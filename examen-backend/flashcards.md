# Flashcards de repaso rápido — Backend (IFCD0210)

Formato pregunta / respuesta corta. Recomendado para repasos rápidos antes del examen. Tapa la respuesta y comprueba.

---

## Bloque 1 — Node.js

**Q1.** ¿Qué es Node.js?
> Entorno de ejecución de JavaScript fuera del navegador, basado en el motor V8 + libuv. Single-threaded asíncrono no bloqueante.

**Q2.** ¿Cómo se llama el bucle que coordina la asincronía en Node?
> Event Loop.

**Q3.** ¿Qué propiedad de `process` tiene los argumentos del CLI?
> `process.argv` (los del usuario empiezan en `[2]`).
> Ej: `node app.ts hola` → `process.argv = ['/usr/bin/node', '/proyecto/app.ts', 'hola']`.

**Q4.** ¿Cómo cargar un `.env` sin librerías externas?
> `node --env-file=.env script.ts`.

**Q5.** ¿Cómo activar ESM en un proyecto Node?
> Añadir `"type": "module"` en `package.json`.

**Q6.** ¿Qué módulo da el FS basado en promesas?
> `node:fs/promises`.

**Q7.** ¿Qué tres APIs ofrece el módulo `fs`?
> Síncrona (`readFileSync`), con callbacks (`readFile`), basada en promesas (`fs/promises`).

**Q8.** Tres librerías para CLIs vistas en clase:
> `minimist`, `commander`, `inquirer`.

**Q9.** ¿Cómo se registran handlers de stdin en Node?
> Eventos: `process.stdin.on('data', cb)`, `process.stdin.on('end', cb)`.

**Q10.** ¿Para qué sirve `cross-env`?
> Definir variables de entorno multiplataforma en npm scripts.

---

## Bloque 2 — Servidor HTTP y Express

**Q11.** ¿Cómo se crea un servidor HTTP nativo?
> `http.createServer((req, res) => {...}).listen(port)`.
> Ej: `http.createServer((req,res)=>res.end('OK')).listen(3300)`.

**Q12.** ¿Versión de Express usada en el curso?
> Express 5.

**Q13.** ¿Qué patrón de archivos separa la aplicación del servidor?
> `app.ts` (Express app) + `server.ts`/`index.ts` (servidor HTTP).

**Q14.** ¿Cómo se desactiva la cabecera `X-Powered-By`?
> `app.disable('x-powered-by')`.

**Q15.** ¿Qué eventos del server suelen escucharse?
> `listening` y `error`.

**Q16.** ¿Qué métodos HTTP expone Express directamente?
> `app.get`, `app.post`, `app.put`, `app.patch`, `app.delete`, `app.use`...

---

## Bloque 3 — Middleware

**Q17.** ¿Qué patrones de diseño implementa el middleware de Express?
> Mediador y Cadena de Responsabilidad.

**Q18.** ¿Firma de un middleware normal?
> `(req, res, next) => {...}`.

**Q19.** ¿Firma de un middleware **de errores**?
> `(err, req, res, next) => {...}` (cuatro parámetros).
> Ej: `app.use((err,req,res,next)=>res.status(err.statusCode??500).json({error:err.message}))`.

**Q20.** ¿En qué orden se ejecutan los middleware?
> En el orden en que se registran con `app.use()` o `app.METHOD()`.

**Q21.** Tres middleware nativos de Express:
> `express.json()`, `express.urlencoded()`, `express.static()`.

**Q22.** ¿Para qué sirve `express.json()`?
> Parsear `application/json` en `req.body`.
> Ej: `app.use(express.json())` → permite hacer `req.body.title` en un POST.

**Q23.** ¿Para qué sirve `morgan`?
> Logger de peticiones HTTP.

**Q24.** ¿Para qué sirve `cors`?
> Enviar las cabeceras `Access-Control-Allow-*` para permitir cross-origin.

