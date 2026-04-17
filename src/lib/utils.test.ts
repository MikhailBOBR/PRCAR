import { describe, expect, it } from "vitest";

import { cn, formatPhoneInput, normalizePhone, slugify } from "@/lib/utils";

describe("utils", () => {
  it("joins class names with cn", () => {
    expect(cn("card", false && "hidden", ["active", null], undefined)).toBe("card active");
  });

  it("slugifies strings with spaces and punctuation", () => {
    expect(slugify("  Geely Monjaro 2024!  ")).toBe("geely-monjaro-2024");
  });

  it("normalizes phone numbers to digits", () => {
    expect(normalizePhone("8 (916) 555-44-33")).toBe("79165554433");
    expect(normalizePhone("+7 (916) 555-44-33")).toBe("79165554433");
  });

  it("formats a full phone number for input", () => {
    expect(formatPhoneInput("9165554433")).toBe("+7 (916) 555-44-33");
  });

  it("formats a partial phone number with placeholders", () => {
    expect(formatPhoneInput("91655544")).toBe("+7 (916) 555-44-__");
  });
});
