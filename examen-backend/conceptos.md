# Guía de conceptos — Examen teórico Backend (IFCD0210)

Resumen de los conceptos teóricos del bloque de **backend** del curso, basado en el material del repo (`9.Node`, `10.Node-Backend`, `11.Express`, `12.Express`, `13.DB`, `14._Base`, `14.API_in_situ`, `14.Prisma_API`, `15.Films`).

---

## 1. Node.js: entorno de ejecución

- **Node.js** es un entorno de ejecución de JavaScript fuera del navegador, basado en el motor **V8** de Chrome.
- Es **single-threaded** pero usa un modelo **asíncrono no bloqueante** apoyado en el **Event Loop** y la **libuv**.
- Se gestiona con **nvm** (Node Version Manager). El curso usa **Node v23+**, que ejecuta TypeScript de forma nativa (`node fichero.ts`).
- **npm** es el gestor de paquetes por defecto. El proyecto se describe en `package.json`.
- **NPM scripts**: `npm start`, `npm run dev`, `npm test`. El comando se define en la sección `scripts`.

### Objetos globales y de proceso

- `global` (equivalente a `window` en navegador).
- `process`: información del proceso (`process.argv`, `process.env`, `process.exit()`, `process.cwd()`).
- `process.argv` es un array con los argumentos de la línea de comandos. Posiciones 0 y 1 son la ruta de Node y del script; los argumentos del usuario empiezan en `[2]`.

```ts
// node app.ts hola mundo
console.log(process.argv);
// [
//   '/usr/bin/node',         // [0] ejecutable
//   '/proyecto/app.ts',      // [1] script
//   'hola',                  // [2] primer argumento del usuario
//   'mundo'                  // [3]
// ]
const args = process.argv.slice(2); // ['hola', 'mundo']
```

### Variables de entorno

- Se leen con `process.env.NOMBRE`.
- Antes se cargaban con `dotenv`; ahora Node soporta nativamente `--env-file=.env`.
- Convención: archivo `.env.SAMPLE` en el repo con las variables (sin valores secretos), `.env` ignorado por git.
- Es habitual usar varios archivos: `.env`, `.env.test`, etc.
- Validación de variables de entorno con **Zod** para garantizar que existen y tienen el tipo correcto.

```bash
# .env
PORT=3300
DATABASE_URL=postgresql://postgres:Curso_@2026@localhost:5432/films
JWT_SECRET=mi_secreto_super_largo
```

```ts
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(3300),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(20),
});

export const env = envSchema.parse(process.env);
// Si falta una variable, el proceso lanza error y no arranca.
```

```bash
# Arranque con .env nativo
node --env-file=.env ./src/index.ts
```

### Módulos

- **CommonJS** (clásico): `require()` / `module.exports`.
- **ES Modules (ESM)**: `import` / `export`. Se activa con `"type": "module"` en `package.json` y/o extensión `.mjs`.
- Tres tipos de módulos: del **core** (built-in: `fs`, `http`, `path`...), de **terceros** (en `node_modules`) y **propios** (rutas relativas).
- Núcleos relevantes: `fs`, `fs/promises`, `path`, `http`, `os`, `process`, `node:test`, `node:assert`, `node:sqlite`.

```ts
// CommonJS (legado)
const fs = require('fs');
module.exports = { miFuncion };

// ESM (lo que usamos en el curso)
import fs from 'node:fs/promises';      // core
import express from 'express';          // tercero
import { repo } from './repo.ts';       // propio
export const miFuncion = () => {};
export default app;
```

### Asincronía en Node

- Tres modelos sucesivos:
  1. **Callbacks** (`fs.readFile(path, cb)`).
  2. **Promesas** (`fs/promises`).
  3. **Async / await** (azúcar sintáctico sobre promesas).
- **Event Loop**: bucle que procesa fases (timers, I/O callbacks, poll, check, close). Las **microtareas** (promesas) se procesan entre fases.

```ts
// 1. Callbacks (legado)
import fs from 'node:fs';
fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) return console.error(err);
    console.log(JSON.parse(data));
});

// 2. Promesas
import { readFile } from 'node:fs/promises';
readFile('data.json', 'utf8')
    .then(data => console.log(JSON.parse(data)))
    .catch(console.error);

// 3. Async/await (recomendado)
const data = await readFile('data.json', 'utf8');
console.log(JSON.parse(data));
```

---

## 2. File System y CLI

### File System

- API síncrona: `readFileSync`, `writeFileSync` — bloquean el hilo.
- API con callbacks: `fs.readFile(path, cb)`, `fs.writeFile(path, data, cb)`.
- API basada en promesas: `import { readFile, writeFile } from 'node:fs/promises'`.
- Para JSON: `JSON.parse()` al leer y `JSON.stringify(data, null, 2)` al escribir.

```ts
import { readFile, writeFile } from 'node:fs/promises';

type Note = { id: string; text: string };

// Leer JSON
const raw = await readFile('./data/db.json', 'utf8');
const notes: Note[] = JSON.parse(raw);

// Modificar
notes.push({ id: crypto.randomUUID(), text: 'nueva nota' });

// Escribir JSON con indentación (null, 2 → 2 espacios)
await writeFile('./data/db.json', JSON.stringify(notes, null, 2));
```

### Standard streams

- `process.stdin`, `process.stdout`, `process.stderr`.
- Eventos sobre stdin: `data`, `end`.
- **Streams** son flujos de datos por trozos (chunks): de lectura, de escritura, dúplex y de transformación.

```ts
process.stdout.write('Escribe algo y pulsa Enter:\n');
process.stdin.on('data', (chunk) => {
    process.stdout.write(`Has escrito: ${chunk.toString()}`);
});
process.stdin.on('end', () => process.exit(0));
```

### Construcción de un CLI

Librerías típicas usadas en el curso:

- **minimist**: parsea argumentos rápido (`--flag valor`).
- **commander**: define comandos, opciones y ayuda automática.
- **inquirer**: wizard interactivo (prompts en consola).

Patrón común: CLI + repositorio (clase con métodos CRUD) + persistencia en JSON.

```ts
// commander
import { Command } from 'commander';
const program = new Command();

program
    .name('notes')
    .version('1.0.0');

program.command('add <text>')
    .description('Añade una nota')
    .action((text) => repo.create({ text }));

program.command('list')
    .action(() => console.log(repo.read()));

program.parse(process.argv);
// node cli.ts add "Estudiar SQL"
// node cli.ts list
```

