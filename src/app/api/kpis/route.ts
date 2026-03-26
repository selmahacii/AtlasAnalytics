import { NextResponse } from 'next/server';
import { loadMLData } from '@/lib/ml-data';

export async function GET() {
  try {
    const data = loadMLData();
    return NextResponse.json(data.kpis);
  } catch (error) {
    console.error('Error loading KPIs:', error);
    return NextResponse.json({ error: 'Failed to load KPIs' }, { status: 500 });
  }
}
