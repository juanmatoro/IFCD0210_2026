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

### Variables de entorno

- Se leen con `process.env.NOMBRE`.
- Antes se cargaban con `dotenv`; ahora Node soporta nativamente `--env-file=.env`.
- Convención: archivo `.env.SAMPLE` en el repo con las variables (sin valores secretos), `.env` ignorado por git.
- Es habitual usar varios archivos: `.env`, `.env.test`, etc.
- Validación de variables de entorno con **Zod** para garantizar que existen y tienen el tipo correcto.

### Módulos

- **CommonJS** (clásico): `require()` / `module.exports`.
- **ES Modules (ESM)**: `import` / `export`. Se activa con `"type": "module"` en `package.json` y/o extensión `.mjs`.
- Tres tipos de módulos: del **core** (built-in: `fs`, `http`, `path`...), de **terceros** (en `node_modules`) y **propios** (rutas relativas).
- Núcleos relevantes: `fs`, `fs/promises`, `path`, `http`, `os`, `process`, `node:test`, `node:assert`, `node:sqlite`.

### Asincronía en Node

- Tres modelos sucesivos:
  1. **Callbacks** (`fs.readFile(path, cb)`).
  2. **Promesas** (`fs/promises`).
  3. **Async / await** (azúcar sintáctico sobre promesas).
- **Event Loop**: bucle que procesa fases (timers, I/O callbacks, poll, check, close). Las **microtareas** (promesas) se procesan entre fases.

---

## 2. File System y CLI

### File System

- API síncrona: `readFileSync`, `writeFileSync` — bloquean el hilo.
- API con callbacks: `fs.readFile(path, cb)`, `fs.writeFile(path, data, cb)`.
- API basada en promesas: `import { readFile, writeFile } from 'node:fs/promises'`.
- Para JSON: `JSON.parse()` al leer y `JSON.stringify(data, null, 2)` al escribir.

### Standard streams

- `process.stdin`, `process.stdout`, `process.stderr`.
- Eventos sobre stdin: `data`, `end`.
- **Streams** son flujos de datos por trozos (chunks): de lectura, de escritura, dúplex y de transformación.

### Construcción de un CLI

Librerías típicas usadas en el curso:

- **minimist**: parsea argumentos rápido (`--flag valor`).
- **commander**: define comandos, opciones y ayuda automática.
- **inquirer**: wizard interactivo (prompts en consola).

Patrón común: CLI + repositorio (clase con métodos CRUD) + persistencia en JSON.

---

## 3. Servidor HTTP nativo y Express

### Servidor con `node:http`

- `http.createServer((req, res) => { ... })`.
- `req.url`, `req.method`. `res.statusCode`, `res.setHeader()`, `res.end()`.
- `server.listen(port, cb)`.
- Para servir estáticos a mano se puede usar la librería `serve-static` como middleware.

### Express

Instalación:

```bash
npm install express
npm install -D @types/express
```

- Express es un **framework web minimalista** sobre el módulo `http` de Node.
- Versión usada en el curso: **Express 5**.

### Patrón server / app

- `server.ts` (o `index.ts`): crea el servidor `http.createServer(app)`, gestiona puerto, eventos `listening` y `error`.
- `app.ts`: define la aplicación Express, registra middleware y rutas. Se exporta para reutilizar (p. ej. en tests).

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

### Middleware nativos de Express

- `express.json()` — parsea cuerpos `application/json` y los deja en `req.body`.
- `express.urlencoded({ extended: true })` — parsea formularios `application/x-www-form-urlencoded`.
- `express.static('public')` — sirve archivos estáticos.

### Middleware de terceros

- **morgan**: logger de peticiones (`morgan('dev')`).
- **cors**: gestiona cabeceras CORS.
- **helmet**: cabeceras de seguridad.

### Manejo de errores

- Clase propia `HttpError extends Error` con `statusCode` y `statusMessage`.
- Middleware de errores: cuatro parámetros, debe ir **al final** del registro.
- Si un error no tiene `statusCode` se trata como **500 Internal Server Error**.
- Tras una ruta no encontrada se devuelve **404 Not Found**, y para método no soportado **405 Method Not Allowed**.

---

## 5. Rutas, controladores y MVC

### Rutas

- Métodos: `app.get`, `app.post`, `app.put`, `app.patch`, `app.delete`.
- **Parámetros de ruta**: `/users/:id` → `req.params.id`.
- **Query string**: `/users?id=1` → `req.query.id`.
- **Body**: `req.body` (requiere `express.json()` o equivalente).
- **Cabeceras**: `req.header('Authorization')`.

### Router

- `import { Router } from 'express'` permite agrupar rutas relacionadas en un módulo.
- Se monta con `app.use('/api/users', usersRouter)`.

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

---

## 6. REST y arquitectura de servicios

### Conceptos clave

