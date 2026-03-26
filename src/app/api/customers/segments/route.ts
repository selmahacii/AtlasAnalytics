import { NextResponse } from 'next/server';
import { loadMLData, getSegmentCustomers } from '@/lib/ml-data';

export async function GET() {
  try {
    const data = loadMLData();
    
    const segments = data.segments.map(seg => ({
      ...seg,
      customers_sample: getSegmentCustomers(data.customers, seg.clusterId),
    }));

    return NextResponse.json({
      segments,
      total_customers: data.customers.length,
      model: 'KMeans',
      n_clusters: 4,
    });
  } catch (error) {
    console.error('Error loading segments:', error);
    return NextResponse.json({ error: 'Failed to load segments' }, { status: 500 });
  }
}
