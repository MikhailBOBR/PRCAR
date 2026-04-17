"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  bodyTypeOptions,
  carStatusOptions,
  driveTypeOptions,
  fuelTypeOptions,
  transmissionOptions,
} from "@/lib/constants";
import { carFormSchema } from "@/lib/schemas";

type CarFormValues = z.input<typeof carFormSchema>;

export function ManagerCarForm({
  mode,
  carId,
  defaultValues,
  existingImages = [],
}: {
  mode: "create" | "edit";
  carId?: string;
  defaultValues?: Partial<CarFormValues>;
  existingImages?: Array<{ url: string; alt: string }>;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof carFormSchema>, undefined, z.output<typeof carFormSchema>>({
    resolver: zodResolver(carFormSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      vin: "",
      color: "",
      city: "",
      engineVolume: 2.0,
      horsepower: 150,
      description: "",
      bodyType: "SEDAN",
      fuelType: "PETROL",
      transmission: "AUTOMATIC",
      driveType: "FWD",
      status: "AVAILABLE",
      featured: false,
      ...defaultValues,
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values, event) =>
        startTransition(async () => {
          setMessage("");
          const formElement = event?.target as HTMLFormElement | undefined;
          const formData = new FormData();

          Object.entries(values).forEach(([key, value]) => {
            formData.append(key, String(value ?? ""));
          });

          const fileInput = formElement?.querySelector<HTMLInputElement>('input[name="images"]');
          const files = fileInput?.files ? Array.from(fileInput.files) : [];
          files.forEach((file) => formData.append("images", file));

          const response = await fetch(mode === "create" ? "/api/cars" : `/api/cars/${carId}`, {
            method: mode === "create" ? "POST" : "PATCH",
            body: formData,
          });

          const payload = await response.json().catch(() => null);

          if (!response.ok) {
            setMessage(payload?.message ?? "Не удалось сохранить автомобиль.");
            return;
          }

          router.replace("/manager");
          router.refresh();
        }),
      )}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Марка" error={errors.brand?.message}>
          <input {...register("brand")} className={inputStyles} />
        </Field>
        <Field label="Модель" error={errors.model?.message}>
          <input {...register("model")} className={inputStyles} />
        </Field>
        <Field label="Год" error={errors.year?.message as string | undefined}>
          <input {...register("year", { valueAsNumber: true })} className={inputStyles} type="number" />
        </Field>
        <Field label="Цена" error={errors.price?.message as string | undefined}>
          <input {...register("price", { valueAsNumber: true })} className={inputStyles} type="number" />
        </Field>
        <Field label="Пробег" error={errors.mileage?.message as string | undefined}>
          <input {...register("mileage", { valueAsNumber: true })} className={inputStyles} type="number" />
        </Field>
        <Field label="VIN" error={errors.vin?.message}>
          <input {...register("vin")} className={inputStyles} />
        </Field>
        <Field label="Цвет" error={errors.color?.message}>
          <input {...register("color")} className={inputStyles} />
        </Field>
        <Field label="Город" error={errors.city?.message}>
          <input {...register("city")} className={inputStyles} />
        </Field>
        <Field label="Объем двигателя" error={errors.engineVolume?.message as string | undefined}>
          <input
            {...register("engineVolume", { valueAsNumber: true })}
            className={inputStyles}
            step="0.1"
            type="number"
          />
        </Field>
        <Field label="Мощность" error={errors.horsepower?.message as string | undefined}>
          <input
            {...register("horsepower", { valueAsNumber: true })}
            className={inputStyles}
            type="number"
          />
        </Field>
        <Field label="Кузов" error={errors.bodyType?.message}>
          <select {...register("bodyType")} className={inputStyles}>
            {bodyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Топливо" error={errors.fuelType?.message}>
          <select {...register("fuelType")} className={inputStyles}>
            {fuelTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Трансмиссия" error={errors.transmission?.message}>
          <select {...register("transmission")} className={inputStyles}>
            {transmissionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Привод" error={errors.driveType?.message}>
          <select {...register("driveType")} className={inputStyles}>
            {driveTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Статус" error={errors.status?.message}>
          <select {...register("status")} className={inputStyles}>
            {carStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3">
          <input {...register("featured")} type="checkbox" />
          <span className="text-sm text-navy">Показать в подборке на главной</span>
        </div>
      </div>

      <Field label="Описание" error={errors.description?.message}>
        <textarea {...register("description")} className={`${inputStyles} min-h-36`} />
      </Field>

      <Field label="Фотографии" error={undefined}>
        <input
          name="images"
          className={`${inputStyles} file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white`}
          multiple
          type="file"
        />
      </Field>

      {existingImages.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {existingImages.map((image) => (
            <div key={image.url} className="overflow-hidden rounded-2xl border border-line bg-white/70">
              <Image
                alt={image.alt}
                className="aspect-[4/3] w-full object-cover"
                height={320}
                src={image.url}
                unoptimized
                width={480}
              />
            </div>
          ))}
        </div>
      ) : null}

      {message ? <p className="text-sm font-medium text-red-600">{message}</p> : null}

      <Button className="w-full sm:w-auto" disabled={isPending} type="submit">
        {mode === "create" ? "Опубликовать автомобиль" : "Сохранить изменения"}
      </Button>
    </form>
  );
}

const inputStyles =
  "w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-brand/40";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-navy">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
