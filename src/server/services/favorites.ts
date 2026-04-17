import { AppError } from "@/lib/errors";
import { db } from "@/lib/db";

export async function addFavorite(userId: string, carId: string) {
  const car = await db.car.findUnique({ where: { id: carId } });

  if (!car) {
    throw new AppError("Автомобиль не найден.", 404);
  }

  return db.favorite.upsert({
    where: {
      userId_carId: {
        userId,
        carId,
      },
    },
    create: {
      userId,
      carId,
    },
    update: {},
  });
}

export async function removeFavorite(userId: string, carId: string) {
  const favorite = await db.favorite.findUnique({
    where: {
      userId_carId: {
        userId,
        carId,
      },
    },
  });

  if (!favorite) {
    throw new AppError("Избранное уже синхронизировано.", 404);
  }

  await db.favorite.delete({
    where: {
      userId_carId: {
        userId,
        carId,
      },
    },
  });
}
