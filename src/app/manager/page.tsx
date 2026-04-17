import Link from "next/link";
import { redirect } from "next/navigation";

import { OrderStatusForm } from "@/components/forms/order-status-form";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import { carStatusLabels, orderStatusLabels } from "@/lib/constants";
import { canManageCatalog } from "@/lib/permissions";
import { formatDate } from "@/lib/format";
import { getManagerDashboard } from "@/server/queries/dashboard";

export const dynamic = "force-dynamic";

export default async function ManagerPage() {
  const session = await getServerAuthSession();

  if (!canManageCatalog(session?.user.role)) {
    redirect("/login");
  }

  const dashboard = await getManagerDashboard();

  return (
    <div className="shell space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-brand-deep/70">Операционная панель</p>
          <h1 className="mt-2 font-display text-4xl text-navy">Менеджеру автосалона</h1>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/manager/cars/new">Добавить автомобиль</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/catalog">Публичная витрина</Link>
          </Button>
        </div>
      </div>

      <StatsGrid
        stats={[
          {
            label: "Карточек в каталоге",
            value: dashboard.stats.carsCount,
            hint: "Общее количество автомобилей, включая архив и проданные позиции.",
          },
          {
            label: "Активные заявки",
            value: dashboard.stats.activeOrdersCount,
            hint: "Новые и незавершенные обращения клиентов.",
          },
          {
            label: "Проданные авто",
            value: dashboard.stats.soldCarsCount,
            hint: "Карточки, автоматически переведенные в статус «Продан».",
          },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-3xl text-navy">Свежие заявки</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="pb-3 font-medium">Клиент</th>
                  <th className="pb-3 font-medium">Автомобиль</th>
                  <th className="pb-3 font-medium">Статус</th>
                  <th className="pb-3 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {dashboard.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 pr-6">
                      <p className="font-medium text-navy">{order.user.name}</p>
                    </td>
                    <td className="py-4 pr-6 text-muted">
                      {order.car.brand} {order.car.model}
                    </td>
                    <td className="py-4 pr-6">
                      <div className="space-y-2">
                        <p className="text-xs text-muted">{orderStatusLabels[order.status]}</p>
                        <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                      </div>
                    </td>
                    <td className="py-4 text-muted">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <h2 className="font-display text-3xl text-navy">Последние карточки</h2>
          <div className="mt-5 space-y-3">
            {dashboard.cars.map((car) => (
              <article
                key={car.id}
                className="rounded-2xl border border-line bg-white/70 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy">{`${car.brand} ${car.model}`}</p>
                    <p className="mt-1 text-sm text-muted">{carStatusLabels[car.status]}</p>
                  </div>
                  <Button asChild variant="ghost">
                    <Link href={`/manager/cars/${car.id}`}>Редактировать</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
