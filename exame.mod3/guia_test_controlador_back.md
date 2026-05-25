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
import type { Request, Response, NextFunction } from 'express';
import type { FilmsRepo } from '../repos/films.repo.ts';
import { FilmsController } from './films.controller.ts';
import { InternalServerError, NotFoundError } from '../../errors/http-error.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
```

## Paso 3 · `describe` raíz + variables y `beforeEach` (Arrange común)
Mockea las 4 piezas. Clave: `res.status` devuelve `res` (encadenable) con `mockReturnValue(res)`.
```ts
describe('Given a instantiated Films Controller', () => {
    let controller: FilmsController;
    let repo: FilmsRepo;
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        repo = {} as FilmsRepo;                 // repo vacío, se mockea por método
        req = {} as Request;
        res = {
            status: vi.fn().mockReturnValue(res), // encadenable: res.status(201).json(...)
            json: vi.fn(),
            send: vi.fn(),
        } as unknown as Response;
        next = vi.fn() as NextFunction;
        controller = new FilmsController(repo);
    });

    afterEach(() => {
        vi.clearAllMocks();                      // limpia mocks entre tests
    });
```

## Paso 4 · Test de instanciación
```ts
    describe('When we instantiate it', () => {
        test('Then it should be defined', () => {
            expect(controller).toBeDefined();
        });
        test('Then it should be an instance of FilmsController', () => {
            expect(controller).toBeInstanceOf(FilmsController);
        });
    });
```

## Paso 5 · Por cada método: caso OK + caso error
**Regla de oro:** 1 `describe('When method X is called')` con sub-`describe` para "And repo return valid data" y "And repo throw an Error".

### Caso éxito (mock resuelve)
```ts
    describe('When method getFilmById is called', () => {
        describe('And repo return valid data', () => {
            test('Then it calls json with a film', async () => {
                // Arrange
                const mockFilm = { id: 1 };
                req.params = { id: '1' };
                repo.getFilmByID = vi.fn().mockResolvedValueOnce(mockFilm);
                // Act
                await controller.getFilmById(req, res, next);
                // Assert
                expect(repo.getFilmByID).toHaveBeenCalledWith(1);   // params parseados
                expect(res.json).toHaveBeenCalledWith(mockFilm);
                expect(next).not.toHaveBeenCalled();                // sin error
            });
        });
```

### Caso error (mock rechaza → next con error)
```ts
        describe('And repo throw an Error', () => {
            test('Then it calls next with InternalServerError', async () => {
                // Arrange
                req.params = { id: '1' };
                repo.getFilmByID = vi.fn().mockRejectedValueOnce(new Error('Any message'));
                // Act
                await controller.getFilmById(req, res, next);
                // Assert
                expect(next).toHaveBeenCalledWith(
                    expect.objectContaining({} as InternalServerError),
                );
            });
        });
    });
```

### Error específico de Prisma → NotFound (P2025)
```ts
        repo.getFilmByID = vi.fn().mockRejectedValueOnce(
            new PrismaClientKnownRequestError('Any message',
                { code: 'P2025', clientVersion: '1' }),
        );
        await controller.getFilmById(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({} as NotFoundError),
        );
```

## Paso 6 · Métodos con status concreto (create 201 / delete 204)
```ts
// CREATE → 201 + json
expect(res.status).toHaveBeenCalledWith(201);
expect(res.status(201).json).toHaveBeenCalledWith(mockFilm);

// DELETE → 204 + send
expect(res.status).toHaveBeenCalledWith(204);
expect(res.status(204).send).toHaveBeenCalled();
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
