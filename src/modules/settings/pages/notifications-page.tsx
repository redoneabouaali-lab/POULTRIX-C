"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS } from "@/constants";
import React from "react";
import { Bell, AlertTriangle, Droplets, Thermometer, Wheat, CheckCircle, Filter } from "lucide-react";

interface AlertItem {
  id: string; barnId: string; type: string; severity: string;
  message: string; timestamp: string; acknowledged: boolean;
}

const typeIcons: Record<string, any> = { temp: Thermometer, water: Droplets, feed: Wheat };
const severityColors: Record<string, string> = { high: "#d95c00", medium: COLORS.gold, low: COLORS.aqua };
const severityBgs: Record<string, string> = { high: "#fff2e5", medium: "#fff8e5", low: "#e8faf5" };
const typeLabels: Record<string, string> = { temp: "Ø­Ø±Ø§Ø±Ø©", water: "Ù…Ø§Ø¡", feed: "Ø¹Ù„Ù", humidity: "Ø±Ø·ÙˆØ¨Ø©", mortality: "Ù†ÙÙˆÙ‚", egg: "Ø¨ÙŠØ¶" };

export default function NotificationsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/predictions/alerts").then(r => r.json()).then(d => {
      if (d.data) setAlerts(d.data.map((a: AlertItem) => ({ ...a, acknowledged: false })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? alerts : filter === "acknowledged" ? alerts.filter(a => a.acknowledged) : alerts.filter(a => a.severity === filter && !a.acknowledged);
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;

  const toggleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
  };

  if (loading) return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      {[1,2,3,4,5].map(i => <div key={i} className="shimmer-bg" style={{ height: 60, borderRadius: 12, marginBottom: 10 }} />)}
    </div>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>Ø§Ù„ØªÙ†Ø¨ÙŠÙ‡Ø§Øª</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>
            {unacknowledged > 0 ? `${unacknowledged} ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ù†Ø´ÙŠØ·Ø©` : "ÙƒÙ„ Ø´ÙŠØ¡ Ù‡Ø§Ø¯Ø¦"}
          </p>
        </div>
      </motion.div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {[
          { value: "all", label: "Ø§Ù„ÙƒÙ„" },
          { value: "high", label: "Ø¹Ø§Ù„ÙŠØ©" },
          { value: "medium", label: "Ù…ØªÙˆØ³Ø·Ø©" },
          { value: "low", label: "Ù…Ù†Ø®ÙØ¶Ø©" },
          { value: "acknowledged", label: "ØªÙ… Ø§Ù„ØªØ£ÙƒÙŠØ¯" },
        ].map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            style={{
              padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer",
              background: filter === f.value ? COLORS.aqua : "#fff",
              color: filter === f.value ? "#000" : "#5A6A5A",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              transition: "all 0.2s",
            }}
          >{f.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <span className="text-xs flex items-center gap-1" style={{ color: "#a0a0aa" }}>
          <Filter size={12} /> ØªØµÙÙŠØ©
        </span>
      </div>

      <AnimatePresence>
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: "#fff", borderRadius: "16px", padding: "60px 20px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <CheckCircle size={40} style={{ color: "#34c759", margin: "0 auto 12px", display: "block", opacity: 0.5 }} />
            <p className="text-sm font-medium" style={{ color: "#5A6A5A" }}>ÙƒÙ„ Ø´ÙŠØ¡ Ù‡Ø§Ø¯Ø¦! Ù„Ø§ ØªÙˆØ¬Ø¯ ØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ù†Ø´ÙŠØ·Ø©.</p>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: alert.acknowledged ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                style={{
                  background: alert.acknowledged ? "#f8f8fa" : "#fff",
                  borderRadius: "12px", padding: "14px 16px",
                  boxShadow: alert.acknowledged ? "none" : "0 1px 3px rgba(0,0,0,0.03)",
                  border: `1px solid ${alert.acknowledged ? "#eeeef0" : severityColors[alert.severity] + "20"}`,
                  opacity: alert.acknowledged ? 0.6 : 1,
                  cursor: "pointer",
                }}
                onClick={() => toggleAcknowledge(alert.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{
                    background: severityBgs[alert.severity],
                  }}>
                    {alert.acknowledged ? (
                      <CheckCircle size={16} style={{ color: "#34c759" }} />
                    ) : (
                      React.createElement(typeIcons[alert.type] || AlertTriangle, { size: 16, style: { color: severityColors[alert.severity] } })
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: alert.acknowledged ? "#a0a0aa" : "#1a1a24" }}>{alert.message}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-md" style={{
                          background: severityBgs[alert.severity],
                          color: severityColors[alert.severity],
                        }}>
                          {alert.severity === "high" ? "Ø¹Ø§Ù„ÙŠØ©" : alert.severity === "medium" ? "Ù…ØªÙˆØ³Ø·Ø©" : "Ù…Ù†Ø®ÙØ¶Ø©"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "#a0a0aa" }}>{alert.barnId}</span>
                      <span className="text-xs" style={{ color: "#a0a0aa" }}>
                        {new Date(alert.timestamp).toLocaleDateString("ar-MA", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {alert.acknowledged && <span className="text-xs" style={{ color: "#34c759" }}>ØªÙ… Ø§Ù„ØªØ£ÙƒÙŠØ¯</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

