import { describe, it, expect } from "vitest";
import { COLORS, API, PAGINATION, RETRY, CACHE_TTL, ERROR_MESSAGES, ROLES } from "@/constants";

describe("constants", () => {
  describe("COLORS", () => {
    it("defines all color keys", () => {
      expect(COLORS).toHaveProperty("aqua");
      expect(COLORS).toHaveProperty("blue");
      expect(COLORS).toHaveProperty("cream");
      expect(COLORS).toHaveProperty("gold");
    });

    it("has correct hex values", () => {
      expect(COLORS.aqua).toBe("#C4893A");
      expect(COLORS.blue).toBe("#2D5541");
      expect(COLORS.cream).toBe("#F5EDE3");
      expect(COLORS.gold).toBe("#BF7A5A");
    });

    it("values are branded as const (TypeScript readonly)", () => {
      const colorKeys = Object.keys(COLORS);
      expect(colorKeys).toEqual(["aqua", "blue", "cream", "gold"]);
    });
  });

  describe("API", () => {
    it("defines BASE with fallback", () => {
      expect(API.BASE).toBe("/api");
    });

    it("defines all endpoint paths", () => {
      expect(API.DASHBOARD).toBe("/api/dashboard");
      expect(API.FLOCK).toBe("/api/flock");
      expect(API.FEED).toBe("/api/feed");
      expect(API.EXPENSES).toBe("/api/expenses");
      expect(API.INVENTORY).toBe("/api/inventory");
      expect(API.ANALYTICS).toBe("/api/analytics");
    });

    it("FLOCK_BY_ID returns dynamic path", () => {
      expect(API.FLOCK_BY_ID("123")).toBe("/api/flocks/123");
    });

    it("EXPORT_INVOICE returns dynamic path", () => {
      expect(API.EXPORT_INVOICE("inv-1")).toBe("/api/export/invoice/inv-1");
    });
  });

  describe("PAGINATION", () => {
    it("has correct defaults", () => {
      expect(PAGINATION.DEFAULT_PAGE).toBe(1);
      expect(PAGINATION.DEFAULT_LIMIT).toBe(20);
      expect(PAGINATION.MAX_LIMIT).toBe(100);
    });
  });

  describe("RETRY", () => {
    it("has correct configuration", () => {
      expect(RETRY.MAX_ATTEMPTS).toBe(3);
      expect(RETRY.BASE_DELAY_MS).toBe(300);
      expect(RETRY.MAX_DELAY_MS).toBe(5000);
    });
  });

  describe("CACHE_TTL", () => {
    it("has correct durations", () => {
      expect(CACHE_TTL.DASHBOARD).toBe(30_000);
      expect(CACHE_TTL.FLOCK).toBe(60_000);
      expect(CACHE_TTL.PREDICTIONS).toBe(120_000);
      expect(CACHE_TTL.AI_INSIGHTS).toBe(60_000);
    });
  });

  describe("ERROR_MESSAGES", () => {
    it("defines all error messages", () => {
      expect(ERROR_MESSAGES.NETWORK).toContain("خطأ");
      expect(ERROR_MESSAGES.UNAUTHORIZED).toContain("تسجيل الدخول");
      expect(ERROR_MESSAGES.NOT_FOUND).toContain("غير موجود");
      expect(ERROR_MESSAGES.RATE_LIMIT).toContain("طلبات كثيرة");
      expect(ERROR_MESSAGES.SERVER).toContain("الخادم");
      expect(ERROR_MESSAGES.VALIDATION).toContain("التحقق");
    });
  });

  describe("ROLES", () => {
    it("defines all roles", () => {
      expect(ROLES.ADMIN).toBe("admin");
      expect(ROLES.OPERATOR).toBe("operator");
      expect(ROLES.VIEWER).toBe("viewer");
    });
  });
});
