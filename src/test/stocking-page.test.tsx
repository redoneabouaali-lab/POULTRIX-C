import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import StockingPage from "@/app/dashboard/stocking/page";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [], error: null }),
    post: vi.fn(),
    invalidate: vi.fn(),
  },
}));

describe("StockingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    const { container } = render(<StockingPage />);
    await waitFor(() => {
      expect(container.querySelector("div")).toBeTruthy();
    });
  });

  it("renders the hero section with flock tracking badge", async () => {
    render(<StockingPage />);
    await waitFor(() => {
      expect(screen.getByText("تتبع القطيع")).toBeTruthy();
    });
  });

  it("renders the stock records heading", async () => {
    render(<StockingPage />);
    await waitFor(() => {
      expect(screen.getByText("سجل الجرد")).toBeTruthy();
    });
  });

  it("renders the add record button", async () => {
    render(<StockingPage />);
    await waitFor(() => {
      expect(screen.getByText("تسجيل جرد")).toBeTruthy();
    });
  });

  it("renders stat cards", async () => {
    render(<StockingPage />);
    await waitFor(() => {
      expect(screen.getAllByText("العدد الحالي").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("إجمالي المضاف")).toBeTruthy();
      expect(screen.getByText("إجمالي المباع")).toBeTruthy();
      expect(screen.getAllByText("نفوق").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the flock filter label", async () => {
    render(<StockingPage />);
    await waitFor(() => {
      expect(screen.getByText("الدفعة:")).toBeTruthy();
    });
  });

  it("shows 'لا توجد سجلات جرد' when there are no records", async () => {
    render(<StockingPage />);
    await waitFor(() => {
      expect(screen.getByText("لا توجد سجلات جرد")).toBeTruthy();
    });
  });

  it("renders table headers", async () => {
    render(<StockingPage />);
    await waitFor(() => {
      expect(screen.getByText("التاريخ")).toBeTruthy();
      expect(screen.getByText("الدفعة")).toBeTruthy();
      expect(screen.getByText("مضاف")).toBeTruthy();
      expect(screen.getByText("مباع")).toBeTruthy();
      expect(screen.getAllByText("نفوق").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("العدد الحالي").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("ملاحظات")).toBeTruthy();
    });
  });
});
