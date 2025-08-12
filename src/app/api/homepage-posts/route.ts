import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side data fetching
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('Homepage API: Fetching trending posts...');
    
    // Fetch latest 6 published posts ordered by view count (trending) then by published date
    const { data: dbPosts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        featured_image_alt,
        published_at,
        created_at,
        view_count,
        share_count,
        favorite_count,
        comment_count,
        like_count,
        reading_time,
        status,
        categories(id, name, slug, sport_type, color)
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('view_count', { ascending: false }) // Order by view count first (trending)
      .order('published_at', { ascending: false }) // Then by published date
      .limit(6);

    if (error) {
      console.error('Homepage API: Database error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Homepage API: Found posts:', dbPosts?.length || 0);

    return NextResponse.json({
      success: true,
      posts: dbPosts || [],
      count: dbPosts?.length || 0
    });

  } catch (error) {
    console.error('Homepage API: Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 