**Q25.** ¿Para qué sirve `helmet`?
> Set de cabeceras HTTP de seguridad.

**Q26.** ¿Cuántos parámetros tiene `app.use(fn)` para activar un middleware global?
> Uno (la función) o dos (path, función).

---

## Bloque 4 — Routing y MVC

**Q27.** ¿Cómo se accede a un parámetro `:id`?
> `req.params.id`.
> Ej: ruta `/films/:id` con request a `/films/42` → `req.params.id === '42'`.

**Q28.** ¿Cómo se accede a `?id=5`?
> `req.query.id`.
> Ej: `/films?year=2010&genre=sci-fi` → `req.query = { year:'2010', genre:'sci-fi' }`.

**Q29.** ¿Cómo se accede al body parseado?
> `req.body`.

**Q30.** ¿Qué clase de Express agrupa rutas?
> `Router` (`import { Router } from 'express'`).

**Q31.** ¿Cómo se monta un router en una ruta?
> `app.use('/api/users', usersRouter)`.
> Ej: dentro de `usersRouter`, `router.get('/:id', ...)` responde a `GET /api/users/:id`.

**Q32.** ¿Qué representa cada letra del MVC?
> Model (datos/lógica), View (presentación), Controller (orquesta y valida).

**Q33.** ¿Para qué sirve la inyección de dependencias en el proyecto?
> Pasar `repo → controller → router` desde fuera, invirtiendo el control y facilitando los tests.

---

## Bloque 5 — REST

**Q34.** ¿Qué significa REST?
> Representational State Transfer. **Estilo arquitectónico** (no tecnología) **basado en recursos** identificados por URIs.

**Q34b.** Cinco elementos esenciales de una API REST:
> Recursos, URIs, representaciones (típicamente JSON), operaciones (métodos HTTP) e hipermedios (HATEOAS).

**Q34c.** Diferencia entre arquitecturas basadas en mensajes y basadas en recursos:
> Mensajes (SOAP): el cliente envía un mensaje XML que describe la acción a ejecutar. Recursos (REST): el cliente identifica un recurso por URI y le aplica un método HTTP estándar.

**Q34d.** Diseño orientado a recursos: ¿bien o mal estos endpoints?
> ❌ `GET /getFilms`, `POST /createFilm` → orientado a acciones (RPC).
> ✅ `GET /films`, `POST /films` → orientado a recursos (REST).

**Q35.** Seis restricciones de REST (Fielding):
> Cliente-servidor, stateless, caché, interfaz uniforme, sistema en capas (+ código bajo demanda opcional).

**Q36.** ¿Qué significa "stateless" en REST?
> El servidor no guarda estado de sesión; cada petición incluye toda la información necesaria.
> Ej: por eso el JWT se manda en cada request — el servidor no recuerda al usuario entre llamadas.

**Q37.** Operaciones CRUD ↔ métodos HTTP:
> Create→POST, Read→GET, Update→PUT/PATCH, Delete→DELETE.

**Q38.** Métodos **idempotentes**:
> GET, PUT, DELETE.

**Q39.** Métodos **no** idempotentes:
> POST y PATCH.
> Ej: `POST /films` 3 veces crea 3 films distintos; `PUT /films/42` 3 veces deja el mismo film 42.

**Q40.** Métodos **seguros** (no modifican estado):
> GET (y técnicamente HEAD, OPTIONS).

**Q41.** Diferencia PUT vs PATCH:
> PUT reemplaza el recurso completo (idempotente). PATCH actualiza parcialmente (no necesariamente idempotente).
> Ej: PUT requiere mandar el objeto entero; PATCH solo los campos que cambian.

**Q42.** ¿Qué formato es estándar de facto en REST?
> JSON.

**Q43.** ¿Qué cabecera fija el formato del cuerpo de respuesta?
> `Content-Type`.

**Q44.** ¿Qué cabecera usa el cliente para pedir un formato?
> `Accept`.

**Q45.** ¿Qué cabecera lleva el JWT?
> `Authorization: Bearer <token>`.

