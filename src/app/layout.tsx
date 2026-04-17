import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "PRCAR",
    template: "%s • PRCAR",
  },
  description:
    "Интернет-магазин автомобилей с каталогом, ролями, заявками, избранным и административной панелью.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-48 bg-gradient-to-b from-white/60 to-transparent" />
        <SiteHeader />
        <main className="relative z-10 flex-1 py-8 sm:py-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
