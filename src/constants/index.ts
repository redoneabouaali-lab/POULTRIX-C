export const API = {
  BASE: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
  DASHBOARD: "/api/dashboard",
  FLOCK: "/api/flock",
  FEED: "/api/feed",
  PREDICTIONS: "/api/predictions",
  STREAM: "/api/stream",
  EGG_RECORDS: "/api/egg-records",
  EXPENSES: "/api/expenses",
  HEALTH_EVENTS: "/api/health-events",
  STOCKING: "/api/stocking",
  INVENTORY: "/api/inventory",
  PRODUCTS: "/api/products",
  ORDERS: "/api/orders",
  FARMS: "/api/farms",
  FLOCK_BY_ID: (id: string) => `/api/flocks/${id}`,
  INVOICES: "/api/invoices",
  EXPORT_INVOICE: (id: string) => `/api/export/invoice/${id}`,
  ANALYTICS: "/api/analytics",
  BREEDS: "/api/breeds",
  DIAGNOSE: "/api/diagnose",
  CHAT: "/api/chat",
};

export const COLORS = {
  aqua: "#C4893A",
  blue: "#2D5541",
  cream: "#F5EDE3",
  gold: "#BF7A5A",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const RETRY = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 300,
  MAX_DELAY_MS: 5000,
} as const;

export const CACHE_TTL = {
  DASHBOARD: 30_000,
  FLOCK: 60_000,
  PREDICTIONS: 120_000,
  AI_INSIGHTS: 60_000,
} as const;

export const ERROR_MESSAGES = {
  NETWORK: "خطأ في الشبكة. تحقق من اتصالك بالإنترنت.",
  UNAUTHORIZED: "انتهت الجلسة. الرجاء تسجيل الدخول مرة أخرى.",
  NOT_FOUND: "الملف المطلوب غير موجود.",
  RATE_LIMIT: "طلبات كثيرة. الرجاء التهدئة قليلاً.",
  SERVER: "خطأ داخلي في الخادم. تم إبلاغ الفريق التقني.",
  VALIDATION: "بيانات غير صالحة. الرجاء التحقق من المدخلات.",
} as const;

export const ROLES = {
  ADMIN: "admin",
  OPERATOR: "operator",
  VIEWER: "viewer",
} as const;