---

## Bloque 6 — Códigos HTTP

**Q46.** Familias de códigos HTTP:
> 1xx informativos, 2xx éxito, 3xx redirección, 4xx error cliente, 5xx error servidor.

**Q47.** ¿200 vs 201 vs 204?
> 200 OK con cuerpo, 201 Created (recurso nuevo, cabecera Location), 204 No Content (éxito sin cuerpo).

**Q48.** ¿401 vs 403?
> 401 falta autenticación (o token inválido); 403 autenticado pero sin permiso.

**Q49.** ¿400 vs 422?
> 400 sintaxis incorrecta de la petición; 422 sintaxis correcta pero semánticamente inválida.

**Q50.** ¿404 vs 405?
> 404 recurso no existe; 405 método no permitido para esa ruta.

**Q51.** ¿409 cuándo se usa?
> Conflicto de integridad (p. ej. email duplicado).

**Q52.** ¿500 vs 503?
> 500 error genérico interno; 503 servicio temporalmente no disponible.

**Q53.** Cabecera típica de un 201 Created:
> `Location: /recurso/123`.

---

## Bloque 7 — Bases de datos y SQL

**Q54.** ¿Qué es un SGBD?
> Sistema Gestor de Bases de Datos.

**Q55.** SGBD relacionales del curso:
> PostgreSQL y SQLite.

**Q56.** Cliente recomendado de Postgres:
> pgAdmin.

**Q57.** ¿Qué es ORM?
> Object-Relational Mapper (mapea tablas a objetos en código).

**Q58.** Comando Docker base de Postgres del curso:
> `docker run -d --name postgres -e POSTGRES_PASSWORD=... -p 5432:5432 postgres:latest`.

**Q59.** Tipos de instrucciones SQL:
> DDL (CREATE/ALTER/DROP), DML (SELECT/INSERT/UPDATE/DELETE), DCL (GRANT/REVOKE), TCL (BEGIN/COMMIT/ROLLBACK).

**Q60.** ¿Para qué sirve `PRIMARY KEY`?
> Identificar de forma única cada fila.
> Ej: `film_id SERIAL PRIMARY KEY`.

**Q61.** ¿Para qué sirve `FOREIGN KEY`?
> Establecer una relación entre tablas referenciando una PK de otra tabla.
> Ej: `genre_id INT REFERENCES genres(genre_id) ON DELETE CASCADE`.

**Q62.** Tipos de JOIN:
> INNER, LEFT, RIGHT, FULL OUTER, CROSS.

**Q63.** ¿LEFT JOIN qué devuelve?
> Todas las filas de la tabla izquierda + las coincidencias de la derecha.
> Ej: `SELECT g.name FROM genres g LEFT JOIN films_genres fg ON g.id=fg.genre_id WHERE fg.film_id IS NULL` → géneros sin películas.

**Q64.** ¿UNION vs UNION ALL?
> UNION quita duplicados; UNION ALL los mantiene.

**Q65.** ¿Qué cláusula filtra antes de GROUP BY?
> WHERE.

**Q66.** ¿Y después de GROUP BY?
> HAVING.
> Ej: `GROUP BY year HAVING COUNT(*) > 5` → años con más de 5 películas.

**Q67.** ¿Qué es una vista (VIEW)?
> Consulta SQL guardada que se comporta como tabla virtual.
> Ej: `CREATE VIEW top_films AS SELECT * FROM films WHERE rate >= 8`.

**Q68.** ¿Qué es un trigger?
> Procedimiento que se ejecuta automáticamente antes/después de un INSERT/UPDATE/DELETE.
> Ej: `CREATE TRIGGER films_updated BEFORE UPDATE ON films FOR EACH ROW EXECUTE FUNCTION set_updated_at()`.

**Q69.** Lenguaje procedural de Postgres:
> PL/pgSQL.

