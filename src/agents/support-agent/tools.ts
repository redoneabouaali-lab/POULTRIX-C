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

export const addFlockTool = {
  name: "add_flock",
  description: "Add a new chicken batch/flock. VALIDATE all required fields before calling. Required: name, breed, totalBirds, avgAge. If any missing, tell user what's missing and ask them to provide it.",
  parameters: z.object({
    name: z.string().describe("Flock/batch name in Arabic, e.g. 'القطيع أ-42'"),
    breed: z.string().describe("Breed name, e.g. 'Cobb 500', 'Ross 308', 'ISA Brown'"),
    totalBirds: z.number().describe("Total number of birds in this batch"),
    avgAge: z.number().describe("Average age of birds in days"),
    houseShedId: z.string().optional().describe("Barn/house name or ID, e.g. 'العنبر 1'"),
    notes: z.string().optional().describe("Additional notes about the flock"),
    healthScore: z.number().optional().describe("Initial health score (0-100), default 100"),
  }),
};

export const recordEggsTool = {
  name: "record_eggs",
  description: "Record egg production for a flock. VALIDATE before calling: flockId, quantity required. If missing, tell user what to provide.",
  parameters: z.object({
    flockId: z.string().describe("ID of the flock that produced these eggs"),
    quantity: z.number().describe("Total number of eggs collected"),
    pricePerTray: z.number().optional().describe("Price per tray (30 eggs) in DH"),
    broken: z.number().optional().describe("Number of broken eggs"),
    notes: z.string().optional().describe("Additional notes"),
  }),
};

export const addHealthEventTool = {
  name: "add_health_event",
  description: "Record a health/vaccination/disease event for a flock. Required: eventType, description. VALIDATE before calling.",
  parameters: z.object({
    eventType: z.string().describe("Type: 'vaccination', 'medication', 'inspection', 'disease', 'mortality', 'checkup', 'treatment'"),
    description: z.string().describe("Description of what happened"),
    flockId: z.string().optional().describe("Flock ID if this affects a specific batch"),
    birdsAffected: z.number().optional().describe("Number of birds affected"),
    mortalityCount: z.number().optional().describe("Number of deaths if any"),
    cost: z.number().optional().describe("Cost incurred in DH"),
    treatment: z.string().optional().describe("Treatment administered"),
    performedBy: z.string().optional().describe("Who performed the procedure"),
    notes: z.string().optional().describe("Additional notes"),
  }),
};

export const addInventoryItemTool = {
  name: "add_inventory_item",
  description: "Add a new item to inventory. Required: type, name, quantity, unit, cost, minimumThreshold. VALIDATE before calling.",
  parameters: z.object({
    type: z.string().describe("Item type: 'feed', 'medicine', 'equipment', 'supplies'"),
    name: z.string().describe("Item name in Arabic"),
    quantity: z.number().describe("Quantity to add"),
    unit: z.string().describe("Unit: 'كغ', 'لتر', 'قطعة', 'علبة', 'كيس'"),
    cost: z.number().describe("Cost per unit in DH"),
    minimumThreshold: z.number().describe("Minimum stock level before reorder alert"),
    supplier: z.string().optional().describe("Supplier name"),
    expiryDate: z.string().optional().describe("Expiry date YYYY-MM-DD"),
    notes: z.string().optional().describe("Additional notes"),
  }),
};

export const addExpenseTool = {
  name: "add_expense",
  description: "Record a new expense. Required: amount, expenseDate, category. VALIDATE before calling.",
  parameters: z.object({
    amount: z.number().describe("Expense amount in DH"),
    expenseDate: z.string().describe("Date of expense YYYY-MM-DD"),
    category: z.string().describe("أعلاف / أدوية / تجهيزات / صيانة / كهرباء / مياه / نقل / عمالة / أخرى"),
    description: z.string().optional().describe("Description of the expense"),
    paymentMethod: z.string().optional().describe("cash / bank_transfer / cheque / card"),
    flockId: z.string().optional().describe("Flock ID if expense is for a specific batch"),
    notes: z.string().optional().describe("Additional notes"),
  }),
};

export const recordStockingTool = {
  name: "record_stocking",
  description: "Record a stocking change (add/remove birds) for a flock. Required: flockId. VALIDATE before calling.",
  parameters: z.object({
    flockId: z.string().describe("ID of the flock"),
    birdsAdded: z.number().optional().describe("Number of birds added"),
    birdsRemoved: z.number().optional().describe("Number of birds removed"),
    mortality: z.number().optional().describe("Number of bird deaths"),
    notes: z.string().optional().describe("Additional notes"),
  }),
};

