"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { orderTypeOptions } from "@/lib/constants";
import { orderSchema } from "@/lib/schemas";

export function OrderForm({
  carId,
  userDefaults,
}: {
  carId: string;
  userDefaults: {
    fullName?: string | null;
    phone?: string | null;
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof orderSchema>, undefined, z.output<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      carId,
      fullName: userDefaults.fullName ?? "",
      phone: userDefaults.phone ?? "",
      type: "TEST_DRIVE",
      comment: "",
      consentToPersonalData: true,
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) =>
        startTransition(async () => {
          setMessage("");

          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          const payload = await response.json().catch(() => null);

          if (!response.ok) {
            setMessage(payload?.message ?? "Не удалось отправить заявку.");
            return;
          }

          setMessage("Заявка отправлена. Менеджер свяжется с вами после проверки.");
          router.refresh();
        }),
      )}
    >
      <input {...register("carId")} type="hidden" />
      <Field label="ФИО" error={errors.fullName?.message}>
        <input {...register("fullName")} className={inputStyles} />
      </Field>
      <Field label="Телефон" error={errors.phone?.message}>
        <input {...register("phone")} className={inputStyles} placeholder="+7 (999) 000-00-00" />
      </Field>
      <Field label="Тип обращения" error={errors.type?.message}>
        <select {...register("type")} className={inputStyles}>
          {orderTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Предпочтительная дата" error={errors.preferredDate?.message as string | undefined}>
        <input {...register("preferredDate")} className={inputStyles} type="datetime-local" />
      </Field>
      <Field label="Комментарий" error={errors.comment?.message}>
        <textarea {...register("comment")} className={`${inputStyles} min-h-28`} />
      </Field>
      <label className="flex items-start gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm text-muted">
        <input {...register("consentToPersonalData")} className="mt-1" type="checkbox" />
        <span>Согласен на обработку персональных данных для обратной связи.</span>
      </label>
      {errors.consentToPersonalData ? (
        <p className="text-xs text-red-600">{errors.consentToPersonalData.message}</p>
      ) : null}
      {message ? <p className="text-sm font-medium text-brand-deep">{message}</p> : null}
      <Button className="w-full" disabled={isPending} type="submit">
        Отправить заявку
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