---

## 3. Servidor HTTP nativo y Express

### Servidor con `node:http`

- `http.createServer((req, res) => { ... })`.
- `req.url`, `req.method`. `res.statusCode`, `res.setHeader()`, `res.end()`.
- `server.listen(port, cb)`.
- Para servir estáticos a mano se puede usar la librería `serve-static` como middleware.

```ts
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

server.listen(3300, () => console.log('http://localhost:3300'));
```

### Express

Instalación:

```bash
npm install express
npm install -D @types/express
```

- Express es un **framework web minimalista** sobre el módulo `http` de Node.
- Versión usada en el curso: **Express 5**.

```ts
import express from 'express';
const app = express();

app.get('/', (req, res) => res.send('Hola Express'));
app.listen(3300);
```

### Patrón server / app

- `server.ts` (o `index.ts`): crea el servidor `http.createServer(app)`, gestiona puerto, eventos `listening` y `error`.
- `app.ts`: define la aplicación Express, registra middleware y rutas. Se exporta para reutilizar (p. ej. en tests).

```ts
// src/app.ts
import express from 'express';
export const app = express();
app.disable('x-powered-by');
app.get('/', (req, res) => res.send('OK'));

// src/index.ts
import http from 'node:http';
import { app } from './app.ts';
import { env } from './config/env.ts';

const server = http.createServer(app);
server.on('listening', () => console.log(`Listening on :${env.PORT}`));
server.on('error', (err) => console.error('Server error:', err));
server.listen(env.PORT);
```

### Mejoras habituales del server

- Lectura de `PORT` desde variables de entorno (con fallback `3300` o similar).
- Logger con `debug` (`createDebug('proyecto:server')`).
- Listener del evento `listening` con la dirección formateada.
- Listener del evento `error`.
- Desactivar la cabecera `X-Powered-By` con `app.disable('x-powered-by')`.

---

## 4. Middleware en Express

### Concepto

- Un **middleware** es una función `(req, res, next) => { ... }` que actúa en la **cadena de procesamiento** de cada petición HTTP.
- Implementa los patrones de diseño **Mediador** y **Cadena de Responsabilidad** (Chain of Responsibility).
- Se ejecutan **en el orden** en el que se registran con `app.use()`.
- Un middleware puede:
  - Ejecutar lógica.
  - Modificar `req` o `res`.
  - Llamar a `next()` para pasar al siguiente.
  - Llamar a `next(error)` para saltar al middleware de errores.
  - Finalizar la respuesta sin llamar a `next()`.

### Tipos de middleware

- **De aplicación**: registrados con `app.use()` y aplicados a todas las rutas (o a un prefijo).
- **De ruta**: registrados con `app.METHOD(path, mw)` (ej. `app.get`).
- **De router**: aplicados a un objeto `Router`.
- **De errores**: tienen **cuatro** parámetros `(err, req, res, next)`. Solo se ejecutan al recibir un error con `next(err)`.

```ts
// Middleware de aplicación: logger custom
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware de ruta (sólo en GET /admin)
app.get('/admin', authenticate, adminHandler);

// Middleware de errores (4 parámetros, AL FINAL)
app.use((err, req, res, next) => {
    res.status(err.statusCode ?? 500).json({ error: err.message });
});
```

### Middleware nativos de Express

- `express.json()` — parsea cuerpos `application/json` y los deja en `req.body`.
- `express.urlencoded({ extended: true })` — parsea formularios `application/x-www-form-urlencoded`.
- `express.static('public')` — sirve archivos estáticos.

```ts
app.use(express.json());                       // req.body = JSON parseado
app.use(express.urlencoded({ extended: true })); // formularios HTML
app.use(express.static('public'));             // sirve /public/index.html en /
```

### Middleware de terceros

- **morgan**: logger de peticiones (`morgan('dev')`).
- **cors**: gestiona cabeceras CORS.
- **helmet**: cabeceras de seguridad.

```ts
import morgan from 'morgan';
import cors from 'cors';

app.use(morgan('dev'));   // GET /api/films 200 12.345 ms - 540
app.use(cors());          // permite cualquier origen (Access-Control-Allow-Origin: *)
```

### Manejo de errores

- Clase propia `HttpError extends Error` con `statusCode` y `statusMessage`.
- Middleware de errores: cuatro parámetros, debe ir **al final** del registro.
- Si un error no tiene `statusCode` se trata como **500 Internal Server Error**.
- Tras una ruta no encontrada se devuelve **404 Not Found**, y para método no soportado **405 Method Not Allowed**.

```ts
// errors/http-error.ts
export class HttpError extends Error {
    constructor(
        public statusCode: number,
        public statusMessage: string,
        message?: string,
    ) {
        super(message ?? statusMessage);
    }
}

// middleware/error-handler.ts
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const status = err instanceof HttpError ? err.statusCode : 500;
    res.status(status).json({ error: err.message });
};

// Uso en un controller
if (!film) throw new HttpError(404, 'Not Found', `Film ${id} no existe`);
```

---

## 5. Rutas, controladores y MVC

### Rutas

- Métodos: `app.get`, `app.post`, `app.put`, `app.patch`, `app.delete`.
- **Parámetros de ruta**: `/users/:id` → `req.params.id`.
- **Query string**: `/users?id=1` → `req.query.id`.
- **Body**: `req.body` (requiere `express.json()` o equivalente).
- **Cabeceras**: `req.header('Authorization')`.

```ts
// GET /api/films/42?lang=es
app.get('/api/films/:id', (req, res) => {
    const id = req.params.id;        // '42'
    const lang = req.query.lang;     // 'es'
    const auth = req.header('Authorization'); // 'Bearer eyJ...'
    res.json({ id, lang });
});

// POST /api/films  con body JSON
app.post('/api/films', (req, res) => {
    const film = req.body;           // { title, year, ... }
    res.status(201).json(film);
});
```

### Router

- `import { Router } from 'express'` permite agrupar rutas relacionadas en un módulo.
- Se monta con `app.use('/api/users', usersRouter)`.

