export interface MetricInputs {
  feedConsumedKg: number;
  weightGainedKg: number;
  deaths: number;
  totalBirds: number;
  eggsProduced: number;
  hensCount: number;
  days: number;
  revenue: number;
  expenses: number;
  totalFeedCost: number;
  laborCost: number;
  medicationCost: number;
  utilitiesCost: number;
}

export function calculateFCR(feedConsumedKg: number, weightGainedKg: number): number {
  if (weightGainedKg <= 0) return 0;
  return +(feedConsumedKg / weightGainedKg).toFixed(2);
}

export function calculateMortalityRate(deaths: number, totalBirds: number): number {
  if (totalBirds <= 0) return 0;
  return +((deaths / totalBirds) * 100).toFixed(2);
}

export function calculateProductionRate(eggsProduced: number, hensCount: number, days: number): number {
  if (hensCount <= 0 || days <= 0) return 0;
  const expected = hensCount * days;
  if (expected <= 0) return 0;
  return +((eggsProduced / expected) * 100).toFixed(1);
}

export function calculateProfitMargin(revenue: number, expenses: number): number {
  if (revenue <= 0) return 0;
  return +(((revenue - expenses) / revenue) * 100).toFixed(1);
}

export function calculateFeedCostPerBird(totalFeedCost: number, totalBirds: number): number {
  if (totalBirds <= 0) return 0;
  return +(totalFeedCost / totalBirds).toFixed(2);
}

export function calculateBreakEvenPrice(totalCost: number, totalBirds: number, avgWeightKg: number): number {
  if (totalBirds <= 0 || avgWeightKg <= 0) return 0;
  return +(totalCost / (totalBirds * avgWeightKg)).toFixed(2);
}

export function calculateAvgDailyGain(weightGainedKg: number, days: number): number {
  if (days <= 0) return 0;
  return +(weightGainedKg / days).toFixed(3);
}

export function calculateEggPerHen(eggsProduced: number, hensCount: number): number {
  if (hensCount <= 0) return 0;
  return +(eggsProduced / hensCount).toFixed(1);
}

export function calculateRevenuePerBird(revenue: number, totalBirds: number): number {
  if (totalBirds <= 0) return 0;
  return +(revenue / totalBirds).toFixed(2);
}

export function calculateCostPerBird(expenses: number, totalBirds: number): number {
  if (totalBirds <= 0) return 0;
  return +(expenses / totalBirds).toFixed(2);
}

export interface KPIReport {
  fcr: number;
  mortalityRate: number;
  productionRate: number;
  profitMargin: number;
  feedCostPerBird: number;
  breakEvenPrice: number;
  avgDailyGain: number;
  eggPerHen: number;
  revenuePerBird: number;
  costPerBird: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export function generateKPIReport(inputs: MetricInputs): KPIReport {
  const totalRevenue = inputs.revenue;
  const totalExpenses = inputs.expenses;
  return {
    fcr: calculateFCR(inputs.feedConsumedKg, inputs.weightGainedKg),
    mortalityRate: calculateMortalityRate(inputs.deaths, inputs.totalBirds),
    productionRate: calculateProductionRate(inputs.eggsProduced, inputs.hensCount, inputs.days),
    profitMargin: calculateProfitMargin(totalRevenue, totalExpenses),
    feedCostPerBird: calculateFeedCostPerBird(inputs.totalFeedCost, inputs.totalBirds),
    breakEvenPrice: calculateBreakEvenPrice(totalExpenses, inputs.totalBirds, inputs.weightGainedKg / inputs.totalBirds),
    avgDailyGain: calculateAvgDailyGain(inputs.weightGainedKg, inputs.days),
    eggPerHen: calculateEggPerHen(inputs.eggsProduced, inputs.hensCount),
    revenuePerBird: calculateRevenuePerBird(totalRevenue, inputs.totalBirds),
    costPerBird: calculateCostPerBird(totalExpenses, inputs.totalBirds),
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
  };
}
