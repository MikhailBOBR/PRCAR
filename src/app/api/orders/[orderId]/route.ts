import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { updateOrderStatus } from "@/server/services/orders";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ message: "Требуется авторизация." }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = await params;
    const order = await updateOrderStatus(
      session.user.id,
      session.user.role,
      orderId,
      body,
    );

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
