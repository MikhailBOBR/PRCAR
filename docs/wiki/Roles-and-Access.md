# Roles and Access

## User Roles

### `CLIENT`
Can:
- browse the catalog
- open car detail pages
- save favorites
- submit requests
- use the personal account

### `MANAGER`
Can:
- add cars
- edit cars
- view requests
- change request statuses

### `ADMIN`
Can:
- perform all manager actions
- change user roles
- manage administrative features

## Access Table

| Action | CLIENT | MANAGER | ADMIN |
|--------|--------|---------|-------|
| Browse catalog | Yes | Yes | Yes |
| Open car page | Yes | Yes | Yes |
| Add to favorites | Yes | Yes | Yes |
| Submit request | Yes | Yes | Yes |
| Manage cars | No | Yes | Yes |
| Process requests | No | Yes | Yes |
| Manage roles | No | No | Yes |

## Access Control

Access to internal sections is restricted by role. This separates the customer-facing features from the internal dealership workflow.

[Back to Home](./Home.md)
