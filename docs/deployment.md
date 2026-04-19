# Развертывание и CI/CD

## Локальный запуск

Для локальной разработки достаточно:

```bash
npm install
docker compose up -d postgres minio
npm run dev
```

При первом `npm run dev` проект автоматически:

- подхватывает переменные из `.env`, `.env.local` или `.env.example`;
- синхронизирует схему PostgreSQL через `prisma db push`;
- загружает demo-данные, если база пустая.

## Docker-инфраструктура

`docker-compose.yml` поднимает:

- `postgres` - база данных проекта;
- `minio` - S3-совместимое хранилище для изображений;
- `app` - production-контейнер приложения.

Локально внешний порт PostgreSQL выставлен на `5433`, чтобы не конфликтовать с уже установленным Postgres на машине.

## Что делает CI

Workflow в `.github/workflows/ci.yml` проверяет проект в несколько этапов:

- поднимает PostgreSQL как сервис GitHub Actions;
- гоняет проверки на `Node.js 20` и `Node.js 22`;
- выполняет `lint`, `typecheck`, `test` и `build`;
- сохраняет `coverage` как артефакт;
- собирает Docker-образ.

## Что делает CD

На пушах в основные ветки workflow дополнительно готовит Docker-образ проекта. Для `main` и тегов образ может публиковаться в `GHCR` (`ghcr.io/<owner>/prcar`), если репозиторий размещен на GitHub и у workflow есть стандартный `GITHUB_TOKEN`.

## Материалы для GitHub Wiki

Содержимое `docs/wiki` оформлено так, чтобы его можно было использовать как локальную wiki или перенести в GitHub Wiki после публикации репозитория.
