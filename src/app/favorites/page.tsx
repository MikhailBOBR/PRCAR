import Link from "next/link";
import { redirect } from "next/navigation";

import { CarCard } from "@/components/catalog/car-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getServerAuthSession } from "@/lib/auth";
import { getUserFavorites } from "@/server/queries/account";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getServerAuthSession();

  if (!session?.user.id) {
    redirect("/login");
  }

  const favorites = await getUserFavorites(session.user.id);
  const favoriteSet = new Set(favorites.map((item) => item.carId));

  return (
    <div className="shell space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Личный кабинет</p>
        <h1 className="mt-2 font-display text-4xl text-navy">Избранные автомобили</h1>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="Избранное пока пустое"
          description="Сохраняйте понравившиеся автомобили из каталога, чтобы сравнить варианты позже."
          action={
            <Button asChild>
              <Link href="/catalog">Открыть каталог</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite) => (
            <CarCard
              key={favorite.id}
              car={favorite.car}
              isFavorite={favoriteSet.has(favorite.carId)}
              isAuthorized
            />
          ))}
        </div>
      )}
    </div>
  );
}
