# Examen Backend IFCD0210 — Guía de estudio

## Parte 4 — Bases de datos, SQL, pg y Prisma (bloques 7, 8, 9, 10)

---

## 🧠 La idea base: datos persistentes

Hasta ahora todo lo que guardábamos era en JSON. Eso no escala. Para datos reales se usa una **base de datos** gestionada por un **SGBD** (Sistema Gestor de Bases de Datos).

### Modelos de datos

- **Relacional** (SQL) → tablas con filas y columnas, relaciones por claves.
- **Documental** → JSON/BSON anidado (MongoDB).
- **Clave-valor** → Redis.
- **Grafo** → Neo4j.
- **Columnar** → analítica.

### Arquitectura típica

**Cliente-servidor**: tu app (cliente) habla con el SGBD (servidor) que escucha en un puerto.

### Términos clave

- **ORM** (Object-Relational Mapper) → mapea tablas a objetos (ej. **Prisma**).
- **ODM** (Object-Document Mapper) → equivalente para documentales (ej. Mongoose).

### BD relacionales típicas

- **MySQL**, **MariaDB**, **PostgreSQL** → servidor.
- **SQLite** → autocontenida en un fichero, ideal para desarrollo/tests.
- En el curso: **PostgreSQL** (en Docker) y **SQLite**.
- Cliente recomendado: **pgAdmin** (Postgres), **DB Browser for SQLite**.

### Diseño de BD

- **Diagramas E/R** (entidad-relación) → entidades, atributos, relaciones, cardinalidades.
- **Cardinalidades** → 1:1, 1:n, n:n.
- **Normalización** → 1FN, 2FN, 3FN, para evitar redundancia.
- **Relaciones n:n** → necesitan **tabla intermedia** (junction table).

---

## 🗃️ SQL (bloque 8)

### Tipos de instrucciones — pregunta cantada

| Familia | Para qué                          | Comandos típicos                       |
| ------- | --------------------------------- | -------------------------------------- |
| **DDL** | Data **Definition** Language      | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`  |
| **DML** | Data **Manipulation** Language    | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DCL** | Data **Control** Language         | `GRANT`, `REVOKE`                      |
| **TCL** | **Transaction** Control Language  | `BEGIN`, `COMMIT`, `ROLLBACK`          |

### Restricciones (constraints)

- `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`.
- `PRIMARY KEY` (numérica autoincremental o UUID).
- `FOREIGN KEY ... REFERENCES tabla(columna)`.
- **Acciones referenciales**: `ON DELETE CASCADE`, `ON DELETE SET NULL`, `ON DELETE RESTRICT`.
- Pueden ser anónimas o **named constraints** (con nombre, mejor para diagnosticar errores).

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

-- Tabla intermedia para relación n:n
CREATE TABLE films_genres (
    film_id  INTEGER REFERENCES films(film_id)   ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(genre_id) ON DELETE RESTRICT,
    PRIMARY KEY (film_id, genre_id)
);
```

### SELECT — orden de cláusulas

```sql
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT
```

- **`WHERE`** filtra **filas individuales**.
- **`HAVING`** filtra **grupos** (después de `GROUP BY`).

Operadores: `=`, `<>`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`.

Funciones de agregación: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

```sql
-- Películas posteriores a 2000, las 10 mejores
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

### JOINs

| JOIN              | Qué devuelve                                          |
| ----------------- | ----------------------------------------------------- |
| `INNER JOIN`      | Filas con coincidencias en ambas tablas               |
| `LEFT JOIN`       | Todas las de la izquierda + coincidencias derecha     |
| `RIGHT JOIN`      | Simétrico del LEFT                                    |
| `FULL OUTER JOIN` | Todas las filas de ambas tablas                       |
| `CROSS JOIN`      | Producto cartesiano                                   |
| `UNION`/`UNION ALL` | Combina resultados de varios SELECT (no es JOIN, lo combina) |

```sql
-- Películas con sus géneros (n:n con tabla intermedia)
SELECT f.title, g.name AS genre
FROM films f
INNER JOIN films_genres fg ON f.film_id  = fg.film_id
INNER JOIN genres g        ON g.genre_id = fg.genre_id;

-- Géneros que NO tienen ninguna película
SELECT g.name
FROM genres g
LEFT JOIN films_genres fg ON g.genre_id = fg.genre_id
WHERE fg.film_id IS NULL;
```

### Postgres avanzado

- **Subconsultas** → en `SELECT`, `WHERE`, `FROM`.
- **Vistas** (`CREATE VIEW`) → consulta guardada como tabla virtual.
- **Procedimientos almacenados y funciones** → en **PL/pgSQL**.
- **Triggers** → ejecutan código antes/después de INSERT, UPDATE o DELETE.
- **Transacciones** → bloque atómico (`BEGIN ... COMMIT / ROLLBACK`).
- **Índices** → aceleran búsquedas a costa de escritura más lenta.

