"use client";

export default function MiniChart({ data, color = "#696cff", height = 36 }: { data: number[]; color?: string; height?: number }) {
  if (data.length < 2) return null;
  const w = data.length * 12;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${height} ${pts} ${w},${height}`} fill={`url(#grad-${color.replace("#","")})`} opacity="0.5" />
    </svg>
  );
}
