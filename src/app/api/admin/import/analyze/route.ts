/**
 * API Route: Analyze Import Source
 * POST /api/admin/import/analyze
 * 
 * Analyzes a data source and returns available item count and sample data
 * Server-side only, requires authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdapterRegistry } from '@/modules/database-importer/adapters';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // if (!await checkAdminAuth(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { source } = body;

    if (!source) {
      return NextResponse.json(
        { error: 'Source parameter required' },
        { status: 400 },
      );
    }

    // Get adapter
    const registry = getAdapterRegistry();
    const adapter = registry.getAdapter(source);

    if (!adapter) {
      return NextResponse.json(
        { error: `Source "${source}" not found` },
        { status: 400 },
      );
    }

    // Analyze source
    const totalAvailable = await adapter.getItemCount();
    
    // Fetch sample
    const sampleItems = await adapter.fetchItems(10, 0);

    return NextResponse.json({
      success: true,
      source: adapter.name,
      totalAvailable,
      sampleCount: sampleItems.length,
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 },
    );
  }
}
