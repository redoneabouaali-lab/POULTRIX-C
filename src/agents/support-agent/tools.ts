import { z } from "zod";

export const dashboardTool = {
  name: "get_dashboard",
  description: "Get live dashboard metrics: mortality rate, feed efficiency, flock health, profit margin",
  parameters: z.object({}),
};

export const flockTool = {
  name: "get_flock",
  description: "Get flock summary: total birds, active barns, average age, breed, health score",
  parameters: z.object({}),
};

export const financialTool = {
  name: "get_financial",
  description: "Get financial snapshot: daily feed cost, daily water cost, projected revenue, profit margin",
  parameters: z.object({}),
};

export const predictionsTool = {
  name: "get_predictions",
  description: "Get AI mortality predictions with risk levels and recommendations for each barn",
  parameters: z.object({}),
};

export const alertsTool = {
  name: "get_alerts",
  description: "Get active barn alerts: temperature, feed, water issues",
  parameters: z.object({}),
};

export const insightsTool = {
  name: "get_insights",
  description: "Get AI insights and recommendations based on current farm data",
  parameters: z.object({}),
};

export const ALL_TOOLS = [
  dashboardTool,
  flockTool,
  financialTool,
  predictionsTool,
  alertsTool,
  insightsTool,
];

export async function executeTool(name: string): Promise<string> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  let url = base;
  switch (name) {
    case "get_dashboard": url += "/dashboard"; break;
    case "get_flock": url += "/flock"; break;
    case "get_financial": url += "/dashboard/financial"; break;
    case "get_predictions": url += "/predictions"; break;
    case "get_alerts": url += "/predictions/alerts"; break;
    case "get_insights": url += "/dashboard/insights"; break;
    default: return JSON.stringify({ error: `Unknown tool: ${name}` });
  }

  try {
    const res = await fetch(url, { headers });
    const data = await res.json();
    return JSON.stringify(data.data || data);
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}
