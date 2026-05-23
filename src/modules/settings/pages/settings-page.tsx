"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { Settings, User, MapPin, Bell, Shield, Copy, Eye, EyeOff, Trash2, Check } from "lucide-react";

const AR = {
  title: "الإعدادات",
  subtitle: "إعدادات الضيعة والحساب",
  farmProfile: "معلومات الضيعة",
  farmName: "اسم الضيعة",
  location: "الموقع",
  barnCount: "عدد الحظائر",
  farmNameVal: "مزرعة النجاح",
  locationVal: "الدار البيضاء، المغرب",
  notifications: "إعدادات الإشعارات",
  emailNotifs: "الإشعارات البريدية",
  emailDesc: "استلام التنبيهات عبر البريد الإلكتروني",
  pushNotifs: "إشعارات التطبيق",
  pushDesc: "إشعارات فورية عند حدوث تنبيه",
  smsNotifs: "إشعارات SMS",
  smsDesc: "رسائل نصية للتنبيهات العاجلة",
  apiKeys: "مفاتيح API",
  apiDesc: "استخدم هذا المفتاح لربط التطبيقات الخارجية بـ POULTRIX",
  dangerZone: "منطقة الخطر",
  deleteWarning: "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات ضيعتك.",
  deleteData: "حذف بيانات الضيعة",
};

export default function SettingsPage() {
  const [farmName, setFarmName] = useState(AR.farmNameVal);
  const [location, setLocation] = useState(AR.locationVal);
  const [barnCount, setBarnCount] = useState("6");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false });

  const copyApiKey = () => {
    navigator.clipboard.writeText("plx_api_8f3a2b7c9d1e4f5a6b7c8d9e0f1a2b3c");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>{AR.title}</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>{AR.subtitle}</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <User size={16} style={{ color: COLORS.aqua }} />
            <p className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{AR.farmProfile}</p>
          </div>
          {[
            { label: AR.farmName, value: farmName, setter: setFarmName },
            { label: AR.location, value: location, setter: setLocation },
            { label: AR.barnCount, value: barnCount, setter: setBarnCount },
          ].map((field, i) => (
            <div key={field.label} style={{ marginBottom: 14 }}>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#5a5a64" }}>{field.label}</label>
              <input value={field.value} onChange={e => field.setter(e.target.value)}
                onFocus={e => { e.currentTarget.style.borderColor = COLORS.aqua; e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.aqua}18`; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#eeeef0"; e.currentTarget.style.boxShadow = "none"; }}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #eeeef0",
                  fontSize: "0.85rem", color: "#1a1a24", background: "#fafafa", outline: "none", transition: "all 0.2s",
                }}
              />
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Bell size={16} style={{ color: COLORS.gold }} />
            <p className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{AR.notifications}</p>
          </div>
          {[
            { key: "email", label: AR.emailNotifs, desc: AR.emailDesc },
            { key: "push", label: AR.pushNotifs, desc: AR.pushDesc },
            { key: "sms", label: AR.smsNotifs, desc: AR.smsDesc },
          ].map((n) => (
            <div key={n.key} style={{ marginBottom: 14 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#1a1a24" }}>{n.label}</p>
                  <p className="text-xs" style={{ color: "#a0a0aa" }}>{n.desc}</p>
                </div>
                <motion.button
                  onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
                    background: notifs[n.key as keyof typeof notifs] ? `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})` : "#ddd",
                    transition: "all 0.3s", position: "relative", padding: 0,
                  }}
                >
                  <motion.div
                    animate={{ x: notifs[n.key as keyof typeof notifs] ? 24 : 2 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                    style={{
                      width: 22, height: 22, borderRadius: "50%", background: "#fff",
                      position: "absolute", top: 2, left: 0,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  />
                </motion.button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} style={{ color: COLORS.blue }} />
            <p className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{AR.apiKeys}</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <code className="font-metric" style={{
              flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid #eeeef0",
              fontSize: "0.8rem", color: "#5a5a64", background: "#fafafa", direction: "ltr", textAlign: "left",
            }}>
              {showApiKey ? "plx_api_8f3a2b7c9d1e4f5a6b7c8d9e0f1a2b3c" : "plx_api_8f3a2b7c...a2b3c"}
            </code>
            <button onClick={() => setShowApiKey(!showApiKey)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #eeeef0", background: "#fff", cursor: "pointer", lineHeight: 0 }}>
              {showApiKey ? <EyeOff size={14} style={{ color: "#5A6A5A" }} /> : <Eye size={14} style={{ color: "#5A6A5A" }} />}
            </button>
            <button onClick={copyApiKey} style={{ padding: "8px", borderRadius: "8px", border: "1px solid #eeeef0", background: "#fff", cursor: "pointer", lineHeight: 0 }}>
              {copied ? <Check size={14} style={{ color: "#34c759" }} /> : <Copy size={14} style={{ color: "#5A6A5A" }} />}
            </button>
          </div>
          <p className="text-xs" style={{ color: "#a0a0aa" }}>{AR.apiDesc}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Trash2 size={16} style={{ color: "#ff3b30" }} />
            <p className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{AR.dangerZone}</p>
          </div>
          <p className="text-xs mb-4" style={{ color: "#5A6A5A" }}>{AR.deleteWarning}</p>
          <motion.button
            whileHover={{ scale: 1.03, background: "#ff3b30", color: "#fff", boxShadow: "0 8px 24px rgba(255,59,48,0.25)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "10px 20px", borderRadius: "10px", border: "1px solid #ff3b30", background: "transparent",
              color: "#ff3b30", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            {AR.deleteData}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
