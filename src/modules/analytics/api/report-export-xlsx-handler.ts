import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { generateKPIReport } from "@/skills/calculations";

const DEMO_EXPENSES = [
  { category: "العلف", amount: 45600 },
  { category: "العمالة", amount: 12400 },
  { category: "العلاج", amount: 3850 },
  { category: "كهرباء وماء", amount: 2100 },
  { category: "النقل", amount: 4200 },
  { category: "الصيانة", amount: 3800 },
  { category: "أخرى", amount: 3500 },
];

const DEMO_BATCHES = [
  { name: "الدفعة A-42", birds: 4850, age: 32, weight: 2.2, health: 97.2, status: "ممتاز" },
  { name: "الدفعة B-52", birds: 4200, age: 28, weight: 1.9, health: 95.1, status: "جيد" },
  { name: "الدفعة C-62", birds: 5100, age: 35, weight: 2.4, health: 93.8, status: "متوسط" },
  { name: "الدفعة D-72", birds: 3800, age: 21, weight: 1.6, health: 96.5, status: "جيد" },
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "production";
    const periodParam = url.searchParams.get("period") || "هذا الشهر";
    const days = periodParam === "هذا الأسبوع" ? 7 : periodParam === "هذا الربع" ? 90 : 30;

    const kpi = generateKPIReport({
      feedConsumedKg: 42500, weightGainedKg: 21250, deaths: 120, totalBirds: 8400,
      eggsProduced: days <= 7 ? 168000 / 4 : days <= 30 ? 168000 : 168000 * 3,
      hensCount: 6200, days,
      revenue: 124800, expenses: 82150,
      totalFeedCost: 45600, laborCost: 12400, medicationCost: 3850, utilitiesCost: 2100,
    });

    const wb = XLSX.utils.book_new();

    const kpiData = [
      ["POULTRIX - تقرير " + (type === "production" ? "الإنتاج" : type === "financial" ? "المالي" : type === "health" ? "الصحي" : "القطيع"), ""],
      ["تاريخ التوليد", new Date().toLocaleDateString("ar-MA")],
      ["الفترة", periodParam],
      [], ["مؤشرات الأداء (KPI)", ""],
      ["المؤشر", "القيمة"],
      ["معامل تحويل العلف (FCR)", kpi.fcr],
      ["نسبة النفوق (%)", kpi.mortalityRate],
      ["نسبة الإنتاج (%)", kpi.productionRate],
      ["هامش الربح (%)", kpi.profitMargin],
      ["تكلفة العلف/طائر (درهم)", kpi.feedCostPerBird],
      ["سعر التعادل/كغ (درهم)", kpi.breakEvenPrice],
      ["متوسط النمو اليومي (كغ)", kpi.avgDailyGain],
      ["بيض/دجاجة", kpi.eggPerHen],
      ["الإيراد/طائر (درهم)", kpi.revenuePerBird],
      ["التكلفة/طائر (درهم)", kpi.costPerBird],
      ["إجمالي الإيرادات (درهم)", kpi.totalRevenue],
      ["إجمالي المصروفات (درهم)", kpi.totalExpenses],
      ["صافي الربح (درهم)", kpi.netProfit],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(kpiData);
    ws1["!cols"] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws1, "المؤشرات");

    if (type === "financial") {
      const expData = [
        ["تفاصيل المصروفات", ""],
        ["البند", "المبلغ (درهم)"],
        ...DEMO_EXPENSES.map(e => [e.category, e.amount]),
        ["المجموع", DEMO_EXPENSES.reduce((s, e) => s + e.amount, 0)],
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(expData);
      ws2["!cols"] = [{ wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, ws2, "المصروفات");
    }

    if (type === "flock") {
      const batchData = [
        ["توزيع القطيع حسب الدفعة", ""],
        ["الدفعة", "العدد", "العمر (يوم)", "الوزن (كغ)", "الصحة (%)", "الحالة"],
        ...DEMO_BATCHES.map(b => [b.name, b.birds, b.age, b.weight, b.health, b.status]),
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(batchData);
      ws2["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, ws2, "القطيع");
    }

    if (type === "health") {
      const healthData = [
        ["تقرير صحي - مؤشرات", ""],
        ["المؤشر", "القيمة"],
        ["مؤشر الصحة العام", "94.5%"],
        ["إجمالي الطيور", 8400],
        ["متوسط العمر (يوم)", 32],
        ...DEMO_BATCHES.map(b => [b.name + " - الصحة", b.health + "%"]),
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(healthData);
      ws2["!cols"] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws2, "الصحة");
    }

    if (type === "production") {
      const prodData = [
        ["إنتاج البيض الأسبوعي", ""],
        ["اليوم", "العدد"],
        ["السبت", 1180],
        ["الأحد", 1240],
        ["الإثنين", 1210],
        ["الثلاثاء", 1280],
        ["الأربعاء", 1320],
        ["الخميس", 1260],
        ["الجمعة", 1200],
        [], ["ملخص الإنتاج", ""],
        ["إجمالي الأسبوع", 8680],
        ["متوسط اليومي", 1240],
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(prodData);
      ws2["!cols"] = [{ wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws2, "الإنتاج");
    }

    const typeLabels: Record<string, string> = {
      production: "الإنتاج", financial: "المالي", health: "الصحي", flock: "القطيع",
    };
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    const label = typeLabels[type] || type;
    const fileName = `POULTRIX-${label}-${periodParam.replace(/\s+/g, "-")}.xlsx`;

    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });
  } catch (e) {
    console.error("xlsx export error:", e);
    return new NextResponse(String(e), { status: 500 });
  }
}
