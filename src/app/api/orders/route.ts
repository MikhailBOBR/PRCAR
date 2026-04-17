import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { canManageCatalog } from "@/lib/permissions";
import { db } from "@/lib/db";
import { createOrder } from "@/server/services/orders";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user.id) {
    return NextResponse.json({ message: "Требуется авторизация." }, { status: 401 });
  }

  const orders = await db.order.findMany({
    where: canManageCatalog(session.user.role) ? undefined : { userId: session.user.id },
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
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ message: "Требуется авторизация." }, { status: 401 });
    }

    const body = await request.json();
    const order = await createOrder(session.user.id, body);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
