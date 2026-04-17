import { CarStatus, Prisma } from "@prisma/client";

import type { SortOption } from "@/lib/constants";
import { db } from "@/lib/db";

type CatalogFilters = {
  query?: string;
  brand?: string;
  bodyType?: Prisma.EnumBodyTypeFilter["equals"];
  fuelType?: Prisma.EnumFuelTypeFilter["equals"];
  transmission?: Prisma.EnumTransmissionFilter["equals"];
  driveType?: Prisma.EnumDriveTypeFilter["equals"];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  page: number;
  sort: SortOption;
};

function buildSort(sort: SortOption): Prisma.CarOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }];
    case "price-desc":
      return [{ price: "desc" }];
    case "year-asc":
      return [{ year: "asc" }];
    case "year-desc":
      return [{ year: "desc" }];
    case "mileage-asc":
      return [{ mileage: "asc" }];
    default:
      return [{ featured: "desc" }, { year: "desc" }];
  }
}

function buildWhere(filters: CatalogFilters): Prisma.CarWhereInput {
  const and: Prisma.CarWhereInput[] = [
    {
      status: {
        in: [CarStatus.AVAILABLE, CarStatus.RESERVED],
      },
    },
  ];

  if (filters.query) {
    and.push({
      OR: [
        { brand: { contains: filters.query, mode: "insensitive" } },
        { model: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } },
        { city: { contains: filters.query, mode: "insensitive" } },
      ],
    });
  }

  if (filters.brand) {
    and.push({ brand: filters.brand });
  }

  if (filters.bodyType) {
    and.push({ bodyType: filters.bodyType });
  }

  if (filters.fuelType) {
    and.push({ fuelType: filters.fuelType });
  }

  if (filters.transmission) {
    and.push({ transmission: filters.transmission });
  }

  if (filters.driveType) {
    and.push({ driveType: filters.driveType });
  }

  if (typeof filters.minPrice === "number") {
    and.push({ price: { gte: filters.minPrice } });
  }

  if (typeof filters.maxPrice === "number") {
    and.push({ price: { lte: filters.maxPrice } });
  }

  if (typeof filters.minYear === "number") {
    and.push({ year: { gte: filters.minYear } });
  }

  if (typeof filters.maxYear === "number") {
    and.push({ year: { lte: filters.maxYear } });
  }

  if (typeof filters.maxMileage === "number") {
    and.push({ mileage: { lte: filters.maxMileage } });
  }

  return { AND: and };
}

/**
 * Returns paginated catalog data with the exact filter configuration used for the query.
 */
export async function getCatalog(filters: CatalogFilters) {
  const pageSize = 9;
  const where = buildWhere(filters);
  const skip = (filters.page - 1) * pageSize;

  const [cars, total, brands] = await Promise.all([
    db.car.findMany({
      where,
      orderBy: buildSort(filters.sort),
      skip,
      take: pageSize,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 6,
        },
        _count: {
          select: {
            favorites: true,
          },
        },
      },
    }),
    db.car.count({ where }),
    db.car.findMany({
      where: {
        status: {
          in: [CarStatus.AVAILABLE, CarStatus.RESERVED],
        },
      },
      distinct: ["brand"],
      select: {
        brand: true,
      },
      orderBy: { brand: "asc" },
    }),
  ]);

  return {
    cars,
    brands: brands.map((item) => item.brand),
    total,
    page: filters.page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getFeaturedCars(limit = 6) {
  return db.car.findMany({
    where: {
      featured: true,
      status: {
        in: [CarStatus.AVAILABLE, CarStatus.RESERVED],
      },
    },
    take: limit,
    orderBy: [{ year: "desc" }, { price: "desc" }],
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        take: 6,
      },
    },
  });
}

export async function getCarBySlug(slug: string) {
  return db.car.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      createdBy: {
        select: {
          name: true,
        },
      },
    },
  });
}

export async function getRelatedCars(carId: string, brand: string) {
  return db.car.findMany({
    where: {
      id: { not: carId },
      brand,
      status: {
        in: [CarStatus.AVAILABLE, CarStatus.RESERVED],
      },
    },
    take: 3,
    orderBy: [{ featured: "desc" }, { year: "desc" }],
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        take: 6,
      },
    },
  });
}
