# Examen Backend IFCD0210 — Guía de estudio

## Parte 3 — REST y arquitectura de servicios (bloque 6)

---

## 🧠 La idea base: ¿qué es REST?

**API** = interfaz que permite a un programa hablar con otro siguiendo un contrato definido. **API web** = una API expuesta sobre **HTTP**.

**REST** (**Representational State Transfer**) **no es una tecnología ni un protocolo**. Es un **estilo arquitectónico** propuesto por **Roy Fielding en el año 2000**. (Esa fecha y autor caen mucho.)

La idea central:

> Los datos y funcionalidades de un sistema se modelan como **recursos**, identificados con URLs y manipulados con los **métodos HTTP estándar**.

En REST **no piensas en funciones a invocar** (`getFilm`, `createUser`) sino en **recursos sobre los que actuar** (`/films`, `/users`). La **acción está implícita en el método HTTP**.

---

## 🏛️ REST vs otras arquitecturas

| Modelo                       | Cómo funciona                                                |
| ---------------------------- | ------------------------------------------------------------ |
| Basado en mensajes (SOAP)    | Cliente envía mensaje XML que describe la **acción** a ejecutar. El recurso es secundario. |
| Basado en recursos (REST)    | Cliente identifica un **recurso** por URI y le aplica un método HTTP estándar. |

---

## 🧩 Los 5 elementos esenciales de una API REST

Esto cae casi seguro:

1. **Recursos** → entidades del dominio (`films`, `users`, `genres`). **Nombres, no acciones**.
2. **URIs** → identifican cada recurso o colección.
   - `/films` → colección.
   - `/films/42` → recurso concreto.
   - `/films/42/reviews` → recurso anidado.
3. **Representaciones** → formato en que viajan los datos. **Lo que viaja por la red NO es el objeto interno del servidor**, sino una vista externa estandarizada (típicamente JSON).
4. **Operaciones** → los métodos HTTP (GET, POST, PUT, PATCH, DELETE), cada uno con semántica fija.
5. **Hipermedios (HATEOAS)** → respuestas que incluyen enlaces a recursos relacionados, haciendo la API navegable.

---

## 🎯 Diseño de URIs: bien vs mal

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
- **Sin verbos** en la URI (los verbos los aportan los métodos HTTP).
- **Jerarquía** para relaciones: `/films/42/reviews`.
- **kebab-case** o todo en minúsculas, sin extensiones (no `.json`).
- Filtros en query string: `/films?year=2010&genre=sci-fi`.
- Paginación en query string: `/films?page=2&limit=20`.

---

## 📜 Las 6 restricciones de REST (Fielding)

5 obligatorias + 1 opcional. Si una API las cumple, es **RESTful**:

1. **Cliente-servidor** → separación clara: cliente para UI, servidor para datos/lógica.
2. **Stateless** (sin estado) → **cada petición contiene toda la info necesaria** para procesarse. El servidor **no guarda sesión** entre peticiones. Por eso el JWT viaja en cada llamada.
3. **Caché** → respuestas indican si son cacheables (`Cache-Control`, `ETag`).
4. **Interfaz uniforme** → mismas operaciones (verbos HTTP) y convenciones para todos los recursos.
5. **Sistema en capas** → el cliente no sabe si habla con el servidor final o con un proxy/balanceador.
6. **Código bajo demanda** (opcional) → el servidor puede enviar código ejecutable al cliente.

---

## 🔧 Métodos HTTP y semántica

Memoriza esta tabla — cae siempre alguna pregunta:

| Método  | CRUD                       | Idempotente | Seguro |
| ------- | -------------------------- | ----------- | ------ |
| GET     | Read                       | ✅ sí       | ✅ sí  |
| POST    | Create                     | ❌ no       | ❌ no  |
| PUT     | Update (reemplazo total)   | ✅ sí       | ❌ no  |
| PATCH   | Update parcial             | ❌ no       | ❌ no  |
| DELETE  | Delete                     | ✅ sí       | ❌ no  |

- **Seguro** → no modifica el estado del servidor.
- **Idempotente** → ejecutar la misma operación N veces produce el mismo resultado que una sola.

### Ejemplo de idempotencia (cae mucho)

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

### PUT vs PATCH (otra trampa)

- **PUT** → reemplazo **completo** del recurso (mandas todo el objeto).
- **PATCH** → actualización **parcial** (mandas solo lo que cambia).

---

## 📦 Códigos de estado HTTP

### Familias

