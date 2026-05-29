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
import { GET as getFeedHandler, POST as postFeedHandler } from "@/modules/chickens/api/feed-handler";
import { GET as getAnalyticsHandler } from "@/modules/analytics/api/analytics-handler";
import { GET as getFarmHandler, PUT as putFarmHandler } from "@/modules/settings/api/farm-profile-handler";
import { PATCH as patchFlockHandler } from "@/modules/chickens/api/flock-handler";

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

export const navigateTool = {
  name: "navigate_to",
  description: "Navigate the user to a specific page in the dashboard. E.g. '/dashboard/chickens', '/dashboard/feed', '/dashboard/analytics', '/dashboard/finance', '/dashboard/eggs', '/dashboard/health', '/dashboard/inventory', '/dashboard/sales', '/dashboard/expenses', '/dashboard/stocking', '/dashboard/breeds', '/dashboard/articles', '/dashboard/notifications', '/dashboard/reports', '/dashboard/settings'",
  parameters: z.object({
    path: z.string().describe("Dashboard path to navigate to, e.g. '/dashboard/chickens'"),
  }),
};
export const sendAlertTool = {
  name: "send_alert",
  description: "Show an alert notification to the user on screen. Use for important warnings (high mortality, low feed, high costs).",
  parameters: z.object({
    message: z.string().describe("Alert message text in Arabic/Darija"),
    type: z.string().optional().describe("Alert type: 'info', 'warning', 'error', 'success'. Default 'info'"),
  }),
};
export const refreshPageTool = {
  name: "refresh_page",
  description: "Refresh the current page data without full reload. Use after adding/updating data so user sees latest.",
  parameters: z.object({}),
};
export const feedDataTool = {
  name: "get_feed_data",
  description: "Get complete feed management data: stock levels, daily consumption, feed receipts, low stock alerts, FCR, feed cost per bird",
  parameters: z.object({}),
};
export const analyticsTool = {
  name: "get_analytics",
  description: "Get comprehensive analytics: mortality trend, egg production over time, revenue history, expense breakdown, KPI report",
  parameters: z.object({}),
};
export const farmProfileTool = {
  name: "get_farm_profile",
  description: "Get farm profile information: name, location, capacity, current stock, certifications, employee count",
  parameters: z.object({}),
};
export const updateFarmProfileTool = {
  name: "update_farm_profile",
  description: "Update farm profile information. Fields you can update: name, location, capacity, description, employeeCount, licenseNumber, certifications",
  parameters: z.object({
    name: z.string().optional().describe("Farm name in Arabic"),
    location: z.string().optional().describe("Location address"),
    capacity: z.number().optional().describe("Maximum bird capacity"),
    description: z.string().optional().describe("Farm description"),
    employeeCount: z.number().optional().describe("Number of employees"),
  }),
};
export const updateFlockTool = {
  name: "update_flock",
  description: "Update an existing flock's data. Required: id (flock ID). Optional fields to update: name, breed, totalBirds, avgAge, healthScore, status, houseShedId, notes. First use get_flock or query_data to find the flock ID.",
  parameters: z.object({
    id: z.string().describe("Flock ID to update, e.g. 'flock-001'"),
    name: z.string().optional().describe("New flock name"),
    breed: z.string().optional().describe("New breed"),
    totalBirds: z.number().optional().describe("New total bird count"),
    avgAge: z.number().optional().describe("New average age in days"),
    healthScore: z.number().optional().describe("New health score (0-100)"),
    status: z.string().optional().describe("New status: 'active', 'sold', 'depopulated'"),
    houseShedId: z.string().optional().describe("New barn/house name"),
    notes: z.string().optional().describe("New notes"),
  }),
};
export const profitAnalysisTool = {
  name: "calculate_profit_analysis",
  description: "Calculate profit analysis across the whole farm. Combines flock data, feed costs, expenses, egg revenue, and sales to compute FCR, cost per bird, profit margin, revenue, and ROI.",
  parameters: z.object({}),
};
export const whatCanIDoTool = {
  name: "what_can_i_do",
  description: "Show the user a complete list of everything the AI can do. Returns categorized capabilities: flock management, egg recording, health tracking, feed/inventory, finances, sales, analytics, navigation, alerts, profiles.",
  parameters: z.object({}),
};

