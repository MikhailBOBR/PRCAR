import type { Metadata } from "next";

import { CarCard } from "@/components/catalog/car-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { catalogFiltersSchema } from "@/lib/schemas";
import { getCatalog } from "@/server/queries/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const filters = catalogFiltersSchema.parse({
    ...Object.fromEntries(
      Object.entries(rawParams).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
    ),
  });

  const session = await getServerAuthSession();
  const [catalog, favorites] = await Promise.all([
    getCatalog(filters),
    session?.user.id
      ? db.favorite.findMany({
          where: { userId: session.user.id },
          select: { carId: true },
        })
      : Promise.resolve([]),
  ]);

  const favoriteSet = new Set(favorites.map((item) => item.carId));

  return (
    <div className="shell space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Подбор автомобиля</p>
        <h1 className="mt-2 font-display text-4xl text-navy">Каталог автосалона</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
          Фильтруйте по цене, году, кузову, коробке и пробегу, чтобы быстрее найти подходящий автомобиль.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <CatalogFilters
          brands={catalog.brands}
          initialValues={{
            query: filters.query ?? "",
            brand: filters.brand ?? "",
            bodyType: filters.bodyType ?? "",
            fuelType: filters.fuelType ?? "",
            transmission: filters.transmission ?? "",
            driveType: filters.driveType ?? "",
            minPrice: String(filters.minPrice ?? ""),
            maxPrice: String(filters.maxPrice ?? ""),
            minYear: String(filters.minYear ?? ""),
            maxYear: String(filters.maxYear ?? ""),
            maxMileage: String(filters.maxMileage ?? ""),
            sort: filters.sort,
          }}
        />

        <section className="space-y-5">
          <div className="glass rounded-[1.75rem] px-5 py-4">
            <p className="text-sm text-muted">
              Найдено автомобилей: <span className="font-semibold text-navy">{catalog.total}</span>
            </p>
          </div>

          {catalog.cars.length === 0 ? (
            <EmptyState
              title="Ничего не найдено"
              description="Попробуйте ослабить фильтры или сбросить сортировку, чтобы увидеть больше предложений."
              action={
                <Button asChild>
                  <a href="/catalog">Очистить фильтры</a>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
              {catalog.cars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isFavorite={favoriteSet.has(car.id)}
                  isAuthorized={Boolean(session?.user)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
