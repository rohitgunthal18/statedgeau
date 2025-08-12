export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch posts with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let query = supabase
      .from('posts')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          color,
          sport_type
        ),
        post_tags (
          tags (
            id,
            name,
            slug,
            color,
            betting_type
          )
        )
      `);

    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('posts')
      .select('id', { count: 'exact', head: true });

    if (status !== 'all') {
      countQuery = countQuery.eq('status', status);
    }

    if (category) {
      countQuery = countQuery.eq('category_id', category);
    }

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      success: true,
      posts: posts || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .substring(0, 60);
    }

    // Ensure slug is unique
    const { data: existingPost } = await supabase
      .from('posts')
      .select('slug')
      .eq('slug', body.slug)
      .single();

    if (existingPost) {
      const timestamp = Date.now();
      body.slug = `${body.slug}-${timestamp}`;
    }

    // Auto-generate SEO fields if not provided
    if (!body.seo_title && body.title) {
      body.seo_title = body.title.length > 60 ? body.title.substring(0, 57) + '...' : body.title;
    }

    if (!body.seo_description && body.excerpt) {
      body.seo_description = body.excerpt.length > 160 ? body.excerpt.substring(0, 157) + '...' : body.excerpt;
    }

    // Auto-generate Open Graph fields
    if (!body.og_title && body.title) {
      body.og_title = body.title;
    }

    if (!body.og_description && body.excerpt) {
      body.og_description = body.excerpt;
    }

    if (!body.og_image && body.featured_image) {
      body.og_image = body.featured_image;
    }

    // Auto-generate Twitter fields
    if (!body.twitter_title && body.title) {
      body.twitter_title = body.title;
    }

    if (!body.twitter_description && body.excerpt) {
      body.twitter_description = body.excerpt;
    }

    if (!body.twitter_image && body.featured_image) {
      body.twitter_image = body.featured_image;
    }

    // Calculate SEO score (basic implementation)
    const seoScore = calculateSEOScore(body);

    // Prepare post data
    const postData = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || '',
      featured_image: body.featured_image || null,
      featured_image_alt: body.featured_image_alt || null,
      category_id: body.category_id || null,
      status: body.status || 'draft',
      
      // SEO Fields
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
      seo_keywords: body.seo_keywords || [],
      focus_keyword: body.focus_keyword || null,
      meta_robots: body.meta_robots || 'index, follow',
      canonical_url: body.canonical_url || null,
      
      // Open Graph Fields
      og_title: body.og_title || null,
      og_description: body.og_description || null,
      og_image: body.og_image || null,
      og_type: body.og_type || 'article',
      
      // Twitter Fields
      twitter_title: body.twitter_title || null,
      twitter_description: body.twitter_description || null,
      twitter_image: body.twitter_image || null,
      twitter_card_type: body.twitter_card_type || 'summary_large_image',
      
      // Schema Fields
      schema_type: body.schema_type || 'Article',
      schema_headline: body.schema_headline || body.title,
      schema_description: body.schema_description || body.excerpt,
      schema_keywords: body.schema_keywords || body.seo_keywords || [],
      
      // Analytics
      seo_score: seoScore,
      reading_time: body.reading_time || null,
      
      // Betting Specific
      match_date: body.match_date || null,
      teams_involved: body.teams_involved || [],
      betting_odds: body.betting_odds || null,
      betting_tips: body.betting_tips || null,
      risk_level: body.risk_level || null,
      
      // Features
      is_featured: body.is_featured || false,
      is_trending: body.is_trending || false,
      is_premium: body.is_premium || false,
      allows_comments: body.allows_comments !== false,
      
      // Scheduling
      scheduled_at: body.scheduled_at || null,
      
      // Metadata
      last_modified_by: 'admin',
      version: 1
    };

    // Insert post
    const { data: post, error } = await supabase
      .from('posts')
      .insert(postData)
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          color,
          sport_type
        )
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create post: ' + error.message },
        { status: 500 }
      );
    }

    // Handle tags
    if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
      const tagInserts = body.tags.map((tagId: string) => ({
        post_id: post.id,
        tag_id: tagId
      }));

      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(tagInserts);

      if (tagError) {
        console.warn('Failed to insert tags:', tagError);
      }
    }

    return NextResponse.json({
      success: true,
      post,
      message: 'Post created successfully'
    });

  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get existing post
    const { data: existingPost, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', body.id)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Create revision before updating
    const { error: revisionError } = await supabase
      .from('post_revisions')
      .insert({
        post_id: body.id,
        title: existingPost.title,
        content: existingPost.content,
        excerpt: existingPost.excerpt,
        revision_number: existingPost.version || 1,
        change_summary: body.change_summary || 'Updated content',
        revised_by: 'admin',
        revision_reason: 'Manual update'
      });

    if (revisionError) {
      console.warn('Failed to create revision:', revisionError);
    }

    // Calculate SEO score
    const seoScore = calculateSEOScore(body);

    // Prepare update data
    const updateData = {
      title: body.title || existingPost.title,
      slug: body.slug || existingPost.slug,
      content: body.content || existingPost.content,
      excerpt: body.excerpt || existingPost.excerpt,
      featured_image: body.featured_image,
      featured_image_alt: body.featured_image_alt,
      category_id: body.category_id,
      status: body.status || existingPost.status,
      
      // SEO Fields
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      seo_keywords: body.seo_keywords || [],
      focus_keyword: body.focus_keyword,
      meta_robots: body.meta_robots || 'index, follow',
      canonical_url: body.canonical_url,
      
      // Open Graph Fields
      og_title: body.og_title,
      og_description: body.og_description,
      og_image: body.og_image,
      og_type: body.og_type || 'article',
      
      // Twitter Fields
      twitter_title: body.twitter_title,
      twitter_description: body.twitter_description,
      twitter_image: body.twitter_image,
      twitter_card_type: body.twitter_card_type || 'summary_large_image',
      
      // Schema Fields
      schema_type: body.schema_type || 'Article',
      schema_headline: body.schema_headline,
      schema_description: body.schema_description,
      schema_keywords: body.schema_keywords || [],
      
      // Analytics
      seo_score: seoScore,
      reading_time: body.reading_time,
      
      // Betting Specific
      match_date: body.match_date,
      teams_involved: body.teams_involved || [],
      betting_odds: body.betting_odds,
      betting_tips: body.betting_tips,
      risk_level: body.risk_level,
      
      // Features
      is_featured: body.is_featured || false,
      is_trending: body.is_trending || false,
      is_premium: body.is_premium || false,
      allows_comments: body.allows_comments !== false,
      
      // Scheduling
      scheduled_at: body.scheduled_at,
      
      // Metadata
      last_modified_by: 'admin',
      version: (existingPost.version || 1) + 1
    };

    // Update post
    const { data: post, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', body.id)
      .select(`
        *,
        categories (
          id,
          name,
        slug,
          color,
          sport_type
        )
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update post: ' + error.message },
        { status: 500 }
      );
    }

    // Update tags
    if (body.tags !== undefined) {
      // Delete existing tags
      await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', body.id);

      // Insert new tags
      if (Array.isArray(body.tags) && body.tags.length > 0) {
        const tagInserts = body.tags.map((tagId: string) => ({
          post_id: body.id,
          tag_id: tagId
        }));

        const { error: tagError } = await supabase
          .from('post_tags')
          .insert(tagInserts);

        if (tagError) {
          console.warn('Failed to update tags:', tagError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      post,
      message: 'Post updated successfully'
    });

  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Delete post (cascade will handle related records)
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to delete post: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate SEO score
function calculateSEOScore(postData: any): number {
  let score = 0;
  
  // Title checks (20 points)
  if (postData.title) {
    if (postData.title.length >= 30 && postData.title.length <= 60) {
      score += 20;
    } else if (postData.title.length >= 20) {
      score += 10;
    }
  }
  
  // SEO description checks (20 points)
  if (postData.seo_description) {
    if (postData.seo_description.length >= 120 && postData.seo_description.length <= 160) {
      score += 20;
    } else if (postData.seo_description.length >= 100) {
      score += 10;
    }
  }
  
  // Focus keyword checks (20 points)
  if (postData.focus_keyword) {
    score += 5;
    
    // Check if keyword is in title
    if (postData.title && postData.title.toLowerCase().includes(postData.focus_keyword.toLowerCase())) {
      score += 5;
    }
    
    // Check if keyword is in description
    if (postData.seo_description && postData.seo_description.toLowerCase().includes(postData.focus_keyword.toLowerCase())) {
      score += 5;
    }
    
    // Check if keyword is in content
    if (postData.content && postData.content.toLowerCase().includes(postData.focus_keyword.toLowerCase())) {
      score += 5;
    }
  }
  
  // Content length checks (20 points)
  if (postData.content) {
    const wordCount = postData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    if (wordCount >= 800) {
      score += 20;
    } else if (wordCount >= 500) {
      score += 15;
    } else if (wordCount >= 300) {
      score += 10;
    }
  }
  
  // Featured image checks (10 points)
  if (postData.featured_image) {
    score += 5;
    if (postData.featured_image_alt) {
      score += 5;
    }
  }
  
  // Excerpt checks (10 points)
  if (postData.excerpt && postData.excerpt.length >= 100) {
    score += 10;
  }
  
  return Math.min(100, score);
} 