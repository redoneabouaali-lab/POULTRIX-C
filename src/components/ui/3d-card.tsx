"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tiltDegree?: number;
  glare?: boolean;
}

export function TiltCard({ children, className = "", style = {}, tiltDegree = 8, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * tiltDegree, y: (0.5 - x) * tiltDegree });
    setGlarePos({ x: x * 100, y: y * 100 });
  }, [tiltDegree]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50 });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </motion.div>
  );
}

export function PageWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function StatCard({ icon: Icon, label, value, color, change, index = 0 }: {
  icon: any; label: string; value: string; color: string; change?: string; index?: number;
}) {
  return (
    <TiltCard tiltDegree={6}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "#fff", borderRadius: "16px", padding: "18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
            <Icon size={18} style={{ color }} />
          </div>
          {change && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.06, type: "spring", stiffness: 200 }}
              className="text-xs font-semibold px-2 py-1 rounded-md tabular-nums"
              style={{ background: change.startsWith("+") ? "#e9f8ed" : "#fde8e8", color: change.startsWith("+") ? "#1a7d36" : "#c41e1e" }}
            >
              {change}
            </motion.span>
          )}
        </div>
        <p className="text-xs font-medium mb-0.5" style={{ color: "#5A6A5A" }}>{label}</p>
        <p className="text-lg font-bold tabular-nums" style={{ color: "#1a1a24" }}>{value}</p>
      </motion.div>
    </TiltCard>
  );
}
