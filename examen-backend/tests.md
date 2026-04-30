# Simulacros de examen — Backend (IFCD0210)

4 simulacros de 40 preguntas tipo test cada uno (160 preguntas en total) sobre el material de backend del repo. Cada examen cubre todos los bloques: Node, Express, REST, BD/SQL, Prisma, Auth, Validación, Testing y conceptos UF1846.

Las soluciones están al final de cada examen.

---

## Examen 1

**1.** ¿Qué afirmación describe mejor a Node.js?

- a) Un framework web para JavaScript.
- b) Un entorno de ejecución de JavaScript fuera del navegador, basado en V8.
- c) Una librería de testing para JavaScript.
- d) Un compilador de TypeScript.

**2.** ¿Qué propiedad de `process` contiene los argumentos pasados desde la línea de comandos?

- a) `process.env`
- b) `process.cwd`
- c) `process.argv`
- d) `process.cli`

**3.** En `process.argv`, ¿en qué posición empiezan los argumentos pasados por el usuario?

- a) `[0]`
- b) `[1]`
- c) `[2]`
- d) `[3]`

**4.** ¿Qué flag de Node permite cargar variables desde un fichero `.env` sin librerías externas?

- a) `--env`
- b) `--env-file=.env`
- c) `--load-env=.env`
- d) `--dotenv`

**5.** ¿Qué módulo nativo se importa para usar el FS basado en promesas?

- a) `node:fs`
- b) `node:fs/promises`
- c) `node:fs/async`
- d) `node:promises/fs`

**6.** ¿Qué patrón de diseño implementan los middleware de Express?

- a) Singleton.
- b) Observer.
- c) Cadena de Responsabilidad.
- d) Factory.

**7.** ¿Cuántos parámetros tiene un middleware **de errores** en Express?

- a) 2 (req, res).
- b) 3 (req, res, next).
- c) 4 (err, req, res, next).
- d) 1 (err).

**8.** ¿Qué middleware nativo de Express se necesita para parsear bodies JSON?

- a) `express.body()`
- b) `express.parse()`
- c) `express.json()`
- d) `express.bodyParser()`

**9.** ¿Cuál es el método HTTP **idempotente** que se usa para reemplazar un recurso completo?

- a) POST
- b) PUT
- c) PATCH
- d) GET

**10.** ¿Qué código HTTP se devuelve normalmente al **crear** un recurso?

- a) 200 OK
- b) 201 Created
- c) 204 No Content
- d) 202 Accepted

**11.** ¿Qué código HTTP indica que falta autenticación o el token es inválido?

- a) 400
- b) 401
- c) 403
- d) 404

**12.** ¿Qué código se usa cuando el usuario está autenticado pero no tiene permiso?

- a) 401
- b) 402
- c) 403
- d) 405

**13.** ¿Cuál de estos métodos HTTP **no** es idempotente?

- a) GET
- b) PUT
- c) POST
- d) DELETE

**14.** ¿Qué significa que REST sea "stateless"?

- a) Que no almacena datos en BD.
- b) Que el servidor no guarda estado de sesión entre peticiones.
- c) Que no usa cookies.
- d) Que no devuelve datos.

**15.** ¿Qué cabecera se utiliza para enviar un JWT al servidor?

- a) `X-Token: <token>`
- b) `Authorization: Bearer <token>`
- c) `Cookie: jwt=<token>`
- d) `Auth: JWT <token>`

**16.** Un JWT está formado por tres partes separadas por puntos. ¿Cuáles son?

- a) header, body, footer
- b) header, payload, signature
- c) algorithm, data, hash
- d) issuer, claims, secret

**17.** ¿Qué librería se usa en el proyecto para hashear contraseñas?

- a) crypto
- b) bcryptjs
- c) hashlib
- d) jsonwebtoken

**18.** ¿Qué tipo de instrucciones SQL son `CREATE`, `ALTER` y `DROP`?

- a) DML
- b) DCL
- c) DDL
- d) TCL

**19.** ¿Y `SELECT`, `INSERT`, `UPDATE`, `DELETE`?

- a) DDL
- b) DML
- c) DCL
- d) TCL

**20.** ¿Qué tipo de JOIN devuelve **todas** las filas de la tabla izquierda más las coincidencias de la derecha?

- a) INNER JOIN
- b) LEFT JOIN
- c) RIGHT JOIN
- d) CROSS JOIN

**21.** ¿Qué función de agregación cuenta filas?

- a) `SUM`
- b) `AVG`
- c) `COUNT`
- d) `TOTAL`

**22.** En PostgreSQL, ¿qué tipo de dato sirve para JSON binario eficiente?

- a) `JSON`
- b) `JSONB`
- c) `BSON`
- d) `BLOB`

**23.** ¿Qué comando Prisma genera el cliente a partir del schema?

- a) `npx prisma init`
- b) `npx prisma generate`
- c) `npx prisma build`
- d) `npx prisma client`

**24.** ¿Qué comando Prisma crea una migración nueva, la aplica y regenera el cliente?

- a) `npx prisma db push`
- b) `npx prisma migrate dev`
- c) `npx prisma migrate deploy`
- d) `npx prisma update`

**25.** ¿Qué decorador de Prisma marca una propiedad como clave primaria?

- a) `@primary`
- b) `@id`
- c) `@key`
- d) `@pk`

**26.** ¿Cómo se mapea un nombre de campo del modelo a una columna distinta en la BD?

- a) `@column("nombre")`
- b) `@field("nombre")`
- c) `@map("nombre")`
- d) `@db.Name("nombre")`

**27.** En Zod, ¿qué método **lanza** una excepción si los datos no son válidos?

- a) `safeParse`
- b) `parse`
- c) `validate`
- d) `check`

**28.** ¿Qué método de Zod devuelve `{ success, data }` o `{ success, error }` sin lanzar?

- a) `parse`
- b) `safeParse`
- c) `tryParse`
- d) `optionalParse`

**29.** ¿Qué librería de logging usada en el curso permite namespaces controlados con la variable de entorno `DEBUG`?

- a) winston
- b) pino
- c) debug
- d) morgan

