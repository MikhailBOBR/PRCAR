# PRCAR

PRCAR - веб-приложение для автосалона с публичным каталогом, карточками автомобилей, заявками, избранным и внутренними кабинетами для клиента, менеджера и администратора.

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

## Быстрый старт

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

При первом `npm run dev` проект сам:

- подхватит переменные из `.env`, `.env.local` или `.env.example`;
- синхронизирует схему БД;
- загрузит demo-данные, если база пустая.

По умолчанию локальный `PostgreSQL` из `docker-compose.yml` доступен на порту `5433`.

Если нужно изменить порты, секреты или storage-настройки, скопируйте `.env.example` в `.env` и поменяйте значения.

## Полезные команды

```bash
npm run db:init
npm run lint
npm run typecheck
npm run test
npm run build
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
