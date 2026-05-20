import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

async function main() {
  const farm = await prisma.farm.upsert({
    where: { id: "farm-001" },
    update: {},
    create: {
      id: "farm-001",
      name: "ضيعة النخيل للدواجن",
    },
  });

  const barnNames = ["العنبر 1", "العنبر 2", "العنبر 3", "العنبر 4", "العنبر 5", "العنبر 6"];
  const barns = await Promise.all(
    barnNames.map((name, i) =>
      prisma.barn.upsert({
        where: { id: `barn-${i + 1}` },
        update: {},
        create: { id: `barn-${i + 1}`, name, farmId: farm.id },
      })
    )
  );

  const flocks = await Promise.all([
    prisma.flock.upsert({
      where: { id: "flock-001" }, update: {},
      create: { id: "flock-001", farmId: farm.id, name: "القطيع أ-42", breed: "Cobb 500", status: "active", totalBirds: 8400, avgAge: 32, healthScore: 96.4, barnId: barns[0].id, houseShedId: barns[0].name, notes: "قطيع اللاحم الأساسي", startDate: new Date("2026-04-15") },
    }),
    prisma.flock.upsert({
      where: { id: "flock-002" }, update: {},
      create: { id: "flock-002", farmId: farm.id, name: "القطيع ب-41", breed: "ISA Brown", status: "active", totalBirds: 6200, avgAge: 48, healthScore: 92.1, barnId: barns[1].id, houseShedId: barns[1].name, notes: "قطيع بياض", startDate: new Date("2026-03-20") },
    }),
    prisma.flock.upsert({
      where: { id: "flock-003" }, update: {},
      create: { id: "flock-003", farmId: farm.id, name: "القطيع ج-30", breed: "Ross 308", status: "active", totalBirds: 10200, avgAge: 18, healthScore: 98.7, barnId: barns[2].id, houseShedId: barns[2].name, notes: "قطيع جديد", startDate: new Date("2026-05-01") },
    }),
  ]);

  const eggData = [
    { id: "egg-001", flockId: "flock-001", recordDate: "2026-05-18", quantity: 8400, trays: 280, pricePerTray: 185, totalRevenue: 51800, sold: true, notes: "جمع صباحي" },
    { id: "egg-002", flockId: "flock-001", recordDate: "2026-05-17", quantity: 7950, trays: 265, pricePerTray: 180, totalRevenue: 47700, sold: true },
    { id: "egg-003", flockId: "flock-002", recordDate: "2026-05-18", quantity: 6200, trays: 206.7, pricePerTray: 190, totalRevenue: 39273, sold: true, notes: "قطيع جديد - إنتاج في ازدياد" },
    { id: "egg-004", flockId: "flock-002", recordDate: "2026-05-16", quantity: 5800, trays: 193.3, pricePerTray: 185, totalRevenue: 35760, sold: false },
    { id: "egg-005", flockId: "flock-003", recordDate: "2026-05-18", quantity: 10200, trays: 340, pricePerTray: 175, totalRevenue: 59500, sold: true },
  ];
  for (const e of eggData) {
    await prisma.eggRecord.upsert({
      where: { id: e.id }, update: {},
      create: { ...e, farmId: "farm-001", eggsPerTray: 30, recordDate: new Date(e.recordDate) },
    });
  }

  const feedReceipts = [
    { id: "fr-001", flockId: "flock-001", dateReceived: "2026-05-15", quantity: 2000, unitCost: 4.20, totalCost: 8400, supplier: "أعلاف المغرب", feedType: "باديء" },
    { id: "fr-002", flockId: "flock-002", dateReceived: "2026-05-14", quantity: 1500, unitCost: 3.95, totalCost: 5925, supplier: "مطاحن الدار البيضاء", feedType: "بياض" },
    { id: "fr-003", flockId: "flock-001", dateReceived: "2026-05-10", quantity: 2000, unitCost: 4.15, totalCost: 8300, supplier: "أعلاف المغرب", feedType: "باديء" },
    { id: "fr-004", flockId: "flock-003", dateReceived: "2026-05-08", quantity: 2500, unitCost: 4.30, totalCost: 10750, supplier: "أعلاف المغرب", feedType: "باديء", notes: "قطيع جديد" },
  ];
  for (const r of feedReceipts) {
    await prisma.feedReceipt.upsert({
      where: { id: r.id }, update: {},
      create: { ...r, farmId: "farm-001", unit: "كغ", dateReceived: new Date(r.dateReceived) },
    });
  }

  const invItems = [
    { id: "inv-001", type: "feed", name: "علف باديء (Starter)", quantity: 2480, minimumThreshold: 500, cost: 4.20, supplier: "أعلاف المغرب", expiryDate: "2026-08-01" },
    { id: "inv-002", type: "feed", name: "علف نامٍ (Grower)", quantity: 1850, minimumThreshold: 400, cost: 3.80, supplier: "أعلاف المغرب", expiryDate: "2026-08-15" },
    { id: "inv-003", type: "feed", name: "علف بياض (Layer)", quantity: 920, minimumThreshold: 600, cost: 3.95, supplier: "مطاحن الدار البيضاء", expiryDate: "2026-07-20", notes: "مخزون منخفض" },
    { id: "inv-004", type: "medicine", name: "مطعوم نيوكاسل", quantity: 15, minimumThreshold: 5, cost: 85, supplier: "صيدلية بيطرية", expiryDate: "2026-12-01" },
    { id: "inv-005", type: "medicine", name: "مضاد حيوي واسع", quantity: 8, minimumThreshold: 3, cost: 120, supplier: "صيدلية بيطرية", expiryDate: "2026-10-01" },
    { id: "inv-006", type: "equipment", name: "مصابيح تدفئة", quantity: 25, minimumThreshold: 10, cost: 45, supplier: "معدات فلاحية" },
    { id: "inv-007", type: "supplies", name: "فرشة نشارة خشب", quantity: 80, minimumThreshold: 20, cost: 18, supplier: "مطحنة الخشب" },
  ];
  for (const i of invItems) {
    await prisma.inventoryItem.upsert({
      where: { id: i.id }, update: {},
      create: { ...i, unit: "كغ", farmId: "farm-001", expiryDate: i.expiryDate ? new Date(i.expiryDate) : null },
    });
  }

  const products = [
    { id: "prd-001", name: "بيض بلدي طازج", type: "eggs", quantity: 2400, price: 1.80, available: true, quality: "premium", batchNumber: "B-42", productionDate: "2026-05-18", expiryDate: "2026-06-01", notes: "إنتاج اليوم" },
    { id: "prd-002", name: "بيض عادي", type: "eggs", quantity: 5600, price: 1.20, available: true, quality: "standard", batchNumber: "B-41", productionDate: "2026-05-17", expiryDate: "2026-05-31" },
    { id: "prd-003", name: "دجاج لاحم طازج", type: "meat", quantity: 340, price: 65, available: true, quality: "premium", batchNumber: "A-30", productionDate: "2026-05-16", expiryDate: "2026-05-20", notes: "وزن متوسط 2.2كغ" },
    { id: "prd-004", name: "سماد عضوي", type: "manure", quantity: 1200, price: 3.50, available: true, quality: "standard", batchNumber: "F-2026", productionDate: "2026-05-01" },
    { id: "prd-005", name: "كتاكيت عمر يوم", type: "chicks", quantity: 0, price: 12, available: false, quality: "standard", productionDate: "2026-05-10", notes: "نفذ المخزون" },
  ];
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id }, update: {},
      create: { ...p, farmId: "farm-001", productionDate: new Date(p.productionDate), expiryDate: p.expiryDate ? new Date(p.expiryDate) : null },
    });
  }

  const orders = [
    { id: "ord-001", customerName: "محمد الفاسي", totalAmount: 4320, status: "shipped", paymentStatus: "paid", deliveryAddress: "فاس، حي الرياض", deliveryDate: "2026-05-20", notes: "توصيل صباحاً" },
    { id: "ord-002", customerName: "تعاونية المنار", totalAmount: 22100, status: "confirmed", paymentStatus: "pending", deliveryAddress: "مراكش، المنطقة الصناعية", deliveryDate: "2026-05-22" },
    { id: "ord-003", customerName: "سوق الجملة", totalAmount: 11900, status: "pending", paymentStatus: "pending", deliveryAddress: "الدار البيضاء، سوق الجملة", notes: "قيد المراجعة" },
  ];
  for (const o of orders) {
    await prisma.order.upsert({
      where: { id: o.id }, update: {},
      create: { ...o, farmId: "farm-001", deliveryDate: o.deliveryDate ? new Date(o.deliveryDate) : null },
    });
  }

  const orderItemData = [
    { id: "oi-001", orderId: "ord-001", productId: "prd-001", productName: "بيض بلدي طازج", quantity: 1200, price: 1.80 },
    { id: "oi-002", orderId: "ord-001", productId: "prd-002", productName: "بيض عادي", quantity: 1800, price: 1.20 },
    { id: "oi-003", orderId: "ord-002", productId: "prd-003", productName: "دجاج لاحم طازج", quantity: 340, price: 65 },
    { id: "oi-004", orderId: "ord-003", productId: "prd-004", productName: "سماد عضوي", quantity: 200, price: 3.50 },
    { id: "oi-005", orderId: "ord-003", productId: "prd-002", productName: "بيض عادي", quantity: 4000, price: 1.20 },
    { id: "oi-006", orderId: "ord-003", productId: "prd-001", productName: "بيض بلدي طازج", quantity: 2000, price: 1.80 },
  ];
  for (const oi of orderItemData) {
    await prisma.orderItem.upsert({
      where: { id: oi.id }, update: {},
      create: oi,
    });
  }

  const invoices = [
    { id: "inv-001", number: "FCT-2026-0001", customerName: "محمد الفاسي", customerPhone: "0612345678", customerAddress: "فاس، حي الرياض", issueDate: "2026-05-18", dueDate: "2026-06-01", status: "paid", subtotal: 6850, total: 6850, paidAmount: 6850, notes: "تم الدفع نقداً" },
    { id: "inv-002", number: "FCT-2026-0002", customerName: "تعاونية المنار", customerPhone: "0523456789", customerAddress: "مراكش، المنطقة الصناعية", issueDate: "2026-05-17", dueDate: "2026-06-16", status: "sent", subtotal: 3850, taxRate: 10, taxAmount: 385, discount: 100, total: 4135, notes: "شيك يستحق بعد 30 يوم" },
    { id: "inv-003", number: "FCT-2026-0003", customerName: "مشتري الجملة", customerPhone: "0634567890", issueDate: "2026-05-15", dueDate: "2026-05-25", status: "overdue", subtotal: 6170, taxRate: 10, taxAmount: 617, total: 6787, paidAmount: 3000, notes: "باقي 3787 درهم" },
  ];
  for (const inv of invoices) {
    await prisma.invoice.upsert({
      where: { id: inv.id }, update: {},
      create: { ...inv, farmId: "farm-001", issueDate: new Date(inv.issueDate), dueDate: new Date(inv.dueDate) },
    });
  }

  const invoiceItems = [
    { id: "ii-001", invoiceId: "inv-001", description: "بيض بلدي طازج - 30 طبق", quantity: 30, unit: "طبق", unitPrice: 185, total: 5550 },
    { id: "ii-002", invoiceId: "inv-001", description: "دجاج لاحم - 20 كغ", quantity: 20, unit: "كغ", unitPrice: 65, total: 1300 },
    { id: "ii-003", invoiceId: "inv-002", description: "علف باديء - 500 كغ", quantity: 500, unit: "كغ", unitPrice: 4.2, total: 2100 },
    { id: "ii-004", invoiceId: "inv-002", description: "سماد عضوي - 50 كيس", quantity: 50, unit: "كيس", unitPrice: 35, total: 1750 },
    { id: "ii-005", invoiceId: "inv-003", description: "كتاكيت عمر يوم - 500", quantity: 500, unit: "كتكوت", unitPrice: 12, total: 6000 },
    { id: "ii-006", invoiceId: "inv-003", description: "مطاعيم نيوكاسل", quantity: 2, unit: "قارورة", unitPrice: 85, total: 170 },
  ];
  for (const ii of invoiceItems) {
    await prisma.invoiceItem.upsert({
      where: { id: ii.id }, update: {},
      create: ii,
    });
  }

  const expenses = [
    { id: "exp-001", flockId: "flock-001", expenseDate: "2026-05-18", category: "علف", description: "شراء علف باديء", amount: 12800, paymentMethod: "نقداً" },
    { id: "exp-002", expenseDate: "2026-05-17", category: "كهرباء", description: "فاتورة الكهرباء الشهرية", amount: 3450, paymentMethod: "تحويل بنكي" },
    { id: "exp-003", flockId: "flock-003", expenseDate: "2026-05-16", category: "دواجن", description: "شراء كتاكيت عمر يوم", amount: 22500, paymentMethod: "نقداً", notes: "500 كتكوت" },
    { id: "exp-004", flockId: "flock-002", expenseDate: "2026-05-15", category: "علاج", description: "مطاعيم نيوكاسل", amount: 1800, paymentMethod: "نقداً" },
    { id: "exp-005", expenseDate: "2026-05-14", category: "صيانة", description: "صيانة نظام التهوية", amount: 4200, paymentMethod: "شيك", notes: "العنبر 3" },
    { id: "exp-006", flockId: "flock-001", expenseDate: "2026-05-13", category: "عمالة", description: "أجر عمال الموسم", amount: 6000, paymentMethod: "تحويل بنكي" },
    { id: "exp-007", flockId: "flock-003", expenseDate: "2026-05-12", category: "علف", description: "علف نامٍ 2 طن", amount: 7600, paymentMethod: "نقداً" },
  ];
  for (const e of expenses) {
    await prisma.expense.upsert({
      where: { id: e.id }, update: {},
      create: { ...e, farmId: "farm-001", expenseDate: new Date(e.expenseDate) },
    });
  }

  const stocking = [
    { id: "stk-001", flockId: "flock-001", recordDate: "2026-04-15", birdsAdded: 8500, currentBirdCount: 8500, notes: "بداية القطيع" },
    { id: "stk-002", flockId: "flock-001", recordDate: "2026-04-22", mortality: 45, currentBirdCount: 8455, notes: "نفوق أسبوع أول" },
    { id: "stk-003", flockId: "flock-001", recordDate: "2026-04-29", mortality: 28, currentBirdCount: 8427 },
    { id: "stk-004", flockId: "flock-001", recordDate: "2026-05-06", mortality: 15, currentBirdCount: 8412 },
    { id: "stk-005", flockId: "flock-001", recordDate: "2026-05-13", mortality: 12, currentBirdCount: 8400 },
    { id: "stk-006", flockId: "flock-003", recordDate: "2026-05-01", birdsAdded: 10500, currentBirdCount: 10500, notes: "بداية القطيع" },
    { id: "stk-007", flockId: "flock-002", recordDate: "2026-05-18", birdsRemoved: 300, currentBirdCount: 6200, notes: "بيع دفعة" },
  ];
  for (const s of stocking) {
    await prisma.stockingRecord.upsert({
      where: { id: s.id }, update: {},
      create: { ...s, farmId: "farm-001", recordDate: new Date(s.recordDate) },
    });
  }

  const healthEvents = [
    { id: "hlth-001", flockId: "flock-001", eventDate: "2026-05-15", eventType: "vaccination", description: "مطعوم النيوكاسل - جرعة ثانية", birdsAffected: 8400, cost: 1200, performedBy: "د. أحمد", nextFollowUp: "2026-06-15" },
    { id: "hlth-002", flockId: "flock-002", eventDate: "2026-05-14", eventType: "disease", description: "ظهور أعراض تنفسية خفيفة", birdsAffected: 200, mortalityCount: 5, cost: 850, treatment: "مضاد حيوي في ماء الشرب", performedBy: "د. كريم", nextFollowUp: "2026-05-21", notes: "تم عزل الطيور المصابة" },
    { id: "hlth-003", flockId: "flock-003", eventDate: "2026-05-10", eventType: "inspection", description: "تفتيش روتيني", performedBy: "المربّي", notes: "القطيع بحالة جيدة" },
    { id: "hlth-004", eventDate: "2026-05-08", eventType: "medication", description: "تعقيم العنابر", cost: 2400, treatment: "مطهر", performedBy: "عمال النظافة", nextFollowUp: "2026-06-08", notes: "جميع العنابر" },
    { id: "hlth-005", flockId: "flock-001", eventDate: "2026-05-18", eventType: "mortality", description: "نفوق مفاجئ - ارتفاع الحرارة", mortalityCount: 12, notes: "تم تعديل التهوية" },
  ];
  for (const h of healthEvents) {
    await prisma.healthEvent.upsert({
      where: { id: h.id }, update: {},
      create: { ...h, farmId: "farm-001", eventDate: new Date(h.eventDate), nextFollowUp: h.nextFollowUp ? new Date(h.nextFollowUp) : null },
    });
  }

  await prisma.financialSnapshot.create({
    data: {
      farmId: "farm-001",
      dailyFeedCost: 2847.50,
      dailyWaterCost: 423.80,
      projectedRevenue: 12480.00,
      profitMargin: 34.2,
      marginTrend: "up",
      yoyGrowth: 18.7,
    },
  });

  await prisma.aIInsight.create({
    data: {
      type: "prediction",
      severity: "high",
      title: "تحسن كفاءة العلف متوقع",
      description: "بناءً على أنماط سلوك القطيع الحالية، يتوقع النظام تحسن 12.4% في كفاءة تحويل العلف خلال 72 ساعة. الموصى به: ضبط نسبة البروتين +3.2%.",
      confidence: 94.7,
      actionable: true,
    },
  });

  await prisma.aIInsight.create({
    data: {
      type: "opportunity",
      severity: "medium",
      title: "نافذة الحصاد المثلى",
      description: "القطيع B-42 يصل للوزن المستهدف قبل 2.4 يوم من الموعد. النظر في تقديم الحصاد لتحسين تكاليف العلف.",
      confidence: 88.3,
      actionable: true,
    },
  });

  await prisma.aIInsight.create({
    data: {
      type: "alert",
      severity: "low",
      title: "تقلب درجة الحرارة في BARN-3",
      description: "BARN-3 يظهر فرق +1.8°C خلال فترات الذروة بعد الظهر. يوصى بمعايرة التهوية.",
      confidence: 76.1,
      actionable: false,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@poultrix.ma" },
    update: {},
    create: {
      name: "مدير المزرعة",
      email: "admin@poultrix.ma",
      role: "admin",
      farmId: "farm-001",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
