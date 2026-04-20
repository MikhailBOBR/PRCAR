# Развертывание и CI/CD

## Локальная разработка

Для разработки достаточно:

```bash
npm install
docker compose up -d postgres minio
npm run dev
```

При первом `npm run dev` проект автоматически:

- подхватывает переменные из `.env`, `.env.local` или `.env.example`;
- синхронизирует схему PostgreSQL через `prisma db push`;
- загружает demo-данные, если база пустая.

Если в PowerShell блокируется `npm.ps1`, используйте `npm.cmd`.

## Локальный production-запуск на хосте

1. Установите зависимости:

```bash
npm install
```

2. Поднимите инфраструктуру:

```bash
docker compose up -d postgres minio
```

3. Соберите приложение:

```bash
npm run build
```

4. Запустите production-режим:

```bash
npm run release:start
```

`release:start` перед стартом приложения запускает `db:init`, поэтому БД подготавливается автоматически и повторно seed не выполняется, если данные уже есть.

## Полный локальный релиз через Docker Compose

```bash
docker compose up -d --build
```

`docker-compose.yml` поднимает:

- `postgres` - базу данных проекта;
- `minio` - S3-совместимое хранилище для изображений;
- `app` - production-контейнер приложения.

Контейнер `app` сам:

- инициализирует базу данных при старте;
- запускает `Next.js` в production-режиме;
- отдает healthcheck через `/api/health`.

Полезные команды:

```bash
docker compose logs -f app
docker compose down
```

## Переменные окружения

Для локальной настройки можно скопировать `.env.example` в `.env` и изменить значения. Для Docker Compose наличие `.env` не обязательно: базовые fallback-значения уже зашиты в конфиг, а `DATABASE_URL` внутри контейнера всегда направлен на сервис `postgres`.

Основные переменные:

- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `UPLOAD_STORAGE`
- `UPLOAD_DIR`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_FORCE_PATH_STYLE`

Для Docker Compose S3-параметры контейнера приложения лучше переопределять через `DOCKER_S3_*`. Это защищает локальный релиз от ситуации, когда в `.env` указан хостовый адрес `localhost`, который не работает внутри контейнера.

Локально внешний порт PostgreSQL выставлен на `5433`, чтобы не конфликтовать с установленным Postgres на машине.

## Что делает CI

Workflow в `.github/workflows/ci.yml`:

- поднимает PostgreSQL как сервис GitHub Actions;
- гоняет проверки на `Node.js 20` и `Node.js 22`;
- выполняет `lint`, `typecheck`, `test` и `build`;
- сохраняет `coverage` как артефакт;
- собирает Docker-образ.

## Что делает CD

На пушах в основные ветки workflow дополнительно готовит Docker-образ проекта. Для `main` и тегов образ может публиковаться в `GHCR` (`ghcr.io/<owner>/prcar`), если репозиторий размещен на GitHub и у workflow есть стандартный `GITHUB_TOKEN`.

## Материалы для GitHub Wiki

Содержимое `docs/wiki` оформлено так, чтобы его можно было использовать как локальную wiki или перенести в GitHub Wiki после публикации репозитория.
