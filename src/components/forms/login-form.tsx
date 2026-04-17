"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/schemas";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({ callbackUrl = "/account" }: { callbackUrl?: string }) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit((values) => {
        setServerError("");

        startTransition(async () => {
          const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
            callbackUrl,
          });

          if (!result?.ok) {
            setServerError("Неверный логин или пароль.");
            return;
          }

          router.replace(result.url ?? callbackUrl);
          router.refresh();
        });
      })}
    >
      <Field
        label="Email"
        error={errors.email?.message}
        input={<input {...register("email")} className={inputStyles} type="email" />}
      />
      <Field
        label="Пароль"
        error={errors.password?.message}
        input={<input {...register("password")} className={inputStyles} type="password" />}
      />
      {serverError ? <p className="text-sm font-medium text-red-600">{serverError}</p> : null}
      <Button className="w-full" disabled={isPending} type="submit">
        Войти
      </Button>
    </form>
  );
}

const inputStyles =
  "w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-brand/40";

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-navy">{label}</label>
      {input}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
