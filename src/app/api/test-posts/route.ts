import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('Test endpoint: Fetching posts...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('posts')
      .select('count')
      .single();
    
    console.log('Connection test:', { testData, testError });

    // Fetch all posts (not just published) for debugging
    const { data: allPosts, error: allError } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        status,
        published_at,
        created_at,
        excerpt,
        featured_image,
        categories(id, name, slug, sport_type)
      `)
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('Error fetching all posts:', allError);
      return NextResponse.json({ error: allError.message }, { status: 500 });
    }

    // Fetch only published posts
    const { data: publishedPosts, error: publishedError } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        status,
        published_at,
        created_at,
        excerpt,
        featured_image,
        categories(id, name, slug, sport_type)
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (publishedError) {
      console.error('Error fetching published posts:', publishedError);
      return NextResponse.json({ error: publishedError.message }, { status: 500 });
    }

    console.log('All posts:', allPosts?.length || 0);
    console.log('Published posts:', publishedPosts?.length || 0);

    return NextResponse.json({
      success: true,
      allPostsCount: allPosts?.length || 0,
      publishedPostsCount: publishedPosts?.length || 0,
      allPosts: allPosts || [],
      publishedPosts: publishedPosts || [],
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      }
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 