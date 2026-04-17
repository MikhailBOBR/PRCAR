"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

export function FavoriteToggle({
  carId,
  isFavorite,
  isAuthorized,
}: {
  carId: string;
  isFavorite: boolean;
  isAuthorized: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      disabled={isPending}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border border-white/75 bg-white/92 text-navy shadow-md shadow-black/10 transition hover:border-brand/30 hover:text-brand",
        isFavorite && "border-brand/30 bg-brand/10 text-brand-deep",
      )}
      onClick={() => {
        if (!isAuthorized) {
          router.push("/login");
          return;
        }

        startTransition(async () => {
          await fetch(`/api/favorites/${carId}`, {
            method: isFavorite ? "DELETE" : "POST",
          });
          router.refresh();
        });
      }}
    >
      <Heart className={cn("size-4", isFavorite && "fill-current")} />
    </button>
  );
}
