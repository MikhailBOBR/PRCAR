# PRCAR

PRCAR — fullstack-приложение интернет-магазина автомобилей, реализованное по требованиям из отчетов по практическим работам №1-14. Проект построен как полноценная веб-система: публичный каталог, карточка автомобиля, избранное, оформление заявок, кабинет клиента, панель менеджера и администрирование ролей.

## Стек

- `Next.js 16` + `React 19` + `TypeScript`
- `Prisma` + `PostgreSQL`
- `NextAuth` с `Credentials Provider`
- `React Hook Form` + `Zod`
- `Tailwind CSS 4`
- `Vitest` + `Testing Library`
- `Docker` + `Docker Compose`
- `TypeDoc` для документации разработчика

## Реализовано

- Публичная витрина автомобилей с фильтрами, сортировкой и карточками
- Детальная страница автомобиля с галереей и формой заявки
- Регистрация и логин с ролевой моделью `CLIENT / MANAGER / ADMIN`
- Избранное для клиента
- История заявок в личном кабинете
- Панель менеджера: просмотр заявок, смена статусов, создание и редактирование карточек авто
- Панель администратора: просмотр пользователей и изменение ролей
- Политика конфиденциальности и согласие на обработку ПДн
- Seed-данные с тестовыми автомобилями и учетными записями
- Docker-конфигурация для `PostgreSQL` и `MinIO`
- CI-пайплайн с `lint`, `typecheck`, `test` и `build`

## Быстрый старт

1. Скопируйте `.env.example` в `.env`.
2. Поднимите инфраструктуру:

```bash
docker compose up -d postgres minio
```

3. Сгенерируйте Prisma Client и примените схему:

```bash
npm install
npx prisma db push
npm run db:seed
```

4. Запустите приложение:

```bash
npm run dev
```

## Полезные команды

```bash
npm run lint
npm run typecheck
npm run test
npm run prisma:generate
npm run db:seed
npm run docs:api
```

## Тестовые учетные записи

- `admin@prcar.local` / `Admin12345!`
- `manager.one@prcar.local` / `Manager12345!`
- `client.one@prcar.local` / `Client12345!`

## Структура

- `src/app` — маршруты, страницы и API route handlers
- `src/components` — UI, формы, layout, каталожные и dashboard-компоненты
- `src/lib` — auth, env, форматирование, валидация, permissions
- `src/server` — query/service/storage-слой
- `prisma` — схема БД и seed
- `docs` — API и заметки по тестированию

## Документация

- [API](./docs/api.md)
- [Тестирование](./docs/testing.md)

## Соответствие требованиям из отчетов

- Каталог, фильтрация, карточка авто — реализованы
- Избранное, заявка, статусы заявок — реализованы
- Ограничение фото до 5 МБ — реализовано
- RBAC и ограничение доступа к `/manager` и `/admin` — реализовано
- Локализация интерфейса на русском языке — реализована
- Docker, тесты и документация — добавлены