**Q70.** ¿Para qué sirven las **transacciones**?
> Agrupar varias operaciones en un bloque atómico (BEGIN/COMMIT/ROLLBACK).

**Q71.** Diferencia JSON vs JSONB en Postgres:
> JSON es texto; JSONB es binario indexable y eficiente para consultas.

**Q72.** Acciones referenciales en FK:
> CASCADE, SET NULL, RESTRICT, NO ACTION.

**Q73.** ¿Cuántas afinidades de tipo tiene SQLite?
> 5: INTEGER, TEXT, REAL, BLOB, NUMERIC.

**Q74.** Diseño de una n:n:
> Tabla intermedia con dos FK que referencian a las dos tablas.

**Q75.** Las tres formas normales (1FN/2FN/3FN) sirven para...
> Eliminar redundancia y dependencias problemáticas en el modelo.

---

## Bloque 8 — Driver `pg` (Node + PostgreSQL)

**Q76.** Librería para conectar Node a Postgres con driver nativo:
> `pg` (+ `@types/pg`).

**Q77.** Sintaxis de placeholders en `pg`:
> `$1, $2, $3...` (no concatenar nunca strings).
> Ej: `client.query('SELECT * FROM films WHERE id = $1', [id])`.

**Q78.** ¿Para qué se usan los placeholders?
> Para evitar **SQL Injection**.
> Ej: `WHERE id = ${id}` ❌ permite que `id = "1; DROP TABLE films; --"` borre tu BD.

**Q79.** ¿Qué método ejecuta una query con `pg`?
> `client.query(sql, paramsArray)`.

**Q80.** ¿Qué propiedades trae el resultado?
> `rows`, `rowCount`, `fields`...

**Q81.** Patrón habitual para encapsular el acceso a una entidad:
> Repository (clase con métodos `read`, `readById`, `create`, `update`, `delete`).

---

## Bloque 9 — Prisma

**Q82.** ¿Qué versión de Prisma se usa?
> Prisma 7.

**Q83.** Comandos básicos del CLI:
> `init`, `generate`, `db pull`, `db push`, `migrate dev`, `migrate deploy`, `migrate reset`, `db seed`, `studio`.

**Q84.** ¿Qué hace `prisma generate`?
> Genera el Prisma Client a partir del schema.

**Q85.** ¿Qué hace `prisma db pull`?
> Introspecta la BD y crea/actualiza el schema con los modelos.

**Q86.** ¿Qué hace `prisma db push`?
> Sincroniza el schema con la BD **sin** generar archivos de migración.
> Ej: rápido para prototipar, pero pierdes el historial.

**Q87.** ¿Qué hace `prisma migrate dev`?
> Crea una nueva migración (archivo SQL versionado), la aplica y regenera el cliente. Para entornos de desarrollo.
> Ej: `npx prisma migrate dev --name add_reviews_table`.

**Q88.** ¿Qué hace `prisma migrate deploy`?
> Aplica las migraciones existentes en producción/CI (no crea nuevas).

**Q89.** ¿Qué decorador define la clave primaria?
> `@id`.

**Q90.** Decorador para autoincremento:
> `@default(autoincrement())`.

**Q91.** Decorador para mapear nombre de columna:
> `@map("nombre_columna")`.

**Q92.** Decorador para mapear nombre de tabla:
> `@@map("nombre_tabla")`.

**Q93.** Decorador para clave primaria compuesta:
> `@@id([campo1, campo2])`.

**Q94.** Decorador para timestamp auto-actualizable:
> `@updatedAt`.

**Q95.** ¿Cómo se define una relación 1:n en Prisma?
> Campo escalar FK + `@relation(fields, references)` en el lado N; lista del modelo en el lado 1.
> Ej: `User { reviews Review[] }` y `Review { user User @relation(fields:[userID], references:[id])  userID Int }`.

**Q96.** Diferencia `findUnique` vs `findFirst`:
> `findUnique` requiere filtro por campo único; `findFirst` admite cualquier filtro y devuelve el primero.
> Ej: `findUnique({ where: { email: 'a@b.c' } })` (email es @unique) vs `findFirst({ where: { year: 2010 } })`.

