import { NextResponse } from "next/server";
import { generateKPIReport, type MetricInputs } from "@/skills/calculations";

const demoKPI = generateKPIReport({
  feedConsumedKg: 42500, weightGainedKg: 21250, deaths: 120, totalBirds: 8400,
  eggsProduced: 168000, hensCount: 6200, days: 30, revenue: 124800,
  expenses: 82150, totalFeedCost: 45600, laborCost: 12400, medicationCost: 3850,
  utilitiesCost: 2100,
});

const invoiceData = {
  number: "FCT-2026-0001",
  customerName: "محمد الفاسي",
  customerAddress: "فاس، حي الرياض",
  issueDate: "2026-05-18",
  dueDate: "2026-06-01",
  items: [
    { desc: "بيض بلدي طازج - 30 طبق", qty: 30, unit: "طبق", price: 185, total: 5550 },
    { desc: "دجاج لاحم - 20 كغ", qty: 20, unit: "كغ", price: 65, total: 1300 },
  ],
  subtotal: 6850, tax: 0, discount: 0, total: 6850,
};

function invoiceHTML(kpi: typeof demoKPI): string {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="utf-8"><title>فاتورة ${invoiceData.number}</title>
<style>
  @page { margin: 15mm; size: A4; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1a1a24; font-size: 12px; line-height: 1.6; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #C4893A; padding-bottom: 15px; margin-bottom: 20px; }
  .header h1 { font-size: 20px; color: #2D5541; margin: 0; }
  .header .inv-number { font-size: 14px; color: #C4893A; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .info-grid .label { font-size: 10px; color: #a0a0aa; }
  .info-grid .value { font-size: 13px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #2D5541; color: white; padding: 8px 10px; text-align: right; font-size: 11px; }
  td { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 12px; }
  td:last-child, th:last-child { text-align: left; }
  .totals { margin-right: auto; width: 300px; }
  .totals .row { display: flex; justify-content: space-between; padding: 4px 0; }
  .totals .grand { font-size: 16px; font-weight: 700; color: #2D5541; border-top: 2px solid #2D5541; padding-top: 8px; margin-top: 4px; }
  .kpi-section { margin-top: 30px; padding-top: 15px; border-top: 1px dashed #ccc; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px; }
  .kpi-card { background: #f8f8fa; padding: 8px 10px; border-radius: 6px; text-align: center; }
  .kpi-card .val { font-size: 16px; font-weight: 700; color: #2D5541; }
  .kpi-card .lbl { font-size: 9px; color: #a0a0aa; }
  .footer { text-align: center; color: #a0a0aa; font-size: 10px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style></head>
<body>
  <div class="header">
    <div><h1>POULTRIX</h1><p style="color:#a0a0aa;font-size:10px;">منصة ذكاء الدواجن</p></div>
    <div style="text-align:left;">
      <div class="inv-number">فاتورة ${invoiceData.number}</div>
      <div style="font-size:10px;color:#a0a0aa;">${invoiceData.issueDate}</div>
    </div>
  </div>
  <div class="info-grid">
    <div>
      <div class="label">العميل</div>
      <div class="value">${invoiceData.customerName}</div>
      <div style="font-size:11px;color:#5a5a64;">${invoiceData.customerAddress}</div>
    </div>
    <div style="text-align:left;">
      <div><span class="label">تاريخ الاستحقاق: </span><span class="value">${invoiceData.dueDate}</span></div>
      <div><span class="label">رقم الفاتورة: </span><span class="value">${invoiceData.number}</span></div>
    </div>
  </div>
  <table>
    <thead><tr><th>البيان</th><th>الكمية</th><th>الوحدة</th><th>السعر</th><th>المجموع</th></tr></thead>
    <tbody>${invoiceData.items.map(i => `<tr><td>${i.desc}</td><td>${i.qty}</td><td>${i.unit}</td><td>${i.price} درهم</td><td>${i.total} درهم</td></tr>`).join("")}</tbody>
  </table>
  <div class="totals">
    <div class="row"><span>المجموع الفرعي</span><span>${invoiceData.subtotal} درهم</span></div>
    <div class="row"><span>الخصم</span><span>${invoiceData.discount} درهم</span></div>
    <div class="grand row"><span>المجموع النهائي</span><span>${invoiceData.total} درهم</span></div>
  </div>
  <div class="kpi-section">
    <h3 style="font-size:13px;color:#2D5541;">مؤشرات الأداء - ${invoiceData.issueDate}</h3>
    <div class="kpi-grid">
      <div class="kpi-card"><div class="val">${kpi.fcr}</div><div class="lbl">معامل تحويل العلف (FCR)</div></div>
      <div class="kpi-card"><div class="val">${kpi.mortalityRate}%</div><div class="lbl">نسبة النفوق</div></div>
      <div class="kpi-card"><div class="val">${kpi.productionRate}%</div><div class="lbl">نسبة الإنتاج</div></div>
      <div class="kpi-card"><div class="val">${kpi.profitMargin}%</div><div class="lbl">هامش الربح</div></div>
      <div class="kpi-card"><div class="val">${kpi.feedCostPerBird} درهم</div><div class="lbl">تكلفة العلف/طائر</div></div>
      <div class="kpi-card"><div class="val">${kpi.breakEvenPrice} درهم</div><div class="lbl">سعر التعادل/كغ</div></div>
      <div class="kpi-card"><div class="val">${kpi.avgDailyGain} كغ</div><div class="lbl">متوسط النمو اليومي</div></div>
      <div class="kpi-card"><div class="val">${kpi.eggPerHen}</div><div class="lbl">بيض/دجاجة</div></div>
    </div>
  </div>
  <div class="footer">POULTRIX AI - منصة ذكاء الدواجن المغربية | poultrix.ma</div>
</body></html>`;
}

export async function GET() {
  const kpi = demoKPI;
  const html = invoiceHTML(kpi);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="invoice-${invoiceData.number}.html"`,
    },
  });
}
