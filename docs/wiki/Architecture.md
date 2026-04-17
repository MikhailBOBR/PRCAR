# Architecture

## General Overview

`PRCAR` is built as a fullstack application on top of `Next.js`. Both the frontend and backend parts are located in a single project.

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
- catalog pages
- car cards and detail pages
- login and registration forms
- account pages
- manager and admin interfaces

### Backend
The backend logic is responsible for:
- user operations
- car management
- favorites
- requests
- role management
- validation and error handling

### Database
`PostgreSQL` is used for persistent data storage. Access to the database is implemented with `Prisma ORM`.

### File Storage
Car images can be stored:
- locally in the filesystem
- in `MinIO` as an S3-compatible storage

## Benefits of the Chosen Architecture
- one project for frontend and backend
- strong typing with `TypeScript`
- convenient database access with `Prisma`
- easy local deployment with `Docker`
- clean separation of UI, business logic, and data access

[Back to Home](./Home.md)
