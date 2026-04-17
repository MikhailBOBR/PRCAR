import { redirect } from "next/navigation";

import { StatsGrid } from "@/components/dashboard/stats-grid";
import { RoleSelectForm } from "@/components/forms/role-select-form";
import { getServerAuthSession } from "@/lib/auth";
import { userRoleLabels } from "@/lib/constants";
import { canManageUsers } from "@/lib/permissions";
import { formatDate } from "@/lib/format";
import { getAdminDashboard } from "@/server/queries/dashboard";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerAuthSession();

  if (!canManageUsers(session?.user.role)) {
    redirect("/login");
  }

  const dashboard = await getAdminDashboard();

  return (
    <div className="shell space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Администрирование</p>
        <h1 className="mt-2 font-display text-4xl text-navy">Роли и пользователи</h1>
      </div>

      <StatsGrid
        stats={[
          {
            label: "Клиенты",
            value: dashboard.roleBuckets.CLIENT,
            hint: "Пользователи с доступом к витрине, избранному и своим заявкам.",
          },
          {
            label: "Менеджеры",
            value: dashboard.roleBuckets.MANAGER,
            hint: "Сотрудники, ведущие каталог и обработку входящих обращений.",
          },
          {
            label: "Администраторы",
            value: dashboard.roleBuckets.ADMIN,
            hint: "Пользователи с правом назначать роли в системе.",
          },
        ]}
      />

      <section className="glass rounded-[2rem] p-6">
        <h2 className="font-display text-3xl text-navy">Учетные записи</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-muted">
              <tr>
                <th className="pb-3 font-medium">Пользователь</th>
                <th className="pb-3 font-medium">Контакты</th>
                <th className="pb-3 font-medium">Текущая роль</th>
                <th className="pb-3 font-medium">Изменить роль</th>
                <th className="pb-3 font-medium">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {dashboard.users.map((user) => (
                <tr key={user.id}>
                  <td className="py-4 pr-6">
                    <p className="font-medium text-navy">{user.name}</p>
                  </td>
                  <td className="py-4 pr-6 text-muted">
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                  </td>
                  <td className="py-4 pr-6 text-muted">{userRoleLabels[user.role]}</td>
                  <td className="py-4 pr-6">
                    <RoleSelectForm userId={user.id} currentRole={user.role} />
                  </td>
                  <td className="py-4 text-muted">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
