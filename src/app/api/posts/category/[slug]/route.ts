import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { BlogAlgorithm, PostMetrics } from '@/lib/blogAlgorithm';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const categorySlugParam = params.slug;
    const slugMap: Record<string, string> = {
      'afl-betting': 'afl',
      'nrl-betting': 'nrl',
      'horse-racing': 'racing',
      'cricket-betting': 'cricket',
      'soccer-betting': 'soccer',
      'tennis-betting': 'tennis',
      'basketball-betting': 'basketball',
      'multi-sport-betting': 'multi-sport',
    };
    const categorySlug = slugMap[categorySlugParam as keyof typeof slugMap] || categorySlugParam;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    console.log(`API: Fetching posts for category: ${categorySlug}, page: ${page}`);

    // First, get the category info
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', categorySlug)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Fetch all posts for this category
    const { data: allPosts, error: postsError } = await supabase
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
        categories!inner(id, name, slug, sport_type, color)
      `)
      .eq('status', 'published')
      .eq('categories.slug', categorySlug)
      .not('published_at', 'is', null);

    if (postsError) {
      console.error('API Error fetching category posts:', postsError);
      return NextResponse.json({ error: postsError.message }, { status: 500 });
    }

    // Convert to PostMetrics format
    const postMetrics: PostMetrics[] = (allPosts || []).map(post => ({
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
            id: category.id,
            name: category.name,
            slug: category.slug,
            sport_type: category.sport_type || 'multi',
            color: category.color || '#1a237e'
          }
    }));

    // Apply category algorithm
    const algorithmPosts = BlogAlgorithm.getCategoryPosts(postMetrics, categorySlug);

    // Apply pagination to algorithm results
    const paginatedPosts = algorithmPosts.slice(offset, offset + limit);

    // Calculate trending stats for this category
    const trendingCategories = BlogAlgorithm.getTrendingCategories(postMetrics);
    const categoryStats = trendingCategories.find(c => c.category === categorySlug);

    console.log(`API: Category ${categorySlug} - ${algorithmPosts.length} total, ${paginatedPosts.length} on page ${page}`);

    return NextResponse.json({
      success: true,
      category: {
        ...category,
        stats: categoryStats || { postCount: postMetrics.length, score: 0 }
      },
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total: algorithmPosts.length,
        totalPages: Math.ceil(algorithmPosts.length / limit),
        hasNext: offset + limit < algorithmPosts.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 