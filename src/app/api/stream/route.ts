import { NextRequest } from "next/server";
import { COLORS } from "@/constants";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function sse(data: string): string {
  return `data: ${data}\n\n`;
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      // initial snapshot
      const sendMetric = () => {
        if (closed) return;
        const payload = {
          type: "metric_update" as const,
          payload: {
            id: `metric-${Date.now()}`,
            mortality: (2.3 + (Math.random() - 0.5) * 0.2).toFixed(1),
            feedConversion: (1.68 + (Math.random() - 0.5) * 0.04).toFixed(2),
            healthScore: (96.4 + (Math.random() - 0.5) * 0.6).toFixed(1),
            profitMargin: (34.2 + (Math.random() - 0.5) * 0.8).toFixed(1),
          },
          timestamp: new Date().toISOString(),
        };
        try {
          controller.enqueue(encoder.encode(sse(JSON.stringify(payload))));
        } catch { /* ignore */ }
      };

      // push every 5 seconds like a real IoT stream
      sendMetric();
      const interval = setInterval(sendMetric, 5000);

      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "Access-Control-Allow-Origin": process.env.NODE_ENV === "production" 
        ? "https://poultrix.app" 
        : "http://localhost:3000",
    },
  });
}
