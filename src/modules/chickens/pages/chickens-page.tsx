"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { PageWrapper, StatCard, TiltCard } from "@/components/ui/3d-card";
import { Bird, Plus, Users, TrendingUp, ShieldCheck, Activity, Search, ArrowUpRight, Check } from "lucide-react";
import type { FlockSummary } from "@/types";

const statusColors: Record<string, string> = { ممتاز: "#34c759", جيد: "#007aff", متوسط: "#ff9f0a" };
const statusBgs: Record<string, string> = { ممتاز: "#e9f8ed", جيد: "#e8f0ff", متوسط: "#fff2e5" };

const batches = [
  { name: "الدفعة A-42", birds: 4850, age: 32, weight: 2.2, health: 97.2, status: "ممتاز", growth: "+52g/يوم" },
  { name: "الدفعة B-52", birds: 4200, age: 28, weight: 1.9, health: 95.1, status: "جيد", growth: "+48g/يوم" },
  { name: "الدفعة C-62", birds: 5100, age: 35, weight: 2.4, health: 93.8, status: "متوسط", growth: "+44g/يوم" },
  { name: "الدفعة D-72", birds: 3800, age: 21, weight: 1.6, health: 96.5, status: "جيد", growth: "+50g/يوم" },
  { name: "الدفعة E-82", birds: 4600, age: 40, weight: 2.6, health: 94.2, status: "متوسط", growth: "+41g/يوم" },
  { name: "الدفعة F-92", birds: 2200, age: 14, weight: 1.1, health: 98.1, status: "ممتاز", growth: "+55g/يوم" },
];

export default function ChickensPage() {
  const [flock, setFlock] = useState<FlockSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<FlockSummary>("/api/flock").then((res) => {
      if (res.data) setFlock(res.data);
      setLoading(false);
    });
  }, []);

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
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
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
        <StatCard icon={Users} label="إجمالي الدجاج" value={flock?.totalBirds?.toLocaleString() || "—"} color="#007aff" change="+4.2%" index={0} />
        <StatCard icon={TrendingUp} label="معدل النمو" value="+4.2%" color="#34c759" change="+1.8%" index={1} />
        <StatCard icon={Activity} label="معدل التحويل" value="1.68" color="#03c3ec" change="-0.3%" index={2} />
        <StatCard icon={ShieldCheck} label="مؤشر الصحة" value={flock ? `${flock.healthScore}%` : "—"} color={COLORS.gold} change={"+3.1%"} index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
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
                  whileHover={{ background: "#f8f8fa" }}
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
                      <div style={{ width: 50, height: 4, borderRadius: 2, background: "#eeeef0" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${b.health}%` }}
                          transition={{ duration: 1, delay: 0.4 + i * 0.04 }}
                          style={{ height: "100%", borderRadius: 2, background: b.health > 96 ? "#34c759" : b.health > 94 ? "#007aff" : "#ff9f0a" }}
                        />
                      </div>
                      <span className="text-xs tabular-nums font-metric" style={{ color: "#5A6A5A" }}>{b.health}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.04, type: "spring", stiffness: 200 }}
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
    </PageWrapper>
  );
}
