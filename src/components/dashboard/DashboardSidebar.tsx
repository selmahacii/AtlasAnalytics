'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  BarChart3,
  Brain,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', id: 'dashboard' },
  { icon: <TrendingUp className="h-5 w-5" />, label: 'Revenue Forecast', id: 'revenue' },
  { icon: <Users className="h-5 w-5" />, label: 'Customer Segments', id: 'segments' },
  { icon: <Package className="h-5 w-5" />, label: 'Products', id: 'products' },
  { icon: <AlertTriangle className="h-5 w-5" />, label: 'Anomaly Detection', id: 'anomalies' },
  { icon: <BarChart3 className="h-5 w-5" />, label: 'Churn Analysis', id: 'churn' },
];

const bottomNavItems: NavItem[] = [
  { icon: <Brain className="h-5 w-5" />, label: 'ML Models', id: 'models' },
  { icon: <Settings className="h-5 w-5" />, label: 'Settings', id: 'settings' },
  { icon: <HelpCircle className="h-5 w-5" />, label: 'Help', id: 'help' },
];

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <TooltipProvider>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 70 : 240 }}
        transition={{ duration: 0.2 }}
        className="h-screen bg-card border-r flex flex-col fixed left-0 top-0 z-40"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">ML Analytics</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {navItems.map((item) => (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === item.id ? 'secondary' : 'ghost'}
                    className={`w-full ${collapsed ? 'justify-center' : 'justify-start'} gap-3`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {item.icon}
                    {!collapsed && (
                      <>
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="py-4 border-t">
          <div className="px-3 space-y-1">
            {bottomNavItems.map((item) => (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeItem === item.id ? 'secondary' : 'ghost'}
                    className={`w-full ${collapsed ? 'justify-center' : 'justify-start'} gap-3`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t">
            <div className="p-3 rounded-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium">ML Status</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Models Active:</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Accuracy:</span>
                  <span className="font-medium text-emerald-500">94.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </TooltipProvider>
  );
}
