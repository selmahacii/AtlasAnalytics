'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Calendar, 
  Activity,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react';

interface Anomaly {
  date: string;
  type: string;
  severity: string;
  deviationPercent: number;
  expectedValue: number;
  actualValue: number;
  description: string;
}

interface AnomaliesData {
  anomalies: Anomaly[];
  total_anomalies: number;
  model: string;
  contamination: number;
  by_severity: {
    high: number;
    medium: number;
    low: number;
  };
}

// Format DZD
function formatDZD(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
}

export default function AnomalyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<AnomaliesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);

  useEffect(() => {
    fetch('/api/anomalies?limit=100')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load anomalies:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();
    const isMobile = width < 640;
    const height = isMobile ? 180 : 220;
    const margin = { top: 15, right: 20, bottom: 35, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const anomalies = data.anomalies;
    
    const sortedAnomalies = anomalies
      .map(a => ({
        ...a,
        parsedDate: new Date(a.date)
      }))
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    if (sortedAnomalies.length === 0) {
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'currentColor')
        .attr('font-size', '14px')
        .text('✓ Aucune anomalie détectée');
      return;
    }

    const xScale = d3.scaleTime()
      .domain(d3.extent(sortedAnomalies, d => d.parsedDate) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(sortedAnomalies, d => d.deviationPercent) || 50])
      .range([innerHeight, 0]);

    const severityColors: Record<string, string> = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981',
    };

    // Grid
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', 'rgba(0,0,0,0.05)');

    // Dots with animation
    g.selectAll('circle')
      .data(sortedAnomalies)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.parsedDate))
      .attr('cy', d => yScale(d.deviationPercent))
      .attr('r', 0)
      .attr('fill', d => severityColors[d.severity] || '#666')
      .attr('opacity', 0.85)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .transition()
      .duration(600)
      .delay((_, i) => i * 30)
      .attr('r', isMobile ? 6 : 8);

    // Add interactivity
    g.selectAll('circle')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', isMobile ? 9 : 12)
          .attr('opacity', 1)
          .attr('stroke-width', 3);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', isMobile ? 6 : 8)
          .attr('opacity', 0.85)
          .attr('stroke-width', 2);
      })
      .on('click', (_, d: any) => setSelectedAnomaly(d));

    // Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(isMobile ? 4 : 6).tickFormat((d: Date | d3.NumberValue) => d3.timeFormat('%d/%m')(d as Date)));

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `${d}%`));

    // Y axis label
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -28)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '9px' : '10px')
      .attr('fill', 'currentColor')
      .text('Déviation %');

  }, [data]);

  const severityConfig: Record<string, { color: string; bgColor: string; label: string; icon: React.ReactNode }> = {
    high: { color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', label: 'Critique', icon: <AlertCircle className="h-4 w-4" /> },
    medium: { color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', label: 'Modéré', icon: <AlertTriangle className="h-4 w-4" /> },
    low: { color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200', label: 'Faible', icon: <Info className="h-4 w-4" /> },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="p-2 rounded-lg bg-amber-500 shadow-lg shadow-amber-500/30">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Détection d'Anomalies
              </CardTitle>
              <CardDescription className="mt-1">
                IsolationForest • Contamination: {data?.contamination || 0.05}
              </CardDescription>
            </div>
            {data && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  {data.by_severity.high} Critique
                </Badge>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {data.by_severity.medium} Modéré
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  {data.by_severity.low} Faible
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <Skeleton className="h-[180px] sm:h-[220px] w-full" />
          ) : (
            <>
              <div ref={containerRef} className="w-full">
                <svg ref={svgRef} className="w-full"></svg>
              </div>

              {/* Selected Anomaly Details */}
              <AnimatePresence>
                {selectedAnomaly && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-4 rounded-xl border-2 ${severityConfig[selectedAnomaly.severity]?.bgColor}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedAnomaly.date).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h4>
                        <Badge 
                          variant="outline"
                          className={`${severityConfig[selectedAnomaly.severity]?.color} border-current`}
                        >
                          {severityConfig[selectedAnomaly.severity]?.icon}
                          <span className="ml-1">{severityConfig[selectedAnomaly.severity]?.label}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {selectedAnomaly.description}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                          <div className="text-gray-500 text-xs mb-1">Attendu</div>
                          <div className="font-semibold">{formatDZD(selectedAnomaly.expectedValue)} DZD</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                          <div className="text-gray-500 text-xs mb-1">Réel</div>
                          <div className="font-semibold">{formatDZD(selectedAnomaly.actualValue)} DZD</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                          <div className="text-gray-500 text-xs mb-1">Déviation</div>
                          <div className="font-semibold text-red-500">+{selectedAnomaly.deviationPercent.toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Model Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Modèle: {data?.model}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{data?.total_anomalies} anomalies détectées</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
