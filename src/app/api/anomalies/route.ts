import { NextRequest, NextResponse } from 'next/server';
import { loadMLData } from '@/lib/ml-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const severity = searchParams.get('severity');
    
    const data = loadMLData();
    let anomalies = data.anomalies;
    
    if (severity) {
      anomalies = anomalies.filter(a => a.severity === severity);
    }

    return NextResponse.json({
      anomalies: anomalies.slice(0, limit),
      total_anomalies: data.anomalies.length,
      model: 'IsolationForest',
      contamination: 0.05,
      by_severity: {
        high: data.anomalies.filter(a => a.severity === 'high').length,
        medium: data.anomalies.filter(a => a.severity === 'medium').length,
        low: data.anomalies.filter(a => a.severity === 'low').length,
      },
    });
  } catch (error) {
    console.error('Error loading anomalies:', error);
    return NextResponse.json({ error: 'Failed to load anomalies' }, { status: 500 });
  }
}
