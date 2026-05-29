import { z } from "zod";
import { NextResponse } from "next/server";

import { GET as getDashboardHandler } from "@/modules/chickens/api/dashboard-handler";
import { GET as getFlockHandler, POST as postFlockHandler } from "@/modules/chickens/api/flock-handler";
import { GET as getEggRecordsHandler, POST as postEggRecordsHandler } from "@/modules/chickens/api/egg-records-handler";
import { GET as getHealthEventsHandler, POST as postHealthEventsHandler } from "@/modules/chickens/api/health-events-handler";
import { GET as getInventoryHandler, POST as postInventoryHandler } from "@/modules/chickens/api/inventory-handler";
import { GET as getExpensesHandler, POST as postExpensesHandler } from "@/modules/finance/api/expenses-handler";
import { GET as getStockingHandler, POST as postStockingHandler } from "@/modules/chickens/api/stocking-handler";
import { GET as getProductsHandler, POST as postProductsHandler } from "@/modules/finance/api/products-handler";
import { GET as getOrdersHandler, POST as postOrdersHandler } from "@/modules/finance/api/orders-handler";
import { GET as getInvoicesHandler, POST as postInvoicesHandler } from "@/modules/finance/api/invoices-handler";
import { GET as getPredictionsHandler } from "@/modules/analytics/api/predictions-handler";

async function callHandler(handler: (req: Request) => Promise<NextResponse>, method: string, body?: any): Promise<string> {
  try {
    const req = new Request("http://localhost/api", {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const res = await handler(req);
    if (!res.ok) {
      const data = await res.json();
      return JSON.stringify({ error: data.error || `HTTP ${res.status}` });
    }
    const data = await res.json();
    return JSON.stringify(data.data || data);
  } catch (e) {
    return JSON.stringify({ error: String(e) });
  }
}

const readHandlers: Record<string, () => Promise<NextResponse>> = {
  flock: getFlockHandler,
  "egg-records": getEggRecordsHandler,
  "health-events": getHealthEventsHandler,
  inventory: getInventoryHandler,
  expenses: getExpensesHandler,
  stocking: getStockingHandler,
  products: getProductsHandler,
  orders: getOrdersHandler,
  invoices: getInvoicesHandler,
};

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

const ALLOWED_ENDPOINTS = ['flock', 'egg-records', 'health-events', 'inventory', 'expenses', 'stocking', 'products', 'orders', 'invoices'];

export async function executeTool(name: string, args: any = {}): Promise<string> {
  switch (name) {
    case "get_dashboard":
      return callHandler(getDashboardHandler, "GET");

    case "get_financial": {
      const { GET } = await import("@/app/api/dashboard/financial/route");
      return callHandler(GET, "GET");
    }

    case "get_insights": {
      const { GET } = await import("@/app/api/dashboard/insights/route");
      return callHandler(GET, "GET");
    }

    case "get_alerts": {
      const { GET } = await import("@/app/api/predictions/alerts/route");
      return callHandler(GET, "GET");
    }

    case "get_flock":
      return callHandler(getFlockHandler, "GET");

    case "get_predictions":
      return callHandler(getPredictionsHandler, "GET");

    case "add_flock":
      return callHandler(postFlockHandler, "POST", args);

    case "record_eggs":
      return callHandler(postEggRecordsHandler, "POST", args);

    case "add_health_event":
      return callHandler(postHealthEventsHandler, "POST", args);

    case "add_inventory_item":
      return callHandler(postInventoryHandler, "POST", args);

    case "add_expense":
      return callHandler(postExpensesHandler, "POST", args);

    case "record_stocking":
      return callHandler(postStockingHandler, "POST", args);

    case "add_product":
      return callHandler(postProductsHandler, "POST", args);

    case "create_order":
      return callHandler(postOrdersHandler, "POST", args);

    case "query_data": {
      if (!args.endpoint) return JSON.stringify({ error: "Endpoint required" });
      if (!ALLOWED_ENDPOINTS.includes(args.endpoint)) return JSON.stringify({ error: "Endpoint not allowed" });
      const h = readHandlers[args.endpoint];
      if (!h) return JSON.stringify({ error: `No handler for endpoint: ${args.endpoint}` });
      return callHandler(h, "GET");
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
