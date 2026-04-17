import { describe, expect, it } from "vitest";

import { formatDate, formatMileage, formatPrice } from "@/lib/format";

describe("formatters", () => {
  it("formats ruble prices for ru-RU", () => {
    expect(formatPrice(3150000)).toContain("3");
    expect(formatPrice(3150000)).toContain("₽");
  });

  it("formats mileage with localized separators", () => {
    expect(formatMileage(12500)).toContain("12");
    expect(formatMileage(12500)).toContain("км");
  });

  it("formats dates as DD.MM.YYYY", () => {
    expect(formatDate("2026-04-17T00:00:00.000Z")).toMatch(/\d{2}\.\d{2}\.\d{4}/);
  });
});
