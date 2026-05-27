"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { Receipt, Plus, X, Loader, Search, DollarSign, TrendingDown, PiggyBank, Edit2, Trash2 } from "lucide-react";

const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "غشت", "شتنبر", "أكتوبر", "نونبر", "ديسمبر"];
const fmtDate = (s: string) => { if (!s) return "—"; const d = new Date(s); return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`; };
const toDH = (n: number) => (n || 0).toLocaleString() + " DH";

const categories = [
  { value: "علف", label: "العلف", color: "#ff9f0a" },
  { value: "كهرباء", label: "الكهرباء", color: "#ff3b30" },
  { value: "دواجن", label: "الدواجن", color: "#007aff" },
  { value: "علاج", label: "العلاج", color: "#34c759" },
  { value: "صيانة", label: "الصيانة", color: "#8e8e93" },
  { value: "عمالة", label: "العمالة", color: "#C4893A" },
  { value: "أخرى", label: "أخرى", color: "#5a5a64" },
];

const paymentMethods = ["نقداً", "تحويل بنكي", "شيك", "بطاقة بنكية"];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ category: "علف", description: "", amount: "", paymentMethod: "نقداً", flockId: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get<any>("/api/expenses"), api.get<any[]>("/api/flock")]).then(([a, b]) => {
      if (a.data?.items) setExpenses(a.data.items);
      if (b.data) setFlocks(b.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let f = expenses;
    if (filterCat !== "all") f = f.filter(e => e.category === filterCat);
    if (search) f = f.filter(e => e.description?.includes(search) || e.notes?.includes(search));
    return f.sort((a, b) => new Date(b.expenseDate).valueOf() - new Date(a.expenseDate).valueOf());
  }, [expenses, filterCat, search]);

  const stats = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const thisMonth = expenses.filter(e => {
      const d = new Date(e.expenseDate);
      const n = new Date();
      return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    });
    const monthTotal = thisMonth.reduce((s, e) => s + e.amount, 0);
    const byCat = expenses.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {});
    const topCat = Object.entries(byCat).sort(([, a], [, b]) => b - a)[0];
    return { total, monthTotal, count: expenses.length, topCat: topCat ? `${topCat[0]} (${toDH(topCat[1])})` : "—" };
  }, [expenses]);

  const catSum = (cat: string) => expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
  const catMax = Math.max(...categories.map(c => catSum(c.value)), 1);

  const handleSubmit = async () => {
    if (!form.description || !form.amount) return;
    setSaving(true);
    const payload = { category: form.category, description: form.description, amount: Number(form.amount), paymentMethod: form.paymentMethod, flockId: form.flockId || undefined, notes: form.notes || undefined, expenseDate: new Date().toISOString().split("T")[0] };
    if (editing) {
      setExpenses((p: any[]) => p.map(e => e.id === editing.id ? { ...e, ...payload } : e));
    } else {
      const res = await api.post("/api/expenses", payload);
      setExpenses((p: any[]) => [{ ...payload, id: res.data?.id || `exp-${Date.now()}`, createdAt: new Date().toISOString() }, ...p]);
    }
    setShowModal(false); setEditing(null);
    setForm({ category: "علف", description: "", amount: "", paymentMethod: "نقداً", flockId: "", notes: "" });
    setSaving(false);
  };

  const getFlockName = (id: string) => flocks.find(f => f.id === id)?.name || id;

  if (loading) return <div style={{ padding: "60px", textAlign: "center" }}>{[1, 2, 3, 4, 5].map(i => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />)}</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: "relative", overflow: "hidden", borderRadius: "20px", marginBottom: "24px", background: "linear-gradient(135deg, #1a1a24 0%, #241a1a 100%)" }}>
        <div style={{ position: "absolute", top: "-35%", left: "65%", transform: "translateX(-50%)", opacity: 0.35, pointerEvents: "none" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.35 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
            <Receipt size={200} style={{ color: "#ff3b30" }} />
          </motion.div>
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "6px 12px", borderRadius: "20px", background: "rgba(255,59,48,0.1)" }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: "#ff3b30" }}>المصروفات</span>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ height: 2, flex: 1, background: "linear-gradient(90deg, rgba(255,59,48,0.27), transparent)", transformOrigin: "right" }} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-black" style={{ color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                {toDH(stats.total)}
                <span className="text-lg font-semibold" style={{ color: "#ff3b30", marginRight: 8 }}>إجمالي المصروفات</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 6 }}>
                {stats.count} معاملة &bull; {toDH(stats.monthTotal)} هذا الشهر &bull; الأكثر: {stats.topCat}
              </motion.p>
            </div>
            <motion.button onClick={() => { setEditing(null); setForm({ category: "علف", description: "", amount: "", paymentMethod: "نقداً", flockId: "", notes: "" }); setShowModal(true); }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ff3b30, #d62d20)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(255,59,48,0.35)", whiteSpace: "nowrap" }}>
              <Plus size={17} /> إضافة مصروف
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "إجمالي المصروفات", value: toDH(stats.total), sub: "كل الفترات", color: "#ff3b30", bg: "#ff3b3008", border: "#ff3b3015" },
          { label: "هذا الشهر", value: toDH(stats.monthTotal), sub: `${new Date().toLocaleDateString("ar-MA", { month: "long" })}`, color: "#ff9f0a", bg: "#ff9f0a08", border: "#ff9f0a15" },
          { label: "عدد المعاملات", value: stats.count.toString(), sub: "مصروف مسجل", color: "#007aff", bg: "#007aff08", border: "#007aff15" },
          { label: "أكبر فئة", value: stats.topCat.split(" (")[0], sub: "الأعلى تكلفة", color: "#C4893A", bg: "#C4893A08", border: "#C4893A15" },
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

      {/* Category breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <span className="text-sm font-semibold" style={{ color: "#1a1a24", display: "block", marginBottom: 14 }}>توزيع المصروفات حسب الفئة</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {categories.map(c => {
            const total = catSum(c.value);
            const pct = (total / catMax) * 100;
            if (total === 0) return null;
            return (
              <div key={c.value}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span className="text-xs font-medium" style={{ color: "#5a5a64" }}>{c.label}</span>
                  <span className="text-xs font-semibold tabular-nums" style={{ color: c.color }}>{toDH(total)}</span>
                </div>
                <div style={{ height: 8, borderRadius: 6, background: "#f0f0f2", overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: "100%", borderRadius: 6, background: c.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "12px 16px", marginBottom: "16px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={() => setFilterCat("all")}
          style={{ padding: "6px 14px", borderRadius: "10px", border: "none", background: filterCat === "all" ? "#1a1a24" : "#f5f5f7", color: filterCat === "all" ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>الكل</button>
        {categories.map(c => (
          <button key={c.value} onClick={() => setFilterCat(c.value)}
            style={{ padding: "6px 14px", borderRadius: "10px", border: "none", background: filterCat === c.value ? c.color : "#f5f5f7", color: filterCat === c.value ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>{c.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ position: "relative", minWidth: 160 }}>
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
            <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>سجل المصروفات</span>
            <span style={{ padding: "2px 10px", borderRadius: "10px", background: "#ff3b3010", color: "#ff3b30", fontSize: "0.7rem", fontWeight: 600 }}>{filtered.length} معاملة</span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                {["التاريخ", "الفئة", "الوصف", "الدفعة", "المبلغ", "طريقة الدفع", ""].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#b0b0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((e, i) => (
                  <motion.tr key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.015 }} style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                    <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}><span className="text-xs" style={{ color: "#5a5a64" }}>{fmtDate(e.expenseDate)}</span></td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ padding: "2px 8px", borderRadius: "6px", background: `${categories.find(c => c.value === (e.category || "أخرى"))?.color || "#8e8e93"}12`, color: categories.find(c => c.value === (e.category || "أخرى"))?.color || "#8e8e93", fontSize: "0.7rem", fontWeight: 600 }}>{e.category}</span>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{e.description}</span>
                      {e.notes && <span className="text-[10px]" style={{ color: "#b0b0b8", display: "block" }}>{e.notes}</span>}
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{e.flockId ? getFlockName(e.flockId) : "—"}</td>
                    <td style={{ padding: "11px 16px" }}><span className="text-sm font-bold tabular-nums font-metric" style={{ color: "#ff3b30" }}>{toDH(e.amount)}</span></td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{e.paymentMethod || "—"}</td>
                    <td style={{ padding: "11px 16px" }}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditing(e); setForm({ category: e.category, description: e.description, amount: String(e.amount), paymentMethod: e.paymentMethod || "نقداً", flockId: e.flockId || "", notes: e.notes || "" }); setShowModal(true); }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#b0b0b8", borderRadius: 6 }}><Edit2 size={13} /></button>
                        <button onClick={() => setExpenses((p: any[]) => p.filter(x => x.id !== e.id))}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#e0e0e0", borderRadius: 6 }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد مصروفات مسجلة</td></tr>}
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
              <div style={{ padding: "28px 28px 0", background: "linear-gradient(135deg, rgba(255,59,48,0.04), transparent)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "#1a1a24", margin: 0 }}>{editing ? "تعديل المصروف" : "إضافة مصروف جديد"}</h2>
                    <p className="text-xs" style={{ color: "#8a8a96", marginTop: 4 }}>سجل مصروفات الضيعة</p>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a8a96" }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div style={{ padding: "20px 28px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الفئة *</label>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}>
                        {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>طريقة الدفع</label>
                      <select value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}>
                        {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الوصف *</label>
                    <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف المصروف"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>المبلغ (DH) *</label>
                      <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الدفعة</label>
                      <select value={form.flockId} onChange={e => setForm(p => ({ ...p, flockId: e.target.value }))}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}>
                        <option value="">اختياري</option>
                        {flocks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                      </select>
                    </div>
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
                  <button onClick={handleSubmit} disabled={saving || !form.description || !form.amount}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ff3b30, #d62d20)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: (saving || !form.description || !form.amount) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 12px rgba(255,59,48,0.3)" }}>
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
