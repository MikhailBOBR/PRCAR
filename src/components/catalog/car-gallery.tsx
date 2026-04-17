"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { getPreferredCarImages } from "@/lib/car-images";
import { cn } from "@/lib/utils";

type CarGalleryProps = {
  images: Array<{ url: string; alt: string }>;
  title: string;
};

const fallbackImage = {
  url: "/images/demo/lumen-sedan.svg",
  alt: "Фото автомобиля",
};

export function CarGallery({ images, title }: CarGalleryProps) {
  const galleryImages = getPreferredCarImages(images);
  const normalizedImages = galleryImages.length > 0 ? galleryImages : [{ ...fallbackImage, alt: title }];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const currentIndex = Math.min(activeIndex, normalizedImages.length - 1);
  const hasMultipleImages = normalizedImages.length > 1;

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        setActiveIndex((index) => (index === 0 ? normalizedImages.length - 1 : index - 1));
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        setActiveIndex((index) => (index === normalizedImages.length - 1 ? 0 : index + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultipleImages, isLightboxOpen, normalizedImages.length]);

  const activeImage = normalizedImages[currentIndex];

  const showPreviousImage = () => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveIndex((index) => (index === 0 ? normalizedImages.length - 1 : index - 1));
  };

  const showNextImage = () => {
    if (!hasMultipleImages) {
      return;
    }

    setActiveIndex((index) => (index === normalizedImages.length - 1 ? 0 : index + 1));
  };

  return (
    <>
      <div className="glass overflow-hidden rounded-[2rem] p-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-navy/6">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute inset-0 z-10 cursor-zoom-in"
            aria-label={`Открыть фото ${title}`}
          />
          <Image
            src={activeImage.url}
            alt={activeImage.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />

          <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
            <div className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-navy backdrop-blur shadow-md shadow-black/10">
              {currentIndex + 1} / {normalizedImages.length}
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="rounded-full bg-white/92 p-2 text-navy shadow-md shadow-black/10 transition hover:bg-white"
              aria-label="Открыть фото в полном размере"
            >
              <Expand className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={showPreviousImage}
            disabled={!hasMultipleImages}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/92 p-2 text-navy shadow-md shadow-black/10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={showNextImage}
            disabled={!hasMultipleImages}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/92 p-2 text-navy shadow-md shadow-black/10 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            aria-label="Следующее фото"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {hasMultipleImages ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {normalizedImages.map((image, index) => (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-[1.1rem] border transition sm:w-32",
                  index === currentIndex
                    ? "border-brand shadow-lg shadow-brand/15"
                    : "border-line hover:border-brand/40",
                )}
                aria-label={`Показать фото ${index + 1}`}
              >
                <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="160px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <div className="fixed inset-0 z-50 bg-navy/94 p-4 sm:p-6">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur">
                Фото {currentIndex + 1} из {normalizedImages.length}
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18"
                aria-label="Закрыть просмотр"
              >
                <X className="size-4" />
                Закрыть
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative h-[72vh] w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/4">
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={showPreviousImage}
                disabled={!hasMultipleImages}
                className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Предыдущее фото"
              >
                <ChevronLeft className="size-4" />
                Назад
              </button>

              <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/70 backdrop-blur">
                Esc · ← · →
              </div>

              <button
                type="button"
                onClick={showNextImage}
                disabled={!hasMultipleImages}
                className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/18 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Следующее фото"
              >
                Дальше
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
