import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";
import { canManageCatalog } from "@/lib/permissions";
import { updateCar } from "@/server/services/cars";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerAuthSession();

    if (!canManageCatalog(session?.user.role)) {
      return NextResponse.json({ message: "Недостаточно прав." }, { status: 403 });
    }

    const { id } = await params;
    const formData = await request.formData();
    const files = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    const car = await updateCar(
      id,
      {
        brand: formData.get("brand"),
        model: formData.get("model"),
        year: formData.get("year"),
        price: formData.get("price"),
        mileage: formData.get("mileage"),
        vin: formData.get("vin"),
        color: formData.get("color"),
        city: formData.get("city"),
        engineVolume: formData.get("engineVolume"),
        horsepower: formData.get("horsepower"),
        description: formData.get("description"),
        bodyType: formData.get("bodyType"),
        fuelType: formData.get("fuelType"),
        transmission: formData.get("transmission"),
        driveType: formData.get("driveType"),
        status: formData.get("status"),
        featured: formData.get("featured"),
      },
      files,
    );

    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: getErrorStatus(error) },
    );
  }
}
