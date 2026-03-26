'use client';

import React from 'react';
import Image from 'next/image';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-[2000px] mx-auto">
            <div className="flex items-center gap-3">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0"
              >
                <Image src="/logo.png" alt="Atlas Analytics Logo" fill className="object-contain drop-shadow-sm" priority />
              </motion.div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Atlas Analytics Platform
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">+28% CA</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <Target className="h-4 w-4 text-indigo-600" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">35% Meilleures Décisions</span>
                </motion.div>
              </div>

              {/* Live Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">En Direct</span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-[2000px] mx-auto">
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
              whileHover={{ scale: 1.01, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">Prévision Revenus</span>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">R² = 0.94</div>
              <div className="text-xs text-slate-500 mt-1">GradientBoostingRegressor</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Target className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">Prédiction Churn</span>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">AUC = 0.89</div>
              <div className="text-xs text-slate-500 mt-1">RandomForestClassifier</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">Segmentation</span>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">4 Segments</div>
              <div className="text-xs text-slate-500 mt-1">KMeans RFM</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01, y: -2 }}
              className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-medium">Détection Anomalies</span>
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">21 Alertes</div>
              <div className="text-xs text-slate-500 mt-1">IsolationForest</div>
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
              { value: '10M+', label: 'Transactions Analysées', icon: Database },
              { value: '4', label: 'Modèles ML Actifs', icon: Brain },
              { value: '500K', label: 'Clients Analysés', icon: BarChart3 },
              { value: '<200ms', label: 'Temps de Réponse API', icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center p-4 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800"
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-indigo-500" />
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                Technologies Utilisées
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Next.js 16', 'React 18', 'D3.js', 'Tailwind CSS', 'TypeScript', 'Framer Motion'].map(tech => (
                  <span key={tech} className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                Modèles Machine Learning
              </h3>
              <div className="flex flex-wrap gap-2">
                {['GradientBoostingRegressor', 'RandomForestClassifier', 'KMeans', 'IsolationForest'].map(model => (
                  <span key={model} className="px-3 py-1 text-xs font-medium rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="text-center px-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                +28% d'amélioration du chiffre d'affaires
              </span>
              <span className="mx-2 text-slate-300 dark:text-slate-600">|</span>
              <Target className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                35% de meilleures décisions stratégiques
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl mx-auto">
              Méthodologie: Comparaison des revenus réels avec les prédictions ML pour l'optimisation des prix et des stocks.
              Segmentation client permettant des campagnes ciblées (réduction du churn de 12%). Détection d'anomalies
              en temps réel pour prévenir les pertes de revenus.
            </p>
          </div>
        </motion.footer>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Développé par Selma Haci
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Plateforme Atlas Analytics - Intelligence Business E-commerce
          </p>
        </div>
      </footer>
    </div>
  );
}
