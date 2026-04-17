import Link from "next/link";
import { redirect } from "next/navigation";

import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getServerAuthSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { orderStatusLabels, orderTypeLabels } from "@/lib/constants";
import { getUserFavorites, getUserOrders } from "@/server/queries/account";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerAuthSession();

  if (!session?.user.id) {
    redirect("/login");
  }

  const [orders, favorites] = await Promise.all([
    getUserOrders(session.user.id),
    getUserFavorites(session.user.id),
  ]);

  return (
    <div className="shell space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Личный кабинет</p>
          <h1 className="mt-2 font-display text-4xl text-navy">
            {session.user.name ?? "Клиент автосалона"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Здесь собраны ваши заявки, история коммуникации с менеджерами и быстрый доступ к
            избранным автомобилям.
          </p>
        </div>
        <Button asChild>
          <Link href="/favorites">Открыть избранное</Link>
        </Button>
      </div>

      <StatsGrid
        stats={[
          {
            label: "Всего заявок",
            value: orders.length,
            hint: "История всех обращений по покупке, брони и тест-драйву.",
          },
          {
            label: "Активные",
            value: orders.filter((order) => order.status !== "COMPLETED" && order.status !== "CANCELLED").length,
            hint: "Новые и обрабатываемые менеджером заявки.",
          },
          {
            label: "Избранное",
            value: favorites.length,
            hint: "Автомобили, которые вы сохранили для сравнения.",
          },
        ]}
      />

      {orders.length === 0 ? (
        <EmptyState
          title="Заявок пока нет"
          description="Выберите автомобиль в каталоге и оставьте заявку на тест-драйв, бронь или покупку."
          action={
            <Button asChild>
              <Link href="/catalog">Подобрать автомобиль</Link>
            </Button>
          }
        />
      ) : (
        <section className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-3xl text-navy">История заявок</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="pb-3 font-medium">Автомобиль</th>
                  <th className="pb-3 font-medium">Тип</th>
                  <th className="pb-3 font-medium">Статус</th>
                  <th className="pb-3 font-medium">Менеджер</th>
                  <th className="pb-3 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 pr-6 font-medium text-navy">
                      {order.car.brand} {order.car.model}
                    </td>
                    <td className="py-4 pr-6 text-muted">{orderTypeLabels[order.type]}</td>
                    <td className="py-4 pr-6 text-muted">{orderStatusLabels[order.status]}</td>
                    <td className="py-4 pr-6 text-muted">
                      {order.manager?.name ?? "Назначается автоматически"}
                    </td>
                    <td className="py-4 text-muted">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
