# Examen Backend IFCD0210 — Guía de estudio

## Parte 6 — Tooling, UF1846 y glosario (bloques 15, 16)

---

## 🛠️ Tooling del proyecto (bloque 15)

### Stack del curso

| Herramienta              | Para qué                                                          |
| ------------------------ | ----------------------------------------------------------------- |
| **TypeScript 5.9**       | Tipado estático. Ejecutado **nativamente por Node 23+** (sin compilar) |
| **ESLint 10** + `typescript-eslint` | Linter (detecta errores y malas prácticas)             |
| **Prettier**             | Formateador de código (`{ "singleQuote": true }`)                 |
| **EditorConfig**         | Indentación común entre editores                                  |
| **debug**                | Logger por namespaces, controlado por la variable `DEBUG`         |
| **cross-env**            | Define variables de entorno multiplataforma en `package.json`     |
| **Postman**              | Cliente para probar APIs REST manualmente                         |

### ⚠️ Para el examen

- **Node 23+ ejecuta TypeScript de forma nativa** → no necesitas `ts-node` ni compilar a JS antes.
- **ESLint** detecta errores y malas prácticas (linter).
- **Prettier** solo formatea (no detecta errores).
- **Postman** sirve para realizar y organizar peticiones HTTP a una API (no es para diagramas E/R ni para diseñar BD).

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

## 🌍 Conceptos UF1846 — Aplicaciones Web Distribuidas (bloque 16)

Esta es la parte más **teórica** y oficial del temario. **Las preguntas suelen ser sobre terminología**, así que ojo a las siglas.

### Arquitecturas distribuidas orientadas a servicios (SOA)

- **SOA** = Service-Oriented Architecture.
- Sistemas divididos en **servicios especializados** que cooperan por la red.
- **Ventajas**: separación de responsabilidades, reutilización, escalabilidad, interoperabilidad.

Dos modelos conceptuales:

- Basados en **mensajes** → SOAP.
- Basados en **recursos** → REST.

### Políticas y contratos de servicios

Distinción clave que cae:

- **Contrato** → rutas, métodos HTTP, parámetros, códigos de estado, formatos de datos.
- **Políticas** → autenticación, autorización, límites de uso, gestión de errores.

Documentación con **OpenAPI / Swagger** (estándar de facto en REST).

### Estándares de seguridad (contexto histórico)

Caen como preguntas de identificación:

| Mundo  | Estándares                                                |
| ------ | --------------------------------------------------------- |
| **SOAP** | **WS-Security**, **SAML**, **XACML**                    |
| **REST** | JWT, OAuth2, HTTPS/TLS, RBAC, CORS                      |

### Directorios de servicios

- Catálogo donde los servicios se registran y los clientes los descubren.
- **Estándar histórico**: **UDDI** (Universal Description, Discovery and Integration).
- **Práctica moderna**: catálogos internos, portales de desarrolladores, descubrimiento dinámico en microservicios (**Consul**, **Eureka**).

### Patrones de comunicación

| Patrón                     | Cómo funciona                                              |
| -------------------------- | ---------------------------------------------------------- |
| **Request/Response**       | REST clásico, síncrono                                     |
| **Pub/Sub** (publicación/suscripción) | Asíncrono, desacoplado (Redis, Kafka, RabbitMQ) |
| **Repositorios centralizados** | Catálogos / directorios de servicios                  |

### Comparativa final SOAP / REST (vista distribuida)

| | SOAP | REST |
|---|---|---|
| Tipo                | Protocolo basado en mensajes XML | Estilo arquitectónico sobre HTTP |
| Contrato formal     | **WSDL**                         | **OpenAPI / Swagger**            |
| Seguridad           | WS-Security, SAML, XACML         | JWT, OAuth2, HTTPS, RBAC, CORS   |
| Formato             | XML obligatorio                  | Libre (típicamente JSON)         |
| Descubrimiento      | UDDI                             | Catálogos modernos (Consul, Eureka) |

---

## 📖 Glosario rápido — siglas que pueden caer

