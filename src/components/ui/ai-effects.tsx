"use client";

import { useEffect, useRef } from "react";
import { COLORS } from "@/constants";

/* ─── 1. Particle Field (canvas-based) ─── */

export function AIParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const count = Math.min(80, Math.floor((w * h) / 20000));
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    const palette = [COLORS.aqua, COLORS.blue, COLORS.gold, COLORS.cream];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    const draw = () => {
      ctx!.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.alpha;
        ctx!.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = COLORS.aqua;
            ctx!.globalAlpha = (1 - dist / 120) * 0.15;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }
      ctx!.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    draw();

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 pointer-events-none ${className}`} />;
}

/* ─── 2. Scanning Line ─── */

export function AIScanLine() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08]">
      <div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.aqua}, ${COLORS.blue}, ${COLORS.aqua}, transparent)`,
          animation: "scanline 4s ease-in-out infinite",
          boxShadow: `0 0 20px ${COLORS.aqua}`,
        }}
      />
      <style>{`@keyframes scanline{0%{top:-2px}50%{top:100%}100%{top:-2px}}`}</style>
    </div>
  );
}

/* ─── 3. AI Status Badge ─── */

export function AIStatusBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase"
      style={{
        background: `linear-gradient(135deg, ${COLORS.aqua}20, ${COLORS.blue}15)`,
        border: `1px solid ${COLORS.aqua}30`,
        color: COLORS.aqua,
        boxShadow: `0 0 20px ${COLORS.aqua}15`,
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full"
          style={{ background: COLORS.aqua, animation: "pulse-ring 2s ease-in-out infinite" }}
        />
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: COLORS.aqua }} />
      </span>
      AI Active
      <style>{`@keyframes pulse-ring{0%,100%{opacity:0.6}50%{opacity:0.2}}`}</style>
    </div>
  );
}

/* ─── 4. Data Stream Bars ─── */

export function DataStreamBars() {
  const bars = 6;
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-[3px] opacity-[0.06] pointer-events-none">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-[2px] rounded-full"
          style={{
            height: `${20 + Math.random() * 60}px`,
            background: i % 2 === 0 ? COLORS.aqua : COLORS.gold,
            animation: `databar ${1.5 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`@keyframes databar{0%,100%{transform:scaleY(0.3);opacity:0.3}50%{transform:scaleY(1);opacity:1}}`}</style>
    </div>
  );
}

/* ─── 5. Glowing Orb ─── */

export function GlowingOrb({ color = COLORS.aqua, size = 300, top = "20%", left = "50%" }: { color?: string; size?: number; top?: string; left?: string }) {
  return (
    <div
      className="absolute pointer-events-none rounded-full"
      style={{
        width: size,
        height: size,
        top,
        left,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${color}25 0%, ${color}10 40%, transparent 70%)`,
        animation: "orb-pulse 4s ease-in-out infinite",
        filter: "blur(40px)",
      }}
    />
  );
}

/* ─── 6. Hexagonal Grid Background ─── */

export function HexGridBg() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexgrid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
          <path d="M20 0L40 11.5L40 34.5L20 46L0 34.5L0 11.5Z" fill="none" stroke={COLORS.aqua} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexgrid)" />
    </svg>
  );
}

/* ─── 7. Neural Network Nodes ─── */

export function NeuralNodes() {
  const nodes = [
    { x: "10%", y: "20%", delay: 0 },
    { x: "85%", y: "15%", delay: 0.5 },
    { x: "20%", y: "75%", delay: 1 },
    { x: "75%", y: "70%", delay: 1.5 },
    { x: "50%", y: "10%", delay: 2 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {nodes.map((node, i) =>
          nodes.slice(i + 1).map((other, j) => (
            <line
              key={`${i}-${j}`}
              x1={node.x}
              y1={node.y}
              x2={other.x}
              y2={other.y}
              stroke={COLORS.aqua}
              strokeWidth="0.3"
              opacity="0.5"
            />
          ))
        )}
        {nodes.map((node, i) => (
          <circle key={i} cx={node.x} cy={node.y} r="3" fill={COLORS.aqua} opacity="0.6">
            <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
}

/* ─── 8. Gradient Mesh Background ─── */

export function GradientMesh() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 15% 25%, ${COLORS.aqua}20 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, ${COLORS.blue}18 0%, transparent 45%),
            radial-gradient(circle at 50% 75%, ${COLORS.gold}15 0%, transparent 45%),
            radial-gradient(circle at 20% 80%, ${COLORS.cream}12 0%, transparent 40%)
          `,
          animation: "mesh-shift 12s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes mesh-shift {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(1deg); }
          100% { transform: scale(1) rotate(-0.5deg); }
        }
      `}</style>
    </div>
  );
}
