import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, House } from "lucide-react";

import { CarCard } from "@/components/catalog/car-card";
import { CarGallery } from "@/components/catalog/car-gallery";
import { OrderForm } from "@/components/forms/order-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import {
  bodyTypeLabels,
  carStatusLabels,
  driveTypeLabels,
  fuelTypeLabels,
  transmissionLabels,
} from "@/lib/constants";
import { db } from "@/lib/db";
import { formatMileage, formatPrice } from "@/lib/format";
import { getCarBySlug, getRelatedCars } from "@/server/queries/catalog";

export const dynamic = "force-dynamic";

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerAuthSession();
  const car = await getCarBySlug(slug);

  if (!car) {
    notFound();
  }

  const [relatedCars, favorites, currentUser] = await Promise.all([
    getRelatedCars(car.id, car.brand),
    session?.user.id
      ? db.favorite.findMany({ where: { userId: session.user.id }, select: { carId: true } })
      : Promise.resolve([]),
    session?.user.id
      ? db.user.findUnique({
          where: { id: session.user.id },
          select: { phone: true },
        })
      : Promise.resolve(null),
  ]);

  const favoriteSet = new Set(favorites.map((item) => item.carId));

  return (
    <div className="shell space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="secondary">
          <Link href="/catalog">
            <ArrowLeft className="size-4" />
            Назад в каталог
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">
            <House className="size-4" />
            На главную
          </Link>
        </Button>
        {session?.user ? (
          <Button asChild variant="ghost">
            <Link href="/favorites">Избранное</Link>
          </Button>
        ) : null}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <CarGallery images={car.images} title={`${car.brand} ${car.model}`} />

          <div className="glass rounded-[2rem] p-6">
            <div className="flex flex-wrap gap-3">
              <Badge>{carStatusLabels[car.status]}</Badge>
              {car.featured ? <Badge>Подборка главной</Badge> : null}
            </div>
            <h1 className="mt-4 font-display text-4xl text-navy">{`${car.brand} ${car.model}`}</h1>
            <p className="mt-2 text-2xl font-semibold text-brand-deep">{formatPrice(car.price)}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
              {car.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Spec label="Год" value={`${car.year}`} />
              <Spec label="Пробег" value={formatMileage(car.mileage)} />
              <Spec label="VIN" value={car.vin} />
              <Spec label="Кузов" value={bodyTypeLabels[car.bodyType]} />
              <Spec label="Топливо" value={fuelTypeLabels[car.fuelType]} />
              <Spec label="Коробка" value={transmissionLabels[car.transmission]} />
              <Spec label="Привод" value={driveTypeLabels[car.driveType]} />
              <Spec label="Мощность" value={car.horsepower ? `${car.horsepower} л.с.` : "—"} />
              <Spec label="Объём двигателя" value={car.engineVolume ? `${car.engineVolume} л` : "—"} />
              <Spec label="Цвет" value={car.color ?? "—"} />
              <Spec label="Город" value={car.city ?? "Москва"} />
              <Spec label="Карточку ведёт" value={car.createdBy?.name ?? "Команда автосалона"} />
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="glass rounded-[2rem] p-6">
            <h2 className="font-display text-3xl text-navy">Оформить заявку</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Выберите тест-драйв, бронь, покупку или кредитный сценарий. Заявка сразу попадет в
              панель менеджера и получит статус «Новая».
            </p>
            <div className="mt-5">
              {session?.user ? (
                <OrderForm
                  carId={car.id}
                  userDefaults={{
                    fullName: session.user.name,
                    phone: currentUser?.phone ?? "",
                  }}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-sm leading-7 text-muted">
                    Для отправки заявки нужен аккаунт клиента, чтобы вы могли отслеживать статус в
                    личном кабинете.
                  </p>
                  <Button asChild>
                    <a href="/login">Войти и продолжить</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>

      {relatedCars.length > 0 ? (
        <section className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Похожие варианты</p>
            <h2 className="mt-2 font-display text-3xl text-navy">Ещё по этой марке</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedCars.map((relatedCar) => (
              <CarCard
                key={relatedCar.id}
                car={relatedCar}
                isFavorite={favoriteSet.has(relatedCar.id)}
                isAuthorized={Boolean(session?.user)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold text-navy">{value}</p>
    </div>
  );
}
