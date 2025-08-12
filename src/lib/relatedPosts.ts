import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: {
    name: string;
    slug: string;
    sportType: string;
  };
  publishedAt: string;
  engagement: {
    viewCount: number;
    shareCount: number;
    favoriteCount: number;
  };
  similarityScore: number;
}

export interface PostForRelated {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category_id: string;
  tags: string[];
  published_at: string;
}

// Calculate text similarity using simple word overlap
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(word => word.length > 3));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(word => word.length > 3));
  
  const intersection = new Set(Array.from(words1).filter(word => words2.has(word)));
  const union = new Set([...Array.from(words1), ...Array.from(words2)]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Calculate category similarity
function calculateCategorySimilarity(category1: string, category2: string): number {
  if (category1 === category2) return 1.0;
  
  // Sport type similarity (AFL/NRL are more similar than AFL/Tennis)
  const sportGroups = {
    'football': ['afl-analysis', 'nrl-analysis'],
    'racing': ['horse-racing'],
    'ball-sports': ['cricket-analysis', 'basketball-analysis'],
    'individual': ['tennis-analysis'],
    'team-sports': ['soccer-analysis']
  };
  
  for (const [group, categories] of Object.entries(sportGroups)) {
    if (categories.includes(category1) && categories.includes(category2)) {
      return 0.7; // Same sport group
    }
  }
  
  return 0.0; // Different sport groups
}

// Calculate tag similarity
function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  if (tags1.length === 0 || tags2.length === 0) return 0;
  
  const set1 = new Set(tags1.map(tag => tag.toLowerCase()));
  const set2 = new Set(tags2.map(tag => tag.toLowerCase()));
  
  const intersection = new Set(Array.from(set1).filter(tag => set2.has(tag)));
  const union = new Set([...Array.from(set1), ...Array.from(set2)]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Calculate recency score (newer posts get higher scores)
function calculateRecencyScore(publishedAt: string): number {
  const now = new Date();
  const published = new Date(publishedAt);
  const daysDiff = (now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24);
  
  // Exponential decay: newer posts get higher scores
  return Math.exp(-daysDiff / 30); // 30-day half-life
}

// Calculate engagement score
function calculateEngagementScore(viewCount: number, shareCount: number, favoriteCount: number): number {
  const totalEngagement = viewCount + (shareCount * 10) + (favoriteCount * 5);
  return Math.log(totalEngagement + 1) / Math.log(1000); // Normalize to 0-1 range
}

// Main function to get related posts
export async function getRelatedPosts(
  currentPostId: string,
  limit: number = 6
): Promise<RelatedPost[]> {
  try {
    // Get current post details
    const { data: currentPost, error: currentError } = await supabase
      .from('posts')
      .select(`
        id, title, excerpt, content, category_id, published_at,
        categories(name, slug, sport_type)
      `)
      .eq('id', currentPostId)
      .single();

    if (currentError || !currentPost) {
      console.error('Error fetching current post:', currentError);
      return [];
    }

    // Get all other published posts
    const { data: allPosts, error: postsError } = await supabase
      .from('posts')
      .select(`
        id, title, slug, excerpt, content, featured_image, published_at,
        view_count, share_count, favorite_count,
        category_id,
        categories(name, slug, sport_type)
      `)
      .eq('status', 'published')
      .neq('id', currentPostId)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(100); // Get more posts to calculate similarity

    if (postsError || !allPosts) {
      console.error('Error fetching posts for related calculation:', postsError);
      return [];
    }

    // Calculate similarity scores for each post
    const postsWithScores = allPosts.map(post => {
      // Text similarity (title + excerpt)
      const textSimilarity = calculateTextSimilarity(
        `${currentPost.title} ${currentPost.excerpt || ''}`,
        `${post.title} ${post.excerpt || ''}`
      );

      // Category similarity
      const categorySimilarity = calculateCategorySimilarity(
        currentPost.categories?.[0]?.slug || '',
        post.categories?.[0]?.slug || ''
      );

      // Recency score
      const recencyScore = calculateRecencyScore(post.published_at);

      // Engagement score
      const engagementScore = calculateEngagementScore(
        post.view_count || 0,
        post.share_count || 0,
        post.favorite_count || 0
      );

      // Weighted similarity score
      const similarityScore = (
        textSimilarity * 0.4 +      // 40% weight for content similarity
        categorySimilarity * 0.3 +  // 30% weight for category similarity
        recencyScore * 0.2 +        // 20% weight for recency
        engagementScore * 0.1       // 10% weight for engagement
      );

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        featuredImage: post.featured_image || '',
        category: {
          name: post.categories?.[0]?.name || 'Sports Analysis',
          slug: post.categories?.[0]?.slug || 'sports-analysis',
          sportType: post.categories?.[0]?.sport_type || 'general'
        },
        publishedAt: post.published_at,
        engagement: {
          viewCount: post.view_count || 0,
          shareCount: post.share_count || 0,
          favoriteCount: post.favorite_count || 0
        },
        similarityScore
      };
    });

    // Sort by similarity score and return top posts
    return postsWithScores
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

  } catch (error) {
    console.error('Error calculating related posts:', error);
    return [];
  }
}

// Get related posts by category
export async function getRelatedPostsByCategory(
  categorySlug: string,
  currentPostId: string,
  limit: number = 6
): Promise<RelatedPost[]> {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id, title, slug, excerpt, featured_image, published_at,
        view_count, share_count, favorite_count,
        categories(name, slug, sport_type)
      `)
      .eq('status', 'published')
      .eq('categories.slug', categorySlug)
      .neq('id', currentPostId)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error || !posts) {
      console.error('Error fetching category-related posts:', error);
      return [];
    }

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      featuredImage: post.featured_image || '',
      category: {
        name: post.categories?.[0]?.name || 'Sports Analysis',
        slug: post.categories?.[0]?.slug || 'sports-analysis',
        sportType: post.categories?.[0]?.sport_type || 'general'
      },
      publishedAt: post.published_at,
      engagement: {
        viewCount: post.view_count || 0,
        shareCount: post.share_count || 0,
        favoriteCount: post.favorite_count || 0
      },
      similarityScore: 1.0 // All posts in same category get same score
    }));

  } catch (error) {
    console.error('Error fetching category-related posts:', error);
    return [];
  }
}

// Get trending posts (high engagement)
export async function getTrendingPosts(limit: number = 6): Promise<RelatedPost[]> {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id, title, slug, excerpt, featured_image, published_at,
        view_count, share_count, favorite_count,
        categories(name, slug, sport_type)
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('view_count', { ascending: false })
      .order('share_count', { ascending: false })
      .limit(limit);

    if (error || !posts) {
      console.error('Error fetching trending posts:', error);
      return [];
    }

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      featuredImage: post.featured_image || '',
      category: {
        name: post.categories?.[0]?.name || 'Sports Analysis',
        slug: post.categories?.[0]?.slug || 'sports-analysis',
        sportType: post.categories?.[0]?.sport_type || 'general'
      },
      publishedAt: post.published_at,
      engagement: {
        viewCount: post.view_count || 0,
        shareCount: post.share_count || 0,
        favoriteCount: post.favorite_count || 0
      },
      similarityScore: 1.0
    }));

  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }
}

// Get recent posts by sport type
export async function getRecentPostsBySport(
  sportType: string,
  limit: number = 6
): Promise<RelatedPost[]> {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id, title, slug, excerpt, featured_image, published_at,
        view_count, share_count, favorite_count,
        categories(name, slug, sport_type)
      `)
      .eq('status', 'published')
      .eq('categories.sport_type', sportType)
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error || !posts) {
      console.error('Error fetching recent posts by sport:', error);
      return [];
    }

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      featuredImage: post.featured_image || '',
      category: {
        name: post.categories?.[0]?.name || 'Sports Analysis',
        slug: post.categories?.[0]?.slug || 'sports-analysis',
        sportType: post.categories?.[0]?.sport_type || 'general'
      },
      publishedAt: post.published_at,
      engagement: {
        viewCount: post.view_count || 0,
        shareCount: post.share_count || 0,
        favoriteCount: post.favorite_count || 0
      },
      similarityScore: 1.0
    }));

  } catch (error) {
    console.error('Error fetching recent posts by sport:', error);
    return [];
  }
} 