**Q97.** Diferencia `include` vs `select`:
> `include` añade relaciones; `select` elige los campos a devolver. **Son excluyentes** en la misma consulta.
> Ej: `findMany({ include: { profile: true } })` vs `findMany({ select: { id: true, email: true } })`.

**Q98.** Método para "actualizar si existe, crear si no":
> `upsert`.
> Ej: `prisma.user.upsert({ where:{email}, update:{...}, create:{...} })`.

**Q99.** ¿Cómo ejecutar SQL crudo con Prisma?
> `prisma.$queryRaw\`SELECT ...\`` o `prisma.$executeRaw`.

**Q100.** ¿Cómo agrupar varias operaciones en una transacción?
> `prisma.$transaction([op1, op2, ...])`.
> Ej: `await prisma.$transaction([prisma.film.create({...}), prisma.review.create({...})])`.

**Q101.** ¿Para qué sirve `prisma db seed`?
> Ejecutar el script de datos iniciales configurado en `prisma.config.ts`.

**Q102.** ¿Qué es Prisma Studio?
> Una GUI web para inspeccionar y editar los datos de la BD.

**Q103.** ¿Cómo se gestiona el Postgres en Prisma 7 con driver nativo `pg`?
> Con `@prisma/adapter-pg` (`new PrismaPg({ connectionString })`).

**Q104.** ¿Dónde se almacena qué migraciones se han aplicado?
> En la tabla `_prisma_migrations` de la BD.

---

## Bloque 10 — Validación con Zod

**Q105.** ¿Qué versión de Zod se usa?
> Zod 4.

**Q106.** Diferencia `parse` vs `safeParse`:
> `parse` lanza `ZodError` si falla; `safeParse` devuelve `{ success, data }` o `{ success, error }`.
> Ej: `const r = Schema.safeParse(req.body); if (!r.success) return next(new HttpError(422,...))`.

**Q107.** ¿Cómo inferir el tipo TS de un schema?
> `type T = z.infer<typeof MiSchema>`.
> Ej: si `UserSchema = z.object({ email: z.string() })` → `type User = { email: string }`.

**Q108.** Validador de email:
> `z.string().email()`.

**Q109.** Campo opcional (acepta undefined):
> `.optional()`.
> Ej: `age: z.number().optional()` → `age` puede ser `number | undefined`.

**Q110.** Campo nullable (acepta null):
> `.nullable()`.
> Ej: `avatar: z.string().nullable()` → puede ser `string | null` (pero NO undefined).

**Q111.** Tres usos de Zod en el curso:
> Validar variables de entorno, DTOs en endpoints, params/query/body en rutas.

---

## Bloque 11 — Auth y seguridad

**Q112.** Autenticación vs autorización:
> Autenticación = quién eres; autorización = qué puedes hacer.

**Q113.** Librería de hashing del curso:
> `bcryptjs`.

**Q114.** ¿Por qué se usa bcrypt en vez de SHA-256?
> Por ser lento por diseño (saltRounds), resistente a fuerza bruta y con sal incorporada.

**Q115.** Salt rounds usados en `15.Films`:
> 12.

**Q116.** Métodos clave de bcrypt:
> `hash(password, saltRounds)` y `compare(password, hash)`.
> Ej: `const h = await hash('pwd', 12); const ok = await compare('pwd', h)`.

**Q117.** ¿Qué es un JWT?
> JSON Web Token: token autocontenido formado por header.payload.signature.
> Ej: `eyJhbGci...HEADER.eyJpZCI6...PAYLOAD.abc123SIGNATURE`.

**Q118.** ¿Las tres partes de un JWT?
> Header (algoritmo y tipo) + Payload (claims) + Signature (firma).

