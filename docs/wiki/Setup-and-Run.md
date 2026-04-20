# Setup and Run

## Requirements

- `Node.js 20+`
- `npm`
- `Docker`

## Install Dependencies

```bash
npm install
```

If PowerShell blocks `npm.ps1`, run commands through `npm.cmd`.

## Environment Variables

For host startup the project can use values from `.env`, `.env.local`, or `.env.example`.

If you need your own values, create `.env` and configure:

```bash
Copy-Item .env.example .env
```

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `UPLOAD_STORAGE`
- `UPLOAD_DIR`

Optional storage variables:

- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_FORCE_PATH_STYLE`

For Docker Compose with S3, prefer `DOCKER_S3_*` overrides so the container does not inherit host-only endpoints such as `localhost`.

## Start Infrastructure

Run PostgreSQL and MinIO:

```bash
docker compose up -d postgres minio
```

The default external PostgreSQL port in `docker-compose.yml` is `5433`.

## Development Start

```bash
npm run dev
```

Before `Next.js` starts, the project:

- runs schema sync for PostgreSQL;
- loads demo data if the database is empty.

## Local Production Start

Build the app:

```bash
npm run build
```

Run the release profile:

```bash
npm run release:start
```

`release:start` automatically prepares the database before starting the production server.

## Full Docker Release

```bash
docker compose up -d --build
```

After startup:

- app: `http://localhost:3000`
- postgres: `localhost:5433`
- minio api: `http://localhost:9000`
- minio console: `http://localhost:9001`

## Useful Commands

```bash
npm run db:init
npm run lint
npm run typecheck
npm run test
npm run release:check
docker compose logs -f app
docker compose down
```

[Back to Home](./Home.md)
