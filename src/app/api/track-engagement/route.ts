import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { postId, action } = await request.json();
    
    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Post ID and action are required' },
        { status: 400 }
      );
    }

    // Validate action type
    const validActions = ['like', 'share', 'favorite'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action type' },
        { status: 400 }
      );
    }

    // Get current engagement counts
    const { data: currentPost, error: fetchError } = await supabase
      .from('posts')
      .select('like_count, share_count, favorite_count')
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error('Error fetching current engagement counts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch post' },
        { status: 404 }
      );
    }

    // Determine which field to update
    let updateField = '';
    let currentCount = 0;
    
    switch (action) {
      case 'like':
        updateField = 'like_count';
        currentCount = currentPost.like_count || 0;
        break;
      case 'share':
        updateField = 'share_count';
        currentCount = currentPost.share_count || 0;
        break;
      case 'favorite':
        updateField = 'favorite_count';
        currentCount = currentPost.favorite_count || 0;
        break;
    }

    // Increment the count
    const newCount = currentCount + 1;

    // Create the update object with proper typing
    const updateObject: { [key: string]: any } = {
      [updateField]: newCount,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('posts')
      .update(updateObject)
      .eq('id', postId)
      .select(`${updateField}`)
      .single();

    if (error) {
      console.error(`Error updating ${action} count:`, error);
      return NextResponse.json(
        { error: `Failed to update ${action} count` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      count: (data as any)[updateField]
    });

  } catch (error) {
    console.error('Track engagement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 