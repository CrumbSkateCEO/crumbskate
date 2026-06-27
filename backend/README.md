# CrumbSkate Backend

API RESTful con Node.js, Express, TypeScript y **Prisma** (PostgreSQL / Neon).

## Requisitos

- Node.js 18+
- Base de datos PostgreSQL en [Neon](https://neon.tech)

## Configuración

1. Copiá `.env.example` a `.env`
2. Pegá tu connection string de Neon en `DATABASE_URL`

```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=tu_secreto
FRONTEND_URL=http://localhost:5173
```

## Base de datos (Prisma)

```bash
# Sincronizar schema con Neon (primera vez o cambios de modelo)
npm run db:push

# Datos iniciales (categorías, configuración)
npm run db:seed

# Probar conexión
npm run db:test

# UI visual de la DB
npm run db:studio
```

Si ya tenés las tablas creadas con `db/schema-postgres.sql`, `db:push` las reconoce sin borrar datos.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm start
```

En Render, el `buildCommand` ya incluye `prisma generate`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor con hot-reload |
| `npm run build` | Genera Prisma Client + compila TS |
| `npm run db:push` | Sincroniza schema con la DB |
| `npm run db:seed` | Inserta datos iniciales |
| `npm run db:test` | Verifica conexión a Neon |
