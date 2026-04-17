import { CarStatus, OrderStatus, type UserRole } from "@prisma/client";

import { AppError } from "@/lib/errors";
import { orderSchema, orderStatusSchema } from "@/lib/schemas";
import { db } from "@/lib/db";

export async function createOrder(userId: string, rawData: unknown) {
  const payload = orderSchema.parse(rawData);
  const car = await db.car.findUnique({
    where: { id: payload.carId },
  });

  if (!car) {
    throw new AppError("Автомобиль не найден.", 404);
  }

  if (car.status === CarStatus.SOLD || car.status === CarStatus.ARCHIVED) {
    throw new AppError("По этому автомобилю уже нельзя оформить заявку.", 409);
  }

  return db.order.create({
    data: {
      ...payload,
      userId,
      status: OrderStatus.NEW,
    },
  });
}

/**
 * Updates an order status and synchronizes the public car state for closed deals.
 */
export async function updateOrderStatus(
  actorId: string,
  actorRole: UserRole,
  orderId: string,
  rawData: unknown,
) {
  if (actorRole !== "MANAGER" && actorRole !== "ADMIN") {
    throw new AppError("Недостаточно прав для изменения статуса заявки.", 403);
  }

  const payload = orderStatusSchema.parse(rawData);
  const order = await db.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError("Заявка не найдена.", 404);
  }

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: {
      status: payload.status,
      managerId: actorId,
    },
  });

  if (payload.status === OrderStatus.COMPLETED && order.type !== "TEST_DRIVE") {
    await db.car.update({
      where: { id: order.carId },
      data: {
        status: CarStatus.SOLD,
      },
    });
  }

  return updatedOrder;
}
