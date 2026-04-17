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

Create a `.env` file and configure:
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

## Apply Prisma Schema

```bash
npx prisma db push
```

## Start Development Server

```bash
npm run dev
```

## Useful Commands

```bash
npm run lint
npm run typecheck
npm run test
```

[Back to Home](./Home.md)