```ts
// src/films/router/films.router.ts
import { Router } from 'express';
export const createFilmsRouter = (controller: FilmsController) => {
    const router = Router();
    router.get('/', controller.getAll);          // GET /api/films
    router.get('/:id', controller.getById);      // GET /api/films/:id
    router.post('/', controller.create);         // POST /api/films
    router.patch('/:id', controller.update);
    router.delete('/:id', controller.delete);
    return router;
};

// src/app.ts
app.use('/api/films', createFilmsRouter(filmsController));
```

### Vistas

- Motores tradicionales: **EJS**, **Pug**, **Handlebars** (`app.set('view engine', 'ejs')` + `res.render()`).
- En el curso se usan **template literals nativos de ES6** (con tag `String.raw`/`html` para resaltado en VSCode).
- Marcado y conversión a HTML con **marked** y front-matter con **gray-matter**.

### Arquitectura MVC

- **Model**: datos y lógica de negocio (entidades, repositorios).
- **View**: representación (HTML o JSON).
- **Controller**: recibe la petición, valida, llama al modelo y devuelve la respuesta.
- Estructura típica del proyecto: `src/{config, middleware, errors, controllers, repos, router, services, types, views, app.ts, index.ts}`.

### Inyección de dependencias

- Los repositorios se pasan a los controladores y los controladores se pasan a los routers como parámetros (no se importan dentro).
- Esto invierte el control y facilita el testing y la sustitución de implementaciones.

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

## 6. REST y arquitectura de servicios

### Concepto general: API y API web

- **API** (Application Programming Interface): interfaz que permite a un programa comunicarse con otro siguiendo un contrato bien definido.
- **API web**: API expuesta sobre **HTTP**. Un cliente envía peticiones HTTP y recibe respuestas HTTP siguiendo reglas conocidas y estandarizadas.

```plain
API = Interfaz + HTTP
```

### REST: estilo arquitectónico orientado a recursos

**REST** (**Representational State Transfer**) **no es una tecnología ni un protocolo**, sino un **estilo arquitectónico** propuesto por Roy Fielding en el año 2000. Su idea central es que **los datos y funcionalidades de un sistema se modelan como recursos**, que se identifican mediante URLs y se manipulan con los métodos estándar de HTTP.

> En una API REST no se piensa en "funciones a invocar" (verbos como `getFilm`, `createUser`) sino en **recursos sobre los que actuar** (`/films`, `/users`).

Esto es lo que diferencia REST de otras arquitecturas:

- **Arquitecturas basadas en mensajes** (clásico, p. ej. SOAP): el cliente envía un mensaje XML que describe la **acción** a ejecutar y sus parámetros. El recurso es secundario.
- **Arquitecturas basadas en recursos** (REST): el cliente identifica un **recurso** mediante una URI y le aplica una operación estándar HTTP. La acción está implícita en el método.

### Los cinco elementos esenciales de una API REST

REST se apoya en cinco elementos clave que hay que tener clarísimos:

1. **Recursos** — Las entidades que la API expone. Representan elementos lógicos del dominio: `films`, `users`, `genres`, `reviews`. **Son nombres, no acciones**.
2. **URIs** — Identifican de forma única cada recurso o colección. Son la "dirección" del recurso.
   - `/films` → colección de películas.
   - `/films/42` → recurso película concreta.
   - `/films/42/reviews` → recurso anidado.
3. **Representaciones** — El formato en el que se envían/reciben los datos del recurso. **Lo que viaja por la red NO es el objeto interno del servidor, sino una vista externa estandarizada**. En la práctica casi siempre es JSON.
4. **Operaciones** — Las acciones se expresan con los **métodos HTTP** (GET, POST, PUT, PATCH, DELETE). Cada método tiene una semántica fija.
5. **Hipermedios** (HATEOAS) — Las respuestas pueden incluir enlaces a otros recursos relacionados, haciendo la API "navegable". En APIs REST básicas suele trabajarse de forma limitada, pero conceptualmente forma parte del modelo.

### Diseño orientado a recursos: bien vs mal

```http
# ❌ MAL — diseño orientado a acciones (RPC sobre HTTP)
GET  /getAllFilms
POST /createFilm
POST /updateFilm/42
POST /deleteFilm/42

# ✅ BIEN — diseño REST orientado a recursos
GET    /films           # leer colección
GET    /films/42        # leer un recurso
POST   /films           # crear en la colección
PATCH  /films/42        # actualizar parcialmente
DELETE /films/42        # eliminar
```

**Reglas prácticas de URIs REST:**

- Recursos en **plural** (`/films`, no `/film`).
- **Sin verbos** en la URI (los verbos son los métodos HTTP).
- **Jerarquía** para relaciones: `/films/42/reviews` (las reviews de la película 42).
- **kebab-case** o todo en minúsculas, sin extensiones (`.json`).
- Filtros por **query string**: `/films?year=2010&genre=sci-fi`.
- Paginación por **query string**: `/films?page=2&limit=20`.

### Principios de REST (restricciones arquitectónicas de Fielding)

REST define seis restricciones — cinco obligatorias y una opcional. Si una API las cumple, es **RESTful**:

1. **Cliente-servidor**: separación clara de responsabilidades. El cliente se ocupa de la UI; el servidor de los datos y la lógica. Pueden evolucionar de forma independiente mientras se respete el contrato.
2. **Stateless** (sin estado): **cada petición contiene toda la información necesaria** para ser procesada. El servidor no guarda sesión entre peticiones. Por eso se envía el JWT en cada llamada — el servidor no recuerda al usuario.
3. **Caché**: las respuestas deben indicar si son cacheables (cabeceras `Cache-Control`, `ETag`, etc.) para mejorar el rendimiento.
4. **Interfaz uniforme**: el mismo conjunto de operaciones (verbos HTTP) y convenciones se aplica a **todos** los recursos. Si sabes operar con `/films`, sabes operar con `/users`.
5. **Sistema en capas**: el cliente no sabe (ni necesita saber) si habla con el servidor final o con un proxy/balanceador/CDN intermedio.
6. **Código bajo demanda** (opcional): el servidor puede enviar código ejecutable al cliente (poco usado).

### Métodos HTTP y semántica

| Método | CRUD | Idempotente | Seguro |
|---|---|---|---|
| GET | Read | sí | sí |
| POST | Create | no | no |
| PUT | Update (reemplazo total) | sí | no |
| PATCH | Update parcial | no | no |
| DELETE | Delete | sí | no |