**30.** ¿Qué middleware se utiliza para registrar peticiones HTTP en consola con un formato predefinido?

- a) `helmet`
- b) `morgan`
- c) `cors`
- d) `compression`

**31.** ¿Qué hace `app.disable('x-powered-by')`?

- a) Desactiva la API REST.
- b) Quita la cabecera que indica que el servidor usa Express.
- c) Inhabilita los middleware de terceros.
- d) Apaga el motor de vistas.

**32.** ¿Qué es un repositorio en el patrón Repository?

- a) Una clase/módulo que abstrae el acceso a la fuente de datos.
- b) Un servicio externo de almacenamiento.
- c) Un repositorio Git.
- d) Una vista de la BD.

**33.** ¿Cómo se accede a un parámetro `:id` de una ruta en Express?

- a) `req.url.id`
- b) `req.query.id`
- c) `req.params.id`
- d) `req.body.id`

**34.** ¿Cómo se accede a `?id=5` en una URL?

- a) `req.params.id`
- b) `req.query.id`
- c) `req.body.id`
- d) `req.headers.id`

**35.** ¿Qué nivel HTTP indica errores del servidor?

- a) 2xx
- b) 3xx
- c) 4xx
- d) 5xx

**36.** ¿Qué utilidad ofrece **Postman** en el desarrollo de APIs REST?

- a) Compilar TypeScript.
- b) Ejecutar tests unitarios.
- c) Realizar y organizar peticiones HTTP a una API.
- d) Diseñar diagramas E/R.

**37.** ¿Qué runner de tests está integrado en Node y se usa en el curso?

- a) jest
- b) mocha
- c) node:test
- d) vitest

**38.** En el modelo RBAC, ¿alrededor de qué se organizan los permisos?

- a) Los usuarios individuales.
- b) Los roles.
- c) Los recursos.
- d) Las cabeceras HTTP.

**39.** ¿Qué describe **mejor** una API REST?

- a) Un protocolo basado en XML.
- b) Un estilo arquitectónico basado en recursos accesibles por HTTP.
- c) Un framework de Node.js.
- d) Una BD documental.

**40.** ¿Qué herramienta es estándar de facto para **documentar** APIs REST?

- a) WSDL
- b) UDDI
- c) OpenAPI / Swagger
- d) SAML

### Soluciones Examen 1

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| b | c | c | b | b | c | c | c | b | b |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| b | c | c | b | b | b | b | c | b | b |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|---|---|---|---|---|---|---|---|---|
| c | b | b | b | b | c | b | b | c | b |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|---|---|---|---|---|---|---|---|---|---|
| b | a | c | b | d | c | c | b | b | c |

---

## Examen 2

**1.** ¿Cuál es la diferencia entre **autenticación** y **autorización**?

- a) Son sinónimos.
- b) Autenticación verifica quién eres; autorización qué puedes hacer.
- c) Autenticación es para humanos; autorización para máquinas.
- d) Autenticación se hace en el cliente; autorización en el servidor.

**2.** ¿Qué cabecera HTTP indica la URI del recurso recién creado tras un `POST`?

- a) `Content-Location`
- b) `Location`
- c) `Created-At`
- d) `Resource-URL`

**3.** ¿Qué método HTTP debería usarse para **actualizar parcialmente** un recurso?

- a) POST
- b) PUT
- c) PATCH
- d) MERGE

**4.** Una petición `PUT` con los mismos datos enviada varias veces produce el mismo resultado. ¿Cómo se llama esta propiedad?

- a) Atomicidad.
- b) Idempotencia.
- c) Consistencia.
- d) Reentrancia.

**5.** ¿Qué código HTTP es apropiado para una **eliminación** exitosa sin cuerpo de respuesta?

- a) 200 OK
- b) 201 Created
- c) 204 No Content
- d) 410 Gone

**6.** ¿Qué archivo describe las dependencias y scripts de un proyecto Node?

- a) `package-lock.json`
- b) `package.json`
- c) `node.config.json`
- d) `npm.json`

**7.** ¿Para qué sirve `package-lock.json`?

- a) Define las dependencias principales.
- b) Bloquea las versiones exactas de todas las dependencias instaladas.
- c) Encripta el `package.json`.
- d) No se usa en Node moderno.

**8.** ¿Qué comando instala una dependencia como **dev dependency**?

- a) `npm install --dev <pkg>`
- b) `npm install -D <pkg>`
- c) `npm dev install <pkg>`
- d) `npm install --development <pkg>`

**9.** ¿Cómo se exporta el **default** de un módulo en ESM?

- a) `module.exports = ...`
- b) `export default ...`
- c) `exports.default = ...`
- d) `export = ...`

**10.** ¿Cuál es el formato de módulos antiguo de Node?

- a) AMD
- b) UMD
- c) CommonJS
- d) ESM

**11.** ¿Qué hace `app.use(express.static('public'))`?

- a) Activa CORS.
- b) Sirve archivos estáticos desde la carpeta `public`.
- c) Compila JavaScript para producción.
- d) Añade un router.

**12.** ¿En qué orden se ejecutan los middleware de Express?

- a) En orden alfabético.
- b) En orden inverso al registro.
- c) En el orden en que se registran.
- d) Aleatoriamente.

**13.** ¿Qué cabecera indica el formato del cuerpo de la respuesta?

- a) `Accept`
- b) `Content-Type`
- c) `Content-Encoding`
- d) `Body-Type`

**14.** ¿Qué cabecera **envía el cliente** para indicar el formato que prefiere recibir?

- a) `Content-Type`
- b) `Accept`
- c) `Prefer`
- d) `Accept-Encoding`

**15.** ¿Cuál de estas no es una **familia** estándar de códigos HTTP?

- a) 1xx Informativos
- b) 2xx Éxito
- c) 6xx Custom
- d) 5xx Error de servidor

**16.** ¿Qué hace `prisma db pull`?

- a) Descarga los datos de la BD a un fichero JSON.
- b) Hace introspección y genera el `schema.prisma` a partir de una BD existente.
- c) Aplica las migraciones pendientes.
- d) Borra el schema.

**17.** ¿Qué hace `prisma db push`?

