import { UserRole } from "@prisma/client";

/**
 * Checks whether a role can manage the car catalog and incoming orders.
 */
export function canManageCatalog(role?: UserRole | null) {
  return role === UserRole.MANAGER || role === UserRole.ADMIN;
}

export function canManageUsers(role?: UserRole | null) {
  return role === UserRole.ADMIN;
}

export function isCustomer(role?: UserRole | null) {
  return role === UserRole.CLIENT;
}
