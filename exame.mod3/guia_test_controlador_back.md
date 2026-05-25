# 📋 Guía: cómo testear un controlador de backend

> Patrón usado en `19.Films-Test` → `src/films/controllers/films.controller.test.ts`.
> Framework: **Vitest** · Estructura: **Given-When-Then** + **AAA**.

El controlador es una unidad que recibe `(req, res, next)`, llama al **repo** y responde.
La estrategia: **mockear el repo, `req`, `res` y `next`** y comprobar QUÉ se llama (no la BD real → eso es e2e).

---

## Paso 1 · Crear el archivo
Junto al controlador: `films.controller.test.ts` (extensión `.test.ts` para que lo coja vitest).

## Paso 2 · Imports
```ts
// Tipos de Express: NO se importan los objetos reales, solo los TIPOS,
// porque en el test req/res/next se sustituyen por mocks.
import type { Request, Response, NextFunction } from 'express';

// Tipo del repositorio: lo importamos como type para tiparlo, pero lo mockearemos.
import type { FilmsRepo } from '../repos/films.repo.ts';

// La clase REAL bajo test (System Under Test, SUT). Esto SÍ es código real.
import { FilmsController } from './films.controller.ts';

// Clases de error propias que el controlador debe pasar a next() según el caso.
import { InternalServerError, NotFoundError } from '../../errors/http-error.ts';

// Error específico de Prisma para simular "registro no encontrado" (código P2025).
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
```

## Paso 3 · `describe` raíz + variables y `beforeEach` (Arrange común)
Mockea las 4 piezas. Clave: `res.status` devuelve `res` (encadenable) con `mockReturnValue(res)`.
```ts
// Bloque GIVEN raíz: el contexto es "tenemos un controlador instanciado".
describe('Given a instantiated Films Controller', () => {
    // Declaramos las variables fuera de beforeEach para que sean accesibles
    // en todos los tests, pero se reinician antes de cada uno (aislamiento).
    let controller: FilmsController;
    let repo: FilmsRepo;       // dependencia mockeada
    let req: Request;          // request mockeada
    let res: Response;         // response mockeada
    let next: NextFunction;    // función next mockeada

    // beforeEach: se ejecuta ANTES de cada test → garantiza estado limpio (Arrange común).
    beforeEach(() => {
        // Repo vacío: cada test inyecta el método concreto que necesita mockear.
        repo = {} as FilmsRepo;

        // Request vacía: cada test rellena req.params / req.body según el método.
        req = {} as Request;

        // Response mockeada. CLAVE: status() devuelve la propia res (mockReturnValue(res))
        // para poder encadenar res.status(201).json(...) igual que en Express.
        res = {
            status: vi.fn().mockReturnValue(res), // espía encadenable
            json: vi.fn(),                        // espía de res.json
            send: vi.fn(),                        // espía de res.send
        } as unknown as Response;

        // next como espía: comprobaremos si se llama (error) o no (éxito).
        next = vi.fn() as NextFunction;

        // Instanciamos el SUT inyectando el repo mockeado (inyección de dependencias).
        controller = new FilmsController(repo);
    });

    // afterEach: limpia el historial de llamadas de TODOS los mocks tras cada test,
    // evitando que las aserciones de un test "vean" llamadas de otro (aislamiento).
    afterEach(() => {
        vi.clearAllMocks();
    });
```

## Paso 4 · Test de instanciación
```ts
    // WHEN: el simple hecho de instanciar el controlador.
    describe('When we instantiate it', () => {
        // THEN: existe (no es undefined/null).
        test('Then it should be defined', () => {
            expect(controller).toBeDefined(); // comprueba que se creó el objeto
        });
        // THEN: es del tipo correcto.
        test('Then it should be an instance of FilmsController', () => {
            expect(controller).toBeInstanceOf(FilmsController); // valida la clase
        });
    });
```

## Paso 5 · Por cada método: caso OK + caso error
**Regla de oro:** 1 `describe('When method X is called')` con sub-`describe` para "And repo return valid data" y "And repo throw an Error".

