import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/forms/login-form";
import { getServerAuthSession } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getServerAuthSession();

  if (session?.user.id) {
    redirect("/account");
  }

  const params = await searchParams;
  const callbackUrl =
    typeof params.callbackUrl === "string" ? params.callbackUrl : "/account";

  return (
    <div className="shell">
      <div className="mx-auto max-w-xl glass rounded-[2rem] px-6 py-8 sm:px-8">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Авторизация</p>
        <h1 className="mt-2 font-display text-4xl text-navy">Вход в систему</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Клиенты получают доступ к избранному и статусам заявок. Менеджеры и администраторы
          дополнительно видят операционные панели.
        </p>
        <div className="mt-6">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
        <p className="mt-5 text-sm text-muted">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-semibold text-brand-deep transition hover:opacity-80">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
