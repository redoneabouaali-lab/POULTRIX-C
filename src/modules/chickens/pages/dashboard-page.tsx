"use client";

import { useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { useRealtime } from "@/hooks";
import { BarChart3, TrendingUp, ShieldCheck, DollarSign, Bird, Egg, Weight, Droplets, Plus, Camera, FileText, Bell, TrendingDown } from "lucide-react";
import type { DashboardMetric, FlockSummary, FinancialSnapshot, MortalityPrediction, BarnAlert, AIInsight } from "@/types";
import MiniChart from "@/components/charts/mini-chart";
import AIPanel from "@/modules/ai/components/ai-panel";

const sparkData = {
  mortality: [2.8, 2.6, 2.4, 2.5, 2.3, 2.2, 2.3],
  feed: [1.72, 1.70, 1.69, 1.68, 1.67, 1.68, 1.68],
  health: [95.2, 95.8, 96.1, 96.4, 96.2, 96.5, 96.4],
  profit: [31.2, 32.5, 33.1, 33.8, 34.0, 34.2, 34.2],
};

const quickActions = [
  { icon: Plus, label: "إضافة دفعة", color: "#696cff" },
  { icon: Camera, label: "تصوير دجاج", color: "#34c759" },
  { icon: FileText, label: "تقرير سريع", color: "#03c3ec" },
  { icon: Bell, label: "تنبيه جديد", color: "#ff9f0a" },
];

const MetricCard = memo(function MetricCard({ metric, Icon, spark, index }: {
  metric: DashboardMetric; Icon: any; spark?: number[]; index: number;
}) {
  const isUp = metric.change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Double-bezel outer shell */}
      <div style={{
        padding: "1.5px", borderRadius: "16px",
        background: `linear-gradient(135deg, ${metric.color}15, ${metric.color}05, transparent 60%)`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.03)`,
      }}>
        {/* Inner core */}
        <div
          className="card-hover"
          style={{
            padding: "18px", borderRadius: "calc(16px - 1.5px)",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.04)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Top row: icon + change badge */}
          <div className="flex items-start justify-between mb-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: "38px", height: "38px", borderRadius: "12px",
                background: `linear-gradient(135deg, ${metric.color}12, ${metric.color}06)`,
                border: `1px solid ${metric.color}12`,
                transition: "all 0.3s ease",
              }}
            >
              <Icon size={17} style={{ color: metric.color }} />
            </div>
            <motion.span
              className="font-semibold tabular-nums flex items-center gap-0.5"
              style={{
                padding: "3px 8px", borderRadius: "8px",
                background: isUp ? "#e9f8ed" : "#fde8e8",
                color: isUp ? "#1a7d36" : "#c41e1e",
                fontSize: "0.65rem", fontWeight: 600,
                border: `1px solid ${isUp ? "#b8e6c9" : "#f5c6c6"}`,
              }}
            >
              {isUp ? (
                <TrendingUp size={10} style={{ color: "#1a7d36" }} />
              ) : (
                <TrendingDown size={10} style={{ color: "#c41e1e" }} />
              )}
              {metric.change >= 0 ? "+" : ""}{metric.change}%
            </motion.span>
          </div>

          {/* Label + Value */}
          <p className="text-label" style={{ margin: 0, fontSize: "0.7rem", letterSpacing: "0.08em" }}>
            {metric.label}
          </p>
          <p
            className="font-bold tabular-nums font-metric"
            style={{ color: "#1E2B22", fontSize: "1.3rem", margin: "3px 0 0", lineHeight: 1.1 }}
          >
            {metric.value}
          </p>

          {/* Sparkline */}
          {spark && (
            <div className="mt-3" style={{ opacity: 0.7 }}>
              <MiniChart data={spark} color={metric.color} />
            </div>
          )}

          {/* Shimmer overlay on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${metric.color}03 50%, transparent 100%)`,
              transition: "opacity 0.6s ease",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
});

const ProgressCard = memo(function ProgressCard({ icon: Icon, label, value, progress, color, index }: {
  icon: any; label: string; value: string; progress: number; color: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Double-bezel outer shell */}
      <div style={{
        padding: "1.5px", borderRadius: "16px",
        background: `linear-gradient(135deg, ${color}12, transparent 60%)`,
      }}>
        {/* Inner core */}
        <div
          className="card-hover"
          style={{
            padding: "18px", borderRadius: "calc(16px - 1.5px)",
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.04)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            position: "relative", overflow: "hidden",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center"
              style={{
                width: "38px", height: "38px", borderRadius: "12px",
                background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                border: `1px solid ${color}12`,
              }}
            >
              <Icon size={17} style={{ color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="font-medium" style={{ color: "#5A6A5A", margin: 0, fontSize: "0.7rem", letterSpacing: "0.02em" }}>
                {label}
              </p>
              <p className="font-bold tabular-nums font-metric" style={{ color: "#1E2B22", margin: "2px 0 0", fontSize: "1.1rem", lineHeight: 1.1 }}>
                {value}
              </p>
            </div>
          </div>
          <div style={{ position: "relative", height: "6px", borderRadius: "4px", background: "#f0f0f2", overflow: "hidden" }}>
            <motion.div
              style={{
                height: "100%", borderRadius: "4px",
                background: `linear-gradient(90deg, ${color}, ${color}bb)`,
                position: "relative",
                boxShadow: `0 0 8px ${color}30`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, delay: 0.4 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow dot at end of progress */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "10px", height: "10px",
                  background: color,
                  boxShadow: `0 0 10px ${color}60, 0 0 20px ${color}30`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.07, type: "spring", stiffness: 200, damping: 12 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

function LiveDot({ connected }: { connected: boolean }) {
  return (
    <motion.span
      className="inline-block rounded-full"
      style={{ width: 5, height: 5, background: connected ? "#34c759" : "#ff3b30" }}
      animate={{ opacity: connected ? [0.3, 1, 0.3] : 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [flock, setFlock] = useState<FlockSummary | null>(null);
  const [financial, setFinancial] = useState<FinancialSnapshot | null>(null);
  const [predictions, setPredictions] = useState<MortalityPrediction[]>([]);
  const [alerts, setAlerts] = useState<BarnAlert[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { connected } = useRealtime();

  useEffect(() => {
    async function load() {
      try {
        const [dash, flockData, fin, pred, alertData, ins] = await Promise.all([
          api.get<DashboardMetric[]>("/api/dashboard"),
          api.get<FlockSummary>("/api/flock"),
          api.get<FinancialSnapshot>("/api/dashboard/financial"),
          api.get<MortalityPrediction[]>("/api/predictions"),
          api.get<BarnAlert[]>("/api/predictions/alerts"),
          api.get<AIInsight[]>("/api/dashboard/insights"),
        ]);
        if (dash.data) setMetrics(dash.data);
        if (flockData.data) setFlock(flockData.data);
        if (fin.data) setFinancial(fin.data);
        if (pred.data) setPredictions(pred.data);
        if (alertData.data) setAlerts(alertData.data);
        if (ins.data) setInsights(ins.data);
      } catch (e) { console.error("Dashboard load error", e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const sparkMap: Record<string, number[]> = {
    mortality: sparkData.mortality, feed: sparkData.feed,
    health: sparkData.health, profit: sparkData.profit,
  };

  return (
    <div>
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}
          >
            <h1
              className="font-heading"
              style={{
                color: "#1E2B22", margin: 0, fontSize: "1.15rem",
                letterSpacing: "-0.02em", fontWeight: 700,
              }}
            >
              لوحة القيادة
            </h1>
            <span style={{
              fontSize: "0.55rem", padding: "2px 8px", borderRadius: "6px",
              background: `${COLORS.aqua}10`, color: COLORS.aqua, fontWeight: 500,
              letterSpacing: "0.05em", border: `1px solid ${COLORS.aqua}12`,
            }}>
              مباشر
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.3 }}
            className="text-sm"
            style={{ color: "#5A6A5A", margin: "4px 0 0", fontSize: "0.75rem", fontWeight: 400, letterSpacing: "0.01em" }}
          >
            نظرة شاملة على ضيعتك — كل المؤشرات في لمحة
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2.5"
          style={{
            padding: "6px 12px 6px 14px", borderRadius: "10px",
            background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <LiveDot connected={connected} />
          <span className="font-medium tabular-nums" style={{
            color: connected ? "#34c759" : "#ff3b30", fontSize: "0.7rem",
            letterSpacing: "0.02em",
          }}>
            {connected ? "مباشر" : "غير متصل"}
          </span>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6 flex-wrap"
      >
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-2"
            style={{
              padding: "7px 14px", borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.04)", cursor: "pointer",
              fontSize: "0.72rem", fontWeight: 500, color: "#5a5a64",
              background: "#ffffff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02)",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div style={{
              width: "18px", height: "18px", borderRadius: "6px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: `${action.color}10`,
              transition: "all 0.25s ease",
            }}>
              <action.icon size={11} style={{ color: action.color }} />
            </div>
            {action.label}
          </motion.button>
        ))}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: "24px" }}>
        <div>
          {/* Metric Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "18px" }}>
            {metrics.slice(0, 4).map((m, i) => {
              const icons = [BarChart3, TrendingUp, ShieldCheck, DollarSign];
              const sp = sparkMap[m.id];
              return <MetricCard key={m.id} metric={m} Icon={icons[i]} spark={sp} index={i} />;
            })}
          </div>

          {/* Progress Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "18px" }}>
            {[
              { icon: Bird, label: "عدد الطيور", value: flock?.totalBirds?.toLocaleString() || "—", progress: 78, color: COLORS.blue },
              { icon: Egg, label: "البيض اليومي", value: "1,240", progress: 62, color: COLORS.gold },
              { icon: Weight, label: "الوزن المتوسط", value: flock ? "2.2 كغ" : "—", progress: 88, color: "#696cff" },
              { icon: Droplets, label: "استهلاك الماء", value: financial ? `${Math.round(financial.dailyWaterCost)} DH` : "—", progress: 45, color: COLORS.aqua },
            ].map((stat, i) => (
              <ProgressCard key={i} {...stat} index={i} />
            ))}
          </div>

          {/* Flock + Financial Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "18px" }}>
            {flock && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ padding: "1.5px", borderRadius: "16px", background: `linear-gradient(135deg, ${COLORS.blue}10, transparent 60%)` }}>
                  <div style={{
                    padding: "18px", borderRadius: "calc(16px - 1.5px)",
                    background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "8px",
                        background: `linear-gradient(135deg, ${COLORS.blue}15, ${COLORS.blue}08)`,
                        border: `1px solid ${COLORS.blue}12`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Bird size={14} style={{ color: COLORS.blue }} />
                      </div>
                      <span className="font-semibold" style={{ color: "#1E2B22", fontSize: "0.8rem" }}>القطيع</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      {[
                        { label: "إجمالي الطيور", value: flock.totalBirds?.toLocaleString() || "—", accent: false },
                        { label: "الحظائر النشطة", value: String(flock.activeBarns), accent: false },
                        { label: "متوسط العمر", value: `${flock.avgAge} يوم`, accent: false },
                        { label: "مؤشر الصحة", value: `${flock.healthScore}%`, accent: true },
                      ].map((item, i) => (
                        <div key={i} style={{ padding: "10px 12px", borderRadius: "10px", background: "#f8f8fa", border: "1px solid #eeeef0" }}>
                          <p style={{ color: "#5A6A5A", margin: 0, fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.03em" }}>
                            {item.label}
                          </p>
                          <p className="font-bold tabular-nums font-metric" style={{
                            color: item.accent ? COLORS.aqua : "#1E2B22",
                            margin: "3px 0 0", fontSize: "0.95rem",
                          }}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {financial && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ padding: "1.5px", borderRadius: "16px", background: `linear-gradient(135deg, ${COLORS.gold}12, transparent 60%)` }}>
                  <div style={{
                    padding: "18px", borderRadius: "calc(16px - 1.5px)",
                    background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
                  }}>
                    <div className="flex items-center gap-2 mb-4">
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "8px",
                        background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.gold}08)`,
                        border: `1px solid ${COLORS.gold}12`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <DollarSign size={14} style={{ color: COLORS.gold }} />
                      </div>
                      <span className="font-semibold" style={{ color: "#1E2B22", fontSize: "0.8rem" }}>الملخص المالي</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      {[
                        { label: "العلف اليومي", value: `${financial.dailyFeedCost.toFixed(0)} DH`, color: "#5A6A5A" },
                        { label: "الماء اليومي", value: `${financial.dailyWaterCost.toFixed(0)} DH`, color: "#5A6A5A" },
                        { label: "الإيراد المتوقع", value: `${financial.projectedRevenue.toFixed(0)} DH`, color: COLORS.aqua },
                        { label: "هامش الربح", value: `+${financial.profitMargin}%`, color: COLORS.gold },
                      ].map((item, i) => (
                        <div key={i} style={{ padding: "10px 12px", borderRadius: "10px", background: "#f8f8fa", border: "1px solid #eeeef0" }}>
                          <p style={{ color: "#5A6A5A", margin: 0, fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.03em" }}>
                            {item.label}
                          </p>
                          <p className="font-bold tabular-nums font-metric" style={{
                            color: item.color || "#1E2B22",
                            margin: "3px 0 0", fontSize: "0.95rem",
                          }}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Alerts Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ padding: "1.5px", borderRadius: "16px", background: `linear-gradient(135deg, ${COLORS.gold}08, transparent 60%)` }}>
              <div style={{
                padding: "18px", borderRadius: "calc(16px - 1.5px)",
                background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)",
              }}>
                <div className="flex items-center gap-2 mb-4">
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.gold}08)`,
                    border: `1px solid ${COLORS.gold}12`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Bell size={14} style={{ color: COLORS.gold }} />
                  </div>
                  <span className="font-semibold" style={{ color: "#1E2B22", fontSize: "0.8rem" }}>
                    التنبيهات
                  </span>
                  {alerts.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="font-semibold tabular-nums"
                      style={{
                        padding: "2px 8px", borderRadius: "8px",
                        background: "#ff3b30", color: "#fff", fontSize: "0.6rem",
                        boxShadow: "0 2px 8px rgba(255,59,48,0.3)",
                      }}
                    >
                      {alerts.length}
                    </motion.span>
                  )}
                </div>
                {alerts.length === 0 ? (
                  <div style={{
                    padding: "14px 16px", borderRadius: "10px",
                    background: "#f0faf4", border: "1px solid #b8e6c9",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}>
                    <TrendingDown size={14} style={{ color: "#1a7d36" }} />
                    <span style={{ color: "#1a7d36", fontSize: "0.75rem", fontWeight: 500 }}>
                      كلشي مستقر — لا توجد تنبيهات
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {alerts.map((alert) => {
                      const isHigh = alert.severity === "high";
                      return (
                        <motion.div
                          key={alert.id}
                          layout
                          className="flex items-start gap-2.5"
                          style={{
                            padding: "10px 14px", borderRadius: "10px",
                            background: isHigh ? "#fff5eb" : "#f8f8fa",
                            border: `1px solid ${isHigh ? "#ffd6b3" : "#eeeef0"}`,
                            borderRight: `3px solid ${isHigh ? "#ff9f0a" : COLORS.aqua}`,
                            fontSize: "0.7rem",
                          }}
                        >
                          <div style={{
                            width: "6px", height: "6px", borderRadius: "50%",
                            background: isHigh ? "#ff9f0a" : COLORS.aqua,
                            marginTop: "5px", flexShrink: 0,
                            boxShadow: `0 0 6px ${isHigh ? "#ff9f0a" : COLORS.aqua}40`,
                          }} />
                          <div>
                            <span style={{
                              color: isHigh ? "#d95c00" : "#1a7d36",
                              fontWeight: 500, lineHeight: 1.4,
                            }}>
                              {alert.message}
                            </span>
                            {alert.barnId && (
                              <p style={{
                                color: "#a0a0aa", margin: "2px 0 0", fontSize: "0.6rem",
                                letterSpacing: "0.02em",
                              }}>
                                {alert.barnId}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <AIPanel predictions={predictions} alerts={alerts} insights={insights} loading={loading} />
      </div>
    </div>
  );
}
