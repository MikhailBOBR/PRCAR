import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/lib/errors";
import { createCar, updateCar } from "@/server/services/cars";

const { dbMock, persistCarImagesMock } = vi.hoisted(() => ({
  dbMock: {
    car: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
  persistCarImagesMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: dbMock,
}));

vi.mock("@/server/storage", () => ({
  persistCarImages: persistCarImagesMock,
}));

function buildCarPayload(overrides: Record<string, unknown> = {}) {
  return {
    brand: "Geely",
    model: "Monjaro",
    year: 2024,
    price: 3890000,
    mileage: 4000,
    vin: "LBV3B5EC9RE103512",
    description: "Very detailed car description with more than thirty characters.",
    bodyType: "CROSSOVER",
    fuelType: "PETROL",
    transmission: "AUTOMATIC",
    driveType: "AWD",
    status: "AVAILABLE",
    featured: false,
    ...overrides,
  };
}

function buildImageFile() {
  return new File([new Uint8Array([1, 2, 3])], "car.png", { type: "image/png" });
}

describe("car services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a car with uppercase vin and generated image metadata", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    persistCarImagesMock.mockResolvedValueOnce([
      {
        key: "cars/geely-monjaro-2024/photo-1.webp",
        url: "/uploads/cars/geely-monjaro-2024/photo-1.webp",
        alt: "Geely Monjaro photo 1",
      },
    ]);
    dbMock.car.create.mockImplementationOnce(async ({ data }) => ({ id: "car_1", ...data }));

    const result = await createCar(
      "manager_1",
      buildCarPayload({
        vin: "lbv3b5ec9re103512",
        color: "Silver",
        city: "Moscow",
        engineVolume: 2,
        horsepower: 238,
        featured: true,
      }),
      [buildImageFile()],
    );

    expect(dbMock.car.create).toHaveBeenCalledTimes(1);
    expect(persistCarImagesMock).toHaveBeenCalledWith(
      expect.any(Array),
      "geely-monjaro-2024",
      "Geely Monjaro",
    );
    expect(result.vin).toBe("LBV3B5EC9RE103512");
    expect(result.slug).toBe("geely-monjaro-2024");
    expect(result.createdById).toBe("manager_1");
    expect(dbMock.car.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        vin: "LBV3B5EC9RE103512",
        slug: "geely-monjaro-2024",
        createdById: "manager_1",
        images: {
          create: [
            {
              key: "cars/geely-monjaro-2024/photo-1.webp",
              url: "/uploads/cars/geely-monjaro-2024/photo-1.webp",
              alt: "Geely Monjaro photo 1",
              sortOrder: 0,
            },
          ],
        },
      }),
    });
  });

  it("generates a unique slug when the base slug already exists", async () => {
    dbMock.car.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: "existing_slug" })
      .mockResolvedValueOnce(null);
    persistCarImagesMock.mockResolvedValueOnce([
      {
        key: "cars/geely-monjaro-2024-1/photo-1.webp",
        url: "/uploads/cars/geely-monjaro-2024-1/photo-1.webp",
        alt: "Geely Monjaro photo 1",
      },
    ]);
    dbMock.car.create.mockImplementationOnce(async ({ data }) => ({ id: "car_1", ...data }));

    const result = await createCar("manager_1", buildCarPayload(), [buildImageFile()]);

    expect(result.slug).toBe("geely-monjaro-2024-1");
  });

  it("rejects duplicate vin on create", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce({ id: "existing_vin" });

    await expect(createCar("manager_1", buildCarPayload(), [buildImageFile()])).rejects.toBeInstanceOf(
      AppError,
    );

    expect(dbMock.car.create).not.toHaveBeenCalled();
  });

  it("rejects update when the car is not found", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce(null);

    await expect(updateCar("missing_car", buildCarPayload(), [])).rejects.toBeInstanceOf(AppError);
  });

  it("appends new images to existing ones on update", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce({
      id: "car_1",
      slug: "geely-monjaro-2024",
      images: [{ id: "img_1" }, { id: "img_2" }],
    });
    dbMock.car.findFirst.mockResolvedValueOnce(null);
    persistCarImagesMock.mockResolvedValueOnce([
      {
        key: "cars/geely-monjaro-2024/photo-3.webp",
        url: "/uploads/cars/geely-monjaro-2024/photo-3.webp",
        alt: "Geely Monjaro photo 3",
      },
    ]);
    dbMock.car.update.mockImplementationOnce(async ({ data }) => ({ id: "car_1", ...data }));

    const result = await updateCar(
      "car_1",
      buildCarPayload({
        vin: "lbv3b5ec9re103512",
        featured: true,
      }),
      [buildImageFile()],
    );

    expect(persistCarImagesMock).toHaveBeenCalledWith(
      expect.any(Array),
      "geely-monjaro-2024",
      "Geely Monjaro",
    );
    expect(result.vin).toBe("LBV3B5EC9RE103512");
    expect(dbMock.car.update).toHaveBeenCalledWith({
      where: { id: "car_1" },
      data: expect.objectContaining({
        vin: "LBV3B5EC9RE103512",
        images: {
          create: [
            {
              key: "cars/geely-monjaro-2024/photo-3.webp",
              url: "/uploads/cars/geely-monjaro-2024/photo-3.webp",
              alt: "Geely Monjaro photo 3",
              sortOrder: 2,
            },
          ],
        },
      }),
    });
  });

  it("rejects duplicate vin on update", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce({
      id: "car_1",
      slug: "geely-monjaro-2024",
      images: [],
    });
    dbMock.car.findFirst.mockResolvedValueOnce({ id: "car_2" });

    await expect(updateCar("car_1", buildCarPayload(), [])).rejects.toBeInstanceOf(AppError);

    expect(dbMock.car.update).not.toHaveBeenCalled();
  });
});
