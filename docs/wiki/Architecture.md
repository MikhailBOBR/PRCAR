# Architecture

## General Overview

`PRCAR` is built as a fullstack application on top of `Next.js`. Both the frontend and backend live in a single repository.

```text
User
  ->
Next.js UI
  ->
API routes / server logic
  ->
Services
  ->
Prisma ORM
  ->
PostgreSQL

Additional storage:
local uploads / MinIO
```

## Main Layers

### Frontend

The frontend contains:

- catalog pages;
- car cards and detail pages;
- login and registration forms;
- account pages;
- manager and admin interfaces.

### Backend

The backend logic is responsible for:

- user operations;
- car management;
- favorites;
- requests;
- role management;
- validation and error handling.

### Database

`PostgreSQL` is used for persistent data storage. Access to the database is implemented with `Prisma ORM`.

### File Storage

Car images can be stored:

- locally in the filesystem;
- in `MinIO` as an S3-compatible storage.

## Cross-Cutting Concerns

- authentication is handled by `NextAuth`;
- authorization is enforced through `middleware` and role checks;
- validation uses `Zod`;
- password storage uses hashed values via `bcrypt`;
- business logic is separated into `services`, while page-oriented reads live in `queries`.

## Why This Architecture Works Well

- one repository for frontend and backend;
- clear separation between UI, business logic, and persistence;
- strong typing with `TypeScript`;
- reproducible local setup with Docker;
- predictable growth path for tests, CI/CD, and deployment.

[Back to Home](./Home.md)
