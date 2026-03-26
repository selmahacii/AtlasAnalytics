import { NextRequest, NextResponse } from 'next/server';
import { loadMLData } from '@/lib/ml-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const data = loadMLData();
    const products = data.productPerformance.slice(0, limit);

    return NextResponse.json({
      products,
      total_products: 2000,
      low_stock_count: data.productPerformance.filter(p => p.stockAlert).length,
    });
  } catch (error) {
    console.error('Error loading product performance:', error);
    return NextResponse.json({ error: 'Failed to load product performance' }, { status: 500 });
  }
}
