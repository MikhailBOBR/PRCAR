import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass rounded-[1.75rem] px-6 py-10 text-center">
      <h2 className="font-display text-3xl text-navy">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted sm:text-base">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