- **API**: interfaz que permite a un programa comunicarse con otro.
- **API web**: API expuesta por HTTP.
- **REST** (Representational State Transfer): **estilo arquitectónico** (no una tecnología) basado en recursos.
- **Recurso**: entidad del dominio identificada por una **URI**.
- **Representación**: forma en la que se envían los datos del recurso (típicamente JSON).
- **Hipermedios**: enlaces dentro de las respuestas para navegar a recursos relacionados (concepto teórico HATEOAS).

### Principios de REST

1. **Cliente-servidor**: separación clara de responsabilidades.
2. **Stateless** (sin estado): cada petición contiene toda la información necesaria; el servidor no guarda sesión.
3. **Caché**: las respuestas pueden marcarse como cacheables.
4. **Interfaz uniforme**: mismo conjunto de operaciones para todos los recursos.
5. **Sistema en capas**: el cliente no sabe si habla con el servidor final o con un proxy.
6. **Código bajo demanda** (opcional).

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

### SELECT

- Cláusulas: `SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT`.
- Operadores: `=`, `<>`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`.
- Funciones de agregación: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

### JOIN

- `INNER JOIN`: filas con coincidencias en ambas tablas.
- `LEFT JOIN`: todas las de la izquierda + coincidencias de la derecha.
- `RIGHT JOIN`: simétrico.
- `FULL OUTER JOIN`: todas las filas de ambas tablas.
- `CROSS JOIN`: producto cartesiano.
- `UNION` / `UNION ALL`: combina resultados de varios SELECT.

### Postgres avanzado

- **Sub-consultas** (subqueries) en `SELECT`, `WHERE`, `FROM`.
- **Vistas** (`CREATE VIEW`): consultas guardadas como tabla virtual.
- **Procedimientos almacenados y funciones** en **PL/pgSQL**.
- **Triggers**: ejecutan código antes/después de un INSERT, UPDATE o DELETE.
- **Transacciones**: bloque atómico (BEGIN ... COMMIT / ROLLBACK).
- **Índices**: aceleran búsquedas a costa de escritura más lenta.

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

### Driver SQLite

- Nativo: `node:sqlite` (Node 22+).
- Antiguo (callbacks): `sqlite3` (requiere promisificar).

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
const prisma = new PrismaClient({ adapter });
prisma.user.findMany();
prisma.user.findUnique({ where: { id: 1 } });
prisma.user.create({ data: {...} });
prisma.user.update({ where: { id }, data: {...} });
prisma.user.delete({ where: { id } });
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

### JWT (JSON Web Token)

- Token autocontenido formado por **tres partes** separadas por puntos: `header.payload.signature`.
  - **Header**: algoritmo (`HS256`, `RS256`...) y tipo.
  - **Payload**: claims (datos del usuario, p. ej. `id`, `email`, `role`). NO va cifrado, solo codificado en base64url.
  - **Signature**: firma del header+payload con un **secret** (HS256) o clave privada (RS256).
- Librería: **jsonwebtoken** (`jwt.sign(payload, secret, options)` / `jwt.verify(token, secret)`).
- El cliente envía el token en cabecera: `Authorization: Bearer <token>`.
- Útil para APIs **stateless** porque el servidor no necesita guardar sesión.

### Modelo RBAC (Role-Based Access Control)

- Permisos organizados por **roles** (p. ej. `USER`, `EDITOR`, `ADMIN`).
- En `15.Films` los roles son un enum de Prisma.
- **Auth interceptor** verifica que el rol del usuario está en la lista de roles permitidos para el endpoint.
- **Owner interceptor**: verifica que el usuario que solicita es el dueño del recurso (compara `req.user.id` con `req.params.id`), o admin.
- Códigos:
  - **401** si no hay token o es inválido.
  - **403** si está autenticado pero no tiene permiso.

### Endpoints típicos de auth

- `POST /api/users/register` — crea usuario con password hasheado.
- `POST /api/users/login` — devuelve token si las credenciales son válidas.
- Endpoints protegidos: requieren `authenticate()`. Algunos requieren `authorize(['ADMIN', 'EDITOR'])` o `isOwnerOrAdmin`.

---

## 13. CORS y seguridad

### CORS (Cross-Origin Resource Sharing)

- Mecanismo del navegador que **bloquea por defecto** peticiones cross-origin (origen distinto al de la página).
- El servidor debe enviar cabeceras `Access-Control-Allow-Origin`, `-Methods`, `-Headers`.
- Las peticiones "no simples" disparan una petición previa **preflight** (`OPTIONS`).
- Middleware `cors()`: con configuración por defecto permite todos los orígenes.

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

describe('Genres repo', () => {
  before(async () => { /* setup */ });
  after(async () => { /* teardown */ });
  test('readAll returns array', async () => {
    const result = await repo.readAll();
    assert.ok(Array.isArray(result));
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
