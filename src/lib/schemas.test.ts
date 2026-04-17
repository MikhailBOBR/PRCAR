import { describe, expect, it } from "vitest";

import { MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";
import {
  carFormSchema,
  catalogFiltersSchema,
  loginSchema,
  orderSchema,
  registerSchema,
  validateUploadedFiles,
} from "@/lib/schemas";

describe("schemas", () => {
  it("requires consent when registering", () => {
    const result = registerSchema.safeParse({
      name: "Алина Соколова",
      email: "alina@example.com",
      phone: "+7 (916) 555-44-33",
      password: "Client12345!",
      consentToPersonalData: false,
    });

    expect(result.success).toBe(false);
  });

  it("accepts registration with valid name, phone and strong password", () => {
    const result = registerSchema.safeParse({
      name: "Алина Соколова",
      email: "alina@example.com",
      phone: "8 (916) 555-44-33",
      password: "Client12345!",
      consentToPersonalData: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects registration passwords without uppercase characters", () => {
    const result = registerSchema.safeParse({
      name: "Алина Соколова",
      email: "alina@example.com",
      phone: "+7 (916) 555-44-33",
      password: "client12345!",
      consentToPersonalData: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects login with a short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("parses empty catalog filter values into defaults", () => {
    const result = catalogFiltersSchema.parse({
      query: "",
      brand: "",
      sort: "featured",
    });

    expect(result.page).toBe(1);
    expect(result.query).toBeUndefined();
    expect(result.brand).toBeUndefined();
  });

  it("rejects invalid catalog ranges and unsupported sort values", () => {
    const result = catalogFiltersSchema.safeParse({
      minYear: "1980",
      sort: "unknown",
    });

    expect(result.success).toBe(false);
  });

  it("parses order form with optional fields omitted", () => {
    const result = orderSchema.safeParse({
      carId: "car_1",
      fullName: "Михаил Кашпиров",
      phone: "+7 (999) 000-00-00",
      type: "TEST_DRIVE",
      preferredDate: "",
      comment: "",
      consentToPersonalData: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferredDate).toBeUndefined();
      expect(result.data.comment).toBeUndefined();
    }
  });

  it("rejects order form without consent", () => {
    const result = orderSchema.safeParse({
      carId: "car_1",
      fullName: "Михаил Кашпиров",
      phone: "+7 (999) 000-00-00",
      type: "TEST_DRIVE",
      consentToPersonalData: false,
    });

    expect(result.success).toBe(false);
  });

  it("normalizes boolean-like featured values in car form", () => {
    const result = carFormSchema.parse({
      brand: "Geely",
      model: "Monjaro",
      year: 2024,
      price: 3890000,
      mileage: 4000,
      vin: "LBV3B5EC9RE103512",
      color: "Silver",
      city: "Moscow",
      engineVolume: 2,
      horsepower: 238,
      description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
      bodyType: "CROSSOVER",
      fuelType: "PETROL",
      transmission: "AUTOMATIC",
      driveType: "AWD",
      status: "AVAILABLE",
      featured: "true",
    });

    expect(result.featured).toBe(true);
  });

  it("rejects car form with invalid vin", () => {
    const result = carFormSchema.safeParse({
      brand: "Geely",
      model: "Monjaro",
      year: 2024,
      price: 3890000,
      mileage: 4000,
      vin: "INVALIDVINWITHIOQ",
      description: "Очень подробное описание автомобиля длиной больше тридцати символов.",
      bodyType: "CROSSOVER",
      fuelType: "PETROL",
      transmission: "AUTOMATIC",
      driveType: "AWD",
      status: "AVAILABLE",
      featured: false,
    });

    expect(result.success).toBe(false);
  });

  it("requires at least one uploaded photo when requested", () => {
    expect(() => validateUploadedFiles([], { required: true })).toThrow();
  });

  it("rejects files larger than 5MB", () => {
    const file = new File([new Uint8Array(MAX_IMAGE_SIZE_BYTES + 1)], "heavy.png", {
      type: "image/png",
    });

    expect(() => validateUploadedFiles([file], { required: true })).toThrow();
  });

  it("accepts files within the size limit", () => {
    const file = new File([new Uint8Array(MAX_IMAGE_SIZE_BYTES)], "ok.png", {
      type: "image/png",
    });

    expect(() => validateUploadedFiles([file], { required: true })).not.toThrow();
  });
});
