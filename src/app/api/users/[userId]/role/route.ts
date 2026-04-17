import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { canManageUsers } from "@/lib/permissions";
import { updateUserRole } from "@/server/services/users";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getServerAuthSession();

    if (!canManageUsers(session?.user.role)) {
      return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
    }

    const { userId } = await params;
    const body = await request.json();
    const user = await updateUserRole(userId, body);

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
