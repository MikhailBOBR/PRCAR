# PRCAR

PRCAR - веб-приложение для автосалона с публичным каталогом автомобилей, карточками машин, заявками, избранным и внутренними кабинетами для клиента, менеджера и администратора.

## Стек

- `Next.js` + `TypeScript`
- `PostgreSQL` + `Prisma`
- `NextAuth`
- `Docker`

## Реализовано

- публичный каталог автомобилей с фильтрами и сортировкой;
- детальная страница автомобиля с заявкой;
- регистрация, авторизация и роли `CLIENT / MANAGER / ADMIN`;
- избранное и личный кабинет клиента;
- панель менеджера для работы с карточками и заявками;
- панель администратора для управления ролями;
- локальное или S3-совместимое хранение изображений;
- тесты, документация и Docker-окружение.

## Быстрый старт для разработки

1. Установите зависимости:

```bash
npm install
```

2. Поднимите инфраструктуру:

```bash
docker compose up -d postgres minio
```

3. Запустите приложение:

```bash
npm run dev
```

При первом `npm run dev` проект автоматически:

- подхватит переменные из `.env`, `.env.local` или `.env.example`;
- синхронизирует схему БД;
- загрузит demo-данные, если база пустая.

Если PowerShell блокирует `npm.ps1`, запускайте команды через `npm.cmd`, например `npm.cmd run dev`.

## Локальный production-релиз

Есть два готовых сценария.

### Вариант 1. Локально на хосте

1. Установите зависимости:

```bash
npm install
```

2. Поднимите PostgreSQL и, при необходимости, MinIO:

```bash
docker compose up -d postgres minio
```

3. Соберите приложение:

```bash
npm run build
```

4. Запустите release-режим:

```bash
npm run release:start
```

`release:start` сам выполнит `db:init`, подготовит схему базы и загрузит demo-данные, если база пустая, а затем поднимет `Next.js` в production-режиме.

### Вариант 2. Полностью через Docker Compose

```bash
docker compose up -d --build
```

После этого будут подняты:

- приложение на `http://localhost:3000`;
- PostgreSQL на `localhost:5433`;
- MinIO API на `http://localhost:9000`;
- MinIO Console на `http://localhost:9001`.

Контейнер приложения теперь сам выполняет инициализацию БД при старте, поэтому отдельный ручной прогон `db:init` для локального релиза не нужен.

Остановить окружение можно так:

```bash
docker compose down
```

Посмотреть логи приложения:

```bash
docker compose logs -f app
```

## Переменные окружения

Для своих значений скопируйте `.env.example` в `.env` и отредактируйте:

```bash
Copy-Item .env.example .env
```

Основные переменные:

- `DATABASE_URL`
- `AUTH_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `UPLOAD_STORAGE`
- `UPLOAD_DIR`

Для S3/MinIO:

- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_FORCE_PATH_STYLE`

Для Docker Compose контейнер приложения использует отдельные override-переменные `DOCKER_S3_*`, чтобы не ломаться из-за хостовых значений вроде `http://localhost:9000` внутри контейнера. Если их не задавать, compose использует встроенный `minio`-сервис.

По умолчанию локальный PostgreSQL из `docker-compose.yml` доступен на порту `5433`.

## Полезные команды

```bash
npm run db:init
npm run lint
npm run typecheck
npm run test
npm run build
npm run release:check
npm run docs:api
```

## Тестовые учетные записи

- `admin@prcar.local` / `Admin12345!`
- `manager.one@prcar.local` / `Manager12345!`
- `client.one@prcar.local` / `Client12345!`

## Структура проекта

```text
PRCAR/
|-- src/
|   |-- app/                  # страницы, layout и API routes
|   |-- components/           # UI, формы, layout, catalog/dashboard
|   |-- lib/                  # auth, env, schemas, utils, permissions
|   |-- server/
|   |   |-- queries/          # запросы для страниц и панелей
|   |   |-- services/         # бизнес-логика
|   |   `-- storage/          # работа с файлами и изображениями
|   `-- types/                # расширения типов
|-- prisma/                   # schema, config, seed
|-- public/                   # статические файлы и demo-изображения
|-- scripts/                  # служебные скрипты запуска
|-- docs/                     # wiki, API, testing, deployment, TypeDoc
|-- .github/workflows/        # CI/CD
|-- docker-compose.yml
|-- Dockerfile
`-- ПРАВОВОЕ_УВЕДОМЛЕНИЕ_РФ.md
```

## Документация

- [Документационный хаб](./docs/README.md)
- [Wiki / материалы для GitHub Wiki](./docs/wiki/Home.md)
- [API](./docs/api.md)
- [Тестирование](./docs/testing.md)
- [Развертывание и CI/CD](./docs/deployment.md)
- [Авторы и участники](./AUTHORS.md)
- [Правовое уведомление](./ПРАВОВОЕ_УВЕДОМЛЕНИЕ_РФ.md)

## Команда

Проект выполнялся командой:

- Кашпирев М. Д.
- Емельянов А. С.
- Чернецов Е. М.
