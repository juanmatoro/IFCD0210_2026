# 🧠 Esquema mental — TESTING

```
TESTING (Vitest + Supertest + Playwright)
│
├── 1. FUNDAMENTOS
│   ├── Framework obligatorio: VITEST
│   ├── Patrón AAA: Arrange (preparar) → Act (ejecutar) → Assert (comprobar)
│   ├── Estructura Given-When-Then (legibilidad)
│   │     describe('Given ...') → describe('When ...') → test('Then ...')
│   └── Tests aislados, deterministas, 1 aspecto por test
│
├── 2. ESTRUCTURA DE UN TEST
│   ├── describe(...)        agrupa
│   ├── test(...) / it(...)  caso concreto
│   ├── expect(valor)        afirmación
│   └── Hooks: beforeEach / afterEach / beforeAll / afterAll
│         → preparar y limpiar estado (vi.clearAllMocks())
│
├── 3. CONFIGURACIÓN (vitest.config.ts)
│   ├── globals: true        describe/test/expect sin importar
│   ├── environment: 'jsdom' (para front / DOM)
│   ├── setupFiles           init antes de tests (.env.test, jest-dom)
│   ├── include              ['**/*.test.ts'] | e2e ['**/*.spec.ts']
│   └── coverage             include / exclude (entities, types, routers, index)
│       Script: "vitest run --coverage"
│
├── 4. MOCKS (vitest = vi)
│   ├── vi.fn()                       crea función mock
│   ├── vi.spyOn(obj, 'metodo')       espía método existente
│   ├── .mockReturnValue(x)           valor síncrono
│   ├── .mockResolvedValue(x)         promesa resuelta
│   ├── .mockRejectedValue(err)       promesa rechazada
│   └── ...Once → solo la próxima llamada
│
├── 5. MATCHERS (expect)
│   ├── toBe          identidad estricta (===, primitivos)
│   ├── toEqual       igualdad estructural profunda (objetos)
│   ├── toStrictEqual igualdad estricta de estructura
│   ├── toBeTypeOf    tipo del valor
│   ├── toContain     subcadena / elemento
│   ├── toThrow                          función lanza error
│   ├── rejects.toThrow                  promesa async rechaza (con await)
│   ├── toHaveBeenCalled / ...With / ...not  espías
│   └── toBeInstanceOf / toBeDefined
│
├── 6. TIPOS DE TEST  (pirámide)
│   ├── UNITARIO     aísla 1 unidad, mockea dependencias (prismaMock, repo={})
│   ├── INTEGRACIÓN  interacción real entre componentes
│   └── E2E          flujo completo extremo a extremo
│
├── 7. E2E BACKEND — Supertest
│   ├── archivos *.spec.ts (vitest.config.e2e.js)
│   ├── request(app).get('/api/films').expect(200)
│   ├── .send(body) / .set('Authorization', 'Bearer ...')
│   ├── seed() + connectDB() en beforeEach (BD de test)
│   └── response.body / response.status
│
└── 8. E2E FRONTEND — Playwright
    ├── archivos *.spec.ts en /e2e (playwright.config.ts)
    ├── test('...', async ({ page }) => {...})
    ├── page.goto(url)
    ├── Localizadores: getByRole / getByTestId (data-test) / locator / getByText
    ├── Acciones: click() / fill() / await userEvent...
    └── Asserts: toHaveTitle / toHaveText / toBeVisible / toHaveCount
```

## ⭐ Mínimos para el examen
- Vitest · AAA · Given-When-Then · describe/test/expect
- beforeEach/afterEach · vi.fn / vi.spyOn · mockResolved/RejectedValue
- toBe vs toEqual · toThrow · rejects.toThrow · toHaveBeenCalledWith
- globals / setupFiles / coverage
- unit vs integración vs e2e
- Supertest (.expect) · Playwright (goto/getByTestId/toHaveTitle)
- Componentes web: @testing-library/dom (screen, getByRole) + jsdom
```
```
