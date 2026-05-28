"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { PageWrapper, StatCard } from "@/components/ui/3d-card";
import { Bird, Plus, Users, TrendingUp, ShieldCheck, Activity, X, Loader } from "lucide-react";
import type { FlockSummary } from "@/types";

const statusColors: Record<string, string> = { ممتاز: "#34c759", جيد: "#007aff", متوسط: "#ff9f0a" };
const statusBgs: Record<string, string> = { ممتاز: "#e9f8ed", جيد: "#e8f0ff", متوسط: "#fff2e5" };

export default function ChickensPage() {
  const [flock, setFlock] = useState<FlockSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const [batches, setBatches] = useState([
    { name: "الدفعة A-42", birds: 4850, age: 32, weight: 2.2, health: 97.2, status: "ممتاز", growth: "+52g/يوم" },
    { name: "الدفعة B-52", birds: 4200, age: 28, weight: 1.9, health: 95.1, status: "جيد", growth: "+48g/يوم" },
    { name: "الدفعة C-62", birds: 5100, age: 35, weight: 2.4, health: 93.8, status: "متوسط", growth: "+44g/يوم" },
    { name: "الدفعة D-72", birds: 3800, age: 21, weight: 1.6, health: 96.5, status: "جيد", growth: "+50g/يوم" },
    { name: "الدفعة E-82", birds: 4600, age: 40, weight: 2.6, health: 94.2, status: "متوسط", growth: "+41g/يوم" },
    { name: "الدفعة F-92", birds: 2200, age: 14, weight: 1.1, health: 98.1, status: "ممتاز", growth: "+55g/يوم" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", breed: "", totalBirds: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<FlockSummary>("/api/flock").then((res) => {
      if (res.data) setFlock(res.data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.breed.trim()) { setError("الاسم والسلالة مطلوبان"); return; }
    setSaving(true); setError("");
    const res = await api.post("/api/flock", { name: form.name, breed: form.breed, totalBirds: Number(form.totalBirds) || 0, notes: form.notes });
    if (res.error) { setError(res.error); setSaving(false); return; }
    setBatches(p => [{ name: form.name, birds: Number(form.totalBirds) || 0, age: 0, weight: 0, health: 100, status: "ممتاز", growth: "—" }, ...p]);
    setShowModal(false); setForm({ name: "", breed: "", totalBirds: "", notes: "" }); setSaving(false);
    api.get<FlockSummary>("/api/flock").then(r => { if (r.data) setFlock(r.data); });
  };

  if (loading) return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      {[1,2,3,4,5].map(i => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
          className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />
      ))}
    </div>
  );

  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>إدارة الدجاج</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>
            {flock?.totalBirds?.toLocaleString() || "—"} طير &bull; {flock?.activeBarns || 0} حظائر
          </p>
        </div>
        <motion.button onClick={() => setShowModal(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px",
            borderRadius: "12px", border: "none", background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
            color: "#000", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(196,137,58,0.3)",
          }}
        >
          <Plus size={16} /> إضافة دفعة
        </motion.button>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { icon: Users, label: "إجمالي الدجاج", value: flock?.totalBirds?.toLocaleString() || "—", color: "#007aff", change: "+4.2%" },
          { icon: TrendingUp, label: "معدل النمو", value: "+4.2%", color: "#34c759", change: "+1.8%" },
          { icon: Activity, label: "معدل التحويل", value: "1.68", color: "#03c3ec", change: "-0.3%" },
          { icon: ShieldCheck, label: "مؤشر الصحة", value: flock ? `${flock.healthScore}%` : "—", color: COLORS.gold, change: "+3.1%" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            style={{ borderRadius: "16px" }}
          >
            <StatCard icon={s.icon} label={s.label} value={s.value} color={s.color} change={s.change} index={i} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
          <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>الدفعات ({batches.length})</span>
          <span className="text-xs font-medium" style={{ color: COLORS.aqua, cursor: "pointer" }}>عرض الكل &larr;</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                {["الدفعة", "العدد", "العمر", "الوزن", "معدل النمو", "الصحة", "الحالة"].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#5A6A5A", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <motion.tr
                  key={b.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  style={{ borderBottom: "1px solid #f5f5f7", cursor: "default" }}
                  whileHover={{ y: -1, background: "#f2f4f7", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{b.name}</span>
                  </td>
                  <td className="tabular-nums font-metric" style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{b.birds.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{b.age} يوم</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{b.weight} كغ</td>
                  <td className="font-metric" style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#34c759" }}>{b.growth}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: "#eeeef0", position: "relative" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${b.health}%` }}
                          transition={{ duration: 1, delay: 0.4 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            height: "100%", borderRadius: 3,
                            background: b.health > 96
                              ? `linear-gradient(90deg, ${COLORS.aqua}, ${COLORS.gold})`
                              : b.health > 94
                                ? `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.aqua})`
                                : `linear-gradient(90deg, #ff9f0a, ${COLORS.gold})`
                          }}
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.04, type: "spring" as const, stiffness: 300, damping: 15 }}
                          style={{
                            position: "absolute", left: `${b.health}%`, top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 10, height: 10, borderRadius: "50%",
                            background: COLORS.gold,
                            boxShadow: `0 0 8px ${COLORS.gold}, 0 0 16px ${COLORS.gold}40`,
                          }}
                        />
                      </div>
                      <span className="text-xs tabular-nums font-metric" style={{ color: "#5A6A5A" }}>{b.health}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.04, type: "spring" as const, stiffness: 200, damping: 25 }}
                      className="text-xs font-semibold px-3 py-1 rounded-md"
                      style={{ background: statusBgs[b.status], color: statusColors[b.status] }}
                    >
                      {b.status}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "16px" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "420px", padding: "28px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#1a1a24", margin: 0 }}>إضافة دفعة جديدة</h2>
                  <p className="text-xs" style={{ color: "#8a8a96", marginTop: 4 }}>أدخل معلومات الدفعة الجديدة</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8a8a96", padding: 4 }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>اسم الدفعة *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: الدفعة أ-42"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => { e.target.style.borderColor = COLORS.aqua; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#e8e8ec"; e.target.style.background = "#f8f8fa" }} />
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>السلالة *</label>
                  <input value={form.breed} onChange={e => setForm(p => ({ ...p, breed: e.target.value }))} placeholder="مثال: Cobb 500"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => { e.target.style.borderColor = COLORS.aqua; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#e8e8ec"; e.target.style.background = "#f8f8fa" }} />
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>عدد الطيور</label>
                  <input type="number" value={form.totalBirds} onChange={e => setForm(p => ({ ...p, totalBirds: e.target.value }))} placeholder="0"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    onFocus={e => { e.target.style.borderColor = COLORS.aqua; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#e8e8ec"; e.target.style.background = "#f8f8fa" }} />
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>ملاحظات</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="اختياري" rows={2}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                    onFocus={e => { e.target.style.borderColor = COLORS.aqua; e.target.style.background = "#fff" }}
                    onBlur={e => { e.target.style.borderColor = "#e8e8ec"; e.target.style.background = "#f8f8fa" }} />
                </div>
              </div>

              {error && <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: "0.8rem" }}>{error}</div>}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#fff", color: "#5a5a64", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}>
                  إلغاء
                </button>
                <button onClick={handleAdd} disabled={saving}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`, color: "#000", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {saving ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? "جاري الحفظ..." : "إضافة"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