### Caso éxito (mock resuelve)
```ts
    // WHEN: se invoca un método concreto del controlador.
    describe('When method getFilmById is called', () => {
        // AND: rama de éxito (el repo devuelve datos válidos).
        describe('And repo return valid data', () => {
            test('Then it calls json with a film', async () => {
                // --- Arrange ---
                const mockFilm = { id: 1 };          // dato simulado que devolverá el repo
                req.params = { id: '1' };            // params llegan SIEMPRE como string
                // Mockeamos el método del repo para que resuelva con el film simulado.
                // mockResolvedValueOnce = promesa resuelta, solo para la próxima llamada.
                repo.getFilmByID = vi.fn().mockResolvedValueOnce(mockFilm);

                // --- Act ---
                await controller.getFilmById(req, res, next); // ejecutamos el SUT

                // --- Assert ---
                // El repo se llamó con el id YA convertido a número (1, no '1').
                expect(repo.getFilmByID).toHaveBeenCalledWith(1);
                // La respuesta se envió como JSON con el film.
                expect(res.json).toHaveBeenCalledWith(mockFilm);
                // En el camino feliz NO se delega al manejador de errores.
                expect(next).not.toHaveBeenCalled();
            });
        });
```

### Caso error (mock rechaza → next con error)
```ts
        // AND: rama de error (el repo lanza un error genérico).
        describe('And repo throw an Error', () => {
            test('Then it calls next with InternalServerError', async () => {
                // --- Arrange ---
                req.params = { id: '1' };
                // mockRejectedValueOnce = la promesa se rechaza → simula fallo del repo.
                repo.getFilmByID = vi.fn().mockRejectedValueOnce(new Error('Any message'));

                // --- Act ---
                await controller.getFilmById(req, res, next);

                // --- Assert ---
                // Ante un error genérico el controlador debe delegar en next()
                // con un InternalServerError. objectContaining valida el TIPO/forma
                // sin exigir igualdad exacta de todas las propiedades.
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });
```

### Error específico de Prisma → NotFound (P2025)
```ts
        // Simulamos el error de Prisma "registro no encontrado" (código P2025).
        // El controlador debe traducirlo a un NotFoundError (404), no a 500.
        req.params = { id: '1' };
        repo.getFilmByID = vi.fn().mockRejectedValueOnce(
            new PrismaClientKnownRequestError('Any message',
                { code: 'P2025', clientVersion: '1' }), // P2025 = not found
        );

        await controller.getFilmById(req, res, next);

        // Verificamos que next recibió un NotFoundError (mapeo de error correcto).
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({} as NotFoundError),
        );
```

## Paso 6 · Métodos con status concreto (create 201 / delete 204)
```ts
// CREATE → debe responder 201 (Created) y enviar el recurso creado en JSON.
expect(res.status).toHaveBeenCalledWith(201);              // se fijó el código 201
expect(res.status(201).json).toHaveBeenCalledWith(mockFilm); // se envió el film

// DELETE → debe responder 204 (No Content) y enviar respuesta vacía con send().
expect(res.status).toHaveBeenCalledWith(204);   // se fijó el código 204
expect(res.status(204).send).toHaveBeenCalled(); // se cerró la respuesta sin body
```

## Paso 7 · Ejecutar
```shell
npx vitest run              # una vez
npx vitest                 # watch
npx vitest run --coverage  # con cobertura
```

---

## ✅ Checklist
- [ ] Mock de `repo`, `req`, `res` (status encadenable), `next`
- [ ] `beforeEach` para montar, `afterEach` con `vi.clearAllMocks()`
- [ ] Test de instanciación (`toBeDefined` / `toBeInstanceOf`)
- [ ] Por método: caso OK (`mockResolvedValueOnce` + `toHaveBeenCalledWith` + `next` NO llamado)
- [ ] Por método: caso error (`mockRejectedValueOnce` + `next` llamado con el error correcto)
- [ ] Status correctos (201 create, 204 delete)
- [ ] Errores Prisma `P2025` → `NotFoundError`; resto → `InternalServerError`
