import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/search';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Build filters
    const filters: any = {};
    if (category) filters.category = category;
    if (tags && tags.length > 0) filters.tags = tags;

    // Perform search
    const { results, total, suggestions } = await searchService.searchPosts(
      query,
      filters,
      limit,
      offset
    );

    return NextResponse.json({
      results,
      total,
      suggestions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters = {}, page = 1, limit = 20 } = body;
    
    const offset = (page - 1) * limit;

    // Perform search
    const { results, total, suggestions } = await searchService.searchPosts(
      query,
      filters,
      limit,
      offset
    );

    return NextResponse.json({
      results,
      total,
      suggestions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
} 