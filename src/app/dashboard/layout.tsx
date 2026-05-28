"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, UserButton } from "@clerk/nextjs";
import { COLORS } from "@/constants";
import ChatButton from "@/modules/ai/components/chat-button";
import { AIParticleField } from "@/components/ui/ai-effects";
import {
  LayoutDashboard, Bird, Egg, Beef, Wheat, Brain, Settings,
  Bell, DollarSign, TrendingUp, Cpu, BookOpen, Stethoscope, Menu,
  HeartPulse, Package, ShoppingCart, Receipt, ArrowUpDown,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "لوحة القيادة", href: "/dashboard" },
  { icon: Bird, label: "الدجاج", href: "/dashboard/chickens" },
  { icon: Egg, label: "البيض", href: "/dashboard/eggs" },
  { icon: Beef, label: "اللحم", href: "/dashboard/meat" },
  { icon: ArrowUpDown, label: "الجرد", href: "/dashboard/stocking" },
  { icon: BookOpen, label: "سلالات الدجاج", href: "/dashboard/breeds" },
  { icon: BookOpen, label: "المقالات", href: "/dashboard/articles" },
  { icon: Wheat, label: "العلف", href: "/dashboard/feed" },
  { icon: HeartPulse, label: "الصحة", href: "/dashboard/health" },
  { icon: Package, label: "المخزون", href: "/dashboard/inventory" },
  { icon: Stethoscope, label: "AI البيطري", href: "/dashboard/ai-vet" },
  { icon: Brain, label: "التحليلات", href: "/dashboard/analytics" },
  { icon: DollarSign, label: "المالية", href: "/dashboard/finance" },
  { icon: ShoppingCart, label: "المبيعات", href: "/dashboard/sales" },
  { icon: Receipt, label: "المصروفات", href: "/dashboard/expenses" },
  { icon: Bell, label: "التنبيهات", href: "/dashboard/notifications" },
  { icon: TrendingUp, label: "التقارير", href: "/dashboard/reports" },
  { icon: Settings, label: "الإعدادات", href: "/dashboard/settings" },
];

