# Setup and Run

## Requirements

- `Node.js`
- `npm`
- `Docker`

## Install Dependencies

```bash
npm install
```

## Environment Variables

Локальный запуск по умолчанию может использовать значения из `.env`, `.env.local` или `.env.example`.

Если нужны свои значения, создайте `.env` и настройте:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `UPLOAD_STORAGE`

Optional storage variables:

- `S3_ENDPOINT`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`

## Start Infrastructure

Run PostgreSQL:

```bash
docker compose up -d postgres
```

If `MinIO` is needed:

```bash
docker compose up -d minio
```

The default local PostgreSQL port in `docker-compose.yml` is `5433`.

## Development Start

Команда разработки сама подготовит базу:

```bash
npm run dev
```

Перед запуском Next.js проект:

- выполняет `prisma db push`;
- загружает demo-данные, если база пустая.

## Useful Commands

```bash
npm run db:init
npm run lint
npm run typecheck
npm run test
```

[Back to Home](./Home.md)
