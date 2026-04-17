import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gauge, ShieldCheck, Sparkles } from "lucide-react";

import { CarCard } from "@/components/catalog/car-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import { getPreferredCarImages, hasUploadedCarImages } from "@/lib/car-images";
import { db } from "@/lib/db";
import { formatMileage, formatPrice } from "@/lib/format";
import { getFeaturedCars } from "@/server/queries/catalog";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerAuthSession();
  const [featuredCars, favoriteIds] = await Promise.all([
    getFeaturedCars(),
    session?.user.id
      ? db.favorite.findMany({
          where: {
            userId: session.user.id,
          },
          select: { carId: true },
        })
      : Promise.resolve([]),
  ]);

  const favoriteSet = new Set(favoriteIds.map((item) => item.carId));
  const showcaseCar = featuredCars.find((car) => hasUploadedCarImages(car.images)) ?? featuredCars[0];
  const showcaseImage = showcaseCar ? getPreferredCarImages(showcaseCar.images)[0] : null;

  return (
    <div className="shell space-y-12">
      <section className="glass animate-rise-in overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <Badge>Автомобили в наличии</Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-display text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
                Найдите автомобиль, который захочется увидеть вживую.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                Актуальные фотографии, понятные характеристики и быстрый отклик менеджера. Сравните
                варианты, сохраните понравившиеся и отправьте заявку за пару минут.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/catalog">
                  Открыть каталог
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={session ? "/account" : "/register"}>
                  {session ? "Открыть личный кабинет" : "Создать аккаунт"}
                </Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-line bg-white/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Sparkles className="size-4 text-brand" />
                  Актуальные фото
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Если для автомобиля уже загружены реальные снимки, в витрине показываются именно они.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-white/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Gauge className="size-4 text-brand" />
                  Понятный выбор
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Цена, пробег, год и ключевые параметры видны сразу, без лишней перегруженности.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-white/70 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <ShieldCheck className="size-4 text-brand" />
                  Быстрый отклик
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Заявка на покупку, бронь или тест-драйв отправляется менеджеру сразу после оформления.
                </p>
              </div>
            </div>
          </div>

          {showcaseCar ? (
            <Link
              href={`/cars/${showcaseCar.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-line bg-navy text-white shadow-2xl shadow-navy/15"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {showcaseImage ? (
                  <Image
                    src={showcaseImage.url}
                    alt={showcaseImage.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">В фокусе</p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="font-display text-3xl sm:text-4xl">{`${showcaseCar.brand} ${showcaseCar.model}`}</h2>
                      <p className="mt-2 text-sm text-white/75">
                        {showcaseCar.year} год · {formatMileage(showcaseCar.mileage)}
                      </p>
                    </div>
                    <ArrowRight className="size-5 shrink-0 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              <div className="grid gap-3 border-t border-white/10 bg-navy/95 px-6 py-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Цена</p>
                  <p className="mt-2 text-xl font-semibold text-white">{formatPrice(showcaseCar.price)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/45">Город</p>
                  <p className="mt-2 text-base font-semibold text-white">{showcaseCar.city ?? "Москва"}</p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-[2rem] border border-line bg-navy p-6 text-white shadow-2xl shadow-navy/20">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Подборка</p>
              <h2 className="mt-4 font-display text-3xl">Свежие предложения уже в каталоге</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Откройте витрину и выберите автомобиль по цене, пробегу, типу кузова и другим параметрам.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Популярные предложения</p>
            <h2 className="mt-2 font-display text-3xl text-navy">Автомобили в наличии</h2>
          </div>
          <Button asChild variant="ghost">
            <Link href="/catalog">Смотреть весь каталог</Link>
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              isFavorite={favoriteSet.has(car.id)}
              isAuthorized={Boolean(session?.user)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
