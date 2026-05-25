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
  globals: true,
  environment: 'jsdom',                 // ⬅ imprescindible: simula el DOM
  setupFiles: './src/setup-test.ts',
}
```
`src/setup-test.ts`:
```ts
import '@testing-library/jest-dom';     // matchers DOM: toBeInTheDocument, toHaveTextContent...
```

## Paso 2 · Crear el archivo
Junto al componente: `counter.test.ts`.

## Paso 3 · Imports
```ts
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';   // solo si hay interacción
import { Counter } from './counter';
```

## Paso 4 · Helper `render` + limpieza
Crea el elemento por su `selector`, fija atributos, **registra** el componente y lo añade al body.
```ts
describe('Given Counter component', () => {
    const render = (
        element: HTMLElement = document.createElement(Counter.selector),
    ) => {
        element.setAttribute('counterId', '12');   // atributos de entrada
        Counter.register();                         // customElements.define (idempotente)
        document.body.append(element);
        return element;
    };

    afterEach(() => {
        document.body.innerHTML = '';               // limpia el DOM entre tests
    });
```

> Si el componente depende de otro (ej. Header usa Theme), **mockea** su registro:
> ```ts
> import { Theme } from '../theme/theme';
> Theme.register = vi.fn();
> ```

## Paso 5 · Test de registro seguro (idempotencia)
`customElements.define` falla si se llama 2 veces con el mismo nombre → el componente debe protegerse.
```ts
    test('registers safely when called more than once', () => {
        expect(() => {
            Counter.register();
            Counter.register();
        }).not.toThrow();
    });
```

## Paso 6 · Test de instanciación
```ts
    test('element could be instantiated', () => {
        const element = render();
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element).toBeInstanceOf(Counter);
    });
```

## Paso 7 · Test de render (consultar el DOM con roles)
Usa `screen.getByRole(...)` — preferir roles ARIA antes que clases/ids.
```ts
    describe('When the component has been rendered', () => {
        beforeEach(() => {
            render();
        });

        test('Then the heading shows the id 12', () => {
            const element = screen.getByRole('heading');
            expect(element).toBeInTheDocument();
            expect(element).toHaveTextContent(/12/);
        });

        test('Then the button and output are present', () => {
            expect(screen.getByRole('button')).toBeInTheDocument();
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
```

Roles útiles: `heading`, `button`, `status` (output), `banner` (header), `link`, `textbox`.

## Paso 8 · Test de interacción (eventos)
`userEvent` es async → siempre `await`.
```ts
        test('Then the counter increases on click', async () => {
            const btn = screen.getByRole('button');
            const output = screen.getByRole('status');
            expect(output).toHaveValue('0');
            await userEvent.click(btn);
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