- a) Crea una migración nueva con historial.
- b) Sincroniza el schema con la BD sin generar archivos de migración.
- c) Sube el schema a un repositorio remoto.
- d) Nada, no existe.

**18.** En Prisma, ¿cómo se define una relación 1:n?

- a) Con dos campos `@id`.
- b) Con un campo escalar (FK) y una propiedad de tipo array en el otro modelo.
- c) Con `@relation("uno-a-muchos")`.
- d) No se puede.

**19.** ¿Qué decorador hace que Prisma actualice automáticamente un campo cuando se modifica el registro?

- a) `@updatedAt`
- b) `@auto`
- c) `@trigger`
- d) `@now()`

**20.** ¿Qué método del cliente Prisma trae **todos** los registros de un modelo?

- a) `findAll()`
- b) `findMany()`
- c) `getAll()`
- d) `selectAll()`

**21.** ¿Qué propiedad de la opción del cliente Prisma trae **relaciones** asociadas?

- a) `select`
- b) `with`
- c) `include`
- d) `relations`

**22.** ¿Qué patrón usa Express para gestionar errores centralizados?

- a) Try/catch global.
- b) Un middleware con 4 parámetros (err, req, res, next).
- c) Una clase ErrorManager.
- d) Promesas con `.catch()` global.

**23.** ¿Qué hereda la clase `HttpError` del proyecto?

- a) `Object`
- b) `Error`
- c) `Exception`
- d) `Response`

**24.** ¿Qué se debe hacer **siempre** antes de guardar un password en BD?

- a) Encriptarlo con AES.
- b) Aplicarle un hash con sal (ej. bcrypt).
- c) Convertirlo a base64.
- d) Comprimirlo.

**25.** ¿Qué algoritmo se usa por defecto en JWT cuando se firma con un secret simétrico?

- a) RS256
- b) HS256
- c) ES256
- d) MD5

**26.** ¿Qué parte de un JWT contiene los datos del usuario (claims)?

- a) Header
- b) Payload
- c) Signature
- d) Footer

**27.** ¿El payload de un JWT está cifrado?

- a) Sí, con AES.
- b) No, solo está codificado en base64url.
- c) Sí, con el secret.
- d) Sí, con RSA.

**28.** ¿Qué función bcrypt verifica una contraseña contra su hash?

- a) `bcrypt.equals(plain, hash)`
- b) `bcrypt.compare(plain, hash)`
- c) `bcrypt.verify(plain, hash)`
- d) `bcrypt.match(plain, hash)`

**29.** ¿Cuál es la principal diferencia entre **autenticación** y **autorización** a nivel de código en una API REST con interceptores?

- a) Solo se diferencian en el nombre.
- b) Authenticate verifica el token; authorize verifica que el rol/permiso es válido.
- c) Authenticate verifica el rol; authorize verifica el token.
- d) Authorize se hace en el cliente.

**30.** ¿Qué tipo de relación tiene una tabla intermedia con dos FK?

- a) 1:1
- b) 1:n
- c) n:n
- d) 0:1

**31.** ¿Cuál de estos NO es un SGBD relacional?

- a) PostgreSQL
- b) MySQL
- c) MongoDB
- d) SQLite

**32.** ¿Qué clase de afinidades de tipo de datos tiene SQLite?

- a) 3
- b) 5
- c) 8
- d) 12

**33.** ¿Qué hace `ON DELETE CASCADE` en una FK?

- a) Impide eliminar la fila padre si hay hijos.
- b) Pone los FK en NULL al borrar la fila padre.
- c) Borra automáticamente las filas hijas al borrar la padre.
- d) Crea una copia de seguridad antes de borrar.

**34.** ¿Qué procedimiento de la BD se ejecuta automáticamente antes/después de un INSERT, UPDATE o DELETE?

- a) Stored procedure.
- b) Trigger.
- c) View.
- d) Index.

**35.** ¿Cómo se llama el lenguaje procedural de PostgreSQL?

- a) T-SQL
- b) PL/SQL
- c) PL/pgSQL
- d) PSQL-Script

**36.** ¿Qué riesgo evita usar **placeholders** (`$1`, `$2`) en consultas SQL en lugar de concatenar strings?

- a) Cross-Site Scripting.
- b) SQL Injection.
- c) Race conditions.
- d) Memory leaks.

**37.** ¿Qué define la cabecera `Authorization: Bearer <token>` en una petición?

- a) Que el servidor debe responder con un token.
- b) Que se envía un token portador para autenticar al usuario.
- c) Que la petición es anónima.
- d) Que se usa autenticación básica.

**38.** ¿Qué patrón estructural describe la separación entre Modelo, Vista y Controlador?

- a) MVP
- b) MVVM
- c) MVC
- d) MV*

**39.** ¿Qué es **CORS**?

- a) Un protocolo de cifrado.
- b) Un mecanismo para permitir/denegar peticiones desde otro origen.
- c) Una librería de Node para BD.
- d) Un tipo de cabecera de caché.

**40.** ¿Qué tipo de tests se usan en `13.DB` y `15.Films`?

- a) Tests E2E con Cypress.
- b) Tests unitarios y de integración con `node:test`.
- c) Tests visuales con Storybook.
- d) Tests de carga con JMeter.

### Soluciones Examen 2

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | c | b | c | b | b | b | b | c |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| b | c | b | b | c | b | b | b | a | b |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|---|---|---|---|---|---|---|---|---|
| c | b | b | b | b | b | b | b | b | c |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|---|---|---|---|---|---|---|---|---|---|
| c | b | c | b | c | b | b | c | b | b |

---

## Examen 3

**1.** ¿Qué se obtiene tras ejecutar `npx prisma init`?

- a) La BD creada.
- b) Las carpetas `prisma/`, `schema.prisma` y `prisma.config.ts`.
- c) Un proyecto Express completo.
- d) El cliente de Prisma compilado.

**2.** ¿Dónde se define la conexión a la BD en Prisma 7 con esta configuración del curso?

- a) En `package.json`.
- b) En `prisma.config.ts` (con DATABASE_URL).
- c) En `tsconfig.json`.
- d) En `app.ts`.

**3.** ¿Qué clase del paquete `@prisma/adapter-pg` se utiliza?

