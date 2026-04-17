import Link from "next/link";

import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import { userRoleLabels } from "@/lib/constants";
import { canManageCatalog, canManageUsers } from "@/lib/permissions";

export async function SiteHeader() {
  const session = await getServerAuthSession();

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/82 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="min-w-0">
          <div>
            <p className="brand-wordmark">PRCAR</p>
            <p className="brand-subtitle">Интернет-магазин автомобилей</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-navy lg:flex">
          <Link href="/catalog" className="transition hover:text-brand-deep">
            Каталог
          </Link>
          <Link href="/favorites" className="transition hover:text-brand-deep">
            Избранное
          </Link>
          <Link href="/account" className="transition hover:text-brand-deep">
            Заявки
          </Link>
          {canManageCatalog(session?.user.role) ? (
            <Link href="/manager" className="transition hover:text-brand-deep">
              Менеджеру
            </Link>
          ) : null}
          {canManageUsers(session?.user.role) ? (
            <Link href="/admin/users" className="transition hover:text-brand-deep">
              Администрирование
            </Link>
          ) : null}
        </nav>

        {session?.user ? (
          <UserMenu
            name={session.user.name ?? "Пользователь"}
            roleLabel={userRoleLabels[session.user.role]}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Войти</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Регистрация</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
