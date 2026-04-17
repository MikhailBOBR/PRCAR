import {
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean;
  children: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:pointer-events-none disabled:opacity-50",
    variant === "primary" &&
      "bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-deep",
    variant === "secondary" &&
      "border border-line bg-white/80 text-navy hover:bg-white",
    variant === "ghost" && "text-navy hover:bg-white/70",
    className,
  );

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    return cloneElement(children as ReactElement<{ className?: string }>, {
      className: cn((children.props as { className?: string }).className, styles),
    });
  }

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
