import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import InventoryPage from "@/app/dashboard/inventory/page";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: { items: [] }, error: null }),
    post: vi.fn(),
    invalidate: vi.fn(),
  },
}));

describe("InventoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    const { container } = render(<InventoryPage />);
    await waitFor(() => {
      expect(container.querySelector("div")).toBeTruthy();
    });
  });

  it("renders the hero section with inventory badge", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByText("إدارة المخزون")).toBeTruthy();
    });
  });

  it("renders the inventory list heading", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByText("قائمة المخزون")).toBeTruthy();
    });
  });

  it("renders the add item button", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByText("إضافة صنف")).toBeTruthy();
    });
  });

  it("renders stat cards", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByText("إجمالي الأصناف")).toBeTruthy();
      expect(screen.getByText("مخزون حرج")).toBeTruthy();
      expect(screen.getByText("إنذار")).toBeTruthy();
      expect(screen.getByText("القيمة الإجمالية")).toBeTruthy();
    });
  });

  it("renders filter buttons", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByText("الكل")).toBeTruthy();
      expect(screen.getByText("العلف")).toBeTruthy();
      expect(screen.getByText("الأدوية")).toBeTruthy();
      expect(screen.getByText("المعدات")).toBeTruthy();
      expect(screen.getByText("المستلزمات")).toBeTruthy();
    });
  });

  it("renders the search input", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText("بحث...")).toBeTruthy();
    });
  });

  it("shows 'لا توجد أصناف في المخزون' when there are no items", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByText("لا توجد أصناف في المخزون")).toBeTruthy();
    });
  });

  it("renders table headers", async () => {
    render(<InventoryPage />);
    await waitFor(() => {
      expect(screen.getByText("النوع")).toBeTruthy();
      expect(screen.getByText("الاسم")).toBeTruthy();
      expect(screen.getByText("المخزون")).toBeTruthy();
      expect(screen.getByText("الحد الأدنى")).toBeTruthy();
      expect(screen.getByText("سعر الوحدة")).toBeTruthy();
    });
  });
});
