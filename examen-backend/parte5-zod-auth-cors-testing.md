# Examen Backend IFCD0210 — Guía de estudio

## Parte 5 — Zod, Auth, CORS y Testing (bloques 11, 12, 13, 14)

---

## ✅ Validación con Zod (bloque 11)

### 🧠 La idea base

**Zod** es una librería de validación basada en **esquemas** con **inferencia de tipos para TypeScript**. La gracia: defines un schema una vez y obtienes tanto la validación en runtime como el tipo TypeScript.

Versión usada en el curso: **Zod 4**.

### API básica

```ts
import { z } from 'zod';

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    age: z.number().int().positive().optional(),
});

type User = z.infer<typeof UserSchema>;
// type User = { email: string; password: string; age?: number | undefined }
```

### Métodos de validación

| Método           | Comportamiento                                              |
| ---------------- | ----------------------------------------------------------- |
| `.parse(data)`   | Devuelve los datos válidos o **lanza** `ZodError`           |
| `.safeParse(data)` | Devuelve `{ success: true, data }` o `{ success: false, error }` |

### Tipos y modificadores

- **Tipos**: `z.string()`, `z.number()`, `z.boolean()`, `z.array()`, `z.object()`, `z.enum()`, `z.literal()`, `z.union()`, `z.tuple()`.
- **Modificadores**: `.optional()`, `.nullable()`, `.default(x)`, `.min(n)`, `.max(n)`, `.email()`, `.url()`, `.regex(...)`.

### Usos típicos en el curso

1. Validar **variables de entorno** al arrancar (`config/env.ts`).
2. Validar **DTOs** del body en endpoints.
3. Validar **params** y **query** en rutas.
4. **Middleware genérico de validación** que recibe un schema y aplica `safeParse`.

### Ejemplo completo

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

// safeParse → no lanza, devuelve un objeto
const result = FilmCreateSchema.safeParse(req.body);
if (!result.success) {
    return next(new HttpError(422, 'Unprocessable Entity', result.error.message));
}
const film = result.data;   // ya tipado como FilmCreate
```

### Middleware genérico de validación

```ts
export const validate = (schema: z.ZodSchema, source: 'body' | 'params' | 'query' = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            return next(new HttpError(422, 'Unprocessable Entity', result.error.message));
        }
        req[source] = result.data;  // datos ya parseados y normalizados
        next();
    };

// Uso en el router
router.post('/films', validate(FilmCreateSchema), filmsController.create);
```

### ⚠️ Para recordar

- Si la validación falla → código **422 Unprocessable Entity** (no 400).
- `parse` lanza → `safeParse` no lanza, devuelve el resultado.
- El tipo se infiere con `z.infer<typeof Schema>` → no duplicas tipos.

---

## 🔐 Autenticación y autorización (bloque 12)

### 🧠 La idea base

Dos cosas que se confunden todo el rato y caen casi seguro:

- **Autenticación** (Authentication) → comprobar **quién eres**. Tradicionalmente email + password.
- **Autorización** (Authorization) → comprobar **qué puedes hacer**. Basada en roles o permisos.

### Hash de contraseñas

- Las contraseñas **NUNCA** se guardan en claro.
- Se aplica **hash con sal** usando funciones lentas: **bcrypt**, **argon2**, **scrypt**.
- Librería del curso: **bcryptjs**.
  - `await hash(password, saltRounds)` (en el curso: `saltRounds = 12`).
  - `await compare(password, hash)` para verificar.
- En el registro **nunca se devuelve** el password.

```ts
import { hash, compare } from 'bcryptjs';

// Al registrar
const hashed = await hash('miPassword123', 12);
// → '$2a$12$Yv6...long.string'  (60 caracteres)

// Al hacer login
const isValid = await compare('miPassword123', hashed);  // true | false
```

### JWT (JSON Web Token) — pregunta cantada

Token autocontenido formado por **3 partes** separadas por puntos: `header.payload.signature`.

| Parte         | Qué contiene                                                                 |
| ------------- | ---------------------------------------------------------------------------- |
| **Header**    | Algoritmo (`HS256`, `RS256`...) y tipo                                       |
| **Payload**   | Claims: datos del usuario (`id`, `email`, `role`). **NO va cifrado**, codificado en base64url |
| **Signature** | Firma del header+payload con un **secret** (HS256) o clave privada (RS256)   |

Librería: **jsonwebtoken**.

```ts
import jwt from 'jsonwebtoken';

// Al hacer login: generar token
const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },  // payload
    env.JWT_SECRET,
    { expiresIn: '1h' },
);
// → 'eyJhbGciOi....eyJpZCI6MS....abc123signature'
//     [HEADER]     .[PAYLOAD]    .[SIGNATURE]

// En cada request protegida: verificar token
try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    // payload = { id: 1, email: '...', role: 'USER', iat, exp }
} catch (err) {
    // Token inválido, expirado o firma incorrecta → 401
}
```

### ⚠️ ATENCIÓN — pregunta trampa muy típica

> El **payload del JWT NO está cifrado**, solo codificado en **base64url**. Cualquiera puede decodificarlo. **Nunca metas información sensible** (contraseñas, tarjetas...). La firma solo garantiza que **no ha sido manipulado**.

### El cliente envía el token en cabecera

```http
Authorization: Bearer <token>
```

El JWT es ideal para APIs **stateless** porque el servidor **no necesita guardar sesión** — toda la info viaja en el token.

### Modelo RBAC (Role-Based Access Control)

- Permisos organizados por **roles** (ej. `USER`, `EDITOR`, `ADMIN`).
- En `15.Films` los roles son un **enum de Prisma**.

Tres "interceptores" típicos:

1. **`authenticate`** → verifica que el JWT sea válido y carga `req.user`.
2. **`authorize(roles[])`** → comprueba que el rol del usuario está en la lista (ADMIN siempre pasa).
3. **`isOwnerOrAdmin`** → compara `req.user.id` con `req.params.id`.

### Códigos clave

- **401 Unauthorized** → no hay token o es inválido.
- **403 Forbidden** → autenticado pero **sin permisos**.

```ts
export class AuthInterceptor {
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

