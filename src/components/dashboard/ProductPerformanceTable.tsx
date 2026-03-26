'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  ExternalLink
} from 'lucide-react';

interface Product {
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

interface PerformanceData {
  products: Product[];
  total_products: number;
  low_stock_count: number;
}

// Format DZD
function formatDZD(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
}

function Sparkline({ data, width = 80, height = 24 }: { data: number[]; width?: number; height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 2, right: 2, bottom: 2, left: 2 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data) || 0, d3.max(data) || 1])
      .range([innerHeight, margin.top]);

    const line = d3.line<number>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    const trend = data[data.length - 1] > data[0];
    const color = trend ? '#10b981' : '#ef4444';

    // Area gradient
    const gradientId = `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`;
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);

    const area = d3.area<number>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', `url(#${gradientId})`)
      .attr('d', area);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}

export default function ProductPerformanceTable() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<keyof Product>('revenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetch('/api/products/performance?limit=100')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, []);

  const sortedProducts = data?.products
    ? [...data.products].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
        }
        return 0;
      })
    : [];

  const paginatedProducts = sortedProducts.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(sortedProducts.length / pageSize);

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const getSortIcon = (columnKey: keyof Product) => {
    if (sortKey !== columnKey) return <SortAsc className="h-3 w-3 ml-1 opacity-30" />;
    return sortDir === 'desc' 
      ? <SortDesc className="h-3 w-3 ml-1 text-violet-500" />
      : <SortAsc className="h-3 w-3 ml-1 text-violet-500" />;
  };

  const categoryColors: Record<string, string> = {
    'Électronique': 'bg-blue-100 text-blue-700',
    'Mode': 'bg-pink-100 text-pink-700',
    'Maison & Jardin': 'bg-green-100 text-green-700',
    'Sport': 'bg-orange-100 text-orange-700',
    'Beauté': 'bg-purple-100 text-purple-700',
    'Livres': 'bg-amber-100 text-amber-700',
    'Jouets': 'bg-cyan-100 text-cyan-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="p-2 rounded-lg bg-amber-500 shadow-lg shadow-amber-500/30">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Performance Produits
              </CardTitle>
              <CardDescription className="mt-1">
                Top {data?.products.length || 0} produits par revenu
              </CardDescription>
            </div>
            {data && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-white/50">
                  {data.total_products.toLocaleString()} produits
                </Badge>
                {data.low_stock_count > 0 && (
                  <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="h-3 w-3" />
                    {data.low_stock_count} stock faible
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 sm:p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/70 dark:hover:bg-gray-800/70">
                      <TableHead className="w-10 text-center font-semibold">#</TableHead>
                      <TableHead className="font-semibold">Produit</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">Catégorie</TableHead>
                      <TableHead 
                        className="text-right font-semibold cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                        onClick={() => handleSort('revenue')}
                      >
                        <div className="flex items-center justify-end">
                          Revenu {getSortIcon('revenue')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right font-semibold cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors"
                        onClick={() => handleSort('margin')}
                      >
                        <div className="flex items-center justify-end">
                          Marge {getSortIcon('margin')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right font-semibold cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors hidden md:table-cell"
                        onClick={() => handleSort('unitsSold')}
                      >
                        <div className="flex items-center justify-end">
                          Unités {getSortIcon('unitsSold')}
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-semibold hidden lg:table-cell">Tendance 30j</TableHead>
                      <TableHead className="text-center font-semibold">État</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product, index) => (
                      <motion.tr
                        key={product.productId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-400 text-center">
                          {page * pageSize + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm truncate max-w-[150px] sm:max-w-[200px]">{product.name}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {product.category}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDZD(product.price)} DZD
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={categoryColors[product.category] || 'bg-gray-100 text-gray-700'}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatDZD(product.revenue)} DZD
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={product.margin > 0 ? 'text-emerald-600 font-medium' : 'text-red-500'}>
                            {formatDZD(product.margin)} DZD
                          </span>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          {product.unitsSold.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center hidden lg:table-cell">
                          <Sparkline data={product.trend30Day} width={80} height={24} />
                        </TableCell>
                        <TableCell className="text-center">
                          {product.stockAlert ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Stock bas
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                              En stock
                            </Badge>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t bg-gray-50/30 dark:bg-gray-800/30">
                <div className="text-sm text-gray-500">
                  Affichage {page * pageSize + 1}-{Math.min((page + 1) * pageSize, sortedProducts.length)} sur {sortedProducts.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
