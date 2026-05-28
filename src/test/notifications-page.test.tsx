import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import NotificationsPage from "@/app/dashboard/notifications/page";

describe("NotificationsPage", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ data: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    const { container } = render(<NotificationsPage />);
    await waitFor(() => {
      expect(container.querySelector("div")).toBeTruthy();
    });
  });

  it("renders the heading", async () => {
    render(<NotificationsPage />);
    await waitFor(() => {
      expect(screen.getByText("التنبيهات")).toBeTruthy();
    });
  });

  it("calls fetch on mount with correct URL", async () => {
    render(<NotificationsPage />);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/predictions/alerts");
    });
  });

  it("shows 'كل شيء هادئ' when there are no alerts", async () => {
    render(<NotificationsPage />);
    await waitFor(() => {
      expect(screen.getByText("كل شيء هادئ! لا توجد تنبيهات نشيطة.")).toBeTruthy();
    });
  });

  it("renders filter buttons", async () => {
    render(<NotificationsPage />);
    await waitFor(() => {
      expect(screen.getByText("الكل")).toBeTruthy();
      expect(screen.getByText("عالية")).toBeTruthy();
      expect(screen.getByText("متوسطة")).toBeTruthy();
      expect(screen.getByText("منخفضة")).toBeTruthy();
      expect(screen.getByText("تم التأكيد")).toBeTruthy();
    });
  });

  it("shows 'تنبيهات نشيطة' count when there are unacknowledged alerts", async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: [
            { id: "1", barnId: "B1", type: "temp", severity: "high", message: "High temp", timestamp: new Date().toISOString(), acknowledged: false },
            { id: "2", barnId: "B2", type: "water", severity: "low", message: "Low water", timestamp: new Date().toISOString(), acknowledged: false },
          ],
        }),
    });
    render(<NotificationsPage />);
    await waitFor(() => {
      expect(screen.getByText("2 تنبيهات نشيطة")).toBeTruthy();
    });
  });

  it("renders alert messages when data is present", async () => {
    mockFetch.mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: [
            { id: "1", barnId: "B1", type: "temp", severity: "high", message: "High temperature detected", timestamp: new Date().toISOString(), acknowledged: false },
          ],
        }),
    });
    render(<NotificationsPage />);
    await waitFor(() => {
      expect(screen.getByText("High temperature detected")).toBeTruthy();
    });
  });
});
