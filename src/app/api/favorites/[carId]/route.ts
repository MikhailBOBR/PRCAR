import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { addFavorite, removeFavorite } from "@/server/services/favorites";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ carId: string }> },
) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ message: "Требуется авторизация." }, { status: 401 });
    }

    const { carId } = await params;
    const favorite = await addFavorite(session.user.id, carId);

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ carId: string }> },
) {
  try {
    const session = await getServerAuthSession();

    if (!session?.user.id) {
      return NextResponse.json({ message: "Требуется авторизация." }, { status: 401 });
    }

    const { carId } = await params;
    await removeFavorite(session.user.id, carId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
