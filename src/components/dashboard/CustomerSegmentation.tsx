'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Crown,
  Heart,
  AlertTriangle,
  Moon
} from 'lucide-react';

interface CustomerSample {
  id: string;
  recency: number;
  frequency: number;
  monetary: number;
  ltv: number;
}

interface Segment {
  clusterId: number;
  segmentName: string;
  segmentSize: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
  avgLTV: number;
  color: string;
  description: string;
  customers_sample: CustomerSample[];
}

interface SegmentsData {
  segments: Segment[];
  total_customers: number;
  model: string;
  n_clusters: number;
}

// Format DZD
function formatDZD(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
}

const segmentIcons: Record<string, React.ReactNode> = {
  'Champions': <Crown className="h-4 w-4" />,
  'Fidèles': <Heart className="h-4 w-4" />,
  'À Risque': <AlertTriangle className="h-4 w-4" />,
  'Hibernants': <Moon className="h-4 w-4" />,
};

export default function CustomerSegmentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<SegmentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);

  useEffect(() => {
    fetch('/api/customers/segments')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load segments:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const { width } = container.getBoundingClientRect();
    const isMobile = width < 640;
    const height = isMobile ? 280 : 320;
    const margin = { top: 25, right: 25, bottom: 45, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const allCustomers: (CustomerSample & { segment: Segment })[] = [];
    data.segments.forEach(segment => {
      segment.customers_sample.forEach(customer => {
        allCustomers.push({ ...customer, segment });
      });
    });

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(allCustomers, d => d.frequency) || 50])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allCustomers, d => d.monetary) || 1000000])
      .range([innerHeight, 0]);

    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(allCustomers, d => d.ltv) || 1000000])
      .range([isMobile ? 2 : 3, isMobile ? 10 : 14]);

    // Grid
    const gridColor = 'rgba(0,0,0,0.05)';
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

    // Circles with animation
    g.selectAll('circle')
      .data(allCustomers)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.frequency))
      .attr('cy', d => yScale(d.monetary))
      .attr('r', 0)
      .attr('fill', d => d.segment.color)
      .attr('opacity', 0.6)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .transition()
      .duration(800)
      .delay((_, i) => i * 2)
      .attr('r', d => sizeScale(d.ltv));

    // Add interactivity
    g.selectAll('circle')
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 3)
          .attr('opacity', 1)
          .attr('r', sizeScale(d.ltv) * 1.3);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke-width', 1)
          .attr('opacity', 0.6);
      })
      .on('click', (_, d: any) => setSelectedSegment(d.segment));

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(isMobile ? 5 : 8));

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat((d: d3.NumberValue) => `${formatDZD(Number(d))} DZD`));

    // Axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + (isMobile ? 35 : 40))
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '10px' : '12px')
      .attr('fill', 'currentColor')
      .text('Fréquence d\'achat');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .attr('font-size', isMobile ? '10px' : '12px')
      .attr('fill', 'currentColor')
      .text('Valeur monétaire');

  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden h-full">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="p-2 rounded-lg bg-violet-500 shadow-lg shadow-violet-500/30">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            Segmentation Client
          </CardTitle>
          <CardDescription>
            KMeans RFM • {data?.total_customers.toLocaleString()} clients analysés
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <Skeleton className="h-[280px] sm:h-[320px] w-full" />
          ) : (
            <>
              <div ref={containerRef} className="w-full">
                <svg ref={svgRef} className="w-full"></svg>
              </div>
              
              {/* Segment Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-6">
                {data?.segments.map((segment, index) => (
                  <motion.div
                    key={segment.clusterId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedSegment?.clusterId === segment.clusterId
                        ? 'border-2 shadow-lg scale-[1.02]'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: `${segment.color}10`,
                      borderColor: selectedSegment?.clusterId === segment.clusterId ? segment.color : 'transparent'
                    }}
                    onClick={() => setSelectedSegment(segment)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: segment.color, color: '#fff' }}
                      >
                        {segmentIcons[segment.segmentName] || <Users className="h-4 w-4" />}
                      </div>
                      <span className="font-semibold text-sm sm:text-base">{segment.segmentName}</span>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <div>{segment.segmentSize.toLocaleString()} clients</div>
                      <div className="font-medium" style={{ color: segment.color }}>
                        LTV: {formatDZD(segment.avgLTV)} DZD
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selected Segment Details */}
              <AnimatePresence>
                {selectedSegment && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div 
                      className="p-4 rounded-xl border-l-4"
                      style={{ 
                        backgroundColor: `${selectedSegment.color}08`,
                        borderColor: selectedSegment.color
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <span style={{ color: selectedSegment.color }}>
                            {segmentIcons[selectedSegment.segmentName]}
                          </span>
                          Segment {selectedSegment.segmentName}
                        </h4>
                        <Badge style={{ backgroundColor: selectedSegment.color, color: '#fff' }}>
                          {((selectedSegment.segmentSize / (data?.total_customers || 1)) * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {selectedSegment.description}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                          <div className="text-gray-500 text-xs">Récence</div>
                          <div className="font-semibold">{selectedSegment.avgRecency.toFixed(0)} jours</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                          <div className="text-gray-500 text-xs">Fréquence</div>
                          <div className="font-semibold">{selectedSegment.avgFrequency.toFixed(1)} cmd</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
                          <div className="text-gray-500 text-xs">Monétaire</div>
                          <div className="font-semibold">{formatDZD(selectedSegment.avgMonetary)} DZD</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
