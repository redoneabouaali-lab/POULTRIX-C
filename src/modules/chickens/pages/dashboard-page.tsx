"use client";

import { useEffect, useState, memo } from "react";
import { motion } from "motion/react";
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="card card-hover"
      style={{ padding: "16px" }}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${metric.color}10` }}>
          <Icon size={16} style={{ color: metric.color }} />
        </div>
        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md tabular-nums" style={{
          background: metric.change >= 0 ? "#e9f8ed" : "#fde8e8",
          color: metric.change >= 0 ? "#1a7d36" : "#c41e1e",
          fontSize: "0.65rem",
        }}>
          {metric.change >= 0 ? "+" : ""}{metric.change}%
        </span>
      </div>
      <p className="text-label mb-0.5">{metric.label}</p>
      <p className="text-base font-bold tabular-nums font-metric" style={{ color: "#1a1a24" }}>{metric.value}</p>
      {spark && <div className="mt-2"><MiniChart data={spark} color={metric.color} /></div>}
    </motion.div>
  );
});

const ProgressCard = memo(function ProgressCard({ icon: Icon, label, value, progress, color, index }: {
  icon: any; label: string; value: string; progress: number; color: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="card card-hover"
      style={{ padding: "16px" }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}10` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "#5A6A5A", margin: 0 }}>{label}</p>
          <p className="text-base font-bold tabular-nums font-metric" style={{ color: "#1a1a24", margin: "1px 0 0" }}>{value}</p>
        </div>
      </div>
      <div className="h-1 rounded-full" style={{ background: "#eeeef0" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        />
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
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-sm font-bold font-heading" style={{ color: "#1a1a24", margin: 0, letterSpacing: "-0.01em" }}>لوحة القيادة</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "2px 0 0", fontSize: "0.7rem" }}>نظرة شاملة على ضيعتك</p>
        </div>
        <div className="flex items-center gap-2">
          <LiveDot connected={connected} />
          <span className="text-xs font-medium" style={{ color: connected ? "#34c759" : "#ff3b30", fontSize: "0.65rem" }}>
            {connected ? "مباشر" : "غير متصل"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="card flex items-center gap-1.5 px-3 py-2"
            style={{ border: "none", cursor: "pointer", fontSize: "0.7rem", fontWeight: "500", color: "#5a5a64" }}
          >
            <action.icon size={13} style={{ color: action.color }} />
            {action.label}
          </motion.button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px" }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
            {metrics.slice(0, 4).map((m, i) => {
              const icons = [BarChart3, TrendingUp, ShieldCheck, DollarSign];
              const sp = sparkMap[m.id];
              return <MetricCard key={m.id} metric={m} Icon={icons[i]} spark={sp} index={i} />;
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
            {[
              { icon: Bird, label: "عدد الطيور", value: flock?.totalBirds?.toLocaleString() || "—", progress: 78, color: COLORS.cream },
              { icon: Egg, label: "البيض اليومي", value: "1,240", progress: 62, color: COLORS.gold },
              { icon: Weight, label: "الوزن المتوسط", value: flock ? "2.2 كغ" : "—", progress: 88, color: COLORS.blue },
              { icon: Droplets, label: "استهلاك الماء", value: financial ? `${Math.round(financial.dailyWaterCost)} DH` : "—", progress: 45, color: COLORS.aqua },
            ].map((stat, i) => (
              <ProgressCard key={i} {...stat} index={i} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {flock && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="card"
                style={{ padding: "16px" }}
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <Bird size={14} style={{ color: COLORS.aqua }} />
                  <span className="text-xs font-semibold" style={{ color: "#1a1a24" }}>القطيع</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "إجمالي الطيور", value: flock.totalBirds?.toLocaleString() || "—" },
                    { label: "الحظائر النشطة", value: String(flock.activeBarns) },
                    { label: "متوسط العمر", value: `${flock.avgAge} يوم` },
                    { label: "مؤشر الصحة", value: `${flock.healthScore}%` },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-xs" style={{ color: "#5A6A5A", margin: 0, fontSize: "0.65rem" }}>{item.label}</p>
                      <p className="text-sm font-bold tabular-nums font-metric" style={{ color: "#1a1a24", margin: "2px 0 0" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {financial && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
                style={{ padding: "16px" }}
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <DollarSign size={14} style={{ color: COLORS.gold }} />
                  <span className="text-xs font-semibold" style={{ color: "#1a1a24" }}>الملخص المالي</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "العلف اليومي", value: `${financial.dailyFeedCost.toFixed(0)} DH` },
                    { label: "الماء اليومي", value: `${financial.dailyWaterCost.toFixed(0)} DH` },
                    { label: "الإيراد المتوقع", value: `${financial.projectedRevenue.toFixed(0)} DH`, color: COLORS.aqua },
                    { label: "هامش الربح", value: `+${financial.profitMargin}%`, color: COLORS.gold },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-xs" style={{ color: "#5A6A5A", margin: 0, fontSize: "0.65rem" }}>{item.label}</p>
                      <p className="text-sm font-bold tabular-nums font-metric" style={{ color: item.color || "#1a1a24", margin: "2px 0 0" }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="card"
            style={{ padding: "16px" }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Bell size={14} style={{ color: COLORS.gold }} />
              <span className="text-xs font-semibold" style={{ color: "#1a1a24" }}>التنبيهات</span>
              {alerts.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#ff3b30", color: "#fff", fontSize: "0.6rem" }}
                >
                  {alerts.length}
                </motion.span>
              )}
            </div>
            {alerts.length === 0 ? (
              <p className="text-xs flex items-center gap-1" style={{ color: "#34c759" }}>
                <TrendingDown size={12} /> كلشي مستقر — لا توجد تنبيهات
              </p>
            ) : (
              <div className="flex gap-1.5 flex-wrap">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    layout
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{
                      background: alert.severity === "high" ? "#fff2e5" : "#e9f8ed",
                      color: alert.severity === "high" ? "#d95c00" : "#1a7d36",
                      border: `1px solid ${alert.severity === "high" ? "#ffd6b3" : "#b8e6c9"}`,
                      fontSize: "0.7rem",
                    }}
                  >
                    {alert.message}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <AIPanel predictions={predictions} alerts={alerts} insights={insights} loading={loading} />
      </div>
    </div>
  );
}
