# 📋 Guía: cómo testear un Web Component

> Patrón usado en `19.Front-Films` → `src/core/components/**/**.test.ts`
> (ej. `counter.test.ts`, `header.test.ts`).
> Framework: **Vitest** + **@testing-library/dom** + **jsdom**.

Un Web Component se registra con `customElements.define` (aquí vía `Component.register()`),
se inserta en el DOM y se comprueba su render e interacción con **Testing Library**.

---

## Paso 1 · Config necesaria (ya existe en el proyecto)
`vitest.config.ts`:
```ts
test: {
  globals: true,            // expone describe/test/expect sin importarlos
  environment: 'jsdom',     // ⬅ IMPRESCINDIBLE: simula document/window en Node
  setupFiles: './src/setup-test.ts', // se ejecuta antes de los tests
}
```
`src/setup-test.ts`:
```ts
// Añade los matchers de DOM (toBeInTheDocument, toHaveTextContent, toHaveValue...)
// a expect. Sin esto, esos matchers no existen.
import '@testing-library/jest-dom';
```

## Paso 2 · Crear el archivo
Junto al componente: `counter.test.ts`.

## Paso 3 · Imports
```ts
// screen: punto de acceso a consultas sobre el DOM montado (document.body).
import { screen } from '@testing-library/dom';

// userEvent: simula interacciones reales del usuario (click, type...). Es ASYNC.
// Importar solo si el test ejercita interacción.
import userEvent from '@testing-library/user-event';

// El componente REAL bajo test (SUT). Esto es código real, no mock.
import { Counter } from './counter';
```

## Paso 4 · Helper `render` + limpieza
Crea el elemento por su `selector`, fija atributos, **registra** el componente y lo añade al body.
```ts
// GIVEN raíz: el contexto es "tenemos el componente Counter".
describe('Given Counter component', () => {
    // Helper reutilizable que monta el componente en el DOM.
    // Parámetro con valor por defecto: crea el elemento por su selector (ej. 'app-counter').
    const render = (
        element: HTMLElement = document.createElement(Counter.selector),
    ) => {
        // Fijamos los atributos de entrada que el componente leerá (props vía atributos).
        element.setAttribute('counterId', '12');

        // Registramos el custom element (customElements.define internamente).
        // Debe ser idempotente: llamarlo varias veces no debe romper (ver Paso 5).
        Counter.register();

        // Insertamos el elemento en el DOM real (jsdom) para poder consultarlo.
        document.body.append(element);

        // Devolvemos el elemento para que el test pueda inspeccionarlo.
        return element;
    };

    // afterEach: vacía el body tras cada test → evita que un test vea el DOM de otro.
    afterEach(() => {
        document.body.innerHTML = '';
    });
```

> Si el componente depende de otro (ej. Header usa Theme), **mockea** su registro
> para aislar el SUT y no arrastrar la lógica del componente hijo:
> ```ts
> import { Theme } from '../theme/theme';
> // Sustituimos register por un mock vacío: el test de Header no debe registrar Theme de verdad.
> Theme.register = vi.fn();
> ```

## Paso 5 · Test de registro seguro (idempotencia)
`customElements.define` falla si se llama 2 veces con el mismo nombre → el componente debe protegerse.
```ts
    // WHEN/THEN: registrar dos veces NO debe lanzar excepción.
    test('registers safely when called more than once', () => {
        // expect(fn).not.toThrow() comprueba que la función NO lanza error.
        expect(() => {
            Counter.register(); // primera definición del custom element
            Counter.register(); // segunda: debe ignorarse, no relanzar define
        }).not.toThrow();
    });
```

## Paso 6 · Test de instanciación
```ts
    test('element could be instantiated', () => {
        const element = render(); // monta el componente y lo devuelve
        // Es un nodo del DOM...
        expect(element).toBeInstanceOf(HTMLElement);
        // ...y concretamente una instancia de nuestra clase Counter.
        expect(element).toBeInstanceOf(Counter);
    });
```

## Paso 7 · Test de render (consultar el DOM con roles)
Usa `screen.getByRole(...)` — preferir roles ARIA antes que clases/ids.
```ts
    // WHEN: el componente ya está renderizado.
    describe('When the component has been rendered', () => {
        // beforeEach local: monta el componente antes de cada test de este bloque.
        beforeEach(() => {
            render();
        });

        // THEN: el encabezado muestra el id recibido por atributo (12).
        test('Then the heading shows the id 12', () => {
            // Buscamos por ROL ARIA (heading) en lugar de por clase/id (más robusto).
            const element = screen.getByRole('heading');
            expect(element).toBeInTheDocument();        // está presente en el DOM
            expect(element).toHaveTextContent(/12/);    // su texto contiene "12" (regex)
        });

        // THEN: existen el botón y el output (status).
        test('Then the button and output are present', () => {
            expect(screen.getByRole('button')).toBeInTheDocument(); // <button>
            expect(screen.getByRole('status')).toBeInTheDocument(); // <output> (role status)
        });
```

Roles útiles: `heading`, `button`, `status` (output), `banner` (header), `link`, `textbox`.

## Paso 8 · Test de interacción (eventos)
`userEvent` es async → siempre `await`.
```ts
        // THEN: al pulsar el botón, el contador aumenta.
        test('Then the counter increases on click', async () => {
            const btn = screen.getByRole('button');     // elemento que dispara la acción
            const output = screen.getByRole('status');  // elemento que refleja el resultado

            // Estado inicial: el output vale '0'.
            expect(output).toHaveValue('0');

            // Simulamos el click del usuario (async → await obligatorio).
            await userEvent.click(btn);

            // Tras el click, el componente actualizó el valor a '1'.
            expect(output).toHaveValue('1');
        });
    });
});
```

## Paso 9 · Ejecutar
```shell
npx vitest run             # unit/componentes
npx vitest run --coverage
# e2e (navegador real) → Playwright, archivos *.spec.ts en /e2e:
npx playwright test
```

---

## ✅ Checklist
- [ ] `environment: 'jsdom'` + `@testing-library/jest-dom` en setup
- [ ] Helper `render()` que crea, configura atributos, `register()` y añade al body
- [ ] `afterEach` con `document.body.innerHTML = ''`
- [ ] Mockear dependencias de otros componentes (`Dep.register = vi.fn()`)
- [ ] Test: registro idempotente (`.not.toThrow()`)
- [ ] Test: instanciación (`toBeInstanceOf`)
- [ ] Test: render con `screen.getByRole` + `toBeInTheDocument` / `toHaveTextContent`
- [ ] Test: interacción con `await userEvent.click()` + assert del cambio
