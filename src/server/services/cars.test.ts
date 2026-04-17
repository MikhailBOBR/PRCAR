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

describe("car services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a car with uppercase vin and generated image metadata", async () => {
    dbMock.car.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    persistCarImagesMock.mockResolvedValueOnce([
      {
        key: "cars/geely-monjaro-2024/photo-1.webp",
        url: "/uploads/cars/geely-monjaro-2024/photo-1.webp",
        alt: "Geely Monjaro — фото 1",
      },
    ]);
    dbMock.car.create.mockImplementationOnce(async ({ data }) => ({ id: "car_1", ...data }));

    const result = await createCar(
      "manager_1",
      {
        brand: "Geely",
        model: "Monjaro",
        year: 2024,
        price: 3890000,
        mileage: 4000,
        vin: "lbv3b5ec9re103512",
        color: "Silver",
        city: "Moscow",
        engineVolume: 2,
        horsepower: 238,
        description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
        bodyType: "CROSSOVER",
        fuelType: "PETROL",
        transmission: "AUTOMATIC",
        driveType: "AWD",
        status: "AVAILABLE",
        featured: true,
      },
      [new File([new Uint8Array([1, 2, 3])], "car.png", { type: "image/png" })],
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
    expect(result.images.create).toEqual([
      {
        key: "cars/geely-monjaro-2024/photo-1.webp",
        url: "/uploads/cars/geely-monjaro-2024/photo-1.webp",
        alt: "Geely Monjaro — фото 1",
        sortOrder: 0,
      },
    ]);
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
        alt: "Geely Monjaro — фото 1",
      },
    ]);
    dbMock.car.create.mockImplementationOnce(async ({ data }) => ({ id: "car_1", ...data }));

    const result = await createCar(
      "manager_1",
      {
        brand: "Geely",
        model: "Monjaro",
        year: 2024,
        price: 3890000,
        mileage: 4000,
        vin: "LBV3B5EC9RE103512",
        description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
        bodyType: "CROSSOVER",
        fuelType: "PETROL",
        transmission: "AUTOMATIC",
        driveType: "AWD",
        status: "AVAILABLE",
        featured: false,
      },
      [new File([new Uint8Array([1, 2, 3])], "car.png", { type: "image/png" })],
    );

    expect(result.slug).toBe("geely-monjaro-2024-1");
  });

  it("rejects duplicate vin on create", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce({ id: "existing_vin" });

    await expect(
      createCar(
        "manager_1",
        {
          brand: "Geely",
          model: "Monjaro",
          year: 2024,
          price: 3890000,
          mileage: 4000,
          vin: "LBV3B5EC9RE103512",
          description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
          bodyType: "CROSSOVER",
          fuelType: "PETROL",
          transmission: "AUTOMATIC",
          driveType: "AWD",
          status: "AVAILABLE",
          featured: false,
        },
        [new File([new Uint8Array([1, 2, 3])], "car.png", { type: "image/png" })],
      ),
    ).rejects.toBeInstanceOf(AppError);

    expect(dbMock.car.create).not.toHaveBeenCalled();
  });

  it("rejects update when the car is not found", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce(null);

    await expect(
      updateCar(
        "missing_car",
        {
          brand: "Geely",
          model: "Monjaro",
          year: 2024,
          price: 3890000,
          mileage: 4000,
          vin: "LBV3B5EC9RE103512",
          description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
          bodyType: "CROSSOVER",
          fuelType: "PETROL",
          transmission: "AUTOMATIC",
          driveType: "AWD",
          status: "AVAILABLE",
          featured: false,
        },
        [],
      ),
    ).rejects.toBeInstanceOf(AppError);
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
        alt: "Geely Monjaro — фото 3",
      },
    ]);
    dbMock.car.update.mockImplementationOnce(async ({ data }) => ({ id: "car_1", ...data }));

    const result = await updateCar(
      "car_1",
      {
        brand: "Geely",
        model: "Monjaro",
        year: 2024,
        price: 3890000,
        mileage: 4000,
        vin: "lbv3b5ec9re103512",
        description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
        bodyType: "CROSSOVER",
        fuelType: "PETROL",
        transmission: "AUTOMATIC",
        driveType: "AWD",
        status: "AVAILABLE",
        featured: true,
      },
      [new File([new Uint8Array([1, 2, 3])], "car.png", { type: "image/png" })],
    );

    expect(persistCarImagesMock).toHaveBeenCalledWith(
      expect.any(Array),
      "geely-monjaro-2024",
      "Geely Monjaro",
    );
    expect(result.vin).toBe("LBV3B5EC9RE103512");
    expect(result.images.create).toEqual([
      {
        key: "cars/geely-monjaro-2024/photo-3.webp",
        url: "/uploads/cars/geely-monjaro-2024/photo-3.webp",
        alt: "Geely Monjaro — фото 3",
        sortOrder: 2,
      },
    ]);
  });

  it("rejects duplicate vin on update", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce({
      id: "car_1",
      slug: "geely-monjaro-2024",
      images: [],
    });
    dbMock.car.findFirst.mockResolvedValueOnce({ id: "car_2" });

    await expect(
      updateCar(
        "car_1",
        {
          brand: "Geely",
          model: "Monjaro",
          year: 2024,
          price: 3890000,
          mileage: 4000,
          vin: "LBV3B5EC9RE103512",
          description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
          bodyType: "CROSSOVER",
          fuelType: "PETROL",
          transmission: "AUTOMATIC",
          driveType: "AWD",
          status: "AVAILABLE",
          featured: false,
        },
        [],
      ),
    ).rejects.toBeInstanceOf(AppError);

    expect(dbMock.car.update).not.toHaveBeenCalled();
  });
});