**Q119.** ¿El payload de un JWT está cifrado?
> No, solo codificado en base64url. Por eso **nunca** se mete información sensible (passwords).
> Ej: pega un JWT en jwt.io y verás el payload en claro.

**Q120.** ¿Qué algoritmo de firma usa por defecto la librería `jsonwebtoken` con secret simétrico?
> HS256 (HMAC-SHA256).

**Q121.** Métodos clave de `jsonwebtoken`:
> `jwt.sign(payload, secret, options)` y `jwt.verify(token, secret)`.
> Ej: `jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: '1h' })`.

**Q122.** ¿Cómo se envía el JWT en la petición?
> Cabecera `Authorization: Bearer <token>`.

**Q123.** ¿Qué pasa si el token es inválido o falta? Código:
> 401 Unauthorized.

**Q124.** ¿Y si está autenticado pero no tiene permiso?
> 403 Forbidden.

**Q125.** ¿Qué es RBAC?
> Role-Based Access Control: permisos organizados por roles.
> Ej: roles `USER`, `EDITOR`, `ADMIN`; el endpoint declara qué roles permite.

**Q126.** Roles definidos en `15.Films`:
> `USER`, `EDITOR`, `ADMIN`.

**Q127.** ¿Qué hace el `isOwnerOrAdmin`?
> Permite continuar si `req.user.id === Number(req.params.id)` o el rol es `ADMIN`; si no, 403.
> Ej: `PATCH /users/5` solo lo aprueba si el JWT identifica al usuario id=5 o si es ADMIN.

**Q128.** ¿Qué cabecera **debería** desactivarse por seguridad en Express?
> `X-Powered-By` con `app.disable('x-powered-by')`.

**Q129.** ¿Qué es CORS?
> Cross-Origin Resource Sharing: mecanismo del navegador para permitir/denegar peticiones a otro origen.

**Q130.** ¿Qué método usa el navegador en una petición CORS preflight?
> OPTIONS.

---

## Bloque 12 — Testing

**Q131.** Runner de tests usado en el curso:
> `node:test` (integrado en Node, sin librerías externas).

**Q132.** Módulo nativo de aserciones:
> `node:assert` (preferiblemente `node:assert/strict`).

**Q133.** ¿Cómo ejecutar todos los tests?
> `node --test`.

**Q134.** ¿Cómo ejecutar tests con un `.env` específico?
> `node --env-file=.env.test --test`.

**Q135.** ¿Cómo ejecutar tests en serie?
> `--test-concurrency=1`.

**Q136.** Hooks de `node:test`:
> `before`, `after`, `beforeEach`, `afterEach` + `describe` y `test`.

**Q137.** Estrategia recomendada para BD de test:
> Una BD aparte, script de setup que recree tablas y aplique seed antes de los tests.

---

## Bloque 13 — Estructura del proyecto y tooling

**Q138.** Estructura típica del repo Films:
> `src/{config, middleware, errors, services, types, zod, <feature>/{controllers,repos,router}, app.ts, index.ts}` + `prisma/` + `data/` + `front/`.

**Q139.** ¿Qué fichero define las dependencias y scripts?
> `package.json`.

**Q140.** ¿Qué fichero bloquea las versiones exactas instaladas?
> `package-lock.json`.

**Q141.** Linter y formateador del curso:
> ESLint 10 + Prettier (con `singleQuote: true`).

**Q142.** Librería de logging por namespaces:
> `debug` (controlada con la variable `DEBUG`).

**Q143.** Cliente HTTP usado para probar APIs:
> Postman.

---

## Bloque 14 — UF1846 (Aplicaciones Web Distribuidas)

**Q144.** ¿Qué significa SOA?
> Service-Oriented Architecture (Arquitectura Orientada a Servicios).

**Q145.** Dos modelos conceptuales de SOA:
> Basados en mensajes (SOAP) y basados en recursos (REST).

**Q146.** ¿Qué describe **WSDL**?
> El contrato de un servicio SOAP en XML.

**Q147.** ¿Y **OpenAPI/Swagger**?
> La especificación moderna para describir y documentar APIs REST.

