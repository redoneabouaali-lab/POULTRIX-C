"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { Plus, X, Loader, Package, Search, AlertTriangle, Wheat, Pill, Wrench, Box, DollarSign, Edit2, Trash2 } from "lucide-react";

const typeConfig = [
  { value: "feed", label: "العلف", icon: Wheat, color: "#ff9f0a" },
  { value: "medicine", label: "الأدوية", icon: Pill, color: "#ff3b30" },
  { value: "equipment", label: "المعدات", icon: Wrench, color: "#007aff" },
  { value: "supplies", label: "المستلزمات", icon: Box, color: "#34c759" },
];

const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "غشت", "شتنبر", "أكتوبر", "نونبر", "ديسمبر"];
const fmtDate = (s: string) => { if (!s) return "—"; const d = new Date(s); return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`; };
const toDH = (n: number) => (n || 0).toLocaleString() + " DH";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ type: "feed", name: "", quantity: "", unit: "كغ", minimumThreshold: "", cost: "", supplier: "", expiryDate: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<any>("/api/inventory").then(res => {
      if (res.data?.items) setItems(res.data.items);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let f = items;
    if (filterType !== "all") f = f.filter(i => i.type === filterType);
    if (search) f = f.filter(i => (i.name || "").includes(search) || (i.supplier || "").includes(search));
    return f;
  }, [items, filterType, search]);

  const stats = useMemo(() => {
    const total = items.length;
    const lowStock = items.filter(i => i.quantity < i.minimumThreshold).length;
    const warning = items.filter(i => i.quantity >= i.minimumThreshold && i.quantity < i.minimumThreshold * 1.5).length;
    const totalValue = items.reduce((s, i) => s + ((i.cost || 0) * i.quantity), 0);
    return { total, lowStock, warning, totalValue };
  }, [items]);

  const TypeIcon = ({ type }: { type: string }) => {
    const t = typeConfig.find(e => e.value === type);
    const Icon = t?.icon || Package;
    return <Icon size={14} style={{ color: t?.color || "#8e8e93" }} />;
  };

  const typeBadge = (type: string) => {
    const t = typeConfig.find(e => e.value === type);
    if (!t) return <span>{type}</span>;
    return (
      <span className="flex items-center gap-1.5" style={{ padding: "3px 10px", borderRadius: "8px", background: `${t.color}10`, color: t.color, fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>
        <t.icon size={12} />
        {t.label}
      </span>
    );
  };

  const stockBar = (qty: number, min: number) => {
    const ratio = min > 0 ? qty / min : 1;
    const color = ratio < 1 ? "#ff3b30" : ratio < 1.5 ? "#ff9f0a" : "#34c759";
    const pct = Math.min((qty / (min * 2)) * 100, 100);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#f0f0f2", overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: "100%", borderRadius: 3, background: color }} />
        </div>
        <span className="text-xs font-semibold tabular-nums" style={{ color, minWidth: 36, textAlign: "left", direction: "ltr" }}>{qty.toLocaleString()}</span>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!form.name) return;
    setSaving(true);
    const payload = { type: form.type, name: form.name, quantity: Number(form.quantity) || 0, unit: form.unit, minimumThreshold: Number(form.minimumThreshold) || 0, cost: Number(form.cost) || 0, supplier: form.supplier || undefined, expiryDate: form.expiryDate || undefined, notes: form.notes || undefined };
    if (editing) {
      setItems(p => p.map(i => i.id === editing.id ? { ...i, ...payload } : i));
    } else {
      const res = await api.post("/api/inventory", payload);
      setItems(p => [{ ...payload, id: (res.data as any)?.id || `inv-${Date.now()}`, createdAt: new Date().toISOString() }, ...p]);
    }
    setShowModal(false); setEditing(null);
    setForm({ type: "feed", name: "", quantity: "", unit: "كغ", minimumThreshold: "", cost: "", supplier: "", expiryDate: "", notes: "" });
    setSaving(false);
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center" }}>{[1, 2, 3, 4, 5].map(i => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />)}</div>;

  return (
    <div>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: "relative", overflow: "hidden", borderRadius: "20px", marginBottom: "24px", background: "linear-gradient(135deg, #1a1a24 0%, #1a241a 100%)" }}>
        <div style={{ position: "absolute", top: "-35%", left: "62%", transform: "translateX(-50%)", opacity: 0.4, pointerEvents: "none" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
            <Package size={180} style={{ color: "#34c759" }} />
          </motion.div>
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "6px 12px", borderRadius: "20px", background: "rgba(52,199,89,0.1)" }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: "#34c759" }}>إدارة المخزون</span>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ height: 2, flex: 1, background: "linear-gradient(90deg, rgba(52,199,89,0.27), transparent)", transformOrigin: "right" }} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-black" style={{ color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                {stats.total}
                <span className="text-lg font-semibold" style={{ color: "#34c759", marginRight: 8 }}>صنف</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 6 }}>
                {stats.lowStock} حرج &bull; {stats.warning} إنذار &bull; قيمة المخزون {toDH(stats.totalValue)}
              </motion.p>
            </div>
            <motion.button onClick={() => { setEditing(null); setForm({ type: "feed", name: "", quantity: "", unit: "كغ", minimumThreshold: "", cost: "", supplier: "", expiryDate: "", notes: "" }); setShowModal(true); }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #34c759, #28a745)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(52,199,89,0.35)", whiteSpace: "nowrap" }}>
              <Plus size={17} /> إضافة صنف
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "إجمالي الأصناف", value: stats.total.toString(), sub: "مسجلة", color: "#007aff", bg: "#007aff08", border: "#007aff15" },
          { label: "مخزون حرج", value: stats.lowStock.toString(), sub: "أقل من الحد الأدنى", color: "#ff3b30", bg: "#ff3b3008", border: "#ff3b3015" },
          { label: "إنذار", value: stats.warning.toString(), sub: "تقترب من الحد", color: "#ff9f0a", bg: "#ff9f0a08", border: "#ff9f0a15" },
          { label: "القيمة الإجمالية", value: toDH(stats.totalValue), sub: "تكلفة المخزون", color: "#34c759", bg: "#34c75908", border: "#34c75915" },
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

      {/* Filter bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "16px 20px", marginBottom: "16px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "4px", flex: 1, flexWrap: "wrap" }}>
          <button onClick={() => setFilterType("all")}
            style={{ padding: "6px 14px", borderRadius: "10px", border: "none", background: filterType === "all" ? "#1a1a24" : "#f5f5f7", color: filterType === "all" ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>الكل</button>
          {typeConfig.map(t => (
            <button key={t.value} onClick={() => setFilterType(t.value)}
              style={{ padding: "6px 14px", borderRadius: "10px", border: "none", display: "flex", alignItems: "center", gap: "5px", background: filterType === t.value ? t.color : "#f5f5f7", color: filterType === t.value ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", minWidth: 180 }}>
          <Search size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#b0b0b8", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
            style={{ width: "100%", padding: "8px 14px 8px 36px", borderRadius: "10px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>قائمة المخزون</span>
            <span style={{ padding: "2px 10px", borderRadius: "10px", background: "#34c75910", color: "#34c759", fontSize: "0.7rem", fontWeight: 600 }}>{filtered.length} صنف</span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                {["النوع", "الاسم", "المخزون", "الحد الأدنى", "سعر الوحدة", "المورد", "صلاحية", ""].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#b0b0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((item, i) => {
                  const level = item.quantity < item.minimumThreshold ? "critical" : item.quantity < item.minimumThreshold * 1.5 ? "warning" : "ok";
                  return (
                    <motion.tr key={item.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.015 }} style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                      <td style={{ padding: "11px 16px" }}>{typeBadge(item.type)}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{item.name}</span>
                        {item.notes && <span className="text-[10px]" style={{ color: "#b0b0b8", display: "block", marginTop: 1 }}>{item.notes}</span>}
                      </td>
                      <td style={{ padding: "11px 16px", minWidth: 160 }}>
                        {stockBar(item.quantity, item.minimumThreshold)}
                        <span className="text-[10px]" style={{ color: "#b0b0b8", display: "block", marginTop: 2 }}>{item.unit}</span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{item.minimumThreshold?.toLocaleString() || "—"}</td>
                      <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{item.cost ? toDH(item.cost) + "/" + item.unit : "—"}</td>
                      <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{item.supplier || "—"}</td>
                      <td style={{ padding: "11px 16px", fontSize: "0.8rem", color: "#5a5a64", whiteSpace: "nowrap" }}>{item.expiryDate ? fmtDate(item.expiryDate) : "—"}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditing(item); setForm({ type: item.type, name: item.name, quantity: String(item.quantity), unit: item.unit, minimumThreshold: String(item.minimumThreshold || ""), cost: String(item.cost || ""), supplier: item.supplier || "", expiryDate: item.expiryDate || "", notes: item.notes || "" }); setShowModal(true); }}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#b0b0b8", borderRadius: 6 }}><Edit2 size={13} /></button>
                          <button onClick={() => setItems(p => p.filter(x => x.id !== item.id))}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#e0e0e0", borderRadius: 6 }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد أصناف في المخزون</td></tr>}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", padding: "16px" }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "480px", padding: "0", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <div style={{ padding: "28px 28px 0", background: "linear-gradient(135deg, rgba(52,199,89,0.04), transparent)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "#1a1a24", margin: 0 }}>{editing ? "تعديل الصنف" : "إضافة صنف جديد"}</h2>
                    <p className="text-xs" style={{ color: "#8a8a96", marginTop: 4 }}>{editing ? "تحديث بيانات المخزون" : "أدخل بيانات الصنف الجديد"}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a8a96" }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div style={{ padding: "20px 28px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>النوع *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                      {typeConfig.map(t => (
                        <button key={t.value} onClick={() => setForm(p => ({ ...p, type: t.value }))}
                          style={{ padding: "8px 4px", borderRadius: "10px", border: `1.5px solid ${form.type === t.value ? t.color : "#e8e8ec"}`, background: form.type === t.value ? `${t.color}08` : "#f8f8fa", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.15s" }}>
                          <t.icon size={16} style={{ color: form.type === t.value ? t.color : "#8a8a96" }} />
                          <span className="text-[10px] font-medium" style={{ color: form.type === t.value ? t.color : "#5a5a64" }}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الاسم *</label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="اسم الصنف"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الكمية *</label>
                      <input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الوحدة *</label>
                      <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}>
                        <option value="كغ">كيلوغرام</option>
                        <option value="لتر">لتر</option>
                        <option value="قطعة">قطعة</option>
                        <option value="كيس">كيس</option>
                        <option value="قارورة">قارورة</option>
                        <option value="عبوة">عبوة</option>
                        <option value="وحدة">وحدة</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الحد الأدنى</label>
                      <input type="number" value={form.minimumThreshold} onChange={e => setForm(p => ({ ...p, minimumThreshold: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>سعر الوحدة (DH)</label>
                      <input type="number" step="0.01" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>المورد</label>
                      <input value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))} placeholder="المورد"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>تاريخ الصلاحية</label>
                    <input type="date" value={form.expiryDate} onChange={e => setForm(p => ({ ...p, expiryDate: e.target.value }))}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>ملاحظات</label>
                    <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="اختياري"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#fff", color: "#5a5a64", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}>إلغاء</button>
                  <button onClick={handleSubmit} disabled={saving || !form.name}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #34c759, #28a745)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: (saving || !form.name) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 12px rgba(52,199,89,0.3)" }}>
                    {saving ? <Loader size={16} /> : <Plus size={16} />}
                    {saving ? "..." : editing ? "تحديث" : "إضافة"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
