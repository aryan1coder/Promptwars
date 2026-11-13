import { describe, it, expect } from "vitest";
import { sanitizeInput } from "../src/lib/googleServices.js";

describe("Security & Input Sanitization", () => {
  it("strips HTML angle brackets to prevent XSS", () => {
    expect(sanitizeInput("  <script>alert(1)</script>  ")).toBe("scriptalert(1)/script");
  });

  it("handles non-string safely", () => {
    expect(sanitizeInput(null)).toBe("");
  });

  it("caps prompts at 2000 chars", () => {
    expect(sanitizeInput("a".repeat(2500)).length).toBe(2000);
  });
});
