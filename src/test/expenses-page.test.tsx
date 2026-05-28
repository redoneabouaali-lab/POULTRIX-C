import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ExpensesPage from "@/app/dashboard/expenses/page";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: { items: [] }, error: null }),
    post: vi.fn(),
    invalidate: vi.fn(),
  },
}));

describe("ExpensesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    const { container } = render(<ExpensesPage />);
    await waitFor(() => {
      expect(container.querySelector("div")).toBeTruthy();
    });
  });

  it("renders the hero section with expenses badge", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("المصروفات")).toBeTruthy();
    });
  });

  it("renders the expenses log heading", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("سجل المصروفات")).toBeTruthy();
    });
  });

  it("renders the add expense button", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("إضافة مصروف")).toBeTruthy();
    });
  });

  it("renders stat cards", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getAllByText("إجمالي المصروفات").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("هذا الشهر")).toBeTruthy();
      expect(screen.getByText("عدد المعاملات")).toBeTruthy();
      expect(screen.getByText("أكبر فئة")).toBeTruthy();
    });
  });

  it("renders the category distribution chart heading", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("توزيع المصروفات حسب الفئة")).toBeTruthy();
    });
  });

  it("renders filter buttons", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("الكل")).toBeTruthy();
      expect(screen.getByText("الكهرباء")).toBeTruthy();
      expect(screen.getByText("الدواجن")).toBeTruthy();
      expect(screen.getByText("العلاج")).toBeTruthy();
      expect(screen.getByText("الصيانة")).toBeTruthy();
    });
  });

  it("shows 'لا توجد مصروفات مسجلة' when there are no expenses", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("لا توجد مصروفات مسجلة")).toBeTruthy();
    });
  });

  it("renders table headers", async () => {
    render(<ExpensesPage />);
    await waitFor(() => {
      expect(screen.getByText("التاريخ")).toBeTruthy();
      expect(screen.getByText("الفئة")).toBeTruthy();
      expect(screen.getByText("الوصف")).toBeTruthy();
      expect(screen.getByText("المبلغ")).toBeTruthy();
      expect(screen.getByText("طريقة الدفع")).toBeTruthy();
    });
  });
});
