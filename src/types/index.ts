export type MetricTrend = "up" | "down" | "stable";
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type AlertType = "feed" | "water" | "temp" | "humidity" | "mortality" | "egg";
export type FlockStatus = "active" | "sold" | "depopulated" | "completed";
export type InventoryType = "feed" | "medicine" | "equipment" | "supplies";
export type ProductType = "eggs" | "meat" | "chicks" | "manure";
export type QualityGrade = "premium" | "standard" | "economy";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";
export type HealthEventType =
  | "vaccination"
  | "medication"
  | "inspection"
  | "disease"
  | "injury"
  | "mortality"
  | "checkup"
  | "treatment";
export type TransactionType = "sale" | "purchase" | "expense" | "investment";

export interface Farm {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  currentStock?: number;
  licenseNumber?: string;
  certifications: string[];
  employeeCount?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  farmId: string;
  createdAt: string;
}

export interface Flock {
  id: string;
  farmId: string;
  name: string;
  breed: string;
  customBreed?: string;
  status: FlockStatus;
  totalBirds: number;
  avgAge: number;
  healthScore?: number;
  houseShedId?: string;
  notes?: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeedReceipt {
  id: string;
  farmId: string;
  flockId?: string;
  dateReceived: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  feedType?: string;
  receiptImage?: string;
  notes?: string;
  createdAt: string;
}

export interface EggRecord {
  id: string;
  farmId: string;
  flockId: string;
  recordDate: string;
  quantity: number;
  eggsPerTray: number;
  trays?: number;
  pricePerTray?: number;
  totalRevenue?: number;
  sold: boolean;
  notes?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  farmId: string;
  flockId?: string;
  expenseDate: string;
  category?: string;
  description?: string;
  amount: number;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface HealthEvent {
  id: string;
  farmId: string;
  flockId?: string;
  eventDate: string;
  eventType: HealthEventType;
  description?: string;
  birdsAffected?: number;
  mortalityCount?: number;
  cost?: number;
  treatment?: string;
  performedBy?: string;
  nextFollowUp?: string;
  notes?: string;
  createdAt: string;
}

export interface StockingRecord {
  id: string;
  farmId: string;
  flockId: string;
  recordDate: string;
  birdsAdded?: number;
  birdsRemoved?: number;
  mortality?: number;
  currentBirdCount?: number;
  notes?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  farmId: string;
  type: InventoryType;
  name: string;
  quantity: number;
  unit: string;
  minimumThreshold: number;
  cost: number;
  supplier?: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  farmId: string;
  name: string;
  type: ProductType;
  quantity: number;
  price: number;
  available: boolean;
  quality: QualityGrade;
  batchNumber?: string;
  productionDate: string;
  expiryDate?: string;
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  farmId: string;
  customerId?: string;
  customerName?: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress?: string;
  deliveryDate?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: MetricTrend;
  bar: number;
  unit?: string;
  color: string;
}

export interface FlockSummary {
  totalBirds: number;
  activeBarns: number;
  avgAge: number;
  breed: string;
  healthScore: number;
}

export interface MortalityPrediction {
  id: string;
  farmId: string;
  flockId?: string;
  riskLevel: Severity;
  probability: number;
  predictedAt: string;
  affectedCohort?: string;
  recommendation?: string;
  confidence: number;
}

export interface BarnAlert {
  id: string;
  farmId: string;
  flockId?: string;
  barnId?: string;
  type: AlertType;
  severity: Severity;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface FinancialSnapshot {
  id: string;
  farmId: string;
  dailyFeedCost: number;
  dailyWaterCost: number;
  projectedRevenue: number;
  profitMargin: number;
  marginTrend: MetricTrend;
  yoyGrowth: number;
  costPerBird?: number;
  breakEvenPrice?: number;
  roi?: number;
  feedCostPercentage?: number;
  laborCost?: number;
  medicationCost?: number;
  utilitiesCost?: number;
  period?: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  farmId: string;
  flockId?: string;
  type: "prediction" | "recommendation" | "alert" | "opportunity";
  severity: Severity;
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  createdAt: string;
}

export interface RealtimeEvent {
  type: "metric_update" | "alert" | "prediction" | "flock_change";
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "operator" | "viewer";
    farmId: string;
  };
  accessToken: string;
  expiresAt: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  meta: {
    timestamp: string;
    version: string;
    cached: boolean;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AnalyticsReport {
  period: string;
  mortalityRate: number;
  feedConversionRatio: number;
  productionRate: number;
  revenue: number;
  expenses: number;
  profitMargin: number;
  revenueHistory: { date: string; amount: number }[];
  expenseBreakdown: { category: string; amount: number }[];
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  farmId: string;
  number: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  paidAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
