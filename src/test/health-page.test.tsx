import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import HealthPage from "@/app/dashboard/health/page";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn().mockResolvedValue({ data: [], error: null }),
    post: vi.fn(),
    invalidate: vi.fn(),
  },
}));

describe("HealthPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    const { container } = render(<HealthPage />);
    await waitFor(() => {
      expect(container.querySelector("div")).toBeTruthy();
    });
  });

  it("renders the hero section with veterinary health badge", async () => {
    render(<HealthPage />);
    await waitFor(() => {
      expect(screen.getByText("الصحة البيطرية")).toBeTruthy();
    });
  });

  it("renders the events log table heading", async () => {
    render(<HealthPage />);
    await waitFor(() => {
      expect(screen.getByText("سجل الأحداث الصحية")).toBeTruthy();
    });
  });

  it("renders the add event button", async () => {
    render(<HealthPage />);
    await waitFor(() => {
      expect(screen.getByText("تسجيل حدث")).toBeTruthy();
    });
  });

  it("renders stat cards", async () => {
    render(<HealthPage />);
    await waitFor(() => {
      expect(screen.getByText("إجمالي الأحداث")).toBeTruthy();
      expect(screen.getByText("آخر 7 أيام")).toBeTruthy();
      expect(screen.getByText("إجمالي النفوق")).toBeTruthy();
      expect(screen.getByText("التكاليف")).toBeTruthy();
    });
  });

  it("renders filter buttons", async () => {
    render(<HealthPage />);
    await waitFor(() => {
      expect(screen.getByText("الكل")).toBeTruthy();
      expect(screen.getByText("تطعيم")).toBeTruthy();
      expect(screen.getByText("مرض")).toBeTruthy();
      expect(screen.getByText("تفتيش")).toBeTruthy();
      expect(screen.getByText("دواء")).toBeTruthy();
      expect(screen.getByText("نفوق")).toBeTruthy();
    });
  });

  it("renders the search input", async () => {
    render(<HealthPage />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText("بحث...")).toBeTruthy();
    });
  });

  it("shows 'لا توجد أحداث صحية مسجلة' when there are no events", async () => {
    render(<HealthPage />);
    await waitFor(() => {
      expect(screen.getByText("لا توجد أحداث صحية مسجلة")).toBeTruthy();
    });
  });
});
