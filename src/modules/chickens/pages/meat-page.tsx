"use client";

import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { PageWrapper, StatCard, TiltCard } from "@/components/ui/3d-card";
import { Beef, TrendingUp, DollarSign, Scale, Clock, CheckCircle, ArrowUpRight } from "lucide-react";

const statusColors: Record<string, string> = { "جاهز للتسويق": "#34c759", "جاهز": "#34c759", قريب: "#ff9f0a", ينمو: "#007aff", صغير: "#03c3ec" };
const statusBgs: Record<string, string> = { "جاهز للتسويق": "#e9f8ed", "جاهز": "#e9f8ed", قريب: "#fff2e5", ينمو: "#e8f0ff", صغير: "#e0f7fa" };

const batches = [
  { name: "BATCH-A42", birds: 4850, avgWeight: 2.2, targetWeight: 2.5, readiness: 88, daysLeft: 4, status: "قريب" },
  { name: "BATCH-B52", birds: 4200, avgWeight: 1.9, targetWeight: 2.5, readiness: 76, daysLeft: 8, status: "ينمو" },
  { name: "BATCH-C62", birds: 5100, avgWeight: 2.4, targetWeight: 2.5, readiness: 96, daysLeft: 1, status: "جاهز" },
  { name: "BATCH-D72", birds: 3800, avgWeight: 1.6, targetWeight: 2.5, readiness: 64, daysLeft: 14, status: "صغير" },
  { name: "BATCH-E82", birds: 4600, avgWeight: 2.6, targetWeight: 2.5, readiness: 100, daysLeft: 0, status: "جاهز للتسويق" },
];

const revenue = batches.reduce((sum, b) => sum + b.birds * b.avgWeight * 22, 0);

export default function MeatPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>إدارة اللحم</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>معدل النمو: +4.2% يومياً &bull; {batches.length} دفعات نشيطة</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        <StatCard icon={Scale} label="الوزن المتوسط" value="2.2 كغ" color="#007aff" change="+3.8%" index={0} />
        <StatCard icon={TrendingUp} label="معدل النمو" value="+52 غ/يوم" color="#34c759" change="+5.2%" index={1} />
        <StatCard icon={Clock} label="الجاهزية" value="2 دفعات" color="#ff9f0a" change={""} index={2} />
        <StatCard icon={DollarSign} label="الإيراد المتوقع" value={`${revenue.toLocaleString()} DH`} color="#03c3ec" change="+12.4%" index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
          <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>الدفعات ({batches.length})</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                {["الدفعة", "العدد", "الوزن", "الهدف", "التقدم", "المتبقي", "الحالة"].map(h => (
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
                  transition={{ delay: 0.25 + i * 0.05 }}
                  style={{ borderBottom: "1px solid #f5f5f7" }}
                  whileHover={{ background: "#f8f8fa" }}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <Beef size={14} style={{ color: statusColors[b.status] || "#5A6A5A" }} />
                      <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{b.name}</span>
                    </div>
                  </td>
                  <td className="tabular-nums font-metric" style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{b.birds.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{b.avgWeight} كغ</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{b.targetWeight} كغ</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: "#eeeef0" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${b.readiness}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: "100%", borderRadius: 3, background: b.readiness > 90 ? "#34c759" : b.readiness > 75 ? "#ff9f0a" : "#007aff" }}
                        />
                      </div>
                      <span className="text-xs font-semibold tabular-nums font-metric" style={{ color: "#5a5a64" }}>{b.readiness}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: b.daysLeft === 0 ? "700" : "400", color: b.daysLeft === 0 ? "#34c759" : "#5a5a64" }}>
                    {b.daysLeft > 0 ? `${b.daysLeft} أيام` : "اليوم"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.05, type: "spring", stiffness: 200 }}
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
