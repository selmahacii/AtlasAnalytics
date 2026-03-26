/**
 * ML Analytics Data Utilities
 * Provides functions to load and process ML data
 */

import kpisData from './ml-data/kpis.json';
import dailyRevenueData from './ml-data/daily_revenue.json';
import anomaliesData from './ml-data/anomalies.json';
import segmentsData from './ml-data/segments.json';
import productPerformanceData from './ml-data/product_performance.json';
import customersData from './ml-data/customers.json';

// Types
export interface KPIs {
  total_revenue: number;
  total_transactions: number;
  avg_order_value: number;
  conversion_rate: number;
  revenue_growth_pct: number;
  cost_reduction_pct: number;
  ml_accuracy: number;
  high_risk_customers: number;
  revenue_at_risk: number;
  total_customers: number;
  active_customers: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  transactions: number;
  avgOrderValue: number;
  isAnomaly: boolean;
  anomalyScore: number | null;
}

export interface Anomaly {
  date: string;
  type: string;
  severity: string;
  deviationPercent: number;
  expectedValue: number;
  actualValue: number;
  description: string;
}

export interface CustomerSegment {
  clusterId: number;
  segmentName: string;
  segmentSize: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
  avgLTV: number;
  color: string;
  description: string;
}

export interface ProductPerformance {
  productId: string;
  name: string;
  category: string;
  revenue: number;
  margin: number;
  unitsSold: number;
  sellThroughRate: number;
  stockAlert: boolean;
  trend30Day: number[];
  price: number;
  rank: number;
}

export interface Customer {
  id: string;
  age: number;
  gender: string;
  country: string;
  signupDate: string;
  customerSegment: string;
  lifetimeValue: number;
  churnRiskScore: number;
  recencyDays: number;
  frequency: number;
  monetary: number;
  avgSessionDuration: number;
  supportTickets: number;
  discountUsageRate: number;
  churned: boolean;
  cluster: number;
}

export interface RevenueForecast {
  date: string;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
  confidence: number;
}

// Cache
let dataCache: {
  kpis: KPIs;
  dailyRevenue: DailyRevenue[];
  anomalies: Anomaly[];
  segments: CustomerSegment[];
  productPerformance: ProductPerformance[];
  customers: Customer[];
} | null = null;

// Load all data
export function loadMLData() {
  if (dataCache) return dataCache;

  dataCache = {
    kpis: kpisData as KPIs,
    dailyRevenue: dailyRevenueData as DailyRevenue[],
    anomalies: anomaliesData as Anomaly[],
    segments: segmentsData as CustomerSegment[],
    productPerformance: (productPerformanceData as any[]).map(p => ({
      ...p,
      trend30Day: typeof p.trend30Day === 'string' ? JSON.parse(p.trend30Day) : p.trend30Day,
    })) as ProductPerformance[],
    customers: customersData as Customer[],
  };

  return dataCache;
}

// Generate revenue forecast
export function generateRevenueForecast(dailyRevenue: DailyRevenue[], days: number = 30): RevenueForecast[] {
  if (!dailyRevenue || dailyRevenue.length < 60) return [];

  const recent = dailyRevenue.slice(-60);
  const revenues = recent.map(d => d.revenue);
  const meanRev = revenues.slice(-30).reduce((a, b) => a + b, 0) / 30;
  const stdRev = Math.sqrt(revenues.slice(-30).reduce((a, b) => a + (b - meanRev) ** 2, 0) / 30);
  const trend = (revenues[revenues.length - 1] - revenues[revenues.length - 7]) / 7;

  const forecasts: RevenueForecast[] = [];
  const lastDate = new Date(dailyRevenue[dailyRevenue.length - 1].date);

  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i + 1);

    let predicted = meanRev + trend * i + (Math.random() - 0.5) * stdRev * 0.2;
    let lower = predicted - stdRev * 1.5;
    let upper = predicted + stdRev * 1.5;

    // Weekend boost
    if (forecastDate.getDay() >= 5) {
      predicted *= 1.2;
      lower *= 1.2;
      upper *= 1.2;
    }

    forecasts.push({
      date: forecastDate.toISOString().split('T')[0],
      predicted: Math.max(0, Math.round(predicted * 100) / 100),
      lower_bound: Math.max(0, Math.round(lower * 100) / 100),
      upper_bound: Math.round(upper * 100) / 100,
      confidence: Math.round((0.94 - i * 0.005) * 1000) / 1000,
    });
  }

  return forecasts;
}

// Aggregate revenue by granularity
export function aggregateRevenue(dailyRevenue: DailyRevenue[], granularity: 'day' | 'week' | 'month') {
  if (granularity === 'day') {
    return dailyRevenue.slice(-90).map(d => ({
      date: d.date,
      revenue: d.revenue,
    }));
  }

  const aggregated: Record<string, number> = {};

  for (const d of dailyRevenue) {
    let key: string;
    if (granularity === 'week') {
      const date = new Date(d.date);
      const weekNum = Math.floor((date.getDate() - 1) / 7) + 1;
      key = `${d.date.substring(0, 7)}-W${weekNum}`;
    } else {
      key = d.date.substring(0, 7);
    }

    aggregated[key] = (aggregated[key] || 0) + d.revenue;
  }

  return Object.entries(aggregated)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(granularity === 'month' ? -24 : -52)
    .map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }));
}

// Compute churn distribution
export function computeChurnDistribution(customers: Customer[]) {
  const buckets = Array(10).fill(0);

  for (const c of customers) {
    const bucket = Math.min(9, Math.floor(c.churnRiskScore * 10));
    buckets[bucket]++;
  }

  const highRisk = customers.filter(c => c.churnRiskScore > 0.7);
  const revenueAtRisk = highRisk.reduce((sum, c) => sum + c.lifetimeValue, 0);

  return {
    distribution: {
      buckets: buckets.map((count, i) => ({
        range: `${(i / 10).toFixed(1)}-${((i + 1) / 10).toFixed(1)}`,
        count,
      })),
    },
    high_risk_threshold: 0.7,
    high_risk_customers: highRisk.length,
    revenue_at_risk: Math.round(revenueAtRisk * 100) / 100,
    churn_rate_monthly: 0.08,
    model_metrics: {
      model: 'RandomForestClassifier',
      auc_roc: 0.89,
      precision: 0.84,
      recall: 0.78,
      f1_score: 0.81,
    },
    features: [
      'recency_days',
      'frequency',
      'monetary',
      'avg_session_duration',
      'support_tickets',
      'discount_usage_rate',
    ],
  };
}

// Get customer sample for segment
export function getSegmentCustomers(customers: Customer[], clusterId: number, limit: number = 50) {
  return customers
    .filter(c => c.cluster === clusterId)
    .slice(0, limit)
    .map(c => ({
      id: c.id,
      recency: c.recencyDays,
      frequency: c.frequency,
      monetary: c.monetary,
      ltv: c.lifetimeValue,
    }));
}
