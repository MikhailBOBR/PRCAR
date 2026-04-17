import { Prisma } from "@prisma/client";

import { AppError } from "@/lib/errors";
import { carFormSchema, validateUploadedFiles } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { db } from "@/lib/db";
import { persistCarImages } from "@/server/storage";

async function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 1;

  while (await db.car.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

/**
 * Creates a car card together with uploaded media metadata.
 */
export async function createCar(managerId: string, rawData: unknown, files: File[]) {
  validateUploadedFiles(files, { required: true });
  const payload = carFormSchema.parse(rawData);

  const existingCar = await db.car.findUnique({
    where: {
      vin: payload.vin.toUpperCase(),
    },
  });

  if (existingCar) {
    throw new AppError("Автомобиль с таким VIN уже существует.", 409);
  }

  const carTitle = `${payload.brand} ${payload.model}`;
  const slug = await ensureUniqueSlug(
    slugify(`${payload.brand}-${payload.model}-${payload.year}`),
  );
  const images = await persistCarImages(files, slug, carTitle);

  return db.car.create({
    data: {
      ...payload,
      vin: payload.vin.toUpperCase(),
      slug,
      createdById: managerId,
      images: {
        create: images.map((image, index) => ({
          key: image.key,
          url: image.url,
          alt: image.alt,
          sortOrder: index,
        })),
      },
    },
  });
}

export async function updateCar(carId: string, rawData: unknown, files: File[]) {
  validateUploadedFiles(files);
  const payload = carFormSchema.parse(rawData);

  const existingCar = await db.car.findUnique({
    where: { id: carId },
    include: { images: true },
  });

  if (!existingCar) {
    throw new AppError("Автомобиль не найден.", 404);
  }

  const duplicateVin = await db.car.findFirst({
    where: {
      id: { not: carId },
      vin: payload.vin.toUpperCase(),
    },
  });

  if (duplicateVin) {
    throw new AppError("VIN уже используется в другой карточке.", 409);
  }

  const images =
    files.length > 0
      ? await persistCarImages(files, existingCar.slug, `${payload.brand} ${payload.model}`)
      : [];

  return db.car.update({
    where: { id: carId },
    data: {
      ...payload,
      vin: payload.vin.toUpperCase(),
      images:
        images.length > 0
          ? {
              create: images.map((image, index) => ({
                key: image.key,
                url: image.url,
                alt: image.alt,
                sortOrder: existingCar.images.length + index,
              })),
            }
          : undefined,
    },
  });
}

export async function getCarForEdit(carId: string) {
  return db.car.findUnique({
    where: { id: carId },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getCatalogCarsApi(where: Prisma.CarWhereInput, orderBy: Prisma.CarOrderByWithRelationInput[]) {
  return db.car.findMany({
    where,
    orderBy,
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });
}
