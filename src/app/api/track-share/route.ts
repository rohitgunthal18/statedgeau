import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { postId, platform, url, title } = await request.json();

    // Validate required fields
    if (!postId || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: postId and platform' },
        { status: 400 }
      );
    }

    // Get client IP and user agent for tracking
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Track the share event
    const { error: trackError } = await supabase
      .from('post_engagement')
      .insert({
        post_id: postId,
        action_type: 'share',
        timestamp: new Date().toISOString(),
        referrer: platform,
        session_id: `${clientIP}-${Date.now()}`,
        user_agent: userAgent
      });

    if (trackError) {
      console.error('Error tracking share:', trackError);
    }

    // Update post share count
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('share_count')
      .eq('id', postId)
      .single();

    if (fetchError) {
      console.error('Error fetching post:', fetchError);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const newShareCount = (post.share_count || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('posts')
      .update({ share_count: newShareCount })
      .eq('id', postId);

    if (updateError) {
      console.error('Error updating share count:', updateError);
      return NextResponse.json(
        { error: 'Failed to update share count' },
        { status: 500 }
      );
    }

    // Track popular shares for analytics
    const { error: popularError } = await supabase
      .from('popular_shares')
      .upsert({
        post_id: postId,
        platform: platform,
        url: url,
        title: title,
        share_count: 1,
        last_shared: new Date().toISOString()
      }, {
        onConflict: 'post_id,platform',
        ignoreDuplicates: false
      });

    if (popularError) {
      console.error('Error tracking popular share:', popularError);
      // Don't fail the request if this fails
    }

    return NextResponse.json({
      success: true,
      shareCount: newShareCount,
      platform: platform,
      message: 'Share tracked successfully'
    });

  } catch (error) {
    console.error('Share tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve share statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const timeframe = searchParams.get('timeframe') || '7d'; // 1d, 7d, 30d, all

    if (!postId) {
      return NextResponse.json(
        { error: 'Missing postId parameter' },
        { status: 400 }
      );
    }

    // Calculate date range based on timeframe
    let dateFilter = '';
    if (timeframe !== 'all') {
      const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = startDate.toISOString();
    }

    // Get share statistics
    let query = supabase
      .from('post_engagement')
      .select('referrer, timestamp')
      .eq('post_id', postId)
      .eq('action_type', 'share');

    if (dateFilter) {
      query = query.gte('timestamp', dateFilter);
    }

    const { data: shares, error } = await query;

    if (error) {
      console.error('Error fetching share stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch share statistics' },
        { status: 500 }
      );
    }

    // Process share statistics
    const platformStats = shares?.reduce((acc: any, share: any) => {
      const platform = share.referrer || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {}) || {};

    const totalShares = shares?.length || 0;

    // Get total share count from post
    const { data: post } = await supabase
      .from('posts')
      .select('share_count')
      .eq('id', postId)
      .single();

    return NextResponse.json({
      success: true,
      postId,
      timeframe,
      totalShares,
      totalSharesAllTime: post?.share_count || 0,
      platformStats,
      shares: shares?.map((share: any) => ({
        platform: share.referrer,
        timestamp: share.timestamp
      })) || []
    });

  } catch (error) {
    console.error('Share stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 