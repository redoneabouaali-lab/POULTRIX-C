import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import SalesPage from "@/app/dashboard/sales/page";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [], error: null }),
    post: vi.fn(),
    invalidate: vi.fn(),
  },
}));

describe("SalesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    const { container } = render(<SalesPage />);
    await waitFor(() => {
      expect(container.querySelector("div")).toBeTruthy();
    });
  });

  it("renders the hero section with sales badge", async () => {
    render(<SalesPage />);
    await waitFor(() => {
      expect(screen.getByText("المبيعات")).toBeTruthy();
    });
  });

  it("renders stat cards", async () => {
    render(<SalesPage />);
    await waitFor(() => {
      expect(screen.getByText("المنتجات المتاحة")).toBeTruthy();
      expect(screen.getByText("الطلبات المعلقة")).toBeTruthy();
      expect(screen.getByText("المبيعات المدفوعة")).toBeTruthy();
      expect(screen.getByText("المبيعات غير المحصلة")).toBeTruthy();
    });
  });

  it("renders both tabs", async () => {
    render(<SalesPage />);
    await waitFor(() => {
      const productsTabs = screen.getAllByText("المنتجات");
      expect(productsTabs.length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("الطلبات").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the search input with placeholder", async () => {
    render(<SalesPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText("بحث في المنتجات...")).toBeTruthy();
    });
  });

  it("shows 'لا توجد منتجات' when there are no products", async () => {
    render(<SalesPage />);
    await waitFor(() => {
      expect(screen.getByText("لا توجد منتجات")).toBeTruthy();
    });
  });

  it("renders products table headers", async () => {
    render(<SalesPage />);
    await waitFor(() => {
      expect(screen.getByText("الاسم")).toBeTruthy();
      expect(screen.getByText("النوع")).toBeTruthy();
      expect(screen.getByText("الكمية")).toBeTruthy();
      expect(screen.getByText("السعر")).toBeTruthy();
      expect(screen.getByText("الجودة")).toBeTruthy();
      expect(screen.getByText("الحالة")).toBeTruthy();
    });
  });

  it("switches to orders tab and shows empty state", async () => {
    render(<SalesPage />);
    const ordersButtons = await screen.findAllByText("الطلبات");
    const ordersTab = ordersButtons[0];
    ordersTab.click();
    await waitFor(() => {
      expect(screen.getByText("لا توجد طلبات")).toBeTruthy();
    });
  });
});