- a) `PostgresAdapter`
- b) `PrismaPg`
- c) `PgClient`
- d) `Adapter`

**4.** En el schema de `15.Films`, ¿cómo se define el enum de roles de usuario?

- a) `enum Role { USER EDITOR ADMIN }`
- b) `type Role = "USER" | "EDITOR" | "ADMIN"`
- c) `roles: ["USER", "EDITOR", "ADMIN"]`
- d) Con una tabla aparte.

**5.** ¿Qué relación tienen `Film` y `Genre` en `15.Films`?

- a) 1:1
- b) 1:n
- c) n:n
- d) Sin relación.

**6.** ¿Qué relación tienen `User` y `Profile`?

- a) 1:1
- b) 1:n
- c) n:n
- d) 0:1

**7.** ¿Cómo se define una clave primaria compuesta en Prisma?

- a) `@id` en cada campo.
- b) `@@id([campo1, campo2])`
- c) `@primary([campo1, campo2])`
- d) `@composite()`

**8.** ¿Cuál es el prefijo correcto del namespace para `debug` en el curso?

- a) `<projectName>:<area>`
- b) `debug-<area>`
- c) `LOG_<area>`
- d) `node:debug`

**9.** ¿Qué variable de entorno controla qué namespaces de `debug` se imprimen?

- a) `DEBUG`
- b) `LOG_LEVEL`
- c) `NODE_DEBUG`
- d) `VERBOSE`

**10.** Si en una API REST se necesita crear un usuario, ¿qué endpoint sigue mejor las convenciones?

- a) `GET /createUser`
- b) `POST /users`
- c) `POST /users/create`
- d) `PUT /users/new`

**11.** ¿Cuántos roles tiene definidos el modelo `User` en `15.Films`?

- a) 1 (USER)
- b) 2 (USER, ADMIN)
- c) 3 (USER, EDITOR, ADMIN)
- d) 4

**12.** ¿Qué hace `prisma.user.findUnique({ where: { id: 1 } })`?

- a) Devuelve todos los usuarios.
- b) Devuelve el primer usuario que cumple un filtro.
- c) Devuelve un único registro identificado por un campo único.
- d) Crea un usuario con id 1.

**13.** ¿Cuál es la función de `prisma.$queryRaw`?

- a) Limpiar la caché del cliente.
- b) Ejecutar SQL crudo.
- c) Lanzar errores intencionados.
- d) Resetear la BD.

**14.** ¿Qué hace `prisma.$transaction([op1, op2])`?

- a) Las ejecuta en paralelo sin garantías.
- b) Las ejecuta secuencialmente como una sola transacción atómica.
- c) Las cancela.
- d) Las exporta a un fichero.

**15.** ¿Qué herramienta es **Prisma Studio**?

- a) Un IDE para JavaScript.
- b) Una GUI web para inspeccionar y editar los datos de la BD.
- c) Un visor de logs.
- d) Un generador de tests.

**16.** ¿Qué hace el método `safeParse` de Zod cuando los datos no son válidos?

- a) Lanza un `ZodError`.
- b) Devuelve `{ success: false, error }`.
- c) Devuelve `null`.
- d) Devuelve `undefined`.

**17.** ¿Qué se obtiene con `z.infer<typeof MiSchema>`?

- a) Un objeto schema en JSON.
- b) Un tipo de TypeScript inferido del schema.
- c) Una validación inmediata.
- d) Una función de migración.

**18.** ¿Qué validador encadenado de Zod garantiza que un string sea un email?

- a) `.email()`
- b) `.isEmail()`
- c) `.email("required")`
- d) `.regex(/email/)`

**19.** ¿Cómo declaras un campo opcional en Zod?

- a) `.maybe()`
- b) `.nullable()`
- c) `.optional()`
- d) `?:`

**20.** ¿Qué uso tiene Zod en `config/env.ts`?

- a) Generar variables de entorno.
- b) Validar y tipar el contenido de `process.env` al arrancar.
- c) Cargar el `.env`.
- d) Encriptar las claves.

**21.** ¿Qué hace `app.use('/api/users', usersRouter)` en Express?

- a) Inicializa la ruta sin asociar nada.
- b) Monta un router en un prefijo de ruta.
- c) Crea un middleware global.
- d) Define los métodos HTTP permitidos.

**22.** ¿Cuál de estos middleware de terceros mejora la **seguridad** añadiendo cabeceras?

- a) `morgan`
- b) `cors`
- c) `helmet`
- d) `body-parser`

**23.** En el patrón MVC, ¿quién valida los datos de entrada y orquesta?

- a) El modelo.
- b) La vista.
- c) El controlador.
- d) El router.

**24.** En el repo, ¿qué clase representa la lógica de auth (hash, compare, sign, verify)?

- a) `AuthController`
- b) `AuthService`
- c) `AuthInterceptor`
- d) `AuthRepo`

**25.** ¿Qué hace `AuthInterceptor.authenticate` cuando no hay cabecera `Authorization`?

- a) Devuelve un 200.
- b) Llama a `next(unauthorizedError)` (401).
- c) Crea un usuario invitado.
- d) Lanza una excepción no controlada.

**26.** ¿Qué hace `isOwnerOrAdmin`?

- a) Permite el acceso a todos los autenticados.
- b) Permite el acceso solo si `req.user.id === Number(req.params.id)` o el rol es ADMIN.
- c) Solo permite admins.
- d) Solo permite owners (sin admin).

**27.** En SQL, ¿qué cláusula filtra **antes** del `GROUP BY`?

- a) `HAVING`
- b) `WHERE`
- c) `ORDER BY`
- d) `LIMIT`

**28.** ¿Y qué cláusula filtra **después** del `GROUP BY`?

- a) `HAVING`
- b) `WHERE`
- c) `ORDER BY`
- d) `FILTER`

**29.** ¿Qué tipo de JOIN devuelve **el producto cartesiano**?

- a) INNER JOIN
- b) FULL OUTER JOIN
- c) CROSS JOIN
- d) LEFT JOIN

**30.** ¿Qué cláusula combina los resultados de varios `SELECT` quitando duplicados?

