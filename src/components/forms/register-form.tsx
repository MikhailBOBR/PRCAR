"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { registerSchema } from "@/lib/schemas";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      consentToPersonalData: true,
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => {
        setServerError("");

        startTransition(async () => {
          const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          if (!response.ok) {
            const payload = await response.json();
            setServerError(payload.message ?? "Не удалось создать аккаунт.");
            return;
          }

          await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });

          router.replace("/account");
          router.refresh();
        });
      })}
    >
      <Field label="Имя и фамилия" error={errors.name?.message}>
        <input {...register("name")} className={inputStyles} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} className={inputStyles} type="email" />
      </Field>
      <Field label="Телефон" error={errors.phone?.message}>
        <input {...register("phone")} className={inputStyles} placeholder="+7 (999) 000-00-00" />
      </Field>
      <Field label="Пароль" error={errors.password?.message}>
        <input {...register("password")} className={inputStyles} type="password" />
      </Field>
      <label className="flex items-start gap-3 rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm text-muted">
        <input {...register("consentToPersonalData")} className="mt-1" type="checkbox" />
        <span>
          Согласен на обработку персональных данных по правилам 152-ФЗ.
        </span>
      </label>
      {errors.consentToPersonalData ? (
        <p className="text-xs text-red-600">{errors.consentToPersonalData.message}</p>
      ) : null}
      {serverError ? <p className="text-sm font-medium text-red-600">{serverError}</p> : null}
      <Button className="w-full" disabled={isPending} type="submit">
        Создать аккаунт
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
