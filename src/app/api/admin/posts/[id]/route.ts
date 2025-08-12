export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET - Fetch individual post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Fetch post with related data
    const { data: post, error } = await supabase
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
      `)
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Transform tags from junction table format to simple array
    const transformedPost = {
      ...post,
      tags: post.post_tags?.map((pt: any) => pt.tags.id) || []
    };

    return NextResponse.json({
      success: true,
      post: transformedPost
    });

  } catch (error) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 