- a) `JOIN`
- b) `UNION`
- c) `UNION ALL`
- d) `MERGE`

**31.** ¿Qué normalización elimina dependencias parciales (campos que no dependen de toda la PK compuesta)?

- a) 1FN
- b) 2FN
- c) 3FN
- d) BCNF

**32.** En el flujo `node --watch ./src/index.ts`, ¿qué hace `--watch`?

- a) Reinicia el proceso al detectar cambios en los ficheros.
- b) Vigila la red.
- c) Compila TypeScript.
- d) Imprime un timer.

**33.** ¿Qué hace `cross-env` en un script de npm?

- a) Permite ejecutar binarios entre proyectos.
- b) Define variables de entorno de forma multiplataforma (Windows / Unix).
- c) Conecta a la BD remota.
- d) Compila TypeScript.

**34.** ¿Qué hace `--test-concurrency=1` al ejecutar tests con `node --test`?

- a) Ejecuta un solo test.
- b) Ejecuta los tests en serie (uno tras otro).
- c) Limita la duración a 1 segundo.
- d) Ejecuta solo el test 1.

**35.** ¿Qué archivo configura ESLint en el proyecto?

- a) `.eslintrc.json`
- b) `eslint.config.js`
- c) `lint.config.ts`
- d) `package.json`

**36.** ¿Qué versión de Express se utiliza en los proyectos del curso?

- a) Express 3
- b) Express 4
- c) Express 5
- d) Fastify

**37.** En un servidor Express, ¿cómo se desactiva la cabecera `X-Powered-By`?

- a) `app.disable('x-powered-by')`
- b) `app.headers().remove('X-Powered-By')`
- c) `app.set('powered-by', false)`
- d) No se puede desactivar.

**38.** En `15.Films`, el repositorio de films está implementado con...

- a) Driver `pg` y SQL crudo.
- b) Prisma Client.
- c) `node:sqlite`.
- d) Un fichero JSON.

**39.** ¿Cuál de estas afirmaciones sobre `OpenAPI/Swagger` es correcta?

- a) Es un protocolo binario.
- b) Es una especificación para describir APIs REST en YAML/JSON.
- c) Es un servidor de aplicaciones.
- d) Es una base de datos.

**40.** ¿Qué patrón de comunicación es **asíncrono y desacoplado**?

- a) REST request/response.
- b) Pub/Sub (publicación/suscripción).
- c) Cliente-servidor síncrono.
- d) RPC.

### Soluciones Examen 3

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | b | a | c | a | b | a | a | b |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| c | c | b | b | b | b | b | a | c | b |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|---|---|---|---|---|---|---|---|---|
| b | c | c | b | b | b | b | a | c | b |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|---|---|---|---|---|---|---|---|---|---|
| b | a | b | b | b | c | a | b | b | b |

---

## Examen 4

**1.** ¿Cuál es el principio del REST que dice que cada petición debe contener toda la información necesaria para procesarla?

- a) Cliente-servidor.
- b) Stateless (sin estado).
- c) Caché.
- d) Sistema en capas.

**2.** ¿Qué se entiende por "interfaz uniforme" en REST?

- a) Que todos los endpoints devuelven el mismo JSON.
- b) Un conjunto consistente de operaciones y convenciones para todos los recursos.
- c) Que se usa el mismo método HTTP para todo.
- d) Que el cliente y servidor tienen el mismo código.

**3.** Una API REST debe modelar...

- a) Funciones (verbos).
- b) Eventos.
- c) Recursos (nombres) identificados por URIs.
- d) Sentencias SQL.

**4.** ¿Qué método HTTP es **seguro** (no modifica el estado del servidor)?

- a) POST
- b) PUT
- c) DELETE
- d) GET

**5.** ¿Qué código HTTP indicaría que se ha intentado crear un email que ya existe?

- a) 400 Bad Request
- b) 404 Not Found
- c) 409 Conflict
- d) 500 Internal Server Error

**6.** ¿Qué código se devuelve si un cliente envía un body **sintácticamente** válido pero que viola reglas de negocio?

- a) 400
- b) 422 Unprocessable Entity
- c) 404
- d) 304

**7.** ¿Qué cabecera permite negociar el formato de la respuesta?

- a) `Content-Type`
- b) `Accept`
- c) `Encoding`
- d) `Format`

**8.** ¿Qué encabezado se utiliza cuando se quiere indicar que el contenido del body es JSON?

- a) `Body-Type: json`
- b) `Content-Type: application/json`
- c) `Accept: application/json`
- d) `Format: json`

**9.** ¿Cuál es la diferencia entre `findUnique` y `findFirst` en Prisma?

- a) `findUnique` busca por campo único; `findFirst` busca el primero que cumpla cualquier filtro.
- b) Son sinónimos.
- c) `findFirst` es más rápido siempre.
- d) `findUnique` solo busca por `id`.

**10.** ¿Qué hace el método `upsert` en Prisma?

- a) Solo crea si no existe.
- b) Solo actualiza si existe.
- c) Actualiza si existe, crea si no existe.
- d) Borra y vuelve a crear.

**11.** ¿Cómo se hace **eager loading** de relaciones en Prisma?

- a) Con `with`.
- b) Con `populate`.
- c) Con `include`.
- d) Con `eager: true`.

**12.** ¿Qué decorador establece un valor por defecto que el motor de BD calcula?

- a) `@default(autoincrement())`
- b) `@autoincrement()`
- c) `@auto`
- d) `@gen()`

**13.** ¿Qué generator se especifica en `schema.prisma` del curso?

- a) `provider = "prisma-client-js"`
- b) `provider = "prisma-client"`
- c) `provider = "ts-client"`
- d) `provider = "node-prisma"`

**14.** Si en un repo `pg` quieres parametrizar `WHERE id = ?`, ¿qué sintaxis usa el driver `pg`?

- a) `WHERE id = ?`
- b) `WHERE id = $1`
- c) `WHERE id = :id`
- d) `WHERE id = #{id}`

**15.** ¿Cuándo conviene usar SQLite en lugar de PostgreSQL?