    authorize(roles: string[] = []) {
        return (req, res, next) => {
            if (!req.user) return next(new HttpError(401, 'Unauthorized'));
            if (req.user.role !== 'ADMIN' && !roles.includes(req.user.role))
                return next(new HttpError(403, 'Forbidden'));
            next();
        };
    }

    isOwnerOrAdmin(req, res, next) {
        if (!req.user) return next(new HttpError(401, 'Unauthorized'));
        const resourceId = Number(req.params.id);
        if (req.user.role !== 'ADMIN' && req.user.id !== resourceId)
            return next(new HttpError(403, 'Forbidden'));
        next();
    }
}
```

### Aplicación en rutas

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

```http
# Register
POST /api/users/register
{ "email": "ana@a.com", "password": "secreto" }
→ 201 Created  { "id": 5, "email": "ana@a.com" }

# Login
POST /api/users/login
{ "email": "ana@a.com", "password": "secreto" }
→ 200 OK  { "token": "eyJhbGci..." }

# Acceso protegido
GET /api/users/5
Authorization: Bearer eyJhbGci...
→ 200 OK
→ 401 si falta o invalida el token
→ 403 si autenticado pero sin permisos
```

---

## 🌐 CORS y seguridad (bloque 13)

### CORS — Cross-Origin Resource Sharing

- Mecanismo del **navegador** que **bloquea por defecto** peticiones cross-origin (origen distinto al de la página).
- El **servidor** debe enviar cabeceras `Access-Control-Allow-Origin`, `-Methods`, `-Headers` para autorizarlas.
- Las peticiones "no simples" (con JSON, con `Authorization`...) disparan una petición previa **preflight** (`OPTIONS`).
- Middleware `cors()`: con configuración por defecto permite todos los orígenes (`*`).

### ⚠️ Importante

CORS lo aplica el **navegador**, no el servidor. Una petición desde Postman o curl **no está sujeta a CORS**, por eso funciona aunque el servidor no envíe las cabeceras.

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

### Preflight (OPTIONS) — flujo completo

```http
# El navegador, antes de un POST con JSON, dispara automáticamente:
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

- **HTTPS** (TLS) siempre en producción.
- Validar y sanear toda entrada (Zod).
- No exponer información sensible en logs.
- **Desactivar `X-Powered-By`** (`app.disable('x-powered-by')`).
- Usar **helmet** para cabeceras de seguridad.
- **Rate limiting** para limitar peticiones por IP/usuario.
- No incluir secretos en el repo (`.env` ignorado).

---

## 🧪 Testing en Node (bloque 14)

### `node:test` y `node:assert`

Test runner **integrado en Node** (sin librerías externas tipo Jest/Mocha). Es lo que se usa en el curso.

### Estructura típica

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

```bash
node --test                                  # ejecuta todos los *.test.ts
node --env-file=.env.test --test             # con variables de test
node --test --test-concurrency=1             # en serie (cuando comparten BD)
```

### BD de test — buenas prácticas

- BD aparte (`*_test_db` o `*_test.db`).
- Script de **setup** que recrea las tablas y aplica seed.
- **Reset entre tests** para empezar siempre en estado conocido.

---

## ✅ Lo que probablemente caiga en el examen

### Zod
- **"¿Qué hace `parse` vs `safeParse`?"** → `parse` lanza, `safeParse` devuelve `{success, data|error}`.
- **"¿Cómo se infiere el tipo TS de un schema?"** → `z.infer<typeof Schema>`.
- **"¿Qué código devuelve un fallo de validación?"** → **422 Unprocessable Entity**.

### Autenticación
- **"¿Diferencia autenticación y autorización?"** → quién eres / qué puedes hacer.
- **"¿Cuántas partes tiene un JWT?"** → **3** (header, payload, signature).
- **"¿El payload del JWT está cifrado?"** → **No**, solo codificado en base64url.
- **"¿Qué cabecera HTTP lleva el JWT?"** → **`Authorization: Bearer <token>`**.
- **"¿Qué librería se usa para hash de password?"** → **bcryptjs**.
- **"¿Qué es RBAC?"** → Role-Based Access Control: permisos organizados por roles.
- **"¿401 vs 403?"** → 401 sin autenticar / 403 autenticado pero sin permisos.

### CORS
- **"¿Quién aplica las restricciones CORS?"** → **el navegador**, no el servidor.
- **"¿Qué método HTTP dispara el preflight?"** → **OPTIONS**.
- **"¿Cabecera principal de CORS?"** → `Access-Control-Allow-Origin`.

### Testing
- **"¿Qué runner de tests usa el curso?"** → **`node:test`** (integrado en Node).
- **"¿Cómo se ejecutan los tests?"** → `node --test`.
- **"¿Qué módulo de aserciones se importa?"** → `node:assert/strict`.
