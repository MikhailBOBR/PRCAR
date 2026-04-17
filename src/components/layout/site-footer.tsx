import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white/40">
      <div className="shell flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-navy">PRCAR</p>
          <p>Актуальные автомобили, реальные фото и быстрый отклик.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy-policy" className="transition hover:text-brand-deep">
            Политика конфиденциальности
          </Link>
          <Link href="/catalog" className="transition hover:text-brand-deep">
            Каталог
          </Link>
          <Link href="/manager" className="transition hover:text-brand-deep">
            Панель менеджера
          </Link>
        </div>
      </div>
    </footer>
  );
}
