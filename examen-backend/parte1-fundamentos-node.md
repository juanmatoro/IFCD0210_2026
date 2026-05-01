# Examen Backend IFCD0210 — Guía de estudio

## Parte 1 — Fundamentos de Node.js (bloques 1 y 2)

---

## 🧠 La idea base: ¿qué es Node?

Node es **un entorno para ejecutar JavaScript fuera del navegador**. Usa el motor **V8** de Chrome (el que parsea y ejecuta JS) y le añade APIs para hablar con el sistema operativo: leer ficheros, abrir sockets, etc.

Lo que tienes que tener clavado:

- **Single-threaded** pero **no bloqueante**. Hay un solo hilo de JavaScript, pero las operaciones de I/O (red, disco) las delega a **libuv**, que las gestiona en segundo plano y devuelve el resultado por el **Event Loop**.
- El Event Loop es un bucle que va recorriendo fases (timers → I/O → poll → check → close) y entre fase y fase ejecuta las **microtareas** (las promesas).
- Una operación CPU-intensiva sí bloquea el hilo (eso suele caer como pregunta trampa: "¿Node es multihilo?" → no, el de JS es uno solo).

---

## 🧰 Lo que hay alrededor

- **nvm** = Node Version Manager. Sirve para tener varias versiones de Node y cambiar entre ellas.
- **npm** = el gestor de paquetes por defecto. El proyecto se describe en `package.json`.
- **`scripts`** dentro de `package.json` define los comandos que ejecutas con `npm run xxx` (`npm start` y `npm test` no necesitan el `run`).
- Node 23+ ejecuta TypeScript de forma **nativa** (`node fichero.ts`). Antes hacía falta `ts-node` o compilar a JS.

---

## 🌍 Variables globales del proceso

- `global` es el equivalente del `window` del navegador.
- `process` es el objeto del proceso actual. Lo más preguntado:
  - `process.argv` → array con los argumentos de la línea de comandos.
  - `process.env` → variables de entorno.
  - `process.exit(code)` → termina el proceso.
  - `process.cwd()` → directorio de trabajo actual.

**Ojo con `process.argv`** — pregunta clásica:

```
node app.ts hola mundo
// argv = [ '/usr/bin/node', '/proyecto/app.ts', 'hola', 'mundo' ]
//          [0] ejecutable    [1] script           [2]+ usuario
```

Los argumentos del usuario empiezan en **`[2]`**. Por eso se hace `process.argv.slice(2)`.

---

## 🔐 Variables de entorno (.env)

Antes hacía falta el paquete `dotenv`. Ahora Node tiene **soporte nativo** con el flag:

```bash
node --env-file=.env ./src/index.ts
```

Convención del repo:

- `.env` → con valores reales, **ignorado por git**.
- `.env.SAMPLE` → plantilla con las claves vacías, sí se commitea.
- Validación con **Zod** para que si falta una variable el proceso no arranque (mejor fallar al inicio que por sorpresa en producción).

---

## 📦 Módulos: CommonJS vs ESM

|              | CommonJS (clásico)         | ESM (moderno, el que usa el curso)               |
| ------------ | -------------------------- | ------------------------------------------------ |
| Importar     | `const x = require('x')`   | `import x from 'x'`                              |
| Exportar     | `module.exports = {...}`   | `export const ...` / `export default`            |
| Activación   | por defecto                | `"type": "module"` en `package.json` o `.mjs`    |

Tres tipos de módulos según de dónde vienen:

1. **Core / built-in** → vienen con Node: `fs`, `http`, `path`, `os`, `node:test`, `node:assert`. Se importan con `node:` delante (recomendado).
2. **Terceros** → instalados en `node_modules` (express, zod…).
3. **Propios** → tus archivos, con ruta relativa.

---

## ⏳ Asincronía: las tres generaciones

1. **Callbacks** (legado): `fs.readFile(path, cb)`. Llevan a "callback hell".
2. **Promesas**: `fs.promises.readFile(path)` o `import fs from 'node:fs/promises'`.
3. **async/await**: azúcar sintáctico sobre promesas. Es lo que se usa hoy.

```ts
// El moderno
import fs from 'node:fs/promises';

const data = await fs.readFile('data.json', 'utf8');
const json = JSON.parse(data);
```

Cosas que confunden en exámenes:

- `fs/promises` ≠ `fs`. Para promesas tienes que importar **`node:fs/promises`**.
- `await` solo dentro de `async` (o en top-level si tu proyecto lo soporta).
- Una promesa no rechazada que falla provoca un `UnhandledPromiseRejection`.

---

## 📁 File System y CLI (bloque 2)

Las operaciones más típicas:

```ts
import fs from 'node:fs/promises';
import path from 'node:path';

await fs.readFile('data.json', 'utf8');           // lee
await fs.writeFile('out.txt', 'hola');            // escribe (sobrescribe)
await fs.appendFile('log.txt', 'línea\n');        // añade al final
await fs.mkdir('carpeta', { recursive: true });   // crea carpeta
await fs.readdir('carpeta');                      // lista
await fs.unlink('fichero.txt');                   // borra fichero
await fs.rm('carpeta', { recursive: true });      // borra carpeta
```

**`path`** sirve para componer rutas multiplataforma (Windows usa `\`, Linux/Mac usa `/`). La regla: **nunca concatenes rutas con `+` o template strings**, usa `path.join()` o `path.resolve()`.

```ts
path.join('src', 'data', 'films.json')   // 'src/data/films.json' o 'src\\data\\films.json'
path.resolve('films.json')               // ruta absoluta
```

**CLI** = Command Line Interface. Aplicación que se controla por la terminal. Recibe input por `process.argv` (o `process.stdin`) y escribe en `process.stdout` / `process.stderr`. El típico ejercicio del curso es un CLI que lee/escribe un JSON con `fs/promises`.

---

## ✅ Lo que probablemente caiga en el examen

- "¿Node es single-thread o multi-thread?" → **single-thread, pero las I/O son no bloqueantes**.
- "¿En qué motor está basado Node?" → **V8** (de Chrome).
- "¿Qué propiedad de `process` contiene los argumentos del CLI?" → **`process.argv`**.
- "¿En qué posición empiezan los args del usuario?" → **`[2]`**.
- "¿Qué flag carga `.env` sin librería externa?" → **`--env-file=.env`**.
- "¿Qué se importa para FS con promesas?" → **`node:fs/promises`**.
- "¿Diferencia entre CommonJS y ESM?" → `require`/`module.exports` vs `import`/`export`.