```sql
-- Subconsulta: películas con nota superior a la media
SELECT title FROM films
WHERE rate > (SELECT AVG(rate) FROM films);

-- Vista
CREATE VIEW top_films AS
SELECT title, rate FROM films WHERE rate >= 8;

-- Transacción atómica
BEGIN;
    INSERT INTO films (title) VALUES ('Tenet');
    INSERT INTO films_genres VALUES (LASTVAL(), 1);
COMMIT;  -- o ROLLBACK si algo falla
```

### Tipos de datos: Postgres vs SQLite

- **Postgres**: muchos (`INTEGER`, `SERIAL`, `VARCHAR(n)`, `TEXT`, `BOOLEAN`, `DATE`, `TIMESTAMP`, `JSON`, `JSONB`, `ARRAY`, `UUID`...).
- **SQLite**: solo 5 clases de afinidad: `INTEGER`, `TEXT`, `REAL`, `BLOB`, `NUMERIC`.

---

## 🔌 Node + PostgreSQL — driver `pg` (bloque 9)

Forma "manual" de hablar con Postgres desde Node, sin ORM.

```bash
npm install pg
npm install -D @types/pg
```

Métodos: `client.connect()`, `client.query(sql, params)`, `client.end()`. El resultado tiene `rows`, `rowCount`, `fields`...

### ⚠️ SQL Injection — pregunta clave

```ts
// ❌ NUNCA: concatenar input → SQL Injection
const bad = await client.query(`SELECT * FROM films WHERE id = ${id}`);

// ✅ SIEMPRE: placeholders parametrizados $1, $2...
const result = await client.query(
    'SELECT * FROM films WHERE id = $1',
    [id],
);
console.log(result.rows);     // [{ id: 42, title: 'Inception' }]
console.log(result.rowCount); // 1
```

Postgres usa `$1, $2, $3...` como placeholders (no `?` como otros).

### Patrón Repository

Clase por entidad con métodos `read`, `readById`, `create`, `update`, `delete`. Aísla la persistencia del resto del código.

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

- **Nativo**: `node:sqlite` (Node 22+).
- **Antiguo (callbacks)**: `sqlite3` (requiere promisificar).

```ts
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./data/app.db');
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(1);   // { id: 1, email: '...' }
db.close();
```

SQLite usa `?` como placeholder (no `$1`).

---

## 🟦 Prisma ORM (bloque 10)

ORM moderno y muy preguntado. Un ORM permite trabajar con la BD a través de objetos en vez de SQL crudo.

### Instalación

```bash
npm install -D prisma
npm install @prisma/client
npm install @prisma/adapter-pg pg
```

### Inicialización

```bash
npx prisma init --output ../generated/prisma
```

Crea `prisma/schema.prisma` y `prisma.config.ts`.

### El schema (`schema.prisma`)

Tres bloques principales:

- **datasource** → proveedor (postgresql/sqlite/mysql/mongodb).
- **generator client** → genera el Prisma Client.
- **modelos** → se mapean a tablas.

### Decoradores frecuentes

| Decorador                                       | Para qué                              |
| ----------------------------------------------- | ------------------------------------- |
| `@id`                                           | Clave primaria                        |
| `@default(autoincrement())`                     | Autoincremental                       |
| `@default(now())`                               | Fecha actual al crear                 |
| `@default(uuid())`                              | UUID generado                         |
| `@unique`                                       | Restricción única                     |
| `@map("nombre_columna")` / `@@map("tabla")`     | Renombrar a snake_case en BD          |
| `@db.VarChar(n)`, `@db.Text`, `@db.Decimal(p,s)` | Tipo SQL específico                  |
| `@relation(fields, references, onDelete: Cascade)` | Definir relación                   |
| `@updatedAt`                                    | Se actualiza solo en cada update      |
| `@@id([campo1, campo2])`                        | Clave primaria compuesta              |

### Relaciones

- **1:1** → campo escalar único, `Profile?` opcional en uno de los lados.
- **1:n** → lista (`Review[]`) en un lado, escalar en el otro.
- **n:n** → listas en ambos lados con `@relation("nombre")` — Prisma genera la tabla intermedia automáticamente.

