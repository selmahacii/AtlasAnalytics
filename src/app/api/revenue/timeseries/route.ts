import { NextRequest, NextResponse } from 'next/server';
import { loadMLData, aggregateRevenue, generateRevenueForecast } from '@/lib/ml-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const granularity = (searchParams.get('granularity') || 'day') as 'day' | 'week' | 'month';
    
    const data = loadMLData();
    const actual = aggregateRevenue(data.dailyRevenue, granularity);
    const forecast = generateRevenueForecast(data.dailyRevenue, 30);
    const anomalyDates = data.anomalies.map(a => a.date);

    return NextResponse.json({
      actual,
      forecast,
      anomaly_dates: anomalyDates,
      granularity,
    });
  } catch (error) {
    console.error('Error loading revenue timeseries:', error);
    return NextResponse.json({ error: 'Failed to load revenue timeseries' }, { status: 500 });
  }
}
