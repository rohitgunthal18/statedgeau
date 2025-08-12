import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BlogAlgorithm, PostMetrics } from '@/lib/blogAlgorithm';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'featured';
    const limit = parseInt(searchParams.get('limit') || '6');

    // Fetch all published posts with engagement data
    const { data: posts, error } = await supabase
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
        like_count,
        share_count,
        favorite_count,
        comment_count,
        reading_time,
        categories(id, name, slug, sport_type, color)
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('API Error fetching posts:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({ 
        success: true, 
        posts: [], 
        count: 0,
        section 
      });
    }

    // Convert to PostMetrics format
    const postMetrics: PostMetrics[] = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      featured_image_alt: post.featured_image_alt || '',
      published_at: post.published_at,
      created_at: post.created_at,
      view_count: post.view_count || 0,
      like_count: post.like_count || 0,
      share_count: post.share_count || 0,
      favorite_count: post.favorite_count || 0,
      comment_count: post.comment_count || 0,
      reading_time: post.reading_time || 5,
      categories: Array.isArray(post.categories) && post.categories.length > 0 
        ? post.categories[0] 
        : {
            id: 'general',
            name: 'Sports Analysis',
            slug: 'sports',
            sport_type: 'multi',
            color: '#1a237e'
          }
    }));

    // Apply different algorithms based on section
    let algorithmPosts: PostMetrics[] = [];
    
    switch (section) {
      case 'featured':
        algorithmPosts = BlogAlgorithm.getFeaturedPosts(postMetrics, limit);
        break;
      case 'fresh':
        algorithmPosts = BlogAlgorithm.getFreshInsights(postMetrics, limit);
        break;
      case 'hot':
        algorithmPosts = BlogAlgorithm.getHotRightNow(postMetrics, limit);
        break;
      case 'seo':
        algorithmPosts = BlogAlgorithm.getSEOOptimizedPosts(postMetrics, limit);
        break;
      default:
        algorithmPosts = BlogAlgorithm.getFeaturedPosts(postMetrics, limit);
    }

    console.log(`API: ${section} algorithm returned ${algorithmPosts.length} posts`);

    return NextResponse.json({
      success: true,
      posts: algorithmPosts,
      count: algorithmPosts.length,
      section,
      totalPosts: posts.length
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 