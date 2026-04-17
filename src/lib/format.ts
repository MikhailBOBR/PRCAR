const moneyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const mileageFormatter = new Intl.NumberFormat("ru-RU");

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/**
 * Formats the car price for a Russian storefront.
 */
export function formatPrice(price: number) {
  return moneyFormatter.format(price);
}

export function formatMileage(mileage: number) {
  return `${mileageFormatter.format(mileage)} км`;
}

export function formatDate(date: Date | string) {
  return dateFormatter.format(new Date(date));
}