function NavItem({ item, active, index }: { item: typeof navItems[0]; active: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.025, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: "0 12px", marginBottom: "2px" }}
    >
      <a
        href={item.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group"
        style={{
          display: "flex", alignItems: "center", gap: "12px", padding: "9px 14px",
          borderRadius: "10px", textDecoration: "none", fontSize: "0.8rem",
          fontWeight: active ? "500" : "400",
          position: "relative", overflow: "hidden",
          color: active ? "#fff" : hovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)",
          letterSpacing: "0.01em",
        }}
      >
        {/* Active background glow */}
        {active && (
          <motion.div
            layoutId="sidebar-bg"
            className="absolute inset-0 rounded-[10px]"
            style={{
              background: `linear-gradient(135deg, ${COLORS.blue}25, ${COLORS.aqua}10)`,
              border: `1px solid ${COLORS.aqua}15`,
              boxShadow: `inset 0 1px 0 ${COLORS.aqua}10`,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        {/* Hover glow */}
        {hovered && !active && (
          <motion.div
            className="absolute inset-0 rounded-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
        )}

        {/* Active indicator pill */}
        {active && (
          <motion.div
            layoutId="sidebar-active"
            style={{
              position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
              width: "3px", height: "18px", borderRadius: "4px",
              background: `linear-gradient(180deg, ${COLORS.aqua}, ${COLORS.gold})`,
              boxShadow: `0 0 12px ${COLORS.aqua}50, 0 0 4px ${COLORS.aqua}30`,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />
        )}

        {/* Icon */}
        <motion.div
          className="relative z-[1] flex items-center justify-center"
          style={{
            width: "20px", height: "20px",
          }}
          animate={{
            scale: active ? 1.05 : hovered ? 1.05 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <item.icon
            size={16}
            style={{
              color: active ? COLORS.aqua : hovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
              transition: "color 0.2s ease",
            }}
          />
        </motion.div>

        {/* Label */}
        <span className="relative z-[1]" style={{ transition: "color 0.2s ease" }}>
          {item.label}
        </span>
      </a>
    </motion.div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => { if (isLoaded && !isSignedIn) router.push("/login"); }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: "#0a0a10" }}>
        <div className="flex gap-3">
          {[COLORS.aqua, COLORS.blue, COLORS.gold].map((c, i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: c }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100dvh" }}>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
          style={{
            width: "270px", minHeight: "100dvh",
            display: "flex", flexDirection: "column", flexShrink: 0,
            background: "linear-gradient(180deg, #13131e 0%, #181828 100%)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "4px 0 32px rgba(0,0,0,0.1)",
          }}
        >
          {/* Subtle edge glow */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[1px]"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${COLORS.aqua}15 30%, ${COLORS.aqua}20 50%, ${COLORS.blue}15 70%, transparent 100%)`,
            }}
          />

          {/* Logo */}
          <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <a href="/dashboard" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 180, damping: 10 }}
                className="relative"
                style={{
                  width: "36px", height: "36px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 3px 16px ${COLORS.aqua}35, 0 1px 4px ${COLORS.aqua}20`,
                  flexShrink: 0,
                }}
              >
                <Cpu size={17} style={{ color: "#0a0a10" }} />
              </motion.div>
              <div>
                <span
                  className="font-brand"
                  style={{
                    fontSize: "1.1rem", color: "#fff", letterSpacing: "-0.03em",
                    lineHeight: 1.2, display: "block",
                  }}
                >
                  POULTRIX
                </span>
                <p style={{
                  fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", margin: "1px 0 0",
                  letterSpacing: "0.08em", fontWeight: 400,
                }}>
                  ذكاء الدواجن
                </p>
              </div>
            </a>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: "14px 0", overflowY: "auto" }}>
            <p style={{
              padding: "4px 22px 10px", fontSize: "0.6rem",
              color: "rgba(255,255,255,0.15)", textTransform: "uppercase",
              letterSpacing: "0.15em", fontWeight: 500,
            }}>
              الرئيسية
            </p>
            {navItems.slice(0, 5).map((item, i) => (
              <NavItem key={item.href} item={item} active={path === item.href} index={i} />
            ))}
            <p style={{
              padding: "18px 22px 10px", fontSize: "0.6rem",
              color: "rgba(255,255,255,0.15)", textTransform: "uppercase",
              letterSpacing: "0.15em", fontWeight: 500,
            }}>
              البيانات
            </p>
            {navItems.slice(5).map((item, i) => (
              <NavItem key={item.href} item={item} active={path === item.href} index={i + 5} />
            ))}
          </nav>

          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: "14px 16px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* @ts-ignore */}
              <UserButton />
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: "500", color: "#fff", margin: 0, lineHeight: 1.3 }}>
                  الحساب
                </p>
                <p style={{
                  fontSize: "0.65rem", color: "rgba(255,255,255,0.25)",
                  margin: "1px 0 0", lineHeight: 1.3,
                }}>
                  الإعدادات
                </p>
              </div>
            </div>
          </motion.div>
        </motion.aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <AIParticleField className="opacity-[0.015]" />
          <motion.nav
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: "0 28px", height: "58px", display: "flex", alignItems: "center",
              justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40,
              background: "rgba(248,248,250,0.75)", backdropFilter: "blur(24px) saturate(180%)",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `${COLORS.blue}08`, cursor: "pointer",
                  border: `1px solid ${COLORS.blue}10`,
                }}
              >
                <Menu size={14} style={{ color: COLORS.blue }} />
              </motion.div>
              <div style={{ width: "1px", height: "20px", background: "rgba(0,0,0,0.06)" }} />
              <span className="font-brand" style={{ fontSize: "0.85rem", color: "#1E2B22", letterSpacing: "-0.02em" }}>
                POULTRIX
              </span>
              <div style={{
                fontSize: "0.6rem", padding: "2px 8px", borderRadius: "6px",
                background: `${COLORS.aqua}10`, color: COLORS.aqua, fontWeight: 500,
                letterSpacing: "0.03em", border: `1px solid ${COLORS.aqua}15`,
              }}>
                v2.0
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#34c759", boxShadow: "0 0 8px rgba(52,199,89,0.4)",
                }}
              />
              <span style={{
                fontSize: "0.75rem", color: "#5A6A5A", fontWeight: 450,
                letterSpacing: "0.01em",
              }}>
                {new Date().toLocaleDateString("ar-MA", {
                  weekday: "long", month: "long", day: "numeric",
                })}
              </span>
            </div>
          </motion.nav>

          <div style={{ padding: "24px", flex: 1 }}>
            <ChatButton />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
