import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { AppError } from "@/lib/errors";
import { registerUser, updateUserRole } from "@/server/services/users";

const { dbMock, hashMock } = vi.hoisted(() => ({
  dbMock: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
  hashMock: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  __esModule: true,
  default: {
    hash: hashMock,
  },
  hash: hashMock,
}));

vi.mock("@/lib/db", () => ({
  db: dbMock,
}));

function buildRegisterPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Alina Sokolova",
    email: "ALINA@EXAMPLE.COM",
    phone: "+7 (916) 555-44-33",
    password: "Client12345!",
    consentToPersonalData: true,
    ...overrides,
  };
}

describe("user services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a user with normalized email and hashed password", async () => {
    dbMock.user.findUnique.mockResolvedValueOnce(null);
    hashMock.mockResolvedValueOnce("hashed-password");
    dbMock.user.create.mockResolvedValueOnce({
      id: "user_1",
      email: "alina@example.com",
      name: "Alina Sokolova",
      role: "CLIENT",
    });

    const result = await registerUser(buildRegisterPayload());

    expect(dbMock.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: "alina@example.com",
      },
    });
    expect(hashMock).toHaveBeenCalledWith("Client12345!", 10);
    expect(dbMock.user.create).toHaveBeenCalledWith({
      data: {
        name: "Alina Sokolova",
        email: "alina@example.com",
        phone: "+7 (916) 555-44-33",
        consentToPersonalData: true,
        passwordHash: "hashed-password",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    expect(result.email).toBe("alina@example.com");
  });

  it("rejects registerUser when the email already exists", async () => {
    dbMock.user.findUnique.mockResolvedValueOnce({ id: "user_1" });

    await expect(registerUser(buildRegisterPayload())).rejects.toBeInstanceOf(AppError);
    expect(hashMock).not.toHaveBeenCalled();
    expect(dbMock.user.create).not.toHaveBeenCalled();
  });

  it("updates a user role", async () => {
    dbMock.user.update.mockResolvedValueOnce({
      id: "user_1",
      role: "MANAGER",
    });

    const result = await updateUserRole("user_1", { role: "MANAGER" });

    expect(dbMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_1" },
      data: {
        role: "MANAGER",
      },
      select: {
        id: true,
        role: true,
      },
    });
    expect(result.role).toBe("MANAGER");
  });

  it("rejects updateUserRole for an invalid role", async () => {
    await expect(updateUserRole("user_1", { role: "OWNER" })).rejects.toBeInstanceOf(ZodError);
    expect(dbMock.user.update).not.toHaveBeenCalled();
  });
});
