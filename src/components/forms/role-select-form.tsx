"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { userRoleOptions } from "@/lib/constants";

export function RoleSelectForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentRole}
      disabled={isPending}
      className="rounded-full border border-line bg-white/70 px-4 py-2 text-sm outline-none transition focus:border-brand/40"
      onChange={(event) =>
        startTransition(async () => {
          await fetch(`/api/users/${userId}/role`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role: event.target.value }),
          });
          router.refresh();
        })
      }
    >
      {userRoleOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