- a) En aplicaciones de gran escala con muchos clientes simultáneos.
- b) En desarrollo, prototipos o tests donde una BD embebida es más práctica.
- c) Nunca, siempre es peor.
- d) En producción con cargas de escritura intensas.

**16.** ¿Qué herramienta gráfica del curso se recomienda para PostgreSQL?

- a) phpMyAdmin
- b) pgAdmin
- c) MySQL Workbench
- d) MongoDB Compass

**17.** ¿Qué comando crea un contenedor Docker con Postgres en el puerto 5432?

- a) `docker create postgres`
- b) `docker run -d --name postgres -e POSTGRES_PASSWORD=... -p 5432:5432 postgres:latest`
- c) `npm install docker-postgres`
- d) `postgres start --container`

**18.** ¿Qué tipo de relación implica una **tabla intermedia** con dos FK?

- a) 1:1
- b) 1:n
- c) n:n
- d) 0:1

**19.** ¿Qué hace `ON DELETE SET NULL`?

- a) Borra las filas hijas.
- b) Pone a NULL los FK de las filas hijas.
- c) Lanza un error.
- d) Crea una copia.

**20.** ¿Qué tipo de instrucciones SQL son `GRANT` y `REVOKE`?

- a) DDL
- b) DML
- c) DCL
- d) TCL

**21.** ¿Qué tipo de instrucciones son `BEGIN`, `COMMIT`, `ROLLBACK`?

- a) DDL
- b) DML
- c) DCL
- d) TCL

**22.** ¿Cuál de estos patrones permite encapsular el acceso a datos detrás de una interfaz?

- a) Singleton.
- b) Adapter.
- c) Repository.
- d) Decorator.

**23.** ¿Qué archivo NO debe subirse al repositorio público y por qué?

- a) `.env` porque contiene secretos.
- b) `package.json` porque cambia frecuentemente.
- c) `tsconfig.json` porque es local.
- d) `eslint.config.js` porque es generado.

**24.** ¿Qué archivo se utiliza para que Git ignore ciertos ficheros?

- a) `.gitexclude`
- b) `.gitignore`
- c) `.gitskip`
- d) `git-config`

**25.** ¿Qué hace el comando `npm run dev` típicamente en estos proyectos?

- a) Compila TypeScript a JavaScript.
- b) Arranca el servidor con `node --watch --env-file=.env`.
- c) Despliega en producción.
- d) Borra `node_modules`.

**26.** ¿Cuál es el rol de la cabecera `Authorization` en una petición a un endpoint protegido?

- a) Indicar el formato del body.
- b) Llevar las credenciales o token del usuario.
- c) Indicar el método HTTP.
- d) Negociar el contenido.

**27.** ¿Qué hace `jwt.verify(token, secret)`?

- a) Genera un token.
- b) Decodifica y comprueba la firma del token; lanza si no es válido.
- c) Borra el token.
- d) Renueva el token.

**28.** Si un JWT no incluye `expiresIn`, ¿qué ocurre?

- a) Es inválido por defecto.
- b) No expira.
- c) Expira en 1 hora.
- d) El servidor lo rechaza.

**29.** En el curso, ¿qué número de saltRounds usa bcrypt para hashear contraseñas?

- a) 4
- b) 8
- c) 10
- d) 12

**30.** ¿Cuál es la principal ventaja de bcrypt frente a SHA-256 a secas para passwords?

- a) Es más rápido.
- b) Es lento por diseño y resistente a ataques de fuerza bruta.
- c) Es reversible.
- d) Devuelve siempre el mismo hash.

**31.** ¿Qué entidad se separa en `15.Films` con relación 1:1 al `User` para guardar nombre, apellido y avatar?

- a) `Account`
- b) `Profile`
- c) `Person`
- d) `UserData`

**32.** ¿Qué función cumple `prisma db seed`?

- a) Crea las tablas.
- b) Inserta datos iniciales en la BD según un script configurado.
- c) Despliega la BD.
- d) Borra la BD.

**33.** ¿Cuál es la diferencia entre `migrate dev` y `migrate deploy`?

- a) `dev` aplica migraciones existentes; `deploy` crea nuevas.
- b) `dev` crea y aplica nuevas migraciones; `deploy` solo aplica las existentes (uso en producción).
- c) Son sinónimos.
- d) `deploy` es para desarrollo.

**34.** ¿Qué hace el archivo `_prisma_migrations` (o tabla en la BD)?

- a) Almacena los datos de la app.
- b) Lleva el registro de qué migraciones se han aplicado.
- c) Es un fichero de configuración.
- d) Guarda los logs.

**35.** ¿Qué servicio ofrece **OpenAPI**?

- a) Servir la API en producción.
- b) Una especificación estandarizada para describir y documentar la API.
- c) Una BD para APIs.
- d) Generar JWT.

**36.** ¿Qué patrón histórico ofrecía un directorio centralizado de servicios SOAP?

- a) UDDI
- b) WSDL
- c) XACML
- d) JNDI

**37.** ¿Qué describe **WSDL**?

- a) El cuerpo de una respuesta HTTP.
- b) El contrato de un servicio SOAP en XML.
- c) Una BD distribuida.
- d) Un protocolo de mensajería.

**38.** En el modelo RBAC, un usuario puede tener...

- a) Solo un permiso.
- b) Solo un rol.
- c) Uno o varios roles.
- d) Todos los roles a la vez obligatoriamente.

**39.** ¿Cuál de estas no es una buena práctica al diseñar respuestas REST?

- a) Usar códigos de estado correctos.
- b) Usar siempre `200 OK` independientemente del resultado.
- c) Usar formato consistente para errores.
- d) Incluir cabeceras informativas.

**40.** ¿Cuál es la finalidad principal de las **migraciones** de Prisma?

- a) Distribuir el cliente de Prisma.
- b) Mantener un historial versionado y reproducible de los cambios del schema en la BD.
- c) Comprimir la BD.
- d) Encriptar los datos.

### Soluciones Examen 4

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | c | d | c | b | b | b | a | c |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| c | a | b | b | b | b | b | c | b | c |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|---|---|---|---|---|---|---|---|---|
| d | c | a | b | b | b | b | b | d | b |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | b | b | b | a | b | c | b | b |

---