**Q148.** Estándares de seguridad del mundo SOAP:
> WS-Security, SAML, XACML.

**Q149.** Estándares prácticos de seguridad en REST:
> HTTPS/TLS, JWT, OAuth2, CORS, RBAC.

**Q150.** Estándar histórico de directorio de servicios:
> UDDI.

**Q151.** Patrón asíncrono y desacoplado de comunicación:
> Pub/Sub (publicación/suscripción) — ej. Redis, Kafka, RabbitMQ.

**Q152.** ¿Qué son los **hipermedios** en una API REST?
> Enlaces dentro de las respuestas para navegar a recursos relacionados (HATEOAS).
> Ej: una respuesta de `/films/42` incluye `"links": { "reviews": "/films/42/reviews" }`.

**Q153.** ¿Cinco elementos esenciales de una API REST?
> Recursos, URIs, representaciones (JSON), operaciones (métodos HTTP) e hipermedios.

**Q154.** Diferencia clave entre arquitectura basada en mensajes vs basada en recursos:
> Mensajes (SOAP): el cliente describe la **acción** en un mensaje XML. Recursos (REST): el cliente identifica un **recurso** por URI y aplica un método HTTP estándar.

**Q155.** ¿En REST las URIs deben contener verbos?
> No. Los verbos los aporta el método HTTP. Las URIs identifican **recursos** (nombres en plural).
> Ej: ❌ `/getFilms` → ✅ `GET /films`.

---

## Tabla resumen — códigos HTTP

| Código | Significado | Cuándo |
|---|---|---|
| 200 | OK | Éxito con cuerpo |
| 201 | Created | Recurso creado (cabecera Location) |
| 204 | No Content | Éxito sin cuerpo (típico DELETE) |
| 301 | Moved Permanently | Redirección permanente |
| 304 | Not Modified | Cache válida |
| 400 | Bad Request | Sintaxis incorrecta |
| 401 | Unauthorized | Falta autenticación o token inválido |
| 403 | Forbidden | Autenticado pero sin permiso |
| 404 | Not Found | Recurso no existe |
| 405 | Method Not Allowed | Método no admitido en esa ruta |
| 409 | Conflict | Violación de integridad (email duplicado) |
| 422 | Unprocessable Entity | Sintaxis correcta, semánticamente inválida |
| 500 | Internal Server Error | Error genérico de servidor |
| 503 | Service Unavailable | Servicio temporalmente fuera |

## Tabla resumen — métodos HTTP

| Método | CRUD | Seguro | Idempotente |
|---|---|---|---|
| GET | Read | sí | sí |
| POST | Create | no | no |
| PUT | Update (reemplazo total) | no | sí |
| PATCH | Update parcial | no | no |
| DELETE | Delete | no | sí |

## Tabla resumen — comandos Prisma

| Comando | Para qué |
|---|---|
| `npx prisma init` | Inicializa el proyecto (schema + config) |
| `npx prisma generate` | Genera el Prisma Client |
| `npx prisma db pull` | Introspección desde la BD existente |
| `npx prisma db push` | Sincroniza schema sin migración (rápido, sin historial) |
| `npx prisma migrate dev --name X` | Crea + aplica migración + regenera cliente (dev) |
| `npx prisma migrate deploy` | Aplica migraciones existentes (prod / CI) |
| `npx prisma migrate reset` | Borra y recrea la BD (+ seed si configurado) |
| `npx prisma db seed` | Ejecuta el script de seed |
| `npx prisma studio` | Abre la GUI web de inspección |

## Tabla resumen — tipos de instrucciones SQL

| Tipo | Significado | Ejemplos |
|---|---|---|
| DDL | Data Definition Language | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| DML | Data Manipulation Language | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| DCL | Data Control Language | `GRANT`, `REVOKE` |
| TCL | Transaction Control Language | `BEGIN`, `COMMIT`, `ROLLBACK` |