- **1xx** → Informativos.
- **2xx** → Éxito.
- **3xx** → Redirección.
- **4xx** → Error del cliente.
- **5xx** → Error del servidor.

### Los más usados en API REST (memorízalos)

| Código | Nombre                | Cuándo                                            |
| ------ | --------------------- | ------------------------------------------------- |
| 200    | OK                    | Operación correcta con cuerpo                     |
| 201    | Created               | Recurso creado (cabecera `Location` con su URI)   |
| 204    | No Content            | Éxito sin cuerpo (típico en DELETE)               |
| 301    | Moved Permanently     | Redirección permanente                            |
| 304    | Not Modified          | Cache válida                                      |
| 400    | Bad Request           | Petición mal formada                              |
| 401    | Unauthorized          | Falta autenticación o token inválido              |
| 403    | Forbidden             | Autenticado pero **sin permisos**                 |
| 404    | Not Found             | Recurso inexistente                               |
| 405    | Method Not Allowed    | Método no soportado en esa ruta                   |
| 409    | Conflict              | Violación de integridad (ej. email duplicado)     |
| 422    | Unprocessable Entity  | Sintaxis correcta pero **semánticamente inválida** (validación Zod) |
| 500    | Internal Server Error | Error genérico del servidor                       |
| 503    | Service Unavailable   | Servicio no disponible                            |

### ⚠️ Diferencia clave 401 vs 403

- **401** → "No sé quién eres" (no autenticado o token mal).
- **403** → "Sé quién eres, pero no puedes hacer esto" (sin permisos).

---

## 📨 Cabeceras HTTP importantes

| Cabecera                     | Para qué                                          |
| ---------------------------- | ------------------------------------------------- |
| `Content-Type: application/json` | Express la añade automáticamente con `res.json()` |
| `Location: /usuarios/123`    | Para 201 Created — URI del recurso creado         |
| `Authorization: Bearer <token>` | Para JWT                                       |
| `Accept: application/json`   | El cliente pide ese formato                       |
| `X-Powered-By: Express`      | Se desactiva por seguridad                        |

```http
# Petición típica autenticada
POST /api/films HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGci...

{ "title": "Inception", "year": 2010 }

# Respuesta
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/films/42

{ "id": 42, "title": "Inception", "year": 2010 }
```

---

## ⚖️ SOAP vs REST

| | SOAP | REST |
|---|---|---|
| Tipo                | Protocolo basado en mensajes XML | Estilo arquitectónico sobre HTTP |
| Contrato formal     | **WSDL**                         | **OpenAPI / Swagger**            |
| Seguridad clásica   | WS-Security, SAML, XACML         | JWT, OAuth2, HTTPS               |
| Formato             | XML obligatorio                  | Libre (típicamente JSON)         |

REST es el estándar de facto en la web moderna.

---

## 🔄 Otros patrones de integración

- **Pub/Sub** (publicación / suscripción) → mensajes asíncronos sobre topics (Redis, Kafka, RabbitMQ).
- **Repositorios centralizados** → catálogos / directorios de servicios.
- **UDDI** → estándar histórico de descubrimiento.
- **Microservicios** y descubrimiento dinámico moderno (Consul, Eureka).

---

## ✅ Lo que probablemente caiga en el examen

- **"¿Qué es REST?"** → un **estilo arquitectónico**, no un protocolo.
- **"¿Quién y cuándo lo propuso?"** → **Roy Fielding, 2000**.
- **"¿Qué método es idempotente?"** → GET, PUT, DELETE. **POST y PATCH no**.
- **"¿Diferencia PUT y PATCH?"** → PUT reemplaza todo, PATCH parcial.
- **"¿Código al crear un recurso?"** → **201 Created**.
- **"¿Código de un DELETE exitoso sin cuerpo?"** → **204 No Content**.
- **"¿401 vs 403?"** → 401 no autenticado, 403 sin permisos.
- **"¿Para validación que falla qué código?"** → **422 Unprocessable Entity**.
- **"¿Qué cabecera lleva el JWT?"** → **`Authorization: Bearer <token>`**.
- **"¿Qué cabecera indica la URI del recurso recién creado?"** → **`Location`**.
- **"¿Documentación estándar para APIs REST?"** → **OpenAPI / Swagger**.
- **"¿Qué significa stateless?"** → Cada petición contiene toda la info necesaria; el servidor no guarda sesión.
- **"¿Cómo deben nombrarse los recursos?"** → Plural, sin verbos, kebab-case.
