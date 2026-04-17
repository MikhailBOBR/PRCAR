import { describe, expect, it } from "vitest";

import { AppError, getErrorMessage, getErrorStatus } from "@/lib/errors";

describe("errors", () => {
  it("returns message from AppError", () => {
    expect(getErrorMessage(new AppError("custom error", 409))).toBe("custom error");
  });

  it("returns message from a generic Error", () => {
    expect(getErrorMessage(new Error("generic error"))).toBe("generic error");
  });

  it("returns a fallback message for unknown values", () => {
    expect(getErrorMessage("unexpected")).toBeTruthy();
  });

  it("returns status from AppError and 500 otherwise", () => {
    expect(getErrorStatus(new AppError("custom error", 422))).toBe(422);
    expect(getErrorStatus(new Error("generic error"))).toBe(500);
  });
});
