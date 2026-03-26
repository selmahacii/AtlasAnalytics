'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Users, 
  TrendingDown,
  Shield,
  Target,
  Activity
} from 'lucide-react';

interface Bucket {
  range: string;
  count: number;
}

interface ModelMetrics {
  model: string;
  auc_roc: number;
  precision: number;
  recall: number;
  f1_score: number;
}

interface ChurnData {
  distribution: {
    buckets: Bucket[];
  };
  high_risk_threshold: number;
  high_risk_customers: number;
  revenue_at_risk: number;
  churn_rate_monthly: number;
  model_metrics: ModelMetrics;
  features: string[];
}

// Format DZD
function formatDZD(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
}

export default function ChurnRiskHistogram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<ChurnData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/churn/risk')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load churn data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();
    const isMobile = width < 640;
    const height = isMobile ? 220 : 260;
    const margin = { top: 20, right: 25, bottom: 45, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const buckets = data.distribution.buckets;
    const maxCount = d3.max(buckets, d => d.count) || 1;

    const xScale = d3.scaleBand()
      .domain(buckets.map(d => d.range))
      .range([0, innerWidth])
      .padding(0.15);

    const yScale = d3.scaleLinear()
      .domain([0, maxCount * 1.15])
      .range([innerHeight, 0]);

    // Gradient for bars
    const gradientId = 'churn-gradient';
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981');

    gradient.append('stop')
      .attr('offset', '60%')
      .attr('stop-color', '#f59e0b');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ef4444');

    // Bars with animation
    g.selectAll('rect')
      .data(buckets)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.range) || 0)
      .attr('y', innerHeight)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', `url(#${gradientId})`)
      .attr('rx', 4)
      .attr('opacity', 0.85)
      .transition()
      .duration(800)
      .delay((_, i) => i * 50)
      .attr('y', d => yScale(d.count))
      .attr('height', d => innerHeight - yScale(d.count));

    // Threshold line (0.7)
    const thresholdX = (xScale('0.7-0.8') || 0);
    g.append('line')
      .attr('x1', thresholdX)
      .attr('y1', 0)
      .attr('x2', thresholdX)
      .attr('y2', innerHeight)
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Threshold label
    g.append('text')
      .attr('x', thresholdX - 5)
      .attr('y', -3)
      .attr('text-anchor', 'end')
      .attr('font-size', isMobile ? '9px' : '10px')
      .attr('fill', '#ef4444')
      .attr('font-weight', '600')
      .text('Risque élevé →');

    // High risk zone background
    g.append('rect')
      .attr('x', thresholdX)
      .attr('y', 0)
      .attr('width', innerWidth - thresholdX)
      .attr('height', innerHeight)
      .attr('fill', '#ef4444')
      .attr('opacity', 0.05);

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('font-size', isMobile ? '8px' : '9px');

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat((d: d3.NumberValue) => Number(d) >= 1000 ? `${(Number(d) / 1000).toFixed(0)}K` : d.toString()));

    // Axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + (isMobile ? 38 : 42))
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '9px' : '11px')
      .attr('fill', 'currentColor')
      .text('Score de Risque de Désabonnement');

  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden h-full">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="p-2 rounded-lg bg-red-500 shadow-lg shadow-red-500/30">
              <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            Analyse du Risque de Désabonnement
          </CardTitle>
          <CardDescription>
            RandomForestClassifier • AUC-ROC = 0.89
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <Skeleton className="h-[220px] sm:h-[260px] w-full" />
          ) : (
            <>
              <div ref={containerRef} className="w-full">
                <svg ref={svgRef} className="w-full"></svg>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800"
                >
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Risque Élevé</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-red-700">
                    {data?.high_risk_customers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">clients</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 }}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800"
                >
                  <div className="text-sm font-medium text-amber-600 mb-2">Revenu à Risque</div>
                  <div className="text-xl sm:text-2xl font-bold text-amber-700">
                    {formatDZD(data?.revenue_at_risk || 0)} DZD
                  </div>
                  <div className="text-xs text-gray-500">perte potentielle</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border"
                >
                  <div className="text-sm font-medium text-gray-600 mb-2">Taux Mensuel</div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    {((data?.churn_rate_monthly || 0) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">désabonnement</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75 }}
                  className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border border-emerald-200 dark:border-emerald-800"
                >
                  <div className="text-sm font-medium text-emerald-600 mb-2">Précision AUC</div>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-700">
                    {(data?.model_metrics.auc_roc || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">exactitude</div>
                </motion.div>
              </div>

              {/* Model Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-violet-500" />
                  <span className="font-medium text-sm">Performance du Modèle</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-1">
                    <span className="text-gray-500">Précision</span>
                    <span className="font-semibold">{(data?.model_metrics.precision || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-1">
                    <span className="text-gray-500">Rappel</span>
                    <span className="font-semibold">{(data?.model_metrics.recall || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-1">
                    <span className="text-gray-500">Score F1</span>
                    <span className="font-semibold">{(data?.model_metrics.f1_score || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-start sm:gap-1">
                    <span className="text-gray-500">AUC-ROC</span>
                    <span className="font-semibold text-emerald-600">{(data?.model_metrics.auc_roc || 0).toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