| Sigla            | Significado                                                       |
| ---------------- | ----------------------------------------------------------------- |
| **API**          | Application Programming Interface                                 |
| **REST**         | Representational State Transfer                                   |
| **CRUD**         | Create, Read, Update, Delete                                      |
| **HTTP**         | HyperText Transfer Protocol                                       |
| **HTTPS**        | HTTP sobre TLS                                                    |
| **TLS**          | Transport Layer Security                                          |
| **URI / URL**    | Identificador / Localizador uniforme de recurso                   |
| **JSON**         | JavaScript Object Notation                                        |
| **JWT**          | JSON Web Token                                                    |
| **RBAC**         | Role-Based Access Control                                         |
| **CORS**         | Cross-Origin Resource Sharing                                     |
| **ORM**          | Object-Relational Mapper (Prisma)                                 |
| **ODM**          | Object-Document Mapper (Mongoose)                                 |
| **MVC**          | Model-View-Controller                                             |
| **SQL**          | Structured Query Language                                         |
| **DDL**          | Data **Definition** Language (CREATE, ALTER, DROP)                |
| **DML**          | Data **Manipulation** Language (SELECT, INSERT, UPDATE, DELETE)   |
| **DCL**          | Data **Control** Language (GRANT, REVOKE)                         |
| **TCL**          | **Transaction** Control Language (BEGIN, COMMIT, ROLLBACK)        |
| **SGBD**         | Sistema Gestor de Bases de Datos                                  |
| **E/R**          | Entidad / Relación                                                |
| **FK / PK**      | Foreign Key / Primary Key                                         |
| **ESM / CJS**    | ES Modules / CommonJS                                             |
| **DTO**          | Data Transfer Object                                              |
| **DI**           | Dependency Injection                                              |
| **SOA**          | Service-Oriented Architecture                                     |
| **SOAP**         | Simple Object Access Protocol                                     |
| **WSDL**         | Web Services Description Language                                 |
| **UDDI**         | Universal Description, Discovery and Integration                  |
| **SAML**         | Security Assertion Markup Language                                |
| **XACML**        | eXtensible Access Control Markup Language                         |

---

## ✅ Lo que probablemente caiga en el examen

### Tooling
- **"¿Qué versión de Node ejecuta TS de forma nativa?"** → **Node 23+**.
- **"¿Para qué sirve Postman?"** → realizar y organizar peticiones HTTP a una API.
- **"¿Qué hace ESLint? ¿Y Prettier?"** → ESLint detecta problemas, Prettier formatea.
- **"¿Para qué sirve `cross-env`?"** → definir variables de entorno multiplataforma en npm scripts.

### UF1846
- **"¿Qué es SOA?"** → Service-Oriented Architecture: arquitectura de servicios distribuidos cooperando por red.
- **"¿Qué es UDDI?"** → estándar histórico de directorio de servicios.
- **"¿Qué documenta WSDL?"** → contrato formal de servicios SOAP.
- **"¿Estándares de seguridad SOAP?"** → WS-Security, SAML, XACML.
- **"¿Estándar de documentación REST?"** → OpenAPI / Swagger.
- **"¿Patrones de comunicación distribuida?"** → Request/Response, Pub/Sub, repositorios centralizados.
- **"¿Diferencia contrato y política?"** → Contrato = rutas, métodos, formatos. Política = auth, límites, errores.

### Glosario (típico "qué significa…")
- **DDL/DML/DCL/TCL** — memoriza los cuatro tipos de instrucciones SQL.
- **ORM/ODM** — relacional vs documental.
- **RBAC** — Role-Based Access Control.
- **CRUD** — Create, Read, Update, Delete.

---

## 🎯 Estrategia para el examen

Ahora que tienes los 6 bloques cubiertos:

1. **Lee de pasada** las 6 partes para tener el panorama completo (1-2 horas).
2. **Haz el Examen 1 de `tests.md`** sin estudiar más, a frío. Anota los errores.
3. **Estudia a fondo** solo los bloques donde hayas fallado más.
4. **Repasa las flashcards** del repo (`flashcards.md`) los días previos.
5. **Examen 5 ("preguntas trampa")** un par de días antes del examen real.
6. **Último simulacro** la víspera, en condiciones reales.

Pillarás muchas más preguntas de las que crees con este sistema. La clave es el diagnóstico antes del estudio, no al revés.
