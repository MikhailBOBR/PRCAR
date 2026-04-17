import { describe, expect, it } from "vitest";

import { canManageCatalog, canManageUsers, isCustomer } from "@/lib/permissions";

describe("permissions", () => {
  it("allows manager and admin to manage catalog", () => {
    expect(canManageCatalog("MANAGER")).toBe(true);
    expect(canManageCatalog("ADMIN")).toBe(true);
    expect(canManageCatalog("CLIENT")).toBe(false);
  });

  it("allows only admin to manage users", () => {
    expect(canManageUsers("ADMIN")).toBe(true);
    expect(canManageUsers("MANAGER")).toBe(false);
  });

  it("recognizes customer role", () => {
    expect(isCustomer("CLIENT")).toBe(true);
    expect(isCustomer("MANAGER")).toBe(false);
  });
});
