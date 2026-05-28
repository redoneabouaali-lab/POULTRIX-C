"use client";

import { motion } from "framer-motion";
import { COLORS } from "@/constants";
import { Brain, AlertTriangle, Eye, TrendingUp } from "lucide-react";
import type { MortalityPrediction, BarnAlert, AIInsight } from "@/types";

function ShimmerLine() {
  return (
    <div className="shimmer-bg" style={{ height: "50px", borderRadius: "10px", marginBottom: "8px" }} />
  );
}

export default function AIPanel({ predictions, alerts, insights, loading }: { predictions: MortalityPrediction[]; alerts: BarnAlert[]; insights: AIInsight[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: "16px" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: "#1a1a24" }}>ذكاء POULTRIX</p>
        {[1, 2, 3].map(i => <ShimmerLine key={i} />)}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card"
      style={{ padding: "16px" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.aqua}10` }}>
          <Brain size={15} style={{ color: COLORS.aqua }} />
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: "#1a1a24", margin: 0 }}>ذكاء POULTRIX</p>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "1px 0 0", fontSize: "0.65rem" }}>توقعات لحظية</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {predictions.slice(0, 2).map((pred) => (
          <motion.div key={pred.id} layout style={{ padding: "10px", borderRadius: "10px", background: "#f8f8fa", border: "1px solid #eeeef0" }}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: "#1a1a24" }}>{pred.affectedCohort || pred.flockId || "—"}</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md tabular-nums" style={{
                background: pred.riskLevel === "high" ? "#fff2e5" : "#e9f8ed",
                color: pred.riskLevel === "high" ? "#d95c00" : "#1a7d36",
                fontSize: "0.6rem",
              }}>
                {Math.round(pred.probability * 100)}%
              </span>
            </div>
            <p className="text-xs" style={{ color: "#5a5a64", margin: 0, lineHeight: 1.5 }}>{pred.recommendation}</p>
            <p className="text-xs flex items-center gap-1 mt-1" style={{ color: "#a0a0aa", fontSize: "0.6rem" }}>
              <Eye size={10} /> {Math.round(pred.confidence * 100)}% ثقة
            </p>
          </motion.div>
        ))}

        {alerts.slice(0, 2).map((alert) => (
          <motion.div key={alert.id} layout className="flex gap-2" style={{ padding: "8px 10px", borderRadius: "10px", background: alert.severity === "high" ? "#fff8e5" : "#f8f8fa", border: "1px solid #eeeef0" }}>
            <AlertTriangle size={12} style={{ color: alert.severity === "high" ? "#ff9f0a" : COLORS.aqua, flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p className="text-xs" style={{ color: "#5a5a64", margin: 0, lineHeight: 1.4 }}>{alert.message}</p>
              <p className="text-xs" style={{ color: "#a0a0aa", margin: "1px 0 0", fontSize: "0.6rem" }}>{alert.barnId}</p>
            </div>
          </motion.div>
        ))}

        {insights.slice(0, 1).map((ins) => (
          <motion.div key={ins.id} layout style={{ padding: "10px", borderRadius: "10px", background: `${COLORS.gold}06`, border: `1px solid ${COLORS.gold}18` }}>
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp size={12} style={{ color: COLORS.gold }} />
              <span className="text-xs font-semibold" style={{ color: "#1a1a24" }}>{ins.title}</span>
            </div>
            <p className="text-xs" style={{ color: "#5a5a64", margin: 0, lineHeight: 1.5 }}>{ins.description}</p>
          </motion.div>
        ))}

        {predictions.length === 0 && alerts.length === 0 && insights.length === 0 && (
          <p className="text-xs text-center py-6" style={{ color: "#a0a0aa" }}>لا توجد بيانات متاحة</p>
        )}
      </div>
    </motion.div>
  );
}
