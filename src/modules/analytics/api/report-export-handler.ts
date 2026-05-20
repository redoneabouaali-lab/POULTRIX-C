import { NextResponse } from "next/server";
import { generateKPIReport, type KPIReport } from "@/skills/calculations";

// ── SVG Chart Builders ──────────────────────────────────────────

function svgBarChart(bars: { label: string; value: number; color: string }[], title: string, unit: string, w = 500, h = 220): string {
  const pad = { t: 32, r: 16, b: 48, l: 60 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const max = Math.max(...bars.map(b => b.value), 1);
  const bw = Math.min(36, cw / bars.length * 0.6);
  const gap = cw / bars.length;
  const barsSVG = bars.map((b, i) => {
    const x = pad.l + i * gap + (gap - bw) / 2;
    const bh = (b.value / max) * ch;
    const y = pad.t + ch - bh;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw}" height="${bh.toFixed(1)}" rx="3" fill="${b.color}" opacity="0.85"/>
<text x="${(x + bw / 2).toFixed(1)}" y="${(pad.t + ch + 16).toFixed(1)}" text-anchor="middle" font-size="9" fill="#888" font-family="sans-serif">${b.label}</text>
<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" font-size="9" fill="#333" font-weight="600" font-family="sans-serif">${b.value.toLocaleString()}${unit}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;display:block;margin:0 auto;">
<text x="${(w / 2).toFixed(1)}" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#333" font-family="sans-serif">${title}</text>
<line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${(pad.t + ch)}" stroke="#ddd" stroke-width="1"/>
<line x1="${pad.l}" y1="${(pad.t + ch)}" x2="${(pad.l + cw)}" y2="${(pad.t + ch)}" stroke="#ddd" stroke-width="1"/>
${[0, 0.25, 0.5, 0.75, 1].map(p => {
  const y = pad.t + ch - p * ch;
  return `<text x="${(pad.l - 8).toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="#999" font-family="sans-serif">${Math.round(p * max).toLocaleString()}</text>
<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${(pad.l + cw)}" y2="${y.toFixed(1)}" stroke="#f0f0f0" stroke-width="1"/>`;
}).join("")}
${barsSVG}
</svg>`;
}

function svgPieChart(segments: { label: string; value: number; color: string }[], title: string, w = 500, h = 280): string {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const cx = 180, cy = 150, r = 100;
  let cumAngle = -90;
  const slices = segments.map(seg => {
    const angle = (seg.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    const sr = (start * Math.PI) / 180;
    const er = ((start + angle) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(sr);
    const y1 = cy + r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er);
    const y2 = cy + r * Math.sin(er);
    const large = angle > 180 ? 1 : 0;
    return { path: `M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`, color: seg.color, label: seg.label, pct: ((seg.value / total) * 100).toFixed(1) };
  }).join("");
  const legendX = 320;
  const legend = segments.map((seg, i) => {
    const ly = 50 + i * 30;
    return `<rect x="${legendX}" y="${ly}" width="12" height="12" rx="2" fill="${seg.color}"/>
<text x="${legendX + 20}" y="${ly + 10}" font-size="10" fill="#555" font-family="sans-serif">${seg.label}</text>
<text x="${legendX + 160}" y="${ly + 10}" text-anchor="end" font-size="10" fill="#333" font-weight="600" font-family="sans-serif">${seg.value.toLocaleString()} (${((seg.value / total) * 100).toFixed(1)}%)</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;display:block;margin:0 auto;">
<text x="${(w / 2).toFixed(1)}" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#333" font-family="sans-serif">${title}</text>
${slices}
<text x="${cx}" y="${(cy + 4)}" text-anchor="middle" font-size="16" font-weight="700" fill="#333" font-family="sans-serif">${total.toLocaleString()}</text>
<text x="${cx}" y="${(cy + 18)}" text-anchor="middle" font-size="9" fill="#999" font-family="sans-serif">درهم</text>
${legend}
</svg>`;
}

function svgGauge(value: number, max: number, label: string, unit: string, w = 240, h = 180): string {
  const pct = Math.min(value / max, 1);
  const angle = -180 + pct * 180;
  const cx = w / 2, cy = 150, r = 80;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);
  const color = value >= max * 0.8 ? "#34c759" : value >= max * 0.5 ? "#ff9f0a" : "#ff3b30";
  const bgR = 12, arcR = r - bgR;
  const bgPath = (a1: number, a2: number) => {
    const s = ((a1 - 180) * Math.PI) / 180;
    const e = ((a2 - 180) * Math.PI) / 180;
    const x1 = cx + arcR * Math.cos(s);
    const y1 = cy + arcR * Math.sin(s);
    const x2 = cx + arcR * Math.cos(e);
    const y2 = cy + arcR * Math.sin(e);
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${arcR} ${arcR} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;display:block;margin:0 auto;">
<text x="${cx}" y="20" text-anchor="middle" font-size="11" font-weight="600" fill="#555" font-family="sans-serif">${label}</text>
<path d="${bgPath(0, 180)}" stroke="#eee" stroke-width="${bgR * 2}" fill="none" stroke-linecap="round"/>
<path d="${bgPath(0, pct * 180)}" stroke="${color}" stroke-width="${bgR * 2}" fill="none" stroke-linecap="round" opacity="0.9"/>
<text x="${cx}" y="${(cy + 4)}" text-anchor="middle" font-size="22" font-weight="800" fill="${color}" font-family="sans-serif">${value}${unit}</text>
<circle cx="${cx}" cy="${cy}" r="50" fill="#fafafa"/>
<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="5" fill="${color}" stroke="#fff" stroke-width="2"/>
</svg>`;
}

function svgTrendSparkline(points: number[], color: string, w = 240, h = 60): string {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const padL = 0, padR = 0, padT = 4, padB = 4;
  const cw = w - padL - padR;
  const ch = h - padT - padB;
  const step = cw / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(padL + i * step).toFixed(1)},${(padT + ch - ((p - min) / range) * ch).toFixed(1)}`).join(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;">
<path d="${d}" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

function kpiCard(label: string, value: string, color: string, subtitle = ""): string {
  return `<div style="background:#f8f8fa;padding:14px 16px;border-radius:10px;text-align:center;border-right:3px solid ${color};">
  <div style="font-size:20px;font-weight:800;color:#1a1a24;font-family:sans-serif;margin-bottom:2px;">${value}</div>
  <div style="font-size:10px;color:#888;font-family:sans-serif;">${label}</div>
  ${subtitle ? `<div style="font-size:9px;color:#aaa;margin-top:2px;font-family:sans-serif;">${subtitle}</div>` : ""}
</div>`;
}

// ── Demo Data ───────────────────────────────────────────────────

const DEMO_BIRDS = 8400;
const DEMO_ACTIVE_BARNS = 6;
const DEMO_AVG_AGE = 32;
const DEMO_HEALTH_SCORE = 94.5;
const DEMO_WEEKLY_EGGS = [1180, 1240, 1210, 1280, 1320, 1260, 1200];
const DEMO_MORTALITY = [1.2, 1.5, 1.8, 2.1, 1.9, 1.4, 1.1, 1.3, 1.6, 1.7, 2.0, 1.5, 1.3, 1.8, 2.2, 1.9, 1.4, 1.2, 1.6, 1.8, 2.0, 1.7, 1.3, 1.5, 1.9, 2.1, 1.6, 1.4, 1.2, 1.1];
const DEMO_EXPENSES = [
  { label: "العلف", value: 45600, color: "#03c3ec" },
  { label: "العمالة", value: 12400, color: "#C4893A" },
  { label: "العلاج", value: 3850, color: "#34c759" },
  { label: "كهرباء", value: 2100, color: "#ff9f0a" },
  { label: "النقل", value: 4200, color: "#007aff" },
  { label: "الصيانة", value: 3800, color: "#af52de" },
  { label: "أخرى", value: 3500, color: "#ff3b30" },
];
const DEMO_WEEKLY_EGGS_LABELS = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const DEMO_BATCHES = [
  { name: "A-42", birds: 4850, health: 97.2, status: "ممتاز" },
  { name: "B-52", birds: 4200, health: 95.1, status: "جيد" },
  { name: "C-62", birds: 5100, health: 93.8, status: "متوسط" },
  { name: "D-72", birds: 3800, health: 96.5, status: "جيد" },
];

// ── Report HTML Generators ──────────────────────────────────────

function productionHTML(kpi: KPIReport): string {
  const eggBars = DEMO_WEEKLY_EGGS.map((v, i) => ({ label: DEMO_WEEKLY_EGGS_LABELS[i], value: v, color: "#03c3ec" }));
  const weeklySum = DEMO_WEEKLY_EGGS.reduce((a, b) => a + b, 0);
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>تقرير الإنتاج - POULTRIX</title>
<style>
  @page { margin: 12mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1a1a24; font-size: 12px; line-height: 1.6; }
  .page { max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #03c3ec; padding-bottom:16px; margin-bottom:24px; }
  .header h1 { font-size:22px; color:#2D5541; margin:0; }
  .header .sub { font-size:10px; color:#aaa; }
  .header .meta { font-size:10px; color:#888; text-align:left; }
  .section { margin-bottom:28px; }
  .section h2 { font-size:14px; color:#2D5541; margin-bottom:12px; padding-bottom:6px; border-bottom:2px solid #f0f0f0; display:flex; align-items:center; gap:8px; }
  .section h2::before { content:""; display:inline-block; width:4px; height:16px; border-radius:2px; background:#03c3ec; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .chart-box { background:#fafafa; border-radius:10px; padding:14px; border:1px solid #f0f0f0; }
  .insight { background:linear-gradient(135deg,#e8f8ed,#f0fcf4); border-radius:10px; padding:14px; border-right:3px solid #34c759; margin-top:14px; }
  .insight p { font-size:11px; color:#2D5541; margin:0; }
  .footer { text-align:center; color:#bbb; font-size:9px; margin-top:32px; padding-top:16px; border-top:1px solid #eee; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style></head>
<body><div class="page">
  <div class="header">
    <div><h1>POULTRIX</h1><p class="sub">منصة ذكاء الدواجن — تقرير الإنتاج</p></div>
    <div class="meta">${new Date().toLocaleDateString("ar-MA")}<br/>${new Date().toLocaleTimeString("ar-MA")}</div>
  </div>
  <div class="section">
    <h2>ملخص الإنتاج</h2>
    <div class="grid-4">
      ${kpiCard("إجمالي البيض الأسبوعي", weeklySum.toLocaleString(), "#03c3ec", "بيضة/أسبوع")}
      ${kpiCard("نسبة الإنتاج", `${kpi.productionRate}%`, "#34c759", kpi.productionRate >= 80 ? "ممتاز" : kpi.productionRate >= 60 ? "جيد" : "تحت المراجعة")}
      ${kpiCard("بيض/دجاجة", String(kpi.eggPerHen), "#ff9f0a", "خلال 30 يوم")}
      ${kpiCard("الإيراد/طائر", `${kpi.revenuePerBird} درهم`, "#007aff", "إجمالي الإيرادات")}
    </div>
  </div>
  <div class="section">
    <h2>إنتاج البيض اليومي</h2>
    <div class="chart-box">${svgBarChart(eggBars, "", "بيضة")}</div>
  </div>
  <div class="section">
    <h2>اتجاه الإنتاج (آخر 30 يوم)</h2>
    <div class="chart-box" style="padding:10px 14px;">
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div>${svgTrendSparkline(DEMO_WEEKLY_EGGS.map(() => 1100 + Math.random() * 400), "#03c3ec", 300, 60)}</div>
        <div style="font-size:11px;color:#555;"><span style="font-weight:700;color:#1a1a24;">متوسط الإنتاج</span><br/>${(weeklySum / 7).toFixed(0)} بيضة/يوم</div>
      </div>
    </div>
  </div>
  <div class="section">
    <h2>مؤشرات الأداء (KPI)</h2>
    <div class="grid-3">
      ${kpiCard("معامل تحويل العلف", String(kpi.fcr), kpi.fcr <= 1.8 ? "#34c759" : kpi.fcr <= 2.2 ? "#ff9f0a" : "#ff3b30", kpi.fcr <= 1.8 ? "ممتاز" : kpi.fcr <= 2.2 ? "جيد" : "تحت المراجعة")}
      ${kpiCard("نسبة النفوق", `${kpi.mortalityRate}%`, kpi.mortalityRate < 2 ? "#34c759" : kpi.mortalityRate < 5 ? "#ff9f0a" : "#ff3b30", kpi.mortalityRate < 2 ? "ضمن المعدل" : "مرتفع")}
      ${kpiCard("متوسط النمو اليومي", `${kpi.avgDailyGain} كغ`, "#03c3ec")}
    </div>
  </div>
  <div class="insight"><p>${kpi.productionRate >= 75 ? "إنتاج ممتاز! استمر في نفس البرنامج الغذائي." : kpi.productionRate >= 55 ? "إنتاج جيد. يمكن تحسينه بمراجعة تركيبة العلف." : "إنتاج منخفض. ينصح بمراجعة خطة التغذية والرعاية الصحية."}</p></div>
  <div class="footer">POULTRIX AI — poultrix.ma | ${new Date().toISOString().split("T")[0]}</div>
</div></body></html>`;
}

function financialHTML(kpi: KPIReport): string {
  const pieSegments = DEMO_EXPENSES;
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>تقرير مالي - POULTRIX</title>
<style>
  @page { margin: 12mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1a1a24; font-size: 12px; line-height: 1.6; }
  .page { max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #C4893A; padding-bottom:16px; margin-bottom:24px; }
  .header h1 { font-size:22px; color:#2D5541; margin:0; }
  .header .sub { font-size:10px; color:#aaa; }
  .header .meta { font-size:10px; color:#888; text-align:left; }
  .section { margin-bottom:28px; }
  .section h2 { font-size:14px; color:#2D5541; margin-bottom:12px; padding-bottom:6px; border-bottom:2px solid #f0f0f0; display:flex; align-items:center; gap:8px; }
  .section h2::before { content:""; display:inline-block; width:4px; height:16px; border-radius:2px; background:#C4893A; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .chart-box { background:#fafafa; border-radius:10px; padding:14px; border:1px solid #f0f0f0; }
  table { width:100%; border-collapse:collapse; margin:10px 0; }
  th { background:#2D5541; color:white; padding:8px 12px; text-align:right; font-size:11px; }
  td { padding:7px 12px; border-bottom:1px solid #f0f0f0; font-size:11px; }
  tr:last-child td { border-bottom:none; }
  .total-row td { font-weight:700; border-top:2px solid #2D5541; font-size:12px; }
  .profit-text { color:#1a7d36; font-weight:700; }
  .loss-text { color:#c41e1e; font-weight:700; }
  .insight { background:linear-gradient(135deg,#fdf6ec,#fefcf5); border-radius:10px; padding:14px; border-right:3px solid #C4893A; margin-top:14px; }
  .insight p { font-size:11px; color:#5a4a2a; margin:0; }
  .footer { text-align:center; color:#bbb; font-size:9px; margin-top:32px; padding-top:16px; border-top:1px solid #eee; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style></head>
<body><div class="page">
  <div class="header">
    <div><h1>POULTRIX</h1><p class="sub">منصة ذكاء الدواجن — تقرير مالي</p></div>
    <div class="meta">${new Date().toLocaleDateString("ar-MA")}<br/>${new Date().toLocaleTimeString("ar-MA")}</div>
  </div>
  <div class="section">
    <h2>ملخص مالي</h2>
    <div class="grid-3">
      ${kpiCard("إجمالي الإيرادات", `${kpi.totalRevenue.toLocaleString()} درهم`, "#34c759")}
      ${kpiCard("إجمالي المصروفات", `${kpi.totalExpenses.toLocaleString()} درهم`, "#ff3b30")}
      ${kpiCard("صافي الربح", `${kpi.netProfit.toLocaleString()} درهم`, kpi.netProfit >= 0 ? "#1a7d36" : "#c41e1e")}
    </div>
  </div>
  <div class="section">
    <h2>توزيع المصروفات</h2>
    <div class="chart-box">${svgPieChart(pieSegments, "", 500, 300)}</div>
  </div>
  <div class="section">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div>
        <h2>تفاصيل المصروفات</h2>
        <table>
          <thead><tr><th>البند</th><th>المبلغ</th><th>%</th></tr></thead>
          <tbody>
            ${DEMO_EXPENSES.map(e => `<tr><td>${e.label}</td><td>${e.value.toLocaleString()} درهم</td><td>${((e.value / kpi.totalExpenses) * 100).toFixed(1)}%</td></tr>`).join("")}
            <tr class="total-row"><td>المجموع</td><td>${kpi.totalExpenses.toLocaleString()} درهم</td><td>100%</td></tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2>مؤشرات الأداء المالي</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;">
          ${kpiCard("هامش الربح", `${kpi.profitMargin}%`, kpi.profitMargin >= 20 ? "#34c759" : kpi.profitMargin >= 10 ? "#ff9f0a" : "#ff3b30")}
          ${kpiCard("سعر التعادل", `${kpi.breakEvenPrice} درهم`, "#C4893A")}
          ${kpiCard("تكلفة/طائر", `${kpi.costPerBird} درهم`, "#007aff")}
          ${kpiCard("الإيراد/طائر", `${kpi.revenuePerBird} درهم`, "#03c3ec")}
        </div>
      </div>
    </div>
  </div>
  <div class="insight"><p>${kpi.netProfit >= 0 ? `الضبعة تحقق ربحاً صافياً قدره ${kpi.netProfit.toLocaleString()} درهم. هامش الربح ${kpi.profitMargin}% ${kpi.profitMargin >= 20 ? "— أداء ممتاز!" : kpi.profitMargin >= 10 ? "— أداء جيد." : "— يمكن تحسينه."}` : `الضبعة تسجل خسارة قدرها ${Math.abs(kpi.netProfit).toLocaleString()} درهم. ينصح بمراجعة هيكل التكاليف.`}</p></div>
  <div class="footer">POULTRIX AI — poultrix.ma | ${new Date().toISOString().split("T")[0]}</div>
</div></body></html>`;
}

function healthHTML(kpi: KPIReport): string {
  const mortalityBars = DEMO_BATCHES.map(b => ({ label: b.name, value: +(100 - b.health).toFixed(1), color: b.health >= 96 ? "#34c759" : b.health >= 94 ? "#ff9f0a" : "#ff3b30" }));
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>تقرير صحي - POULTRIX</title>
<style>
  @page { margin: 12mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1a1a24; font-size: 12px; line-height: 1.6; }
  .page { max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #34c759; padding-bottom:16px; margin-bottom:24px; }
  .header h1 { font-size:22px; color:#2D5541; margin:0; }
  .header .sub { font-size:10px; color:#aaa; }
  .header .meta { font-size:10px; color:#888; text-align:left; }
  .section { margin-bottom:28px; }
  .section h2 { font-size:14px; color:#2D5541; margin-bottom:12px; padding-bottom:6px; border-bottom:2px solid #f0f0f0; display:flex; align-items:center; gap:8px; }
  .section h2::before { content:""; display:inline-block; width:4px; height:16px; border-radius:2px; background:#34c759; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .chart-box { background:#fafafa; border-radius:10px; padding:14px; border:1px solid #f0f0f0; }
  .health-bar-bg { height:8px; border-radius:4px; background:#eee; margin-top:4px; overflow:hidden; }
  .health-bar-fill { height:100%; border-radius:4px; transition:width 0.3s; }
  table { width:100%; border-collapse:collapse; margin:10px 0; }
  th { background:#2D5541; color:white; padding:8px 12px; text-align:right; font-size:11px; }
  td { padding:7px 12px; border-bottom:1px solid #f0f0f0; font-size:11px; }
  .recommend { background:linear-gradient(135deg,#e8f8ed,#f0fcf4); border-radius:10px; padding:14px; border-right:3px solid #34c759; margin-top:14px; }
  .recommend ul { padding-right:20px; margin:0; font-size:11px; color:#2D5541; line-height:2; }
  .recommend li { margin-bottom:4px; }
  .footer { text-align:center; color:#bbb; font-size:9px; margin-top:32px; padding-top:16px; border-top:1px solid #eee; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style></head>
<body><div class="page">
  <div class="header">
    <div><h1>POULTRIX</h1><p class="sub">منصة ذكاء الدواجن — تقرير صحي</p></div>
    <div class="meta">${new Date().toLocaleDateString("ar-MA")}<br/>${new Date().toLocaleTimeString("ar-MA")}</div>
  </div>
  <div class="section">
    <h2>مؤشر الصحة العام</h2>
    <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;">
      ${svgGauge(DEMO_HEALTH_SCORE, 100, "مؤشر الصحة", "%")}
      <div style="flex:1;min-width:200px;">
        <div class="grid-3">
          ${kpiCard("مؤشر الصحة", `${DEMO_HEALTH_SCORE}%`, "#34c759", DEMO_HEALTH_SCORE >= 90 ? "ممتاز" : DEMO_HEALTH_SCORE >= 75 ? "جيد" : "تحت المراجعة")}
          ${kpiCard("نسبة النفوق", `${kpi.mortalityRate}%`, kpi.mortalityRate < 2 ? "#34c759" : "#ff9f0a", kpi.mortalityRate < 2 ? "ضمن المعدل" : "مرتفع")}
          ${kpiCard("متوسط العمر", `${DEMO_AVG_AGE} يوم`, "#007aff")}
        </div>
      </div>
    </div>
  </div>
  <div class="section">
    <h2>مؤشرات الأداء حسب الدفعة</h2>
    <div class="chart-box">${svgBarChart(mortalityBars, "معدل النفوق (%)", "%", 500, 200)}</div>
  </div>
  <div class="section">
    <h2>تحليل الأداء</h2>
    <div class="grid-4">
      ${kpiCard("FCR", String(kpi.fcr), kpi.fcr <= 1.8 ? "#34c759" : "#ff9f0a")}
      ${kpiCard("النمو اليومي", `${kpi.avgDailyGain} كغ`, "#03c3ec")}
      ${kpiCard("بيض/دجاجة", String(kpi.eggPerHen), "#C4893A")}
      ${kpiCard("نسبة الإنتاج", `${kpi.productionRate}%`, "#007aff")}
    </div>
  </div>
  <div class="section">
    <h2>تفاصيل القطيع</h2>
    <table>
      <thead><tr><th>الدفعة</th><th>العدد</th><th>مؤشر الصحة</th><th>الحالة</th><th>الشريط الصحي</th></tr></thead>
      <tbody>
        ${DEMO_BATCHES.map(b => {
          const hc = b.health >= 96 ? "#34c759" : b.health >= 94 ? "#ff9f0a" : "#ff3b30";
          return `<tr><td>${b.name}</td><td>${b.birds.toLocaleString()}</td><td style="color:${hc};font-weight:600;">${b.health}%</td><td>${b.status}</td><td><div class="health-bar-bg"><div class="health-bar-fill" style="width:${b.health}%;background:${hc};"></div></div></td></tr>`;
        }).join("")}
      </tbody>
    </table>
  </div>
  <div class="recommend">
    <ul>
      <li>مؤشر الصحة العام ${DEMO_HEALTH_SCORE}% — ${DEMO_HEALTH_SCORE >= 90 ? "ممتاز، استمر في نفس البرنامج الصحي" : DEMO_HEALTH_SCORE >= 75 ? "جيد، ينصح بمتابعة يومية" : "يحتاج إلى تدخل فوري"}</li>
      <li>نسبة النفوق ${kpi.mortalityRate}% — ${kpi.mortalityRate < 2 ? "ضمن المعدل الطبيعي" : "أعلى من المعدل، ينصح بمراجعة برامج التلقيح"}</li>
      <li>ينصح بإجراء فحص دوري للقطيع كل أسبوعين</li>
      <li>مراقبة جودة العلف والماء بشكل مستمر</li>
    </ul>
  </div>
  <div class="footer">POULTRIX AI — poultrix.ma | ${new Date().toISOString().split("T")[0]}</div>
</div></body></html>`;
}

function flockHTML(kpi: KPIReport): string {
  const batchBars = DEMO_BATCHES.map(b => ({ label: b.name, value: b.birds, color: b.health >= 96 ? "#34c759" : b.health >= 94 ? "#ff9f0a" : "#007aff" }));
  const totalBatchBirds = DEMO_BATCHES.reduce((s, b) => s + b.birds, 0);
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>تقرير القطيع - POULTRIX</title>
<style>
  @page { margin: 12mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1a1a24; font-size: 12px; line-height: 1.6; }
  .page { max-width: 800px; margin: 0 auto; padding: 20px; }
  .header { display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #007aff; padding-bottom:16px; margin-bottom:24px; }
  .header h1 { font-size:22px; color:#2D5541; margin:0; }
  .header .sub { font-size:10px; color:#aaa; }
  .header .meta { font-size:10px; color:#888; text-align:left; }
  .section { margin-bottom:28px; }
  .section h2 { font-size:14px; color:#2D5541; margin-bottom:12px; padding-bottom:6px; border-bottom:2px solid #f0f0f0; display:flex; align-items:center; gap:8px; }
  .section h2::before { content:""; display:inline-block; width:4px; height:16px; border-radius:2px; background:#007aff; }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
  .chart-box { background:#fafafa; border-radius:10px; padding:14px; border:1px solid #f0f0f0; }
  .batch-card { background:#fff; border:1px solid #f0f0f0; border-radius:10px; padding:12px; transition:all 0.2s; }
  .batch-card:hover { border-color:#ddd; }
  .health-dot { display:inline-block; width:8px; height:8px; border-radius:50%; margin-left:6px; }
  .health-bar-bg { height:6px; border-radius:3px; background:#eee; margin-top:6px; overflow:hidden; }
  .health-bar-fill { height:100%; border-radius:3px; }
  table { width:100%; border-collapse:collapse; margin:10px 0; }
  th { background:#007aff; color:white; padding:8px 12px; text-align:right; font-size:11px; }
  td { padding:7px 12px; border-bottom:1px solid #f0f0f0; font-size:11px; }
  .insight { background:linear-gradient(135deg,#e8f0ff,#f4f8ff); border-radius:10px; padding:14px; border-right:3px solid #007aff; margin-top:14px; }
  .insight p { font-size:11px; color:#1a3a5c; margin:0; }
  .footer { text-align:center; color:#bbb; font-size:9px; margin-top:32px; padding-top:16px; border-top:1px solid #eee; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style></head>
<body><div class="page">
  <div class="header">
    <div><h1>POULTRIX</h1><p class="sub">منصة ذكاء الدواجن — تقرير القطيع</p></div>
    <div class="meta">${new Date().toLocaleDateString("ar-MA")}<br/>${new Date().toLocaleTimeString("ar-MA")}</div>
  </div>
  <div class="section">
    <h2>ملخص القطيع</h2>
    <div class="grid-4">
      ${kpiCard("إجمالي الطيور", DEMO_BIRDS.toLocaleString(), "#007aff")}
      ${kpiCard("الحظائر النشطة", String(DEMO_ACTIVE_BARNS), "#34c759")}
      ${kpiCard("متوسط العمر", `${DEMO_AVG_AGE} يوم`, "#C4893A")}
      ${kpiCard("مؤشر الصحة", `${DEMO_HEALTH_SCORE}%`, "#03c3ec", DEMO_HEALTH_SCORE >= 90 ? "ممتاز" : "جيد")}
    </div>
  </div>
  <div class="section">
    <h2>توزيع القطيع حسب الدفعة</h2>
    <div class="chart-box">${svgBarChart(batchBars, "عدد الطيور", "طير")}</div>
  </div>
  <div class="section">
    <h2>بطاقات الدفعات</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${DEMO_BATCHES.map(b => {
        const hc = b.health >= 96 ? "#34c759" : b.health >= 94 ? "#ff9f0a" : "#ff3b30";
        return `<div class="batch-card"><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;font-weight:600;color:#1a1a24;">${b.name}</span><span style="font-size:11px;color:${hc};font-weight:600;"><span class="health-dot" style="background:${hc};"></span>${b.health}%</span></div><div style="font-size:11px;color:#888;">${b.birds.toLocaleString()} طير &bull; ${b.status}</div><div class="health-bar-bg"><div class="health-bar-fill" style="width:${b.health}%;background:${hc};"></div></div></div>`;
      }).join("")}
    </div>
  </div>
  <div class="section">
    <h2>مؤشرات الأداء (KPI)</h2>
    <div class="grid-4">
      ${kpiCard("الإيراد/طائر", `${kpi.revenuePerBird} درهم`, "#34c759")}
      ${kpiCard("التكلفة/طائر", `${kpi.costPerBird} درهم`, "#ff9f0a")}
      ${kpiCard("النمو اليومي", `${kpi.avgDailyGain} كغ`, "#03c3ec")}
      ${kpiCard("هامش الربح", `${kpi.profitMargin}%`, kpi.profitMargin >= 20 ? "#34c759" : "#ff9f0a")}
    </div>
  </div>
  <div class="section">
    <h2>ملخص الدفعات</h2>
    <table>
      <thead><tr><th>الدفعة</th><th>العدد</th><th>الصحة</th><th>الحالة</th><th>نسبة من القطيع</th></tr></thead>
      <tbody>
        ${DEMO_BATCHES.map(b => {
          const hc = b.health >= 96 ? "#34c759" : b.health >= 94 ? "#ff9f0a" : "#ff3b30";
          return `<tr><td>${b.name}</td><td>${b.birds.toLocaleString()}</td><td style="color:${hc};font-weight:600;">${b.health}%</td><td>${b.status}</td><td>${((b.birds / totalBatchBirds) * 100).toFixed(1)}%</td></tr>`;
        }).join("")}
        <tr style="font-weight:700;border-top:2px solid #007aff;"><td>المجموع</td><td>${totalBatchBirds.toLocaleString()}</td><td>${(DEMO_BATCHES.reduce((s, b) => s + b.health, 0) / DEMO_BATCHES.length).toFixed(1)}%</td><td></td><td>100%</td></tr>
      </tbody>
    </table>
  </div>
  <div class="insight"><p>القطيع في حالة جيدة. مؤشر الصحة العام ${DEMO_HEALTH_SCORE}%. التوزيع متوازن بين الدفعات. ${kpi.mortalityRate < 2 ? "نسبة النفوق ضمن المعدل الطبيعي." : "ينصح بمراقبة الدفعات ذات المؤشر الصحي المنخفض."}</p></div>
  <div class="footer">POULTRIX AI — poultrix.ma | ${new Date().toISOString().split("T")[0]}</div>
</div></body></html>`;
}

const periodDays: Record<string, number> = {
  "هذا الأسبوع": 7,
  "هذا الشهر": 30,
  "هذا الربع": 90,
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "production";
    const periodParam = url.searchParams.get("period") || "هذا الشهر";
    const days = periodDays[periodParam] || 30;

    const kpi = generateKPIReport({
      feedConsumedKg: 42500, weightGainedKg: 21250, deaths: 120, totalBirds: 8400,
      eggsProduced: days <= 7 ? 168000 / 4 : days <= 30 ? 168000 : 168000 * 3,
      hensCount: 6200, days,
      revenue: 124800,
      expenses: 82150,
      totalFeedCost: 45600, laborCost: 12400, medicationCost: 3850, utilitiesCost: 2100,
    });

    const typeMap: Record<string, (k: KPIReport) => string> = {
      production: productionHTML,
      financial: financialHTML,
      health: healthHTML,
      flock: flockHTML,
    };
    const typeLabels: Record<string, string> = {
      production: "الإنتاج", financial: "المالي", health: "الصحي", flock: "القطيع",
    };

    const html = (typeMap[type] || productionHTML)(kpi);
    const label = typeLabels[type] || type;
    const asciiName = `POULTRIX-${label}-${periodParam.replace(/\s+/g, "-")}.html`;
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(asciiName)}`,
      },
    });
  } catch (e) {
    console.error("report export error:", e);
    return new NextResponse(String(e), { status: 500 });
  }
}