- **Seguro**: no modifica el estado del servidor.
- **Idempotente**: ejecutar la misma operación N veces produce el mismo resultado que ejecutarla una vez.

```http
GET    /api/films            → 200 [lista]
GET    /api/films/42         → 200 {film} | 404
POST   /api/films            → 201 {film creado}
PUT    /api/films/42         → 200 {film reemplazado COMPLETO}
PATCH  /api/films/42         → 200 {film con campos actualizados}
DELETE /api/films/42         → 204 (sin cuerpo)
```

Ejemplo de idempotencia:

```http
# PUT idempotente: 3 llamadas idénticas → mismo estado final
PUT /api/films/42  { "title": "Inception", "year": 2010 }
PUT /api/films/42  { "title": "Inception", "year": 2010 }   # mismo resultado
PUT /api/films/42  { "title": "Inception", "year": 2010 }   # mismo resultado

# POST NO idempotente: 3 llamadas → 3 recursos distintos
POST /api/films  { "title": "Inception" }   # crea id 50
POST /api/films  { "title": "Inception" }   # crea id 51
POST /api/films  { "title": "Inception" }   # crea id 52
```

### Códigos de estado HTTP

Familias:

- **1xx** Informativos.
- **2xx** Éxito.
- **3xx** Redirección.
- **4xx** Error del cliente.
- **5xx** Error del servidor.

Más usados en API REST:

- **200 OK** — operación correcta con cuerpo.
- **201 Created** — recurso creado (cabecera `Location` con su URI).
- **204 No Content** — éxito sin cuerpo (típico en DELETE).
- **301 Moved Permanently**, **304 Not Modified**.
- **400 Bad Request** — petición mal formada.
- **401 Unauthorized** — falta autenticación o token inválido.
- **403 Forbidden** — autenticado pero sin permisos.
- **404 Not Found** — recurso inexistente.
- **405 Method Not Allowed**.
- **409 Conflict** — violación de integridad (p. ej. email duplicado).
- **422 Unprocessable Entity** — sintaxis correcta pero semánticamente inválida.
- **500 Internal Server Error**.
- **503 Service Unavailable**.

### Cabeceras importantes

- `Content-Type: application/json` — Express la pone automáticamente con `res.json()`.
- `Location: /usuarios/123` — para 201 Created.
- `Authorization: Bearer <token>` — para JWT.
- `Accept: application/json` — el cliente pide ese formato.
- `X-Powered-By: Express` — se desactiva por seguridad.

```http
# Petición típica autenticada
POST /api/films HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{ "title": "Inception", "year": 2010 }

# Respuesta
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/films/42

{ "id": 42, "title": "Inception", "year": 2010 }
```

### Comparativa SOAP / REST

- **SOAP**: protocolo basado en mensajes XML, contrato formal con **WSDL**, estándares de seguridad **WS-Security, SAML, XACML**.
- **REST**: estilo arquitectónico sobre HTTP, formato libre (típicamente JSON), documentación con **OpenAPI/Swagger**.
- En la web moderna, REST es el estándar de facto por su simplicidad.

### Otros patrones de integración

- **Pub/Sub** (publicación/suscripción): mensajes asíncronos sobre topics (ej. Redis).
- **Repositorios centralizados**: catálogos / directorios de servicios. Histórico: **UDDI**.
- **Microservicios** y descubrimiento dinámico moderno.

---

## 7. Bases de datos

### Conceptos generales

- **SGBD** (Sistema Gestor de Bases de Datos): software servidor que gestiona la BD.
- **Modelos**: relacional (SQL), documental, clave-valor, grafo, columnar.
- Arquitectura **cliente-servidor**: cliente (CLI, GUI, app) → servidor (PostgreSQL, MySQL...).
- **ORM** (Object-Relational Mapper): mapea tablas a objetos en código (ej. Prisma).
- **ODM** (Object-Document Mapper): equivalente para BD documentales (ej. Mongoose).

### Bases de datos relacionales

- **MySQL**, **MariaDB**, **PostgreSQL** — servidor.
- **SQLite** — autocontenida en un fichero, ideal para desarrollo/test.
- En el curso: **PostgreSQL** principal (en contenedor Docker) y **SQLite**.
- Cliente recomendado: **pgAdmin** (Postgres) y **DB Browser for SQLite**.

### Comandos Docker usados en clase

```shell
docker run -d --name postgres --shm-size=1g \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=Curso_@2026 \
  -e POSTGRES_DB=postgres -p 5432:5432 \
  -v postgres-data:/var/lib/postgresql postgres:latest
```

Otro contenedor con datos de películas (omdb): `btholt/complete-intro-to-sql`.

### Diseño de bases de datos

- **Diagramas Entidad-Relación (E/R)**: entidades, atributos, relaciones, cardinalidades (1:1, 1:n, n:n).
- **Normalización**: 1FN, 2FN, 3FN para evitar redundancia.
- Relaciones n:n requieren **tabla intermedia** (junction table).

---

## 8. SQL

### Tipos de instrucciones

