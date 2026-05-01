# Examen Backend IFCD0210 — Guía de estudio

## Parte 2 — Servidor HTTP, Express, Middleware y MVC (bloques 3, 4, 5)

---

## 🧠 La idea base: del HTTP nativo a Express

Node trae un módulo nativo `node:http` para crear servidores. Funciona, pero es muy verboso (tienes que parsear `req.url`, distinguir métodos a mano, gestionar cuerpos…). **Express** es un **framework web minimalista** construido sobre ese módulo `http` que añade routing, middleware y utilidades de respuesta.

```ts
// Servidor con node:http (lo crudo)
import http from 'node:http';

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hola desde Node nativo');
        return;
    }
    res.statusCode = 404;
    res.end('Not Found');
});
server.listen(3300);
```

```ts
// Mismo ejemplo con Express
import express from 'express';
const app = express();

app.get('/', (req, res) => res.send('Hola Express'));
app.listen(3300);
```

El curso usa **Express 5**.

---

## 🧱 Patrón server / app

### La idea de fondo

Son **dos responsabilidades distintas** que se pueden mezclar pero conviene separar:

- **`app.ts`** → "**qué hace tu API**". Es la aplicación Express: middleware, rutas, controladores, manejo de errores. Es **agnóstica al transporte**: no sabe en qué puerto va a correr ni le importa.
- **`server.ts` / `index.ts`** → "**cómo se sirve en la red**". Crea el servidor HTTP, lee el puerto del `.env`, escucha eventos del SO (`listening`, `error`), gestiona el ciclo de vida (arranque, apagado).

### Cómo encajan mecánicamente

La clave es que **una `app` de Express es, internamente, una función `(req, res) => void`**. Y `http.createServer()` acepta exactamente ese tipo de función. Por eso puedes hacer:

```ts
const server = http.createServer(app);
server.listen(env.PORT);
```

Express por sí solo **no abre puertos**. Quien abre el puerto es siempre el módulo `http` de Node — Express solo le dice "yo me encargo de procesar cada request".

### Por qué separarlas (3 razones reales)

1. **Tests.** Para testear endpoints con supertest u otra librería **no necesitas abrir un puerto real**: importas `app` y se acabó. Si todo estuviera en un único `index.ts` que llama a `listen()`, cada test arrancaría un servidor de verdad → lento, conflictos de puertos, etc.
2. **Separación de responsabilidades.** Cambiar el puerto, añadir HTTPS o poner la app detrás de varios servidores **no debería tocar tu lógica de negocio**. Y al revés: añadir una ruta no debería tocar el código de arranque.
3. **Ciclo de vida.** El `server.ts` es donde pones lo que habla con el sistema operativo: escuchar el evento `error` (puerto ocupado), `listening` (logs de arranque), `SIGTERM` para apagados limpios… Eso no pinta nada en `app.ts`.

### Regla mental para el examen

> Si el código habla con la **red o el SO** → va en `server.ts`.
> Si el código habla con **HTTP, requests, rutas** → va en `app.ts`.

### Ejemplo

```ts
// src/app.ts → solo Express
import express from 'express';
export const app = express();
app.disable('x-powered-by');     // Por seguridad
app.get('/', (req, res) => res.send('OK'));

// src/index.ts → solo arranque
import http from 'node:http';
import { app } from './app.ts';
import { env } from './config/env.ts';

const server = http.createServer(app);
server.on('listening', () => console.log(`Listening on :${env.PORT}`));
server.on('error', (err) => console.error('Server error:', err));
server.listen(env.PORT);
```

Mejoras habituales que suelen aparecer:

- Lectura de `PORT` desde `.env` con fallback.
- Logger con `debug` (`createDebug('proyecto:server')`).
- Desactivar la cabecera `X-Powered-By` para no chivar que usas Express.

---

## 🪝 Middleware (bloque 4)

Esto es **lo más preguntado** del bloque Express. Memoriza la idea con calma.

### ¿Qué es un middleware?

Una función `(req, res, next) => { ... }` que **se ejecuta en la cadena de procesamiento** de cada petición. Se ejecutan **en el orden en que se registran** con `app.use()`.

Implementa los patrones de diseño:
- **Mediador**.
- **Cadena de Responsabilidad** (Chain of Responsibility) ← este es el que más cae.

Un middleware puede:

- Ejecutar lógica.
- Modificar `req` o `res`.
- Llamar a `next()` → pasa al siguiente.
- Llamar a `next(error)` → salta al middleware **de errores**.
- Finalizar la respuesta (no llamar a `next()`).

### Tipos de middleware

| Tipo            | Cómo se registra                          |
| --------------- | ----------------------------------------- |
| De aplicación   | `app.use(mw)` → todas las rutas           |
| De ruta         | `app.METHOD(path, mw, handler)`           |
| De router       | aplicado a un objeto `Router`             |
| **De errores**  | **4 parámetros**: `(err, req, res, next)` |

```ts
// De aplicación: logger custom
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// De ruta (solo en GET /admin)
app.get('/admin', authenticate, adminHandler);

// De errores: 4 parámetros, AL FINAL del registro
app.use((err, req, res, next) => {
    res.status(err.statusCode ?? 500).json({ error: err.message });
});
```

### ⚠️ Pregunta trampa clásica

