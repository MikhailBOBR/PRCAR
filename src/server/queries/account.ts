import { db } from "@/lib/db";

export async function getUserFavorites(userId: string) {
  return db.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      car: {
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 6,
          },
        },
      },
    },
  });
}

export async function getUserOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      car: {
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
      manager: {
        select: {
          name: true,
        },
      },
    },
  });
}
