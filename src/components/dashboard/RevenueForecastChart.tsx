'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  RefreshCw,
  Info,
  Calendar
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DataPoint {
  date: string;
  revenue: number;
}

interface ForecastPoint {
  date: string;
  predicted: number;
  lower_bound: number;
  upper_bound: number;
  confidence: number;
}

interface RevenueData {
  actual: DataPoint[];
  forecast: ForecastPoint[];
  anomaly_dates: string[];
  granularity: string;
}

// Format DZD
function formatDZD(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
}

export default function RevenueForecastChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('day');
  const [hoverData, setHoverData] = useState<{date: string; value: number; type: string} | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/revenue/timeseries?granularity=${granularity}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load revenue data:', err);
        setLoading(false);
      });
  }, [granularity]);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();
    const isMobile = width < 640;
    const height = isMobile ? 280 : 380;
    const margin = { top: 30, right: isMobile ? 40 : 60, bottom: isMobile ? 40 : 50, left: isMobile ? 50 : 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const allData = [
      ...data.actual.map(d => ({ ...d, type: 'actual' })),
      ...data.forecast.map(d => ({ date: d.date, revenue: d.predicted, type: 'forecast' })),
    ];

    const parseDate = d3.timeParse('%Y-%m-%d');
    const parseWeekDate = d3.timeParse('%Y-%m-W%W');
    const parseMonthDate = d3.timeParse('%Y-%m');
    const parseFn = granularity === 'day' ? parseDate : granularity === 'week' ? parseWeekDate : parseMonthDate;

    allData.forEach(d => {
      d.date = parseFn(d.date)?.toISOString() || d.date;
    });

    const xScale = d3.scaleTime()
      .domain(d3.extent(allData, d => new Date(d.date)) as [Date, Date])
      .range([0, innerWidth]);

    const yMax = d3.max([
      ...data.actual.map(d => d.revenue),
      ...data.forecast.map(d => d.upper_bound),
    ]) || 0;

    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0]);

    // Grid
    const gridColor = 'rgba(0,0,0,0.06)';
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', gridColor);

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', gridColor);

    // Confidence interval
    const forecastArea = d3.area<ForecastPoint>()
      .x(d => xScale(new Date(d.date)))
      .y0(d => yScale(d.lower_bound))
      .y1(d => yScale(d.upper_bound))
      .curve(d3.curveMonotoneX);

    const gradientId = 'forecastGradient';
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6').attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#8b5cf6').attr('stop-opacity', 0.05);

    g.append('path')
      .datum(data.forecast)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', forecastArea);

    // Actual line
    const actualLine = d3.line<DataPoint>()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.revenue))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data.actual)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round')
      .attr('d', actualLine);

    // Forecast line
    const forecastLine = d3.line<ForecastPoint>()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.predicted))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data.forecast)
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '8,4')
      .attr('d', forecastLine);

    // Anomaly markers
    const anomalySet = new Set(data.anomaly_dates);
    const anomalyData = data.actual.filter(d => anomalySet.has(d.date));

    g.selectAll('.anomaly')
      .data(anomalyData)
      .enter()
      .append('g')
      .attr('class', 'anomaly-marker')
      .attr('transform', d => `translate(${xScale(new Date(d.date))},${yScale(d.revenue)})`)
      .each(function() {
        const parent = d3.select(this);
        parent.append('circle')
          .attr('r', 8)
          .attr('fill', '#ef4444')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('filter', 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))');
        
        parent.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.3em')
          .attr('fill', '#fff')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text('!');
      });

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(isMobile ? 4 : 6).tickFormat((d: Date | d3.NumberValue) => d3.timeFormat('%d/%m')(d as Date)));

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat((d: d3.NumberValue) => `${formatDZD(Number(d))} DZD`));

    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth - (isMobile ? 150 : 200)}, -5)`);

    // Actual legend
    legend.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 25)
      .attr('y2', 0)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5);

    legend.append('text')
      .attr('x', 30)
      .attr('y', 4)
      .attr('font-size', isMobile ? '10px' : '11px')
      .attr('fill', 'currentColor')
      .text('Réel');

    // Forecast legend
    legend.append('line')
      .attr('x1', 70)
      .attr('y1', 0)
      .attr('x2', 95)
      .attr('y2', 0)
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '8,4');

    legend.append('text')
      .attr('x', 100)
      .attr('y', 4)
      .attr('font-size', isMobile ? '10px' : '11px')
      .attr('fill', 'currentColor')
      .text('Prévision');

  }, [data, granularity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="p-2 rounded-lg bg-emerald-500 shadow-lg shadow-emerald-500/30">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Prévision des Revenus
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                GradientBoostingRegressor • Précision R² = 0.94
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(['day', 'week', 'month'] as const).map((g) => (
                <Button
                  key={g}
                  variant={granularity === g ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGranularity(g)}
                  className="text-xs px-3"
                >
                  {g === 'day' ? 'Jour' : g === 'week' ? 'Semaine' : 'Mois'}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <Skeleton className="h-[280px] sm:h-[380px] w-full rounded-lg" />
          ) : (
            <>
              <div ref={containerRef} className="w-full">
                <svg ref={svgRef} className="w-full"></svg>
              </div>
              
              {/* Stats below chart */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-gray-600 dark:text-gray-400">Anomalie détectée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-3 rounded bg-violet-200"></div>
                    <span className="text-gray-600 dark:text-gray-400">Intervalle 95%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                    <Calendar className="h-3 w-3 mr-1" />
                    30 jours prévision
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
