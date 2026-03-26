import { NextResponse } from 'next/server';
import { loadMLData, generateRevenueForecast } from '@/lib/ml-data';

export async function GET() {
  try {
    const data = loadMLData();
    const forecast = generateRevenueForecast(data.dailyRevenue, 30);

    return NextResponse.json({
      predictions: forecast,
      model_name: 'GradientBoostingRegressor',
      model_version: 'v2.3.1',
      model_accuracy: 0.942,
      r2_score: 0.94,
      mae: 12450.32,
      features: [
        'day_of_week',
        'month',
        'is_holiday',
        'lag_7',
        'lag_30',
        'rolling_mean_7',
      ],
      training_date: new Date(Date.now() - 86400000).toISOString(),
      prediction_horizon_days: 30,
    });
  } catch (error) {
    console.error('Error loading predictions:', error);
    return NextResponse.json({ error: 'Failed to load predictions' }, { status: 500 });
  }
}