## Examen 5 — Preguntas trampa (matices que confunden)

40 preguntas centradas en distinciones finas que suelen generar errores: pares que se confunden, comportamientos sutiles de Express/Prisma/HTTP, y conceptos donde la respuesta "obvia" no es la correcta.

**1.** Un cliente envía un token JWT **expirado**. ¿Qué código HTTP es el más adecuado?

- a) 400 Bad Request
- b) 401 Unauthorized
- c) 403 Forbidden
- d) 419 Token Expired

**2.** Un usuario autenticado intenta borrar un recurso de **otro** usuario. ¿Qué código devuelve el `isOwnerOrAdmin`?

- a) 401 Unauthorized
- b) 403 Forbidden
- c) 404 Not Found
- d) 409 Conflict

**3.** Diferencia clave entre `PUT` y `PATCH`:

- a) `PUT` es idempotente y `PATCH` no lo es necesariamente.
- b) `PATCH` es idempotente y `PUT` no lo es.
- c) Ambos son idempotentes y producen el mismo efecto.
- d) `PUT` solo crea, `PATCH` solo actualiza.

**4.** En Prisma, diferencia entre `findUnique` y `findFirst`:

- a) `findUnique` devuelve varios; `findFirst` solo uno.
- b) `findUnique` exige filtro por campo `@unique`/`@id`; `findFirst` admite cualquier filtro.
- c) Son sinónimos.
- d) `findFirst` exige índice y `findUnique` no.

**5.** Diferencia entre `prisma db push` y `prisma migrate dev`:

- a) `db push` crea archivos de migración; `migrate dev` no.
- b) `db push` sincroniza schema sin historial; `migrate dev` crea archivo SQL versionado.
- c) Son equivalentes.
- d) `db push` se usa solo en producción.

**6.** Diferencia entre `400 Bad Request` y `422 Unprocessable Entity`:

- a) `400` es por sintaxis inválida; `422` por contenido válido pero semánticamente incorrecto.
- b) `422` es por sintaxis inválida; `400` por semántica.
- c) Son sinónimos.
- d) `400` es para GET y `422` para POST.

**7.** Si una ruta `app.use('/api', ...)` queda **antes** del middleware `express.json()`, ¿qué pasa con `req.body` en un POST?

- a) Se llena automáticamente.
- b) Llega `undefined` porque el parser no se ha ejecutado todavía.
- c) Llega como string raw.
- d) Express lanza una excepción al arrancar.

**8.** ¿Qué método HTTP es **a la vez** seguro e idempotente?

- a) POST
- b) PUT
- c) GET
- d) DELETE

**9.** ¿Es `DELETE` idempotente?

- a) No, porque cada llamada borra algo distinto.
- b) Sí, porque eliminar el mismo recurso varias veces deja el sistema en el mismo estado.
- c) Solo si devuelve 200.
- d) Depende del servidor.

**10.** Llamar `POST /usuarios` dos veces con los mismos datos suele crear **dos** usuarios. Esto significa que `POST` es:

- a) Seguro pero no idempotente.
- b) Ni seguro ni idempotente.
- c) Idempotente pero no seguro.
- d) Seguro e idempotente.

**11.** En Express 5, si un middleware async lanza una excepción, ¿qué ocurre?

- a) Express se cierra.
- b) Express captura la excepción y la pasa al middleware de errores automáticamente.
- c) El cliente recibe un timeout.
- d) Hay que envolver siempre con try/catch (ya no, en Express 5).

**12.** Diferencia entre **autenticación** y **autorización** en una sola frase:

- a) Autenticación = qué puedes hacer; autorización = quién eres.
- b) Autenticación = quién eres; autorización = qué puedes hacer.
- c) Son lo mismo.
- d) Autenticación es para humanos; autorización para servicios.

**13.** Un usuario con rol `EDITOR` intenta acceder a un endpoint que requiere `ADMIN`. ¿Qué pasa en `AuthInterceptor.authorize`?

- a) Pasa porque está autenticado.
- b) Devuelve 401.
- c) Devuelve 403 porque su rol no está autorizado.
- d) Devuelve 500.

**14.** En `15.Films`, ¿el rol `ADMIN` pasa siempre las comprobaciones de `authorize` aunque no esté en la lista de roles?

- a) No, debe estar en la lista.
- b) Sí, ADMIN se acepta siempre como caso especial.
- c) Solo si lo pone el owner.
- d) Solo en endpoints GET.

**15.** En el `payload` del JWT, ¿conviene meter la **contraseña**?

- a) Sí, para verificarla.
- b) No, porque el payload no está cifrado, solo codificado en base64url.
- c) Sí, en hash.
- d) Solo si el secret es muy largo.

**16.** ¿Por qué bcrypt usa **salt rounds**?

- a) Para hacer el hash más corto.
- b) Para hacerlo más lento por diseño y resistente a fuerza bruta.
- c) Para que sea reversible.
- d) Para producir el mismo hash siempre.

**17.** Diferencia entre `include` y `select` en Prisma:

- a) Son sinónimos.
- b) `include` añade relaciones; `select` elige qué campos devolver y son **excluyentes**.
- c) `select` añade relaciones y `include` filtra.
- d) Solo `select` se usa en `findMany`.

**18.** En Postgres, diferencia entre `JSON` y `JSONB`:

- a) `JSON` es más rápido para consultas; `JSONB` es texto plano.
- b) `JSONB` es binario indexable y eficiente para consultas; `JSON` es texto.
- c) Son lo mismo.
- d) `JSONB` solo existe en MySQL.

**19.** En SQLite el tipo `VARCHAR(255)` realmente se almacena como...

- a) `VARCHAR` con límite estricto de 255.
- b) `TEXT`, ignorando la longitud (afinidad de tipos).
- c) `BLOB`.
- d) `INTEGER`.

**20.** Si una FK tiene `ON DELETE RESTRICT`, ¿qué pasa al borrar la fila padre con hijos?

- a) Se borran los hijos en cascada.
- b) Los hijos quedan huérfanos.
- c) La operación falla con error de integridad referencial.
- d) Los FK se ponen a NULL.

**21.** En Express, ¿cuál es el orden correcto de registro?

