import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Fuel, Gauge, MapPin } from "lucide-react";

import { FavoriteToggle } from "@/components/catalog/favorite-toggle";
import { Badge } from "@/components/ui/badge";
import { getPreferredCarImages } from "@/lib/car-images";
import { fuelTypeLabels } from "@/lib/constants";
import { formatMileage, formatPrice } from "@/lib/format";

type CarCardProps = {
  car: {
    id: string;
    slug: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    city: string | null;
    fuelType: string;
    featured?: boolean;
    images: Array<{ url: string; alt: string }>;
  };
  isFavorite: boolean;
  isAuthorized: boolean;
};

export function CarCard({ car, isFavorite, isAuthorized }: CarCardProps) {
  const images = getPreferredCarImages(car.images);
  const image = images[0];

  return (
    <article className="glass group overflow-hidden rounded-[1.75rem]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Link
          href={`/cars/${car.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`Открыть карточку ${car.brand} ${car.model}`}
        />
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 via-black/8 to-transparent" />
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4">
          {car.featured ? (
            <Badge className="border-white/80 bg-white/92 text-brand-deep shadow-lg shadow-black/15 backdrop-blur-md">
              Рекомендуем
            </Badge>
          ) : (
            <span />
          )}
          <FavoriteToggle
            carId={car.id}
            isFavorite={isFavorite}
            isAuthorized={isAuthorized}
          />
        </div>
        {images.length > 1 ? (
          <div className="pointer-events-none absolute bottom-4 left-4 z-20 rounded-full bg-white/94 px-3 py-1 text-xs font-semibold text-navy shadow-md shadow-black/10 backdrop-blur">
            {images.length} фото
          </div>
        ) : null}
      </div>
      <div className="space-y-4 px-5 py-5">
        <div className="space-y-1">
          <Link href={`/cars/${car.slug}`} className="block">
            <h3 className="font-display text-2xl text-navy">{`${car.brand} ${car.model}`}</h3>
          </Link>
          <p className="text-lg font-semibold text-brand-deep">{formatPrice(car.price)}</p>
        </div>

        <div className="grid gap-2 text-sm text-muted sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-brand" />
            {car.year} год
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-brand" />
            {formatMileage(car.mileage)}
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="size-4 text-brand" />
            {fuelTypeLabels[car.fuelType as keyof typeof fuelTypeLabels] ?? car.fuelType}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-brand" />
            {car.city ?? "Москва"}
          </div>
        </div>

        <Link
          href={`/cars/${car.slug}`}
          className="inline-flex items-center text-sm font-semibold text-navy transition hover:text-brand-deep"
        >
          Открыть карточку
        </Link>
      </div>
    </article>
  );
}
