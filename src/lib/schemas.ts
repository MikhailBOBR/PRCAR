import {
  BodyType,
  CarStatus,
  DriveType,
  FuelType,
  OrderStatus,
  OrderType,
  Transmission,
  UserRole,
} from "@prisma/client";
import { z } from "zod";

import { MAX_IMAGE_SIZE_BYTES, sortOptions } from "@/lib/constants";
import { normalizePhone } from "@/lib/utils";

const phoneValidationMessage = "Введите телефон в формате +7 (999) 000-00-00.";

const trimmedString = z.string().trim();

const emptyStringToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional());

export const loginSchema = z.object({
  email: trimmedString.email("Введите корректный email."),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов."),
});

export const registerSchema = z.object({
  name: trimmedString.min(2, "Укажите имя и фамилию."),
  email: trimmedString.email("Введите корректный email."),
  phone: trimmedString.refine(
    (value) => {
      const normalized = normalizePhone(value);
      return normalized.length === 11 && normalized.startsWith("7");
    },
    { message: phoneValidationMessage },
  ),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов.")
    .regex(/[A-Z]/, "Добавьте хотя бы одну заглавную букву.")
    .regex(/[0-9]/, "Добавьте хотя бы одну цифру."),
  consentToPersonalData: z
    .boolean()
    .refine((value) => value === true, "Необходимо согласие на обработку персональных данных."),
});

export const orderSchema = z.object({
  carId: trimmedString.min(1),
  fullName: trimmedString.min(2, "Укажите ФИО."),
  phone: trimmedString.refine(
    (value) => {
      const normalized = normalizePhone(value);
      return normalized.length === 11 && normalized.startsWith("7");
    },
    { message: phoneValidationMessage },
  ),
  type: z.nativeEnum(OrderType),
  preferredDate: emptyStringToUndefined(z.coerce.date()),
  comment: emptyStringToUndefined(trimmedString.max(500, "Комментарий слишком длинный.")),
  consentToPersonalData: z
    .boolean()
    .refine((value) => value === true, "Нужно подтвердить согласие на обработку данных."),
});

export const roleUpdateSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const orderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

const sortValues = sortOptions.map((option) => option.value) as [
  (typeof sortOptions)[number]["value"],
  ...(typeof sortOptions)[number]["value"][],
];

export const catalogFiltersSchema = z.object({
  query: emptyStringToUndefined(trimmedString.max(50)),
  brand: emptyStringToUndefined(trimmedString.max(40)),
  bodyType: emptyStringToUndefined(z.nativeEnum(BodyType)),
  fuelType: emptyStringToUndefined(z.nativeEnum(FuelType)),
  transmission: emptyStringToUndefined(z.nativeEnum(Transmission)),
  driveType: emptyStringToUndefined(z.nativeEnum(DriveType)),
  minPrice: emptyStringToUndefined(z.coerce.number().int().nonnegative()),
  maxPrice: emptyStringToUndefined(z.coerce.number().int().nonnegative()),
  minYear: emptyStringToUndefined(z.coerce.number().int().min(1990).max(2100)),
  maxYear: emptyStringToUndefined(z.coerce.number().int().min(1990).max(2100)),
  maxMileage: emptyStringToUndefined(z.coerce.number().int().nonnegative()),
  sort: z.enum(sortValues).default("featured"),
  page: z.coerce.number().int().min(1).default(1),
});

export const carFormSchema = z.object({
  brand: trimmedString.min(2, "Укажите марку."),
  model: trimmedString.min(1, "Укажите модель."),
  year: z.coerce.number().int().min(1990).max(new Date().getFullYear() + 1),
  price: z.coerce.number().int().positive("Цена должна быть больше нуля."),
  mileage: z.coerce.number().int().nonnegative("Пробег не может быть отрицательным."),
  vin: trimmedString
    .length(17, "VIN должен состоять из 17 символов.")
    .regex(/^[A-HJ-NPR-Z0-9]+$/i, "VIN содержит недопустимые символы."),
  color: emptyStringToUndefined(trimmedString.max(40)),
  city: emptyStringToUndefined(trimmedString.max(40)),
  engineVolume: emptyStringToUndefined(z.coerce.number().min(0).max(10)),
  horsepower: emptyStringToUndefined(z.coerce.number().int().min(0).max(2500)),
  description: trimmedString.min(30, "Добавьте внятное описание автомобиля."),
  bodyType: z.nativeEnum(BodyType),
  fuelType: z.nativeEnum(FuelType),
  transmission: z.nativeEnum(Transmission),
  driveType: z.nativeEnum(DriveType),
  status: z.nativeEnum(CarStatus).default(CarStatus.AVAILABLE),
  featured: z.coerce.boolean().default(false),
});

export function validateUploadedFiles(files: File[], { required = false } = {}) {
  if (required && files.length === 0) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["images"],
        message: "Добавьте хотя бы одну фотографию автомобиля.",
      },
    ]);
  }

  for (const file of files) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new z.ZodError([
        {
          code: "custom",
          path: ["images"],
          message: `Файл ${file.name} превышает лимит 5 МБ.`,
        },
      ]);
    }
  }
}