- a) Rutas → middleware → manejador de errores.
- b) Middleware → rutas → manejador de errores.
- c) Manejador de errores → middleware → rutas.
- d) El orden no importa.

**22.** Un middleware **no** llama a `next()` ni envía una respuesta. ¿Qué pasa?

- a) Express avanza al siguiente automáticamente.
- b) La petición queda colgada hasta el timeout del cliente.
- c) Express devuelve 500.
- d) Express devuelve 204 No Content.

**23.** ¿Qué pasa si hay **dos** middleware de errores y el primero llama a `next(err)`?

- a) El segundo middleware de errores recibe el error.
- b) Se ignora el error.
- c) Express se cierra.
- d) El cliente recibe dos respuestas.

**24.** Diferencia entre `app.get('/users')` y `app.use('/users', ...)`:

- a) `get` solo responde a GET en `/users` exacto; `use` aplica a cualquier método y rutas que **empiecen** por `/users`.
- b) Son sinónimos.
- c) `use` solo acepta GET.
- d) `get` acepta cualquier método.

**25.** En Zod, `z.string().optional()` permite...

- a) Solo `undefined`.
- b) `undefined` (no `null`).
- c) `null` (no `undefined`).
- d) Cualquier tipo.

**26.** En Zod, para permitir `null` además de un valor:

- a) `.optional()`
- b) `.nullable()`
- c) `.maybe()`
- d) `.empty()`

**27.** Si en Zod usas `.parse()` y los datos son inválidos, ¿qué devuelve?

- a) `null`
- b) `{ success: false }`
- c) Lanza una excepción `ZodError`.
- d) Devuelve los datos inválidos sin avisar.

**28.** ¿Qué cabecera dispara una petición **preflight** OPTIONS en CORS?

- a) Una petición simple GET.
- b) Una petición con `Content-Type: application/json` y método no simple, o con cabeceras personalizadas.
- c) Cualquier petición HTTPS.
- d) Las redirecciones 301.

**29.** En Prisma, `@id @default(autoincrement())` requiere que el campo sea de tipo...

- a) `String`
- b) `Int` o `BigInt`
- c) `Boolean`
- d) `DateTime`

**30.** Diferencia entre `prisma migrate dev` y `prisma migrate deploy`:

- a) `dev` crea/aplica nuevas migraciones (entornos de desarrollo); `deploy` solo aplica las existentes (uso típico en CI/producción).
- b) `dev` borra la BD; `deploy` no.
- c) `deploy` regenera el cliente y `dev` no.
- d) Son sinónimos.

**31.** Si haces `prisma migrate reset`, ¿qué pasa con los datos?

- a) Se mantienen.
- b) Se borran y luego se aplica el seed (si está configurado).
- c) Se exportan a JSON.
- d) Solo se borran las tablas vacías.

**32.** En el repo, `node --watch --env-file=.env ./src/index.ts` significa que:

- a) Compila TS y lo ejecuta.
- b) Ejecuta TS nativo, recargando al cambiar y cargando variables del `.env`.
- c) Solo carga el `.env`.
- d) Solo arranca un watcher sin ejecutar nada.

**33.** Un controller llama al repo y devuelve `res.json(data)`. ¿Qué cabecera fija Express automáticamente?

- a) `Content-Type: text/plain`
- b) `Content-Type: application/json`
- c) `Content-Type: application/octet-stream`
- d) Ninguna; hay que ponerla a mano.

**34.** En el patrón Repository, ¿qué error es **típico** mezclar?

- a) Validación HTTP (400/404) dentro del repo, en lugar de en el controller.
- b) Devolver datos.
- c) Lanzar excepciones.
- d) Crear conexiones.

**35.** En `13.DB`, los queries con `pg` usan `$1, $2...`. ¿Qué pasa si concatenas strings con `+` en lugar de usar parámetros?

- a) Funciona igual.
- b) Te expones a inyección SQL.
- c) Es más rápido.
- d) Postgres lo ignora.

**36.** Diferencia entre `app.disable('x-powered-by')` y `helmet()`:

- a) Son lo mismo.
- b) `disable` quita una sola cabecera; `helmet` añade un set completo de cabeceras de seguridad.
- c) `helmet` deshabilita Express.
- d) `disable` solo afecta a producción.

**37.** En el middleware `cors()` sin opciones, ¿qué orígenes se permiten?

- a) Ninguno.
- b) Solo `localhost`.
- c) Todos (`*`).
- d) Solo el mismo origen.

**38.** En Prisma, `@updatedAt` actualiza el campo:

- a) Solo al crear el registro.
- b) Cada vez que se modifica el registro.
- c) Solo al borrarlo.
- d) Nunca; hay que hacerlo manual.

**39.** Una API REST está bien diseñada si las URLs contienen...

- a) Verbos: `/getUsers`, `/createUser`.
- b) Recursos en plural: `/users`, `/users/:id`.
- c) Acciones: `/users/find/:id`.
- d) Métodos HTTP en la ruta.

**40.** Si en JWT no defines `expiresIn` y el secret se filtra...

- a) No hay riesgo, los tokens son seguros.
- b) Los tokens son válidos para siempre y un atacante puede usarlos sin caducidad.
- c) El servidor los rechaza automáticamente.
- d) Expiran a las 24h por defecto.

### Soluciones Examen 5

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | a | b | b | a | b | c | b | a |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | c | b | b | b | b | b | b | c |

| 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | a | a | b | b | c | b | b | a |

| 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|---|---|---|---|---|---|---|---|---|---|
| b | b | b | a | b | b | c | b | b | b |

---

## Cómo aprovechar estos simulacros

1. **Primera vuelta**: hazlos sin consultar `conceptos.md`, marca solo lo que sabes con seguridad.
2. **Corrección**: revisa cada error contra el documento de conceptos. No memorices la respuesta — entiende **por qué**.
3. **Segunda vuelta** (1-2 días después): repite los exámenes que peor te fueron.
4. **Tablas mentales** importantes: códigos HTTP, métodos HTTP (idempotencia/seguridad), tipos SQL (DDL/DML/DCL/TCL), comandos de Prisma, diferencias 401 vs 403.
