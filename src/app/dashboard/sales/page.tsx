"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { ShoppingCart, Package, Plus, X, Loader, Search, DollarSign, TrendingUp, CheckCircle, Clock, Truck, Ban } from "lucide-react";

const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "غشت", "شتنبر", "أكتوبر", "نونبر", "ديسمبر"];
const fmtDate = (s: string) => { if (!s) return "—"; const d = new Date(s); return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`; };
const toDH = (n: number) => (n || 0).toLocaleString() + " DH";

const orderStatuses = [
  { value: "pending", label: "قيد الانتظار", icon: Clock, color: "#ff9f0a" },
  { value: "confirmed", label: "مؤكد", icon: CheckCircle, color: "#007aff" },
  { value: "shipped", label: "تم الشحن", icon: Truck, color: "#34c759" },
  { value: "cancelled", label: "ملغي", icon: Ban, color: "#ff3b30" },
];

const productTypes = [
  { value: "eggs", label: "بيض", color: "#C4893A" },
  { value: "meat", label: "لحم", color: "#ff3b30" },
  { value: "manure", label: "سماد", color: "#34c759" },
  { value: "chicks", label: "كتاكيت", color: "#ff9f0a" },
];

export default function SalesPage() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([api.get<any[]>("/api/products"), api.get<any[]>("/api/orders")]).then(([a, b]) => {
      if (a.data) setProducts(a.data);
      if (b.data) setOrders(b.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const available = products.filter(p => p.available).length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0);
    const pendingRevenue = orders.filter(o => o.paymentStatus === "pending").reduce((s, o) => s + o.totalAmount, 0);
    return { available, pendingOrders, totalRevenue, pendingRevenue };
  }, [products, orders]);

  const prodFiltered = useMemo(() => {
    if (!search) return products;
    return products.filter(p => p.name?.includes(search) || p.type?.includes(search));
  }, [products, search]);

  const ordFiltered = useMemo(() => {
    if (!search) return orders;
    return orders.filter(o => o.customerName?.includes(search) || o.id?.includes(search));
  }, [orders, search]);

  const getStatusBadge = (status: string) => {
    const s = orderStatuses.find(x => x.value === status);
    if (!s) return <span>{status}</span>;
    return (
      <span className="flex items-center gap-1.5" style={{ padding: "3px 10px", borderRadius: "8px", background: `${s.color}10`, color: s.color, fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>
        <s.icon size={12} /> {s.label}
      </span>
    );
  };

  const prodBadge = (type: string) => {
    const t = productTypes.find(x => x.value === type);
    return (
      <span style={{ padding: "2px 8px", borderRadius: "6px", background: `${t?.color || "#8e8e93"}12`, color: t?.color || "#8e8e93", fontSize: "0.7rem", fontWeight: 600 }}>
        {t?.label || type}
      </span>
    );
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center" }}>{[1, 2, 3, 4, 5].map(i => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />)}</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: "relative", overflow: "hidden", borderRadius: "20px", marginBottom: "24px", background: "linear-gradient(135deg, #1a1a24 0%, #1a2420 100%)" }}>
        <div style={{ position: "absolute", top: "-30%", left: "60%", transform: "translateX(-50%)", opacity: 0.35, pointerEvents: "none" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.35 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
            <ShoppingCart size={200} style={{ color: "#C4893A" }} />
          </motion.div>
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "6px 12px", borderRadius: "20px", background: "rgba(196,137,58,0.1)" }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: COLORS.gold }}>المبيعات</span>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ height: 2, flex: 1, background: `linear-gradient(90deg, ${COLORS.gold}44, transparent)`, transformOrigin: "right" }} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-black" style={{ color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                {toDH(stats.totalRevenue + stats.pendingRevenue)}
                <span className="text-lg font-semibold" style={{ color: COLORS.gold, marginRight: 8 }}>إجمالي المبيعات</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 6 }}>
                {stats.available} منتج متاح &bull; {stats.pendingOrders} طلب معلق &bull; {toDH(stats.pendingRevenue)} قيد التحصيل
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "المنتجات المتاحة", value: stats.available.toString(), sub: "منتج", color: "#34c759", bg: "#34c75908", border: "#34c75915" },
          { label: "الطلبات المعلقة", value: stats.pendingOrders.toString(), sub: "في انتظار التأكيد", color: "#ff9f0a", bg: "#ff9f0a08", border: "#ff9f0a15" },
          { label: "المبيعات المدفوعة", value: toDH(stats.totalRevenue), sub: "تم التحصيل", color: "#007aff", bg: "#007aff08", border: "#007aff15" },
          { label: "المبيعات غير المحصلة", value: toDH(stats.pendingRevenue), sub: "في انتظار الدفع", color: "#ff3b30", bg: "#ff3b3008", border: "#ff3b3015" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
            style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: `1px solid ${s.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <p className="text-xs" style={{ color: "#8a8a96", marginBottom: 6, fontWeight: 500 }}>{s.label}</p>
            <p className="text-xl font-black tabular-nums font-metric" style={{ color: s.color, lineHeight: 1.1 }}>{s.value}</p>
            <p className="text-[11px]" style={{ color: "#b0b0b8", marginTop: 4 }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#f0f0f2", borderRadius: "12px", padding: "4px", width: "fit-content" }}>
        <button onClick={() => setTab("products")}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "10px", border: "none", background: tab === "products" ? "#fff" : "transparent", color: tab === "products" ? "#1a1a24" : "#8a8a96", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", boxShadow: tab === "products" ? "0 1px 4px rgba(0,0,0,0.06)" : "none", transition: "all 0.15s" }}>
          <Package size={15} /> المنتجات
        </button>
        <button onClick={() => setTab("orders")}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "10px", border: "none", background: tab === "orders" ? "#fff" : "transparent", color: tab === "orders" ? "#1a1a24" : "#8a8a96", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", boxShadow: tab === "orders" ? "0 1px 4px rgba(0,0,0,0.06)" : "none", transition: "all 0.15s" }}>
          <ShoppingCart size={15} /> الطلبات
        </button>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "12px 16px", marginBottom: "16px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", alignItems: "center" }}>
        <Search size={15} style={{ color: "#b0b0b8", marginLeft: 10 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tab === "products" ? "بحث في المنتجات..." : "بحث في الطلبات..."}
          style={{ flex: 1, border: "none", background: "transparent", fontSize: "0.85rem", outline: "none", color: "#1a1a24" }} />
      </motion.div>

      {tab === "products" && (
        <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>المنتجات</span>
              <span style={{ padding: "2px 10px", borderRadius: "10px", background: `${COLORS.gold}10`, color: COLORS.gold, fontSize: "0.7rem", fontWeight: 600 }}>{prodFiltered.length} منتج</span>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                  {["الاسم", "النوع", "الكمية", "السعر", "الجودة", "الصلاحية", "الحالة"].map(h => (
                    <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#b0b0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {prodFiltered.map((p, i) => (
                    <motion.tr key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.015 }} style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                      <td style={{ padding: "11px 16px" }}><span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{p.name}</span></td>
                      <td style={{ padding: "11px 16px" }}>{prodBadge(p.type)}</td>
                      <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: p.quantity > 0 ? "#007aff" : "#ff3b30", fontWeight: 600 }}>{p.quantity.toLocaleString()}</td>
                      <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{toDH(p.price)}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "6px", background: p.quality === "premium" ? "#C4893A12" : "#8e8e9312", color: p.quality === "premium" ? "#C4893A" : "#8e8e93", fontSize: "0.7rem", fontWeight: 600 }}>
                          {p.quality === "premium" ? "ممتاز" : "عادي"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: "0.8rem", color: "#5a5a64" }}>{p.expiryDate ? fmtDate(p.expiryDate) : "—"}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: "8px", background: p.available ? "#34c75910" : "#ff3b3010", color: p.available ? "#34c759" : "#ff3b30", fontSize: "0.7rem", fontWeight: 600 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.available ? "#34c759" : "#ff3b30" }} />
                          {p.available ? "متاح" : "نفذ"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {prodFiltered.length === 0 && <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد منتجات</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {tab === "orders" && (
        <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>الطلبات</span>
              <span style={{ padding: "2px 10px", borderRadius: "10px", background: "#007aff10", color: "#007aff", fontSize: "0.7rem", fontWeight: 600 }}>{ordFiltered.length} طلب</span>
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                  {["العميل", "التاريخ", "المنتجات", "المبلغ", "الحالة", "الدفع", "التوصيل"].map(h => (
                    <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#b0b0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {ordFiltered.map((o, i) => (
                    <motion.tr key={o.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.015 }} style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                      <td style={{ padding: "11px 16px" }}>
                        <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{o.customerName}</span>
                        <span className="text-[10px]" style={{ color: "#b0b0b8", display: "block" }}>{o.id}</span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: "0.8rem", color: "#5a5a64", whiteSpace: "nowrap" }}>{fmtDate(o.createdAt)}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {o.items?.slice(0, 2).map((item: any) => (
                            <span key={item.id} className="text-xs" style={{ color: "#5a5a64" }}>{item.productName} × {item.quantity}</span>
                          ))}
                          {o.items?.length > 2 && <span className="text-[10px]" style={{ color: "#b0b0b8" }}>+{o.items.length - 2} أخرى</span>}
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px" }}><span className="text-sm font-bold tabular-nums font-metric" style={{ color: "#34c759" }}>{toDH(o.totalAmount)}</span></td>
                      <td style={{ padding: "11px 16px" }}>{getStatusBadge(o.status)}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "6px", background: o.paymentStatus === "paid" ? "#34c75912" : "#ff9f0a12", color: o.paymentStatus === "paid" ? "#34c759" : "#ff9f0a", fontSize: "0.7rem", fontWeight: 600 }}>
                          {o.paymentStatus === "paid" ? "مدفوع" : "معلق"}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: "0.8rem", color: "#5a5a64" }}>
                        {o.deliveryDate ? fmtDate(o.deliveryDate) : "—"}
                        {o.deliveryAddress && <span className="text-[10px]" style={{ color: "#b0b0b8", display: "block" }}>{o.deliveryAddress}</span>}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {ordFiltered.length === 0 && <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد طلبات</td></tr>}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
