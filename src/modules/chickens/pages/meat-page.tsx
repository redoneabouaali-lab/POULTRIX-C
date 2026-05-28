"use client";

import { motion } from "framer-motion";
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
        {[
          { icon: Scale, label: "الوزن المتوسط", value: "2.2 كغ", color: "#007aff", change: "+3.8%" },
          { icon: TrendingUp, label: "معدل النمو", value: "+52 غ/يوم", color: "#34c759", change: "+5.2%" },
          { icon: Clock, label: "الجاهزية", value: "2 دفعات", color: "#ff9f0a", change: "" },
          { icon: DollarSign, label: "الإيراد المتوقع", value: `${revenue.toLocaleString()} DH`, color: "#03c3ec", change: "+12.4%" },
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
        transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
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
                  whileHover={{ y: -1, background: "#f2f4f7", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
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
                      <div style={{ width: 60, height: 8, borderRadius: 4, background: "#eeeef0", position: "relative" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${b.readiness}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            height: "100%", borderRadius: 4,
                            background: b.readiness > 90
                              ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.aqua})`
                              : b.readiness > 75
                                ? `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.gold})`
                                : `linear-gradient(90deg, ${COLORS.aqua}, ${COLORS.blue})`
                          }}
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.05, type: "spring" as const, stiffness: 300, damping: 15 }}
                          style={{
                            position: "absolute", left: `${b.readiness}%`, top: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 12, height: 12, borderRadius: "50%",
                            background: COLORS.gold,
                            boxShadow: `0 0 8px ${COLORS.gold}, 0 0 16px ${COLORS.gold}40`,
                          }}
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
                      transition={{ delay: 0.4 + i * 0.05, type: "spring" as const, stiffness: 200, damping: 25 }}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-5"
      >
        <TiltCard tiltDegree={3}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}>
            <span className="text-sm font-semibold font-heading" style={{ color: "#1a1a24" }}>توزيع الإيرادات المتوقعة</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "18px" }}>
              {batches.map((b, i) => {
                const rev = b.birds * b.avgWeight * 22;
                const pct = (rev / revenue) * 100;
                return (
                  <motion.div
                    key={b.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-xs font-medium" style={{ color: "#5A6A5A", minWidth: 70 }}>{b.name}</span>
                    <div style={{ flex: 1, position: "relative" }}>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#eeeef0" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.aqua})` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs tabular-nums font-metric font-semibold" style={{ color: "#1a1a24", minWidth: 80, textAlign: "left", direction: "ltr" }}>{rev.toLocaleString()} DH</span>
                  </motion.div>
                );
              })}
            </div>
            <div style={{ borderTop: "1px solid #f0f0f2", marginTop: "16px", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-sm font-semibold font-heading" style={{ color: "#1a1a24" }}>الإيرادات الإجمالية المتوقعة</span>
              <span className="text-base font-black tabular-nums font-metric" style={{ color: COLORS.gold }}>{revenue.toLocaleString()} DH</span>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </PageWrapper>
  );
}
