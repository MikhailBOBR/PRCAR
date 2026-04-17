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

### `docs`
Contains project documentation.

## Simplified Tree

```text
src/
  app/
  components/
  lib/
  server/
    queries/
    services/
prisma/
docs/
public/
```

[Back to Home](./Home.md)
