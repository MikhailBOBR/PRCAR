import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";

export async function getManagerDashboard() {
  const [carsCount, activeOrdersCount, soldCarsCount, recentOrders, cars] = await Promise.all([
    db.car.count(),
    db.order.count({
      where: {
        status: {
          in: ["NEW", "IN_PROGRESS", "APPROVED"],
        },
      },
    }),
    db.car.count({
      where: {
        status: "SOLD",
      },
    }),
    db.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        car: {
          select: {
            brand: true,
            model: true,
          },
        },
      },
    }),
    db.car.findMany({
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
    }),
  ]);

  return {
    stats: {
      carsCount,
      activeOrdersCount,
      soldCarsCount,
    },
    recentOrders,
    cars,
  };
}

export async function getAdminDashboard() {
  const [managerStats, users] = await Promise.all([
    getManagerDashboard(),
    db.user.findMany({
      orderBy: [{ role: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const roleBuckets = users.reduce(
    (accumulator, user) => {
      accumulator[user.role] += 1;
      return accumulator;
    },
    {
      [UserRole.CLIENT]: 0,
      [UserRole.MANAGER]: 0,
      [UserRole.ADMIN]: 0,
    },
  );

  return {
    ...managerStats,
    users,
    roleBuckets,
  };
}
