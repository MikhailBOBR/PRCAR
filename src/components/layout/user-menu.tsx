"use client";

import Link from "next/link";
import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function UserMenu({
  name,
  roleLabel,
}: {
  name: string;
  roleLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden rounded-full border border-line bg-white/70 px-4 py-2 text-right sm:block">
        <p className="text-sm font-semibold text-navy">{name}</p>
        <p className="text-xs text-muted">{roleLabel}</p>
      </div>
      <Button asChild variant="secondary">
        <Link href="/account">Кабинет</Link>
      </Button>
      <Button
        variant="ghost"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await signOut({ callbackUrl: "/" });
          })
        }
      >
        <LogOut className="size-4" />
        Выход
      </Button>
    </div>
  );
}
