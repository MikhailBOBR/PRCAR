import { NextResponse } from "next/server";

import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { registerUser } from "@/server/services/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUser(body);

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
