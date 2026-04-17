import bcrypt from "bcryptjs";

import { AppError } from "@/lib/errors";
import { registerSchema, roleUpdateSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

export async function registerUser(rawData: unknown) {
  const payload = registerSchema.parse(rawData);
  const existingUser = await db.user.findUnique({
    where: {
      email: payload.email.toLowerCase(),
    },
  });

  if (existingUser) {
    throw new AppError("Пользователь с таким email уже существует.", 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  return db.user.create({
    data: {
      name: payload.name,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      consentToPersonalData: payload.consentToPersonalData,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

export async function updateUserRole(userId: string, rawData: unknown) {
  const payload = roleUpdateSchema.parse(rawData);

  return db.user.update({
    where: { id: userId },
    data: {
      role: payload.role,
    },
    select: {
      id: true,
      role: true,
    },
  });
}