**"¿Cuántos parámetros tiene un middleware de errores?"** → **4** (`err, req, res, next`). Un middleware normal tiene 3 (`req, res, next`). Express los distingue **por la cantidad de parámetros**.

### Middleware nativos de Express

- `express.json()` → parsea bodies `application/json` y los deja en `req.body`.
- `express.urlencoded({ extended: true })` → parsea formularios HTML.
- `express.static('public')` → sirve archivos estáticos.

```ts
app.use(express.json());                          // req.body = JSON parseado
app.use(express.urlencoded({ extended: true })); // formularios HTML
app.use(express.static('public'));               // sirve /public/index.html en /
```

### Middleware de terceros típicos

- **morgan** → logger de peticiones (`morgan('dev')`).
- **cors** → gestiona cabeceras CORS.
- **helmet** → cabeceras de seguridad.

### Manejo de errores

- Clase propia `HttpError extends Error` con `statusCode` y `statusMessage`.
- Middleware de errores siempre **al final** del registro.
- Si un error no tiene `statusCode` → se trata como **500 Internal Server Error**.
- Ruta no encontrada → **404**. Método no soportado → **405**.

```ts
export class HttpError extends Error {
    constructor(
        public statusCode: number,
        public statusMessage: string,
        message?: string,
    ) {
        super(message ?? statusMessage);
    }
}

// Uso en un controller
if (!film) throw new HttpError(404, 'Not Found', `Film ${id} no existe`);
```

---

## 🛣️ Rutas y parámetros (bloque 5)

### Cómo extraer datos de una request

| De dónde viene             | Cómo se accede                 |
| -------------------------- | ------------------------------ |
| Parámetros de ruta `:id`   | `req.params.id`                |
| Query string `?lang=es`    | `req.query.lang`               |
| Body (JSON)                | `req.body` (necesita `express.json()`) |
| Cabecera                   | `req.header('Authorization')`  |

```ts
// GET /api/films/42?lang=es
app.get('/api/films/:id', (req, res) => {
    const id = req.params.id;                 // '42'
    const lang = req.query.lang;              // 'es'
    const auth = req.header('Authorization'); // 'Bearer eyJ...'
    res.json({ id, lang });
});
```

### Router

`Router` permite **agrupar rutas relacionadas en un módulo** y montarlas en un prefijo.

```ts
// src/films/router/films.router.ts
import { Router } from 'express';
export const createFilmsRouter = (controller: FilmsController) => {
    const router = Router();
    router.get('/', controller.getAll);          // GET /api/films
    router.get('/:id', controller.getById);      // GET /api/films/:id
    router.post('/', controller.create);
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.delete);
    return router;
};

// src/app.ts
app.use('/api/films', createFilmsRouter(filmsController));
```

### Vistas

- Tradicionales: **EJS**, **Pug**, **Handlebars** (`app.set('view engine', 'ejs')` + `res.render(...)`).
- En el curso se usan **template literals nativos de ES6** (con tag `String.raw`/`html` para coloreado en VSCode).
- Para markdown: **marked** (HTML) y **gray-matter** (front-matter).

---

## 🏛️ Arquitectura MVC

- **M (Model)** → datos y lógica de negocio (entidades, repositorios).
- **V (View)** → representación (HTML o JSON).
- **C (Controller)** → recibe la petición, valida, llama al modelo y devuelve respuesta.

Estructura típica del proyecto:

```
src/{config, middleware, errors, controllers, repos, router, services, types, views, app.ts, index.ts}
```

### Inyección de dependencias

Patrón clave que cae en preguntas de "buenas prácticas":

- Los repositorios se pasan a los controladores.
- Los controladores se pasan a los routers.
- **Nunca se importan directamente dentro** — se reciben por constructor o parámetro.

Esto invierte el control y facilita testing y sustitución de implementaciones.

```ts
// src/app.ts — todo se inyecta desde aquí
const filmsRepo = new FilmsRepo(prisma);
const filmsController = new FilmsController(filmsRepo);
const filmsRouter = createFilmsRouter(filmsController);
app.use('/api/films', filmsRouter);

// En el repo NUNCA se importa Prisma directamente — se recibe
export class FilmsRepo {
    constructor(private prisma: PrismaClient) {}
    readAll() { return this.prisma.film.findMany(); }
}
```

---

## ✅ Lo que probablemente caiga en el examen

- **"¿Qué patrón de diseño implementan los middleware?"** → **Cadena de Responsabilidad** (también Mediador).
- **"¿Cuántos parámetros tiene un middleware de errores?"** → **4** (`err, req, res, next`).
- **"¿Qué middleware se necesita para parsear bodies JSON?"** → **`express.json()`**.
- **"¿Dónde se montan los middleware de errores?"** → **Al final** del registro.
- **"¿Qué código devuelve una ruta no encontrada?"** → **404**. **¿Y un método no soportado?** → **405**.
- **"¿Cómo accedes al parámetro `:id` de la ruta?"** → **`req.params.id`**.
- **"¿Cómo accedes al query string?"** → **`req.query`**.
- **"¿Qué significa MVC?"** → Model-View-Controller.
- **"¿Por qué se inyectan las dependencias en lugar de importarlas?"** → para invertir el control y facilitar testing/sustitución.
- **"¿Para qué sirve `app.disable('x-powered-by')`?"** → seguridad: no revelar que se usa Express.
