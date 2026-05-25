# Examen Testing — 30 preguntas tipo test

> Basado en Vitest, Supertest y Playwright (proyecto Films API + Front-Films).
> Marca una sola opción por pregunta. La opción correcta va marcada con ✓.

---

**1.** ¿Qué framework de testing se usa obligatoriamente en el proyecto?
- a) Jest
- b) Mocha
- c) Vitest ✓
- d) Jasmine

**2.** ¿Qué patrón estructura un test en tres fases Arrange-Act-Assert?
- a) AAA ✓
- b) CRUD
- c) MVC
- d) DRY

**3.** La estructura Given-When-Then sirve para...
- a) Definir rutas
- b) Mejorar la legibilidad describiendo contexto, acción y resultado esperado ✓
- c) Configurar la base de datos
- d) Generar mocks automáticos

**4.** ¿Qué bloque agrupa varios tests relacionados?
- a) `it`
- b) `describe` ✓
- c) `expect`
- d) `assert`

**5.** ¿Qué hook se ejecuta antes de cada test?
- a) `beforeAll`
- b) `afterEach`
- c) `beforeEach` ✓
- d) `setup`

**6.** ¿Para qué sirven `beforeEach`/`afterEach`?
- a) Para acelerar los tests
- b) Para preparar y limpiar estado, manteniendo los tests aislados ✓
- c) Para definir rutas
- d) Para hacer commits

**7.** ¿Qué función de Vitest crea una función mock?
- a) `vi.mock()`
- b) `vi.fn()` ✓
- c) `vi.stub()`
- d) `vi.create()`

**8.** ¿Qué hace `vi.spyOn(AuthService, 'verifyTokenAsync')`?
- a) Elimina el método
- b) Espía/intercepta un método existente del objeto ✓
- c) Crea una clase nueva
- d) Borra el módulo

**9.** ¿Qué método simula que una promesa se resuelve con un valor?
- a) `mockReturnValue`
- b) `mockResolvedValue` ✓
- c) `mockRejectedValue`
- d) `mockThrow`

**10.** ¿Qué método simula que una promesa es rechazada?
- a) `mockResolvedValue`
- b) `mockReturnValue`
- c) `mockRejectedValue` ✓
- d) `mockReject`

**11.** ¿Qué matcher comprueba igualdad estructural profunda (objetos)?
- a) `toBe`
- b) `toEqual` ✓
- c) `toContain`
- d) `toBeTypeOf`

**12.** ¿Qué matcher comprueba identidad estricta (===) para primitivos?
- a) `toEqual`
- b) `toBe` ✓
- c) `toMatch`
- d) `toHaveLength`

**13.** Para comprobar que una función lanza un error se usa...
- a) `expect(fn).toThrow()` ✓
- b) `expect(fn).toError()`
- c) `expect(fn).toFail()`
- d) `expect(fn).toCatch()`

**14.** Para comprobar que una promesa async rechaza se usa...
- a) `await expect(promesa).rejects.toThrow()` ✓
- b) `expect(promesa).toThrow()`
- c) `expect(promesa).reject()`
- d) `await promesa.catch()`

**15.** ¿Qué matcher verifica el tipo de un valor?
- a) `toBeType`
- b) `toBeTypeOf` ✓
- c) `typeOf`
- d) `toMatchType`

**16.** ¿Qué comprueba `expect(next).toHaveBeenCalledWith()`?
- a) Que `next` existe
- b) Que `next` fue llamada con esos argumentos ✓
- c) Que `next` es async
- d) Que `next` devuelve un valor

**17.** En `vitest.config.ts`, ¿qué opción activa las APIs globales (describe, test, expect) sin importarlas?
- a) `setupFiles`
- b) `globals: true` ✓
- c) `coverage`
- d) `include`

**18.** ¿Para qué sirve `setupFiles` en la config de Vitest?
- a) Ejecutar código de inicialización antes de los tests (p.ej. cargar `.env.test`) ✓
- b) Definir las rutas de la API
- c) Generar el cliente Prisma
- d) Crear los mocks

**19.** ¿Qué script ejecuta los tests con informe de cobertura?
- a) `vitest`
- b) `vitest run --coverage` ✓
- c) `vitest watch`
- d) `vitest --report`

**20.** Un test **unitario** se caracteriza por...
- a) Probar la app completa con servidor real
- b) Aislar una unidad usando mocks de sus dependencias ✓
- c) Usar siempre la base de datos real
- d) Lanzar un navegador

**21.** Un test de **integración** se diferencia del unitario en que...
- a) No usa `expect`
- b) Prueba la interacción real entre componentes/dependencias ✓
- c) Siempre falla
- d) No usa `describe`

**22.** ¿Qué librería se usa para los tests **e2e** de la API Express?
- a) Playwright
- b) Supertest ✓
- c) Cypress
- d) Axios

**23.** En los e2e de la API, ¿qué extensión tienen los archivos según la config?
- a) `.test.ts`
- b) `.spec.ts` ✓
- c) `.e2e.ts`
- d) `.it.ts`

**24.** Con Supertest, ¿cómo se comprueba que una respuesta tiene status 200?
- a) `.status(200)`
- b) `.expect(200)` ✓
- c) `.assert(200)`
- d) `.code(200)`

**25.** ¿Qué framework se usa para los tests e2e del frontend?
- a) Supertest
- b) Vitest
- c) Playwright ✓
- d) Selenium

**26.** En Playwright, ¿cómo se navega a una URL?
- a) `page.open(url)`
- b) `page.goto(url)` ✓
- c) `page.visit(url)`
- d) `page.navigate(url)`

**27.** En Playwright, ¿qué selector localiza por el atributo `data-test`?
- a) `page.getByRole`
- b) `page.getByTestId` ✓
- c) `page.getByClass`
- d) `page.getByName`

**28.** En Playwright, ¿qué assertion comprueba el título de la página?
- a) `toHaveText`
- b) `toBeVisible`
- c) `toHaveTitle` ✓
- d) `toContainTitle`

**29.** ¿Qué archivos de exclusión de cobertura tienen sentido (no aportan lógica testeable)?
- a) Repos y servicios
- b) Controllers
- c) Entities, types y routers ✓
- d) Los archivos de test

**30.** ¿Por qué los tests unitarios de repos usan un `prismaMock` en lugar de la BD real?
- a) Porque Prisma no funciona en test
- b) Para aislar la unidad y no depender de una base de datos real ✓
- c) Porque es obligatorio en Vitest
- d) Para que los tests sean más lentos

---

## Respuestas correctas

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|----|
| c | a | b | b | c | b | b | b | b | c |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|----|----|----|----|----|----|----|----|----|----|
| b | b | a | a | b | b | b | a | b | b |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|----|----|----|----|----|----|----|----|----|----|
| b | b | b | b | c | b | b | c | c | b |
