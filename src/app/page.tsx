'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Sparkles,
  Activity,
  Zap,
  BarChart3,
  Database,
  Clock,
  CheckCircle2
} from 'lucide-react';
import KPIHeader from '@/components/dashboard/KPIHeader';
import RevenueForecastChart from '@/components/dashboard/RevenueForecastChart';
import CustomerSegmentation from '@/components/dashboard/CustomerSegmentation';
import ProductPerformanceTable from '@/components/dashboard/ProductPerformanceTable';
import ChurnRiskHistogram from '@/components/dashboard/ChurnRiskHistogram';
import AnomalyTimeline from '@/components/dashboard/AnomalyTimeline';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-violet-500/25"
              >
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  ML Analytics Platform
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Tableau de Bord Prédictif E-commerce
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              {/* KPI Claims */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800"
                >
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">+28% CA</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800"
                >
                  <Target className="h-4 w-4 text-violet-600" />
                  <span className="font-semibold text-violet-700 dark:text-violet-400">35% Meilleures Décisions</span>
                </motion.div>
              </div>

              {/* Live Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">En Direct</span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* KPI Cards */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <KPIHeader />
        </motion.section>

        {/* ML Models Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm font-medium opacity-90">Prévision Revenus</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold">R² = 0.94</div>
                <div className="text-xs opacity-75 mt-1">GradientBoostingRegressor</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border-0 shadow-lg bg-gradient-to-br from-red-500 to-rose-600 text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm font-medium opacity-90">Prédiction Churn</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold">AUC = 0.89</div>
                <div className="text-xs opacity-75 mt-1">RandomForestClassifier</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border-0 shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm font-medium opacity-90">Segmentation</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold">4 Segments</div>
                <div className="text-xs opacity-75 mt-1">KMeans RFM</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm font-medium opacity-90">Détection Anomalies</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold">21 Alertes</div>
                <div className="text-xs opacity-75 mt-1">IsolationForest</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Revenue Forecast - Full width on mobile, half on desktop */}
          <div className="xl:col-span-2">
            <RevenueForecastChart />
          </div>

          {/* Customer Segmentation */}
          <CustomerSegmentation />

          {/* Churn Risk */}
          <ChurnRiskHistogram />
        </div>

        {/* Product Performance */}
        <div className="mb-6">
          <ProductPerformanceTable />
        </div>

        {/* Anomaly Timeline */}
        <div className="mb-6">
          <AnomalyTimeline />
        </div>

        {/* Footer Stats */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 pt-6 border-t"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { value: '10M+', label: 'Transactions Analysées', icon: Database, color: 'text-violet-500' },
              { value: '4', label: 'Modèles ML Actifs', icon: Brain, color: 'text-emerald-500' },
              { value: '500K', label: 'Clients Analysés', icon: BarChart3, color: 'text-amber-500' },
              { value: '<200ms', label: 'Temps de Réponse API', icon: Zap, color: 'text-red-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border"
              >
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <div className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm border mb-8">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Technologies Utilisées
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js 16', 'React 18', 'D3.js', 'Tailwind CSS', 'TypeScript', 'Framer Motion'].map(tech => (
                  <span key={tech} className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-violet-500" />
                Modèles Machine Learning
              </h3>
              <div className="flex flex-wrap gap-2">
                {['GradientBoostingRegressor', 'RandomForestClassifier', 'KMeans', 'IsolationForest'].map(model => (
                  <span key={model} className="px-3 py-1 text-xs font-medium rounded-full bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="text-center px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-violet-50 dark:from-emerald-950 dark:to-violet-950 border mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                +28% d'amélioration du chiffre d'affaires
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <Target className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-400">
                35% de meilleures décisions stratégiques
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 max-w-3xl mx-auto">
              Méthodologie: Comparaison des revenus réels avec les prédictions ML pour l'optimisation des prix et des stocks.
              Segmentation client permettant des campagnes ciblées (réduction du churn de 12%). Détection d'anomalies
              en temps réel pour prévenir les pertes de revenus.
            </p>
          </div>
        </motion.footer>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Développé avec ❤️ en utilisant{' '}
            <span className="font-medium">Next.js</span> et{' '}
            <span className="font-medium">D3.js</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Plateforme Atlas Analytics - Intelligence Business E-commerce
          </p>
        </div>
      </footer>
    </div>
  );
}
