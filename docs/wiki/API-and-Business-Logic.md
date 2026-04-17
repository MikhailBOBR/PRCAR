# API and Business Logic

## Main Logic Areas

### Users
- registration
- authentication
- user role updates

### Cars
- car creation
- car editing
- catalog queries
- loading car data for edit pages

### Favorites
- add to favorites
- remove from favorites

### Orders
- create request
- update request status

## Example API Routes
- `POST /api/auth/register`
- `POST /api/cars`
- `PATCH /api/cars/[id]`
- `POST /api/orders`
- `PATCH /api/orders/[orderId]`
- `POST /api/favorites/[carId]`
- `DELETE /api/favorites/[carId]`
- `PATCH /api/users/[userId]/role`

## Business Rules
- `VIN` must be unique
- a car `slug` is generated automatically
- role-based access is enforced for protected actions
- a completed non-test-drive order marks a car as `SOLD`
- request and form payloads are validated through schemas

[Back to Home](./Home.md)