export const ALL_TOOLS = [
  dashboardTool, flockTool, financialTool, predictionsTool, alertsTool, insightsTool,
  addFlockTool, recordEggsTool, addHealthEventTool, addInventoryItemTool, addExpenseTool,
  recordStockingTool, addProductTool, createOrderTool, queryDataTool,
  navigateTool, sendAlertTool, refreshPageTool, feedDataTool, analyticsTool,
  farmProfileTool, updateFarmProfileTool, updateFlockTool, profitAnalysisTool, whatCanIDoTool,
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

    case "navigate_to":
      return JSON.stringify({ success: true, path: args.path });

    case "send_alert":
      return JSON.stringify({ success: true, message: args.message, type: args.type || "info" });

    case "refresh_page":
      return JSON.stringify({ success: true });

    case "get_feed_data":
      return callHandler(getFeedHandler, "GET");

    case "get_analytics":
      return callHandler(getAnalyticsHandler, "GET");

    case "get_farm_profile":
      return callHandler(getFarmHandler, "GET");

    case "update_farm_profile":
      return callHandler(putFarmHandler, "PUT", args);

    case "update_flock":
      return callHandler(patchFlockHandler, "PATCH", args);

    case "calculate_profit_analysis": {
      const [flockStr, expenseStr, eggStr, productStr, orderStr] = await Promise.all([
        callHandler(getFlockHandler, "GET"),
        callHandler(getExpensesHandler, "GET"),
        callHandler(getEggRecordsHandler, "GET"),
        callHandler(getProductsHandler, "GET"),
        callHandler(getOrdersHandler, "GET"),
      ]);
      let flock, expenses, eggs, products, orders;
      try { flock = JSON.parse(flockStr); } catch { flock = []; }
      try { expenses = JSON.parse(expenseStr); } catch { expenses = []; }
      try { eggs = JSON.parse(eggStr); } catch { eggs = []; }
      try { products = JSON.parse(productStr); } catch { products = []; }
      try { orders = JSON.parse(orderStr); } catch { orders = []; }
      const flockArr = Array.isArray(flock) ? flock : Array.isArray(flock?.data) ? flock.data : [];
      const expenseArr = Array.isArray(expenses) ? expenses : Array.isArray(expenses?.data) ? expenses.data : [];
      const eggArr = Array.isArray(eggs) ? eggs : Array.isArray(eggs?.data) ? eggs.data : [];
      const productArr = Array.isArray(products) ? products : Array.isArray(products?.data) ? products.data : [];
      const orderArr = Array.isArray(orders) ? orders : Array.isArray(orders?.data) ? orders.data : [];
      const totalBirds = flockArr.reduce((s: number, f: any) => s + (f.totalBirds || 0), 0);
      const totalExpenses = expenseArr.reduce((s: number, e: any) => s + (e.amount || 0), 0);
      const totalEggs = eggArr.reduce((s: number, e: any) => s + (e.quantity || 0), 0);
      const totalRevenue = orderArr.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);
      const avgCostPerBird = totalBirds > 0 ? totalExpenses / totalBirds : 0;
      const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100) : 0;
      return JSON.stringify({
        totalBirds, totalExpenses, totalRevenue, totalEggs,
        avgCostPerBird: +avgCostPerBird.toFixed(2),
        profitMargin: +profitMargin.toFixed(2),
        activeProducts: productArr.length,
        totalOrders: orderArr.length,
        flocksCount: flockArr.length,
        flocks: flockArr,
      });
    }

    case "what_can_i_do":
      return JSON.stringify({
        categories: [
          { name: "🐔 إدارة القطيع", tools: ["add_flock", "get_flock", "update_flock", "record_stocking"] },
          { name: "🥚 البيض", tools: ["record_eggs"] },
          { name: "💉 الصحة", tools: ["add_health_event"] },
          { name: "🌾 العلف والمخزون", tools: ["add_inventory_item", "get_feed_data"] },
          { name: "💰 المالية", tools: ["add_expense", "get_financial", "calculate_profit_analysis"] },
          { name: "🛒 المبيعات", tools: ["add_product", "create_order"] },
          { name: "📊 التحليلات", tools: ["get_dashboard", "get_analytics", "get_predictions"] },
          { name: "🧭 التنقل", tools: ["navigate_to"] },
          { name: "🔔 التنبيهات", tools: ["send_alert", "get_alerts"] },
          { name: "🏠 الضيعة", tools: ["get_farm_profile", "update_farm_profile"] },
        ],
      });

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