```prisma
generator client {
    provider = "prisma-client"
    output   = "../generated/prisma"
}

datasource db { provider = "postgresql" }

enum Role { USER EDITOR ADMIN }

// 1:1
model User {
    id       Int      @id @default(autoincrement()) @map("user_id")
    email    String   @unique @db.VarChar(100)
    password String   @db.VarChar(255)
    role     Role     @default(USER)
    profile  Profile?         // lado opcional 1:1
    reviews  Review[]         // 1:n
    @@map("users")
}

// n:n (Prisma genera la tabla intermedia)
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

// PK compuesta
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

### Comandos del CLI — memoriza la diferencia entre ellos

| Comando                                | Qué hace                                                |
| -------------------------------------- | ------------------------------------------------------- |
| `npx prisma generate`                  | Genera el **Prisma Client** a partir del schema         |
| `npx prisma db pull`                   | **Introspección**: crea modelos a partir de una BD existente |
| `npx prisma db push`                   | Empuja el schema a la BD **sin migración** (rápido, sin historial) |
| `npx prisma migrate dev --name nombre` | Crea migración + aplica + regenera cliente              |
| `npx prisma migrate deploy`            | Aplica migraciones en producción (no genera nuevas)     |
| `npx prisma migrate reset`             | Borra y recrea la BD                                    |
| `npx prisma db seed`                   | Ejecuta el script de seed configurado                   |
| `npx prisma studio`                    | GUI para inspeccionar datos                             |

### Cliente Prisma — operaciones típicas

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
    include: { genres: true },     // trae relaciones
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

// UPDATE parcial
await prisma.film.update({
    where: { id: 42 },
    data: { rate: 9.0 },
});

// UPSERT (update si existe, create si no)
await prisma.user.upsert({
    where: { email: 'a@b.c' },
    update: { password: hashed },
    create: { email: 'a@b.c', password: hashed },
});

// DELETE
await prisma.film.delete({ where: { id: 42 } });

// SELECT vs INCLUDE (¡EXCLUYENTES!)
await prisma.user.findMany({ select: { id: true, email: true } });  // solo esos campos
await prisma.user.findMany({ include: { profile: true } });          // todos + relación

// TRANSACCIÓN atómica
await prisma.$transaction([
    prisma.film.create({ data: {...} }),
    prisma.review.create({ data: {...} }),
]);

// SQL crudo (cuando Prisma se queda corto)
const stats = await prisma.$queryRaw`SELECT COUNT(*) FROM films`;
```

### ⚠️ `select` vs `include` — pregunta de matiz

- **`include`** → trae el objeto **completo** + las relaciones que pidas.
- **`select`** → eliges **qué campos concretos** quieres.
- **Son excluyentes** en una misma query.

### Métodos típicos

`findMany`, `findUnique`, `findFirst`, `create`, `createMany`, `update`, `upsert`, `delete`, `count`.

### Filtros

`where`, `orderBy`, `take`, `skip`, `include`, `select`.

### Migraciones

- Cada migración → archivo `migration.sql` en `prisma/migrations/<timestamp>_<nombre>/`.
- Estado registrado en la tabla `_prisma_migrations` de la BD.
- Histórico ordenado por timestamp.

### Seed

- Script TypeScript que inserta datos iniciales.
- Configurado en `prisma.config.ts` (clave `migrations.seed`).
- Habitual: `db.seed.ts` (dev) y `db-test.seed.ts` (test).

---

## ✅ Lo que probablemente caiga en el examen

- **"¿Qué significa SGBD/ORM/ODM?"** → Sistema Gestor BD / Object-Relational Mapper / Object-Document Mapper.
- **"¿Tipos de instrucciones SQL?"** → DDL, DML, DCL, TCL.
- **"¿Qué es DDL? ¿Y DML?"** → Definition (CREATE, ALTER, DROP) / Manipulation (SELECT, INSERT, UPDATE, DELETE).
- **"¿Cómo se modela una relación n:n?"** → tabla intermedia con FK a ambas tablas.
- **"¿Diferencia WHERE y HAVING?"** → WHERE filtra filas, HAVING filtra grupos.
- **"¿LEFT JOIN frente a INNER JOIN?"** → LEFT trae todas las de la izquierda aunque no haya match.
- **"¿Cómo se evita SQL Injection con `pg`?"** → placeholders parametrizados (`$1, $2...`).
- **"¿Comando para crear migración en Prisma?"** → `npx prisma migrate dev --name <nombre>`.
- **"¿Diferencia `db push` y `migrate dev`?"** → `db push` sin historial, `migrate` con archivo de migración.
- **"¿`select` y `include` se pueden usar a la vez?"** → **No, son excluyentes**.
- **"¿Cómo se hace una transacción en Prisma?"** → `prisma.$transaction([op1, op2])`.
- **"¿`@id` vs `@@id([...])`?"** → simple vs compuesta.
- **"¿Qué es un trigger?"** → función que se dispara antes/después de INSERT/UPDATE/DELETE.
- **"¿Tipos de datos en SQLite?"** → solo 5: INTEGER, TEXT, REAL, BLOB, NUMERIC.