export const addProductTool = {
  name: "add_product",
  description: "Add a new product for sale. Required: name, type, quantity, price. VALIDATE before calling.",
  parameters: z.object({
    name: z.string().describe("Product name in Arabic"),
    type: z.string().describe("Product type: 'eggs', 'meat', 'chicks', 'manure'"),
    quantity: z.number().describe("Quantity available"),
    price: z.number().describe("Selling price per unit in DH"),
    quality: z.string().optional().describe("Quality grade: 'premium', 'standard', 'economy'"),
    batchNumber: z.string().optional().describe("Batch number"),
    notes: z.string().optional().describe("Additional notes"),
  }),
};

export const createOrderTool = {
  name: "create_order",
  description: "Create a new customer order. Required: customerName, items array with productId, quantity, price each. VALIDATE before calling.",
  parameters: z.object({
    customerName: z.string().describe("Customer name"),
    totalAmount: z.number().describe("Total order amount in DH"),
    items: z.array(z.object({
      productId: z.string(),
      productName: z.string().optional(),
      quantity: z.number(),
      price: z.number(),
    })).describe("Array of ordered items"),
    deliveryAddress: z.string().optional().describe("Delivery address"),
    notes: z.string().optional().describe("Additional notes"),
  }),
};

export const queryDataTool = {
  name: "query_data",
  description: "Query any farm data: flocks, eggs, inventory, health events, expenses, stocking, products, orders, invoices. Use this to look up data before creating/updating. E.g. 'show me all flocks', 'list inventory items', 'what health events happened?'",
  parameters: z.object({
    endpoint: z.string().describe("API endpoint to query: 'flock', 'egg-records', 'health-events', 'inventory', 'expenses', 'stocking', 'products', 'orders', 'invoices'"),
  }),
};

export const ALL_TOOLS = [
  dashboardTool, flockTool, financialTool, predictionsTool, alertsTool, insightsTool,
  addFlockTool, recordEggsTool, addHealthEventTool, addInventoryItemTool, addExpenseTool,
  recordStockingTool, addProductTool, createOrderTool, queryDataTool,
];

export async function executeTool(name: string, args: any = {}): Promise<string> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  const writeEndpoints: Record<string, string> = {
    add_flock: "/flock",
    record_eggs: "/egg-records",
    add_health_event: "/health-events",
    add_inventory_item: "/inventory",
    add_expense: "/expenses",
    record_stocking: "/stocking",
    add_product: "/products",
    create_order: "/orders",
  };

  if (name === "query_data" && args.endpoint) {
    const ALLOWED_ENDPOINTS = ['flock', 'egg-records', 'health-events', 'inventory', 'expenses', 'stocking', 'products', 'orders', 'invoices'];
    if (!ALLOWED_ENDPOINTS.includes(args.endpoint)) {
      return JSON.stringify({ error: "Endpoint not allowed" });
    }
    try {
      const res = await fetch(`${base}/${args.endpoint}`, { headers });
      if (!res.headers.get('content-type')?.includes('json')) {
        const text = await res.text();
        return JSON.stringify({ error: `Non-JSON response: ${text.slice(0, 200)}` });
      }
      const data = await res.json();
      return JSON.stringify(data.data || data);
    } catch (e) {
      return JSON.stringify({ error: String(e) });
    }
  }

  if (writeEndpoints[name]) {
    try {
      const res = await fetch(`${base}${writeEndpoints[name]}`, {
        method: "POST", headers, body: JSON.stringify(args),
      });
      if (!res.headers.get('content-type')?.includes('json')) {
        const text = await res.text();
        return JSON.stringify({ error: `Non-JSON response: ${text.slice(0, 200)}` });
      }
      const data = await res.json();
      return JSON.stringify(data.data || data);
    } catch (e) {
      return JSON.stringify({ error: String(e) });
    }
  }

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
    if (!res.headers.get('content-type')?.includes('json')) {
      const text = await res.text();
      return JSON.stringify({ error: `Non-JSON response: ${text.slice(0, 200)}` });
    }
    const data = await res.json();
    return JSON.stringify(data.data || data);
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}
