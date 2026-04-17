# Database

## Main Entities

### `User`
Stores user information:
- name
- email
- phone
- password hash
- role

### `Car`
Stores information about a car:
- brand
- model
- year
- price
- mileage
- VIN
- description
- status

### `CarImage`
Stores car images and their display order.

### `Favorite`
Links users with favorite cars.

### `Order`
Stores requests created by customers:
- purchase
- booking
- test drive

## Relationships
- one user can have many orders
- one user can have many favorite cars
- one car can have many images
- one car can be linked to many requests

## Database Purpose

The database provides centralized storage for users, cars, images, and requests. It also supports role-based access and the core business logic of the application.

[Back to Home](./Home.md)
