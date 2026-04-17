# API

Ниже описаны ключевые программные интерфейсы приложения PRCAR.

## Аутентификация

### `POST /api/auth/register`

Создает клиентский аккаунт.

Request body:

```json
{
  "name": "Алексей Петров",
  "email": "alex@example.com",
  "phone": "+7 (915) 000-00-00",
  "password": "Client12345!",
  "consentToPersonalData": true
}
```

Response:

```json
{
  "id": "clx...",
  "email": "alex@example.com",
  "name": "Алексей Петров",
  "role": "CLIENT"
}
```

### `GET|POST /api/auth/[...nextauth]`

Обрабатывает login/logout/session-потоки через `NextAuth`.

## Каталог

### `GET /api/cars`

Возвращает список автомобилей по фильтрам.

Query params:

- `query`
- `brand`
- `bodyType`
- `fuelType`
- `transmission`
- `driveType`
- `minPrice`
- `maxPrice`
- `minYear`
- `maxYear`
- `maxMileage`
- `sort`
- `page`

Response shape:

```json
{
  "cars": [],
  "brands": ["Audi", "BMW", "Toyota"],
  "total": 15,
  "page": 1,
  "pageSize": 9,
  "totalPages": 2
}
```

### `POST /api/cars`

Создает карточку автомобиля. Доступно только `MANAGER` и `ADMIN`.

Content type: `multipart/form-data`

Поля:

- `brand`
- `model`
- `year`
- `price`
- `mileage`
- `vin`
- `color`
- `city`
- `engineVolume`
- `horsepower`
- `description`
- `bodyType`
- `fuelType`
- `transmission`
- `driveType`
- `status`
- `featured`
- `images[]`

Ограничения:

- изображения `jpg/png/webp/svg`
- размер каждого файла до `5 МБ`

### `PATCH /api/cars/:id`

Обновляет существующую карточку автомобиля. Доступно только `MANAGER` и `ADMIN`.

## Избранное

### `POST /api/favorites/:carId`

Добавляет автомобиль в избранное текущего пользователя.

### `DELETE /api/favorites/:carId`

Удаляет автомобиль из избранного.

## Заявки

### `GET /api/orders`

Возвращает:

- все заявки — для `MANAGER`/`ADMIN`
- только свои заявки — для `CLIENT`

### `POST /api/orders`

Создает заявку на покупку, бронь, тест-драйв или кредит.

Request body:

```json
{
  "carId": "clx...",
  "fullName": "Алексей Петров",
  "phone": "+7 (915) 000-00-00",
  "type": "TEST_DRIVE",
  "preferredDate": "2026-04-20T12:00:00.000Z",
  "comment": "Нужен осмотр в выходные",
  "consentToPersonalData": true
}
```

### `PATCH /api/orders/:orderId`

Изменяет статус заявки. Доступно только `MANAGER` и `ADMIN`.

Request body:

```json
{
  "status": "IN_PROGRESS"
}
```

Если статус переводится в `COMPLETED` и это не `TEST_DRIVE`, автомобиль автоматически получает статус `SOLD`.

## Пользователи

### `PATCH /api/users/:userId/role`

Меняет роль пользователя. Доступно только `ADMIN`.

Request body:

```json
{
  "role": "MANAGER"
}
```

## Healthcheck

### `GET /api/health`

Ответ для smoke-check и мониторинга.

```json
{
  "status": "ok",
  "timestamp": "2026-04-17T09:00:00.000Z",
  "storage": "local"
}
```
