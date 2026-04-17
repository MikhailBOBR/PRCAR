import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/lib/errors";
import { addFavorite, removeFavorite } from "@/server/services/favorites";

const { dbMock } = vi.hoisted(() => ({
  dbMock: {
    car: {
      findUnique: vi.fn(),
    },
    favorite: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  db: dbMock,
}));

describe("favorite services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds a favorite for an existing car", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce({ id: "car_1" });
    dbMock.favorite.upsert.mockResolvedValueOnce({
      userId: "user_1",
      carId: "car_1",
    });

    const result = await addFavorite("user_1", "car_1");

    expect(dbMock.favorite.upsert).toHaveBeenCalledWith({
      where: {
        userId_carId: {
          userId: "user_1",
          carId: "car_1",
        },
      },
      create: {
        userId: "user_1",
        carId: "car_1",
      },
      update: {},
    });
    expect(result).toEqual({
      userId: "user_1",
      carId: "car_1",
    });
  });

  it("rejects addFavorite when the car is missing", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce(null);

    await expect(addFavorite("user_1", "missing_car")).rejects.toBeInstanceOf(AppError);
    expect(dbMock.favorite.upsert).not.toHaveBeenCalled();
  });

  it("removes an existing favorite", async () => {
    dbMock.favorite.findUnique.mockResolvedValueOnce({
      userId: "user_1",
      carId: "car_1",
    });
    dbMock.favorite.delete.mockResolvedValueOnce(undefined);

    await removeFavorite("user_1", "car_1");

    expect(dbMock.favorite.delete).toHaveBeenCalledWith({
      where: {
        userId_carId: {
          userId: "user_1",
          carId: "car_1",
        },
      },
    });
  });

  it("rejects removeFavorite when there is nothing to delete", async () => {
    dbMock.favorite.findUnique.mockResolvedValueOnce(null);

    await expect(removeFavorite("user_1", "car_1")).rejects.toMatchObject({
      status: 404,
    });
    expect(dbMock.favorite.delete).not.toHaveBeenCalled();
  });
});
