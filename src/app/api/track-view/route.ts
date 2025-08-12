import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get current view count
    const { data: currentPost, error: fetchError } = await supabase
      .from('posts')
      .select('view_count')
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error('Error fetching current view count:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch post' },
        { status: 404 }
      );
    }

    // Increment view count
    const newViewCount = (currentPost.view_count || 0) + 1;

    const { data, error } = await supabase
      .from('posts')
      .update({ 
        view_count: newViewCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select('view_count')
      .single();

    if (error) {
      console.error('Error updating view count:', error);
      return NextResponse.json(
        { error: 'Failed to update view count' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      viewCount: data.view_count
    });

  } catch (error) {
    console.error('Track view error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 