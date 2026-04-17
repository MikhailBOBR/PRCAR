import { notFound, redirect } from "next/navigation";

import { ManagerCarForm } from "@/components/forms/manager-car-form";
import { getServerAuthSession } from "@/lib/auth";
import { canManageCatalog } from "@/lib/permissions";
import { getCarForEdit } from "@/server/services/cars";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerAuthSession();

  if (!canManageCatalog(session?.user.role)) {
    redirect("/login");
  }

  const { id } = await params;
  const car = await getCarForEdit(id);

  if (!car) {
    notFound();
  }

  return (
    <div className="shell">
      <div className="glass rounded-[2rem] px-6 py-8 sm:px-8">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Менеджерская зона</p>
        <h1 className="mt-2 font-display text-4xl text-navy">
          {car.brand} {car.model}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Изменяйте цену, статус, описание и характеристики без прямого доступа к базе данных.
        </p>
        <div className="mt-6">
          <ManagerCarForm
            mode="edit"
            carId={car.id}
            defaultValues={{
              brand: car.brand,
              model: car.model,
              year: car.year,
              price: car.price,
              mileage: car.mileage,
              vin: car.vin,
              color: car.color ?? "",
              city: car.city ?? "",
              engineVolume: car.engineVolume ?? undefined,
              horsepower: car.horsepower ?? undefined,
              description: car.description,
              bodyType: car.bodyType,
              fuelType: car.fuelType,
              transmission: car.transmission,
              driveType: car.driveType,
              status: car.status,
              featured: car.featured,
            }}
            existingImages={car.images}
          />
        </div>
      </div>
    </div>
  );
}
