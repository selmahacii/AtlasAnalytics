import { NextResponse } from 'next/server';
import { loadMLData, computeChurnDistribution } from '@/lib/ml-data';

export async function GET() {
  try {
    const data = loadMLData();
    const churnData = computeChurnDistribution(data.customers);
    return NextResponse.json(churnData);
  } catch (error) {
    console.error('Error loading churn risk:', error);
    return NextResponse.json({ error: 'Failed to load churn risk' }, { status: 500 });
  }
}
