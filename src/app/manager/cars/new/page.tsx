import { redirect } from "next/navigation";

import { ManagerCarForm } from "@/components/forms/manager-car-form";
import { getServerAuthSession } from "@/lib/auth";
import { canManageCatalog } from "@/lib/permissions";

export default async function NewCarPage() {
  const session = await getServerAuthSession();

  if (!canManageCatalog(session?.user.role)) {
    redirect("/login");
  }

  return (
    <div className="shell">
      <div className="glass rounded-[2rem] px-6 py-8 sm:px-8">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Менеджерская зона</p>
        <h1 className="mt-2 font-display text-4xl text-navy">Добавить автомобиль</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Форма учитывает обязательные характеристики, лимит размера фото до 5 МБ и статусы
          публикации.
        </p>
        <div className="mt-6">
          <ManagerCarForm mode="create" />
        </div>
      </div>
    </div>
  );
}
