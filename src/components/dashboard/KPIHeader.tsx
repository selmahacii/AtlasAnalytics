'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Target,
  Percent,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface KPIs {
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

// Format DZD currency
function formatDZD(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)} Md DZD`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)} M DZD`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K DZD`;
  }
  return `${value.toFixed(0)} DZD`;
}

function AnimatedCounter({ value, formatter }: { value: number; formatter: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(value);

  useEffect(() => {
    const duration = 2000;
    const steps = 80;
    const increment = (value - ref.current) / steps;
    let current = ref.current;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      setDisplayValue(current);
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{formatter(displayValue)}</span>;
}

interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color: string;
  bgColor: string;
  delay?: number;
  format?: 'currency' | 'number' | 'percent';
}

function KPICard({ title, value, icon, trend, trendLabel, color, bgColor, delay = 0, format = 'number' }: KPICardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  const formatValue = (v: number) => {
    if (format === 'currency') return formatDZD(v);
    if (format === 'percent') return `${v.toFixed(1)}%`;
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
    return v.toFixed(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`relative overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`} 
            style={{ background: bgColor }}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 truncate">{title}</p>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {format === 'currency' ? (
                  <AnimatedCounter value={value} formatter={formatValue} />
                ) : (
                  <AnimatedCounter value={value} formatter={formatValue} />
                )}
                {format === 'percent' && <span className="text-lg">%</span>}
              </div>
              {trend !== undefined && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                  className={`flex items-center gap-1 mt-2 text-xs sm:text-sm font-medium ${
                    isPositive ? 'text-emerald-600' : 'text-red-500'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                  <span>{Math.abs(trend).toFixed(1)}%</span>
                  <span className="text-gray-500 font-normal">{trendLabel || 'vs période préc.'}</span>
                </motion.div>
              )}
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
              className="p-2.5 sm:p-3 rounded-xl shadow-md"
              style={{ backgroundColor: color }}
            >
              <div className="text-white">{icon}</div>
            </motion.div>
          </div>
        </CardContent>
        
        {/* Decorative gradient */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 opacity-80"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
      </Card>
    </motion.div>
  );
}

export default function KPIHeader() {
  const [kpis, setKPIs] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/kpis')
      .then(res => res.json())
      .then(data => {
        setKPIs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load KPIs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!kpis) return null;

  const kpiCards = [
    {
      title: 'Chiffre d\'Affaires',
      value: kpis.total_revenue,
      icon: <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />,
      trend: kpis.revenue_growth_pct,
      trendLabel: 'croissance',
      color: '#10b981',
      bgColor: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
      format: 'currency' as const,
    },
    {
      title: 'Transactions',
      value: kpis.total_transactions,
      icon: <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />,
      trend: 15.2,
      trendLabel: 'hausse',
      color: '#3b82f6',
      bgColor: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      format: 'number' as const,
    },
    {
      title: 'Panier Moyen',
      value: kpis.avg_order_value,
      icon: <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />,
      trend: 8.5,
      trendLabel: 'hausse',
      color: '#8b5cf6',
      bgColor: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      format: 'currency' as const,
    },
    {
      title: 'Précision ML',
      value: kpis.ml_accuracy,
      icon: <Target className="h-5 w-5 sm:h-6 sm:w-6" />,
      color: '#f59e0b',
      bgColor: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      format: 'percent' as const,
    },
    {
      title: 'Croissance CA',
      value: kpis.revenue_growth_pct,
      icon: <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />,
      color: '#ef4444',
      bgColor: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      format: 'percent' as const,
    },
    {
      title: 'Réduction Coûts',
      value: kpis.cost_reduction_pct,
      icon: <Percent className="h-5 w-5 sm:h-6 sm:w-6" />,
      color: '#06b6d4',
      bgColor: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
      format: 'percent' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {kpiCards.map((kpi, index) => (
        <KPICard key={kpi.title} {...kpi} delay={index * 0.1} />
      ))}
    </div>
  );
}