- **DDL** (Data Definition Language): `CREATE`, `ALTER`, `DROP`, `TRUNCATE`.
- **DML** (Data Manipulation Language): `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- **DCL** (Data Control Language): `GRANT`, `REVOKE`.
- **TCL** (Transaction Control Language): `BEGIN`, `COMMIT`, `ROLLBACK`.

### Restricciones (constraints)

- `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`.
- `PRIMARY KEY` (numérica autoincremental o UUID).
- `FOREIGN KEY ... REFERENCES tabla(columna)`.
- **Acciones referenciales**: `ON DELETE CASCADE`, `ON DELETE SET NULL`, `ON DELETE RESTRICT`.
- Pueden ser **anónimas** o **named constraints** (con nombre, mejor para diagnosticar errores).

```sql
CREATE TABLE genres (
    genre_id   SERIAL PRIMARY KEY,
    name       VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE films (
    film_id      SERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    release_year INTEGER CHECK (release_year > 1888),
    rate         DECIMAL(2,1) DEFAULT 0.0,
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE films_genres (
    film_id  INTEGER REFERENCES films(film_id)  ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(genre_id) ON DELETE RESTRICT,
    PRIMARY KEY (film_id, genre_id)
);
```

### SELECT

- Cláusulas: `SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT`.
- Operadores: `=`, `<>`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`.
- Funciones de agregación: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

```sql
-- Films posteriores a 2000 ordenadas por nota desc, las 10 mejores
SELECT title, release_year, rate
FROM films
WHERE release_year > 2000 AND rate IS NOT NULL
ORDER BY rate DESC
LIMIT 10;

-- Cuántas películas por año (solo años con > 5)
SELECT release_year, COUNT(*) AS total
FROM films
GROUP BY release_year
HAVING COUNT(*) > 5
ORDER BY release_year;
```

### JOIN

- `INNER JOIN`: filas con coincidencias en ambas tablas.
- `LEFT JOIN`: todas las de la izquierda + coincidencias de la derecha.
- `RIGHT JOIN`: simétrico.
- `FULL OUTER JOIN`: todas las filas de ambas tablas.
- `CROSS JOIN`: producto cartesiano.
- `UNION` / `UNION ALL`: combina resultados de varios SELECT.

```sql
-- Películas con sus géneros (n:n con tabla intermedia)
SELECT f.title, g.name AS genre
FROM films f
INNER JOIN films_genres fg ON f.film_id = fg.film_id
INNER JOIN genres g        ON g.genre_id = fg.genre_id;

-- Géneros que NO tienen ninguna película
SELECT g.name
FROM genres g
LEFT JOIN films_genres fg ON g.genre_id = fg.genre_id
WHERE fg.film_id IS NULL;
```

### Postgres avanzado

- **Sub-consultas** (subqueries) en `SELECT`, `WHERE`, `FROM`.
- **Vistas** (`CREATE VIEW`): consultas guardadas como tabla virtual.
- **Procedimientos almacenados y funciones** en **PL/pgSQL**.
- **Triggers**: ejecutan código antes/después de un INSERT, UPDATE o DELETE.
- **Transacciones**: bloque atómico (BEGIN ... COMMIT / ROLLBACK).
- **Índices**: aceleran búsquedas a costa de escritura más lenta.

```sql
-- Subconsulta: películas con nota superior a la media
SELECT title FROM films
WHERE rate > (SELECT AVG(rate) FROM films);

-- Vista
CREATE VIEW top_films AS
SELECT title, rate FROM films WHERE rate >= 8;

-- Trigger PL/pgSQL: actualizar updated_at antes de cada UPDATE
CREATE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER films_updated
BEFORE UPDATE ON films
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Transacción
BEGIN;
    INSERT INTO films (title) VALUES ('Tenet');
    INSERT INTO films_genres VALUES (LASTVAL(), 1);
COMMIT;  -- o ROLLBACK si algo falla
```

### Tipos de datos en Postgres (frente a SQLite)

- Postgres: `INTEGER`, `SERIAL`, `VARCHAR(n)`, `TEXT`, `BOOLEAN`, `DATE`, `TIMESTAMP`, `JSON`, `JSONB`, `ARRAY`, `UUID`...
- SQLite: solo 5 clases de afinidad (`INTEGER`, `TEXT`, `REAL`, `BLOB`, `NUMERIC`).

---

## 9. Node + PostgreSQL (driver `pg`)

- Librería: `pg` + `@types/pg`.
- Cliente: `new Client({ connectionString })` o `Pool`.
- Métodos: `client.connect()`, `client.query(sql, params)`, `client.end()`.
- Parámetros con placeholders `$1, $2...` (no concatenar nunca strings — riesgo de **SQL Injection**).
- Resultado: objeto con `rows`, `rowCount`, `fields`...
- Patrón **Repository**: clase por entidad con métodos `read`, `readById`, `create`, `update`, `delete`.

```ts
import { Client } from 'pg';

const client = new Client({ connectionString: env.DATABASE_URL });
await client.connect();

// ❌ NUNCA: concatenar input → SQL Injection
const bad = await client.query(`SELECT * FROM films WHERE id = ${id}`);

// ✅ SIEMPRE: placeholders parametrizados
const result = await client.query(
    'SELECT * FROM films WHERE id = $1',
    [id],
);
console.log(result.rows);     // [{ id: 42, title: 'Inception', ... }]
console.log(result.rowCount); // 1

await client.end();
```

Patrón Repository con `pg`:

```ts
export class GenresRepo {
    constructor(private client: Client) {}

    async readAll() {
        const { rows } = await this.client.query('SELECT * FROM genres');
        return rows;
    }

    async create(name: string) {
        const { rows } = await this.client.query(
            'INSERT INTO genres (name) VALUES ($1) RETURNING *',
            [name],
        );
        return rows[0];
    }
}
```

### Driver SQLite

- Nativo: `node:sqlite` (Node 22+).
- Antiguo (callbacks): `sqlite3` (requiere promisificar).

```ts
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./data/app.db');
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(1);   // { id: 1, email: '...' }
db.close();
```

### Testing con BD

- Crear una BD de test independiente (`movies_db_test.db` o `_test_db`).
- Script `setup` que recrea las tablas y carga datos seed.
- `node --env-file=.env.test --test` ejecuta los tests con `node:test`.

---

## 10. Prisma ORM

### Instalación

```bash
npm install -D prisma
npm install @prisma/client
npm install -D @types/pg
npm install @prisma/adapter-pg pg dotenv
```

### Inicialización

```bash
npx prisma init --output ../generated/prisma
```

Crea `prisma/schema.prisma` y `prisma.config.ts`.

### Schema (`schema.prisma`)

- Define **datasource** (proveedor: postgresql / sqlite / mysql / mongodb).
- Define **generator client** (provider, output).
- Define **modelos** que se mapean a tablas.
- Decoradores frecuentes:
  - `@id`, `@default(autoincrement())`, `@default(now())`, `@default(uuid())`.
  - `@unique`, `@map("nombre_columna")`, `@@map("nombre_tabla")`.
  - `@db.VarChar(n)`, `@db.Text`, `@db.Decimal(p, s)`, `@db.Binary(16)`.
  - `@relation(fields: [...], references: [...], onDelete: Cascade)`.
  - `@updatedAt`, `@ignore`.
- **Enums**: `enum Role { USER EDITOR ADMIN }`.
- Relaciones: 1:1 (campo escalar único), 1:n (lista en un lado), n:n (listas en ambos con `@relation("nombre")`).
- Claves compuestas: `@@id([campo1, campo2])`.

```prisma
generator client {
    provider = "prisma-client"
    output   = "../generated/prisma"
}

datasource db {
    provider = "postgresql"
}

enum Role {
    USER
    EDITOR
    ADMIN
}

// 1:1  (User ↔ Profile)
model User {
    id       Int      @id @default(autoincrement()) @map("user_id")
    email    String   @unique @db.VarChar(100)
    password String   @db.VarChar(255)
    role     Role     @default(USER)
    profile  Profile?         // lado opcional 1:1
    reviews  Review[]         // 1:n
    @@map("users")
}

model Profile {
    id        Int    @id
    firstName String @db.VarChar(200) @map("first_name")
    user      User   @relation(fields: [id], references: [id], onDelete: Cascade)
    @@map("profiles")
}

// n:n  (Film ↔ Genre — Prisma genera la tabla intermedia automática)
model Film {
    id     Int     @id @default(autoincrement()) @map("film_id")
    title  String  @db.VarChar(255)
    genres Genre[] @relation("films_genres")
    @@map("films")
}

model Genre {
    id    Int    @id @default(autoincrement()) @map("genre_id")
    name  String @unique
    films Film[] @relation("films_genres")
    @@map("genres")
}

// PK compuesta (Review)
model Review {
    user   User @relation(fields: [userID], references: [id])
    film   Film @relation(fields: [filmID], references: [id])
    rate   Decimal @db.Decimal(3,1)
    userID Int @map("user_id")
    filmID Int @map("film_id")
    @@id([userID, filmID])
    @@map("reviews")
}
```

### Comandos del CLI

- `npx prisma generate` → genera el **Prisma Client** a partir del schema.
- `npx prisma db pull` → introspección: crea modelos a partir de una BD existente.
- `npx prisma db push` → empuja el schema a la BD sin generar migración (rápido, sin historial).
- `npx prisma migrate dev --name nombre` → crea migración + aplica + regenera cliente.
- `npx prisma migrate deploy` → aplica migraciones en producción (no genera nuevas).
- `npx prisma migrate reset` → borra y recrea la BD.
- `npx prisma db seed` → ejecuta el script de seed configurado.
- `npx prisma studio` → GUI para inspeccionar datos.

### Cliente Prisma

```ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// READ
const films = await prisma.film.findMany({
    where: { year: { gte: 2000 } },
    orderBy: { rate: 'desc' },
    take: 10,
    include: { genres: true },     // trae las relaciones
});

const film = await prisma.film.findUnique({ where: { id: 42 } });

// CREATE
const newFilm = await prisma.film.create({
    data: {
        title: 'Tenet',
        year: 2020,
        genres: { connect: [{ id: 1 }, { id: 5 }] },  // n:n
    },
});

// UPDATE (parcial — solo campos pasados)
await prisma.film.update({
    where: { id: 42 },
    data: { rate: 9.0 },
});

// UPSERT
await prisma.user.upsert({
    where: { email: 'a@b.c' },
    update: { password: hashed },
    create: { email: 'a@b.c', password: hashed },
});

// DELETE
await prisma.film.delete({ where: { id: 42 } });

// SELECT vs INCLUDE (excluyentes)
await prisma.user.findMany({ select: { id: true, email: true } }); // solo esos campos
await prisma.user.findMany({ include: { profile: true } });        // todos + relación

// TRANSACCIÓN atómica
await prisma.$transaction([
    prisma.film.create({ data: {...} }),
    prisma.review.create({ data: {...} }),
]);

// SQL CRUDO (cuando Prisma se queda corto)
const stats = await prisma.$queryRaw`SELECT COUNT(*) FROM films`;
```

- Métodos típicos: `findMany`, `findUnique`, `findFirst`, `create`, `createMany`, `update`, `upsert`, `delete`, `count`.
- Filtros: `where`, `orderBy`, `take`, `skip`, `include`, `select`.
- `include`: trae relaciones relacionadas.
- `select`: elige campos concretos (excluyente con include).
- **Transacciones**: `prisma.$transaction([op1, op2])`.
- **SQL crudo**: `prisma.$queryRaw\`SELECT ...\``.

### Migraciones

- Archivo `migration.sql` por cada migración en `prisma/migrations/<timestamp>_<nombre>/`.
- El estado del schema se guarda en la tabla `_prisma_migrations` de la BD.
- En el repo `15.Films` hay tres migraciones: `initial`, `update`, `delete_cascade`.

### Seed

- Script TypeScript que inserta datos iniciales. Configurado en `prisma.config.ts` (clave `migrations.seed`).
- Habitualmente se separa `db.seed.ts` (dev) y `db-test.seed.ts` (test).

---

## 11. Validación con Zod

- **Zod** es una librería de validación basada en esquemas con inferencia de tipos para TypeScript.
- Versión usada: **Zod 4**.

### API básica

```ts
import { z } from 'zod';
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().positive().optional(),
});
type User = z.infer<typeof UserSchema>;
```

### Métodos de validación

- `.parse(data)` → devuelve los datos válidos o **lanza** `ZodError`.
- `.safeParse(data)` → devuelve `{ success, data }` o `{ success, error }`.
- Tipos: `z.string()`, `z.number()`, `z.boolean()`, `z.array()`, `z.object()`, `z.enum()`, `z.literal()`, `z.union()`, `z.tuple()`.
- Modificadores: `.optional()`, `.nullable()`, `.default(x)`, `.min(n)`, `.max(n)`, `.email()`, `.url()`, `.regex(...)`.

### Usos típicos en el curso

- Validar **variables de entorno** al arrancar (`config/env.ts`).
- Validar **DTOs** del body en endpoints.
- Validar **params** y **query** en rutas.
- Middleware genérico de validación que recibe un schema y aplica `safeParse` al fragmento de la request correspondiente.

```ts
// Schema de Film
const FilmCreateSchema = z.object({
    title: z.string().min(1).max(255),
    year: z.number().int().gte(1888),
    director: z.string().min(1),
    rate: z.number().gte(0).lte(10),
    genreIds: z.array(z.number().int()).optional(),
});
type FilmCreate = z.infer<typeof FilmCreateSchema>;

// Métodos
const result = FilmCreateSchema.safeParse(req.body);
if (!result.success) {
    return next(new HttpError(422, 'Unprocessable Entity', result.error.message));
}
const film = result.data;   // ya tipado como FilmCreate

// .parse lanza si falla
const film2: FilmCreate = FilmCreateSchema.parse(req.body);
```

Middleware genérico de validación:

```ts
export const validate = (schema: z.ZodSchema, source: 'body' | 'params' | 'query' = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            return next(new HttpError(422, 'Unprocessable Entity', result.error.message));
        }
        req[source] = result.data;  // datos ya parseados
        next();
    };

// Uso en el router
router.post('/films', validate(FilmCreateSchema), filmsController.create);
```

---

## 12. Autenticación y autorización

### Definiciones

- **Autenticación** (Authentication): comprobar **quién eres**. Tradicionalmente email + password.
- **Autorización** (Authorization): comprobar **qué puedes hacer**. Basada en roles o permisos.

### Hash de contraseñas

- Las contraseñas **nunca** se guardan en claro.
- Se aplica **hash con sal** usando funciones lentas (bcrypt, argon2, scrypt).
- Librería usada: **bcryptjs**.
  - `await hash(password, saltRounds)` (en el curso: `saltRounds = 12`).
  - `await compare(password, hash)` para verificar.
- En el registro nunca se devuelve el password.

```ts
import { hash, compare } from 'bcryptjs';

// Al registrar
const hashed = await hash('miPassword123', 12);
// hashed = '$2a$12$Yv6...long.string'  (60 caracteres)

// Al hacer login
const isValid = await compare('miPassword123', hashed);  // true | false
```

### JWT (JSON Web Token)

- Token autocontenido formado por **tres partes** separadas por puntos: `header.payload.signature`.
  - **Header**: algoritmo (`HS256`, `RS256`...) y tipo.
  - **Payload**: claims (datos del usuario, p. ej. `id`, `email`, `role`). NO va cifrado, solo codificado en base64url.
  - **Signature**: firma del header+payload con un **secret** (HS256) o clave privada (RS256).
- Librería: **jsonwebtoken** (`jwt.sign(payload, secret, options)` / `jwt.verify(token, secret)`).
- El cliente envía el token en cabecera: `Authorization: Bearer <token>`.
- Útil para APIs **stateless** porque el servidor no necesita guardar sesión.

```ts
import jwt from 'jsonwebtoken';

// Al hacer login: generar token
const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },  // payload
    env.JWT_SECRET,
    { expiresIn: '1h' },
);
// token = 'eyJhbGciOi....eyJpZCI6MS....abc123signature'
//          [HEADER]    .[PAYLOAD]    .[SIGNATURE]

// En cada request protegida: verificar token
try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    // payload = { id: 1, email: '...', role: 'USER', iat, exp }
} catch (err) {
    // Token inválido, expirado o firma incorrecta → 401
}
```

⚠️ El **payload NO está cifrado**, solo codificado en base64url. Cualquiera puede decodificarlo. **Nunca metas información sensible** (contraseñas, tarjetas, etc.). La firma solo garantiza que **no ha sido manipulado**.

### Modelo RBAC (Role-Based Access Control)

- Permisos organizados por **roles** (p. ej. `USER`, `EDITOR`, `ADMIN`).
- En `15.Films` los roles son un enum de Prisma.
- **Auth interceptor** verifica que el rol del usuario está en la lista de roles permitidos para el endpoint.
- **Owner interceptor**: verifica que el usuario que solicita es el dueño del recurso (compara `req.user.id` con `req.params.id`), o admin.
- Códigos:
  - **401** si no hay token o es inválido.
  - **403** si está autenticado pero no tiene permiso.

```ts
// middleware/auth.interceptor.ts
export class AuthInterceptor {
    // Verifica que el JWT sea válido y carga req.user
    authenticate(req, res, next) {
        const authHeader = req.header('Authorization');
        if (!authHeader) return next(new HttpError(401, 'Unauthorized'));

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token)
            return next(new HttpError(401, 'Unauthorized'));

        try {
            req.user = AuthService.verifyToken(token);   // { id, email, role }
            next();
        } catch {
            next(new HttpError(401, 'Unauthorized'));
        }
    }

    // Verifica que el rol esté autorizado (ADMIN siempre pasa)
    authorize(roles: string[] = []) {
        return (req, res, next) => {
            if (!req.user) return next(new HttpError(401, 'Unauthorized'));
            if (req.user.role !== 'ADMIN' && !roles.includes(req.user.role))
                return next(new HttpError(403, 'Forbidden'));
            next();
        };
    }

    // Verifica que el usuario sea dueño del recurso o admin
    isOwnerOrAdmin(req, res, next) {
        if (!req.user) return next(new HttpError(401, 'Unauthorized'));
        const resourceId = Number(req.params.id);
        if (req.user.role !== 'ADMIN' && req.user.id !== resourceId)
            return next(new HttpError(403, 'Forbidden'));
        next();
    }
}
```

Aplicación en las rutas:

```ts
const auth = new AuthInterceptor();

router.get('/films', filmsController.getAll);                    // Pública
router.post('/films',
    auth.authenticate.bind(auth),
    auth.authorize(['EDITOR']),                                  // Solo EDITOR o ADMIN
    filmsController.create);

router.patch('/users/:id',
    auth.authenticate.bind(auth),
    auth.isOwnerOrAdmin.bind(auth),                              // Solo dueño o admin
    usersController.update);
```

### Endpoints típicos de auth

- `POST /api/users/register` — crea usuario con password hasheado.
- `POST /api/users/login` — devuelve token si las credenciales son válidas.
- Endpoints protegidos: requieren `authenticate()`. Algunos requieren `authorize(['ADMIN', 'EDITOR'])` o `isOwnerOrAdmin`.

```http
# Register
POST /api/users/register
{ "email": "ana@a.com", "password": "secreto" }
→ 201 Created  { "id": 5, "email": "ana@a.com" }

# Login
POST /api/users/login
{ "email": "ana@a.com", "password": "secreto" }
→ 200 OK  { "token": "eyJhbGci..." }

# Acceso a endpoint protegido
GET /api/users/5
Authorization: Bearer eyJhbGci...
→ 200 OK  { ... }
→ 401 si falta/invalida el token
→ 403 si autenticado pero sin permisos
```

---

## 13. CORS y seguridad

### CORS (Cross-Origin Resource Sharing)

- Mecanismo del navegador que **bloquea por defecto** peticiones cross-origin (origen distinto al de la página).
- El servidor debe enviar cabeceras `Access-Control-Allow-Origin`, `-Methods`, `-Headers`.
- Las peticiones "no simples" disparan una petición previa **preflight** (`OPTIONS`).
- Middleware `cors()`: con configuración por defecto permite todos los orígenes.

```ts
import cors from 'cors';

// Permitir cualquier origen (desarrollo)
app.use(cors());

// Configuración restrictiva (producción)
app.use(cors({
    origin: ['https://miweb.com', 'https://admin.miweb.com'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
```

```http
# Preflight automático que dispara el navegador antes de un POST con JSON
OPTIONS /api/films
Origin: https://miweb.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

# Respuesta del servidor
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://miweb.com
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Otras buenas prácticas de seguridad

- Usar **HTTPS** (TLS) siempre en producción.
- Validar y sanear toda entrada (Zod).
- No exponer información sensible en logs.
- Desactivar `X-Powered-By`.
- Usar **helmet** para cabeceras de seguridad.
- Limitar el rate (rate limiting).
- No incluir secretos en el repositorio (`.env` ignorado).

---

## 14. Testing en Node

### `node:test` y `node:assert`

- Test runner integrado en Node (sin librerías externas).
- Estructura:

```ts
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { GenresRepo } from './genres.ts';

describe('Genres repo', () => {
    let repo: GenresRepo;

    before(async () => {
        await prepareTestingDb();        // setup BD test
        repo = new GenresRepo(client);
    });

    after(async () => {
        await client.end();
    });

    test('readAll returns array', async () => {
        const result = await repo.readAll();
        assert.ok(Array.isArray(result));
    });

    test('create inserta y devuelve el género', async () => {
        const genre = await repo.create('SciFi');
        assert.strictEqual(genre.name, 'SciFi');
        assert.ok(genre.id > 0);
    });

    test('readById lanza si no existe', async () => {
        await assert.rejects(
            () => repo.readById(99999),
            { name: 'HttpError' },
        );
    });
});
```

### Ejecución

- `node --test` ejecuta todos los `*.test.ts`.
- `node --env-file=.env.test --test` carga variables específicas de test.
- `--test-concurrency=1` ejecuta los tests en serie (útil cuando comparten BD).

### BD de test

- BD aparte (`*_test_db` o `*_test.db`).
- Script de setup que recrea las tablas y aplica seed.
- Reset entre tests para que cada uno empiece en un estado conocido.

---

## 15. Tooling del proyecto

- **TypeScript 5.9** ejecutado nativamente por Node 23+ (sin compilación previa).
- **ESLint 10** + `typescript-eslint`: linter.
- **Prettier**: formateador (`{ "singleQuote": true }`).
- **EditorConfig**: configuración común de indentación.
- **debug**: logger por namespaces, controlado con la variable de entorno `DEBUG`.
- **cross-env**: define variables de entorno multiplataforma en npm scripts.
- **Postman**: cliente para probar APIs REST manualmente.

### Estructura típica de un proyecto Express + Prisma del curso

```
proyecto/
├── src/
│   ├── config/         # env.ts, db.ts, seed.ts
│   ├── middleware/     # customs.ts, error-handler.ts, auth.interceptor.ts, validations.ts
│   ├── errors/         # http-error.ts
│   ├── services/       # auth.ts
│   ├── zod/            # *.schemas.ts
│   ├── types/          # tipos compartidos
│   ├── <feature>/      # users/, films/...
│   │   ├── controllers/
│   │   ├── repos/
│   │   └── router/
│   ├── views/
│   ├── app.ts
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── .env / .env.test
├── package.json
├── tsconfig.json
└── eslint.config.js
```

---

## 16. Conceptos UF1846 (Aplicaciones Web Distribuidas)

### Arquitecturas distribuidas orientadas a servicios (SOA)

- Sistemas divididos en **servicios especializados** que cooperan por la red.
- Ventajas: separación de responsabilidades, reutilización, escalabilidad, interoperabilidad.
- Modelos conceptuales: basados en mensajes (SOAP) o basados en recursos (REST).

### Políticas y contratos de servicios

- **Contrato**: rutas, métodos HTTP, parámetros, códigos, formatos.
- **Políticas**: autenticación, autorización, límites de uso, gestión de errores.
- Documentación con **OpenAPI / Swagger**.

### Estándares de seguridad (contexto)

- **WS-Security**, **SAML**, **XACML** (mundo SOAP).
- En REST: tokens (JWT), OAuth2, HTTPS/TLS, RBAC, CORS.

### Directorios de servicios

- Catálogo donde los servicios se registran y los clientes los descubren.
- Estándar histórico: **UDDI**.
- Práctica moderna: catálogos internos, portales de desarrolladores, descubrimiento dinámico en microservicios (Consul, Eureka).

### Patrones de comunicación

- **Request/Response** (REST clásico).
- **Pub/Sub** (publicación/suscripción): asíncrono, desacoplado (Redis, Kafka, RabbitMQ).
- **Repositorios centralizados**.

---

## Glosario rápido

| Término | Significado |
|---|---|
| API | Interfaz de Programación de Aplicaciones |
| REST | Representational State Transfer |
| CRUD | Create, Read, Update, Delete |
| HTTP | HyperText Transfer Protocol |
| HTTPS | HTTP sobre TLS |
| TLS | Transport Layer Security |
| URI / URL | Identificador / Localizador uniforme de recurso |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| RBAC | Role-Based Access Control |
| CORS | Cross-Origin Resource Sharing |
| ORM | Object-Relational Mapper |
| ODM | Object-Document Mapper |
| MVC | Model-View-Controller |
| SQL | Structured Query Language |
| DDL / DML / DCL / TCL | Definition / Manipulation / Control / Transaction Language |
| SGBD | Sistema Gestor de Bases de Datos |
| E/R | Entidad / Relación |
| FK / PK | Foreign Key / Primary Key |
| ESM / CJS | ES Modules / CommonJS |
| DTO | Data Transfer Object |
| DI | Dependency Injection |
| SOA | Service-Oriented Architecture |
| SOAP | Simple Object Access Protocol |
| WSDL | Web Services Description Language |
| UDDI | Universal Description, Discovery and Integration |
