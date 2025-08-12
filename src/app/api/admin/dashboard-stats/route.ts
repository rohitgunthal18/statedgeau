import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin dashboard
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get current date ranges
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);
    
    const [
      { data: publishedPosts },
      { data: totalEngagement },
      { data: currentMonthViews },
      { data: lastMonthViews },
      { data: comments },
      { data: recentActivity }
    ] = await Promise.all([
      // Published posts count
      supabase
        .from('posts')
        .select('id, view_count, share_count, favorite_count, like_count')
        .eq('status', 'published'),

      // Total engagement metrics
      supabase
        .from('posts')
        .select('view_count, share_count, favorite_count, like_count')
        .eq('status', 'published'),

      // Current month views
      supabase
        .from('post_engagement')
        .select('id')
        .eq('action_type', 'view')
        .gte('created_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString()),

      // Last month views for comparison
      supabase
        .from('post_engagement')
        .select('id')
        .eq('action_type', 'view')
        .gte('created_at', new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1).toISOString())
        .lt('created_at', new Date(now.getFullYear(), now.getMonth(), 1).toISOString()),

      // Comments/engagement count
      supabase
        .from('post_engagement')
        .select('id')
        .in('action_type', ['share', 'favorite', 'like']),

      // Recent activity (last 24 hours)
      supabase
        .from('post_engagement')
        .select('action_type, created_at, post_id')
        .gte('created_at', new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20)
    ]);

    // Calculate metrics
    const totalPosts = publishedPosts?.length || 0;
    const totalViews = totalEngagement?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
    
    const currentMonthViewsCount = currentMonthViews?.length || 0;
    const lastMonthViewsCount = lastMonthViews?.length || 0;
    
    // Calculate monthly growth
    const monthlyGrowth = lastMonthViewsCount > 0 
      ? Math.round(((currentMonthViewsCount - lastMonthViewsCount) / lastMonthViewsCount) * 100)
      : 0;

    // Total engagement (comments/interactions)
    const totalComments = comments?.length || 0;

    // Real-time stats
    const recentViewsCount = recentActivity?.filter(a => a.action_type === 'view').length || 0;
    const recentSharesCount = recentActivity?.filter(a => a.action_type === 'share').length || 0;
    const recentLikesCount = recentActivity?.filter(a => a.action_type === 'like').length || 0;

    const dashboardStats = {
      totalPosts,
      totalViews,
      totalComments,
      monthlyGrowth,
      recentActivity: {
        views24h: recentViewsCount,
        shares24h: recentSharesCount,
        likes24h: recentLikesCount,
        total24h: recentActivity?.length || 0
      },
      trends: {
        currentMonthViews: currentMonthViewsCount,
        lastMonthViews: lastMonthViewsCount,
        growthDirection: monthlyGrowth >= 0 ? 'up' : 'down'
      },
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats
    });

  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 