"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { orderStatusOptions } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <select
        defaultValue={currentStatus}
        className="rounded-full border border-line bg-white/70 px-4 py-2 text-sm outline-none transition focus:border-brand/40"
        onChange={(event) =>
          startTransition(async () => {
            await fetch(`/api/orders/${orderId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: event.target.value }),
            });
            router.refresh();
          })
        }
      >
        {orderStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Button disabled={isPending} type="button" variant="secondary">
        Обновлено
      </Button>
    </div>
  );
}
