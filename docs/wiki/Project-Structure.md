# Project Structure

## Main Directories

### `src/app`

Contains application pages, route handlers, and API endpoints.

### `src/components`

Contains reusable UI components:

- catalog components
- forms
- layout components
- generic UI elements

### `src/lib`

Contains shared helpers and utility logic:

- validation schemas
- formatting
- authentication helpers
- environment handling
- error processing
- utility functions

### `src/server/services`

Contains the main business logic:

- cars
- orders
- favorites
- users

### `src/server/queries`

Contains read-focused queries for rendering pages and dashboards.

### `prisma`

Contains:

- `schema.prisma`
- seed data
- Prisma configuration

### `scripts`

Contains startup helpers and database bootstrap scripts.

### `docs`

Contains project documentation, TypeDoc output, and wiki materials.

## Expanded Tree

```text
PRCAR/
  src/
    app/
      (auth)/
      account/
      admin/
      api/
      cars/
      catalog/
      favorites/
      manager/
    components/
      catalog/
      dashboard/
      forms/
      layout/
      ui/
    lib/
    server/
      queries/
      services/
      storage/
    types/
  prisma/
  public/
    images/
  scripts/
  docs/
    developer/
    wiki/
  .github/
    workflows/
```

## Key Files

- `middleware.ts` - route protection and role-based access;
- `prisma/schema.prisma` - database schema;
- `prisma/seed.ts` - demo data;
- `scripts/db-init.ts` - automatic database preparation before local development;
- `docker-compose.yml` - local infrastructure for PostgreSQL, MinIO, and the app;
- `ПРАВОВОЕ_УВЕДОМЛЕНИЕ_РФ.md` - legal notice for authorship and distribution rules.

[Back to Home](./Home.md)
