import Link from "next/link";
import { redirect } from "next/navigation";

import { RegisterForm } from "@/components/forms/register-form";
import { getServerAuthSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerAuthSession();

  if (session?.user.id) {
    redirect("/account");
  }

  return (
    <div className="shell">
      <div className="mx-auto max-w-xl glass rounded-[2rem] px-6 py-8 sm:px-8">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Регистрация</p>
        <h1 className="mt-2 font-display text-4xl text-navy">Создать аккаунт клиента</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          После регистрации вы сможете сохранять автомобили в избранное и отслеживать свои заявки
          в личном кабинете.
        </p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-5 text-sm text-muted">
          Уже зарегистрированы?{" "}
          <Link href="/login" className="font-semibold text-brand-deep transition hover:opacity-80">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
