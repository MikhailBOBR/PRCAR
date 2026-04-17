import { CarStatus, OrderStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AppError } from "@/lib/errors";
import { createOrder, updateOrderStatus } from "@/server/services/orders";

const { dbMock } = vi.hoisted(() => ({
  dbMock: {
    car: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    order: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/db", () => ({
  db: dbMock,
}));

function buildOrderPayload(overrides: Record<string, unknown> = {}) {
  return {
    carId: "car_1",
    fullName: "Mikhail Kashpirov",
    phone: "+7 (999) 000-00-00",
    type: "PURCHASE",
    consentToPersonalData: true,
    ...overrides,
  };
}

describe("order services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an order with NEW status for an available car", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce({
      id: "car_1",
      status: CarStatus.AVAILABLE,
    });
    dbMock.order.create.mockImplementationOnce(async ({ data }) => ({
      id: "order_1",
      ...data,
    }));

    const result = await createOrder("user_1", buildOrderPayload());

    expect(dbMock.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user_1",
        carId: "car_1",
        status: OrderStatus.NEW,
      }),
    });
    expect(result.status).toBe(OrderStatus.NEW);
  });

  it("rejects createOrder when the car does not exist", async () => {
    dbMock.car.findUnique.mockResolvedValueOnce(null);

    await expect(createOrder("user_1", buildOrderPayload())).rejects.toMatchObject({
      status: 404,
    });
    expect(dbMock.order.create).not.toHaveBeenCalled();
  });

  it.each([CarStatus.SOLD, CarStatus.ARCHIVED])(
    "rejects createOrder when the car status is %s",
    async (status) => {
      dbMock.car.findUnique.mockResolvedValueOnce({
        id: "car_1",
        status,
      });

      await expect(createOrder("user_1", buildOrderPayload())).rejects.toBeInstanceOf(AppError);
      expect(dbMock.order.create).not.toHaveBeenCalled();
    },
  );

  it("rejects updateOrderStatus for clients", async () => {
    await expect(
      updateOrderStatus("user_1", "CLIENT", "order_1", { status: OrderStatus.IN_PROGRESS }),
    ).rejects.toMatchObject({
      status: 403,
    });

    expect(dbMock.order.findUnique).not.toHaveBeenCalled();
  });

  it("rejects updateOrderStatus when the order does not exist", async () => {
    dbMock.order.findUnique.mockResolvedValueOnce(null);

    await expect(
      updateOrderStatus("manager_1", "MANAGER", "missing_order", {
        status: OrderStatus.IN_PROGRESS,
      }),
    ).rejects.toMatchObject({
      status: 404,
    });
  });

  it("updates order status and assigns the manager", async () => {
    dbMock.order.findUnique.mockResolvedValueOnce({
      id: "order_1",
      carId: "car_1",
      type: "BOOKING",
    });
    dbMock.order.update.mockImplementationOnce(async ({ data }) => ({
      id: "order_1",
      ...data,
    }));

    const result = await updateOrderStatus("manager_1", "MANAGER", "order_1", {
      status: OrderStatus.IN_PROGRESS,
    });

    expect(dbMock.order.update).toHaveBeenCalledWith({
      where: { id: "order_1" },
      data: {
        status: OrderStatus.IN_PROGRESS,
        managerId: "manager_1",
      },
    });
    expect(dbMock.car.update).not.toHaveBeenCalled();
    expect(result.status).toBe(OrderStatus.IN_PROGRESS);
  });

  it("marks the car as SOLD when a non test-drive order is completed", async () => {
    dbMock.order.findUnique.mockResolvedValueOnce({
      id: "order_1",
      carId: "car_1",
      type: "PURCHASE",
    });
    dbMock.order.update.mockResolvedValueOnce({
      id: "order_1",
      status: OrderStatus.COMPLETED,
      managerId: "admin_1",
    });

    await updateOrderStatus("admin_1", "ADMIN", "order_1", {
      status: OrderStatus.COMPLETED,
    });

    expect(dbMock.car.update).toHaveBeenCalledWith({
      where: { id: "car_1" },
      data: {
        status: CarStatus.SOLD,
      },
    });
  });

  it("does not change car status when a test-drive order is completed", async () => {
    dbMock.order.findUnique.mockResolvedValueOnce({
      id: "order_1",
      carId: "car_1",
      type: "TEST_DRIVE",
    });
    dbMock.order.update.mockResolvedValueOnce({
      id: "order_1",
      status: OrderStatus.COMPLETED,
      managerId: "manager_1",
    });

    await updateOrderStatus("manager_1", "MANAGER", "order_1", {
      status: OrderStatus.COMPLETED,
    });

    expect(dbMock.car.update).not.toHaveBeenCalled();
  });
});
