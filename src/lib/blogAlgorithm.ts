// Blog Algorithm for Dynamic Content Distribution
// Based on successful platforms like Medium, Reddit, and major news sites

export interface PostMetrics {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  featured_image_alt: string;
  published_at: string;
  created_at: string;
  view_count: number;
  like_count: number;
  share_count: number;
  favorite_count: number;
  comment_count: number;
  reading_time: number;
  categories: {
    id: string;
    name: string;
    slug: string;
    sport_type: string;
    color: string;
  };
}

export interface AlgorithmWeights {
  recency: number;      // How much recent posts are favored (0-1)
  views: number;        // Weight for view count (0-1)
  engagement: number;   // Weight for likes/shares/comments (0-1)
  trending: number;     // Weight for posts gaining momentum (0-1)
  diversity: number;    // Weight for category diversity (0-1)
}

export class BlogAlgorithm {
  // Different algorithm configurations for different sections
  private static readonly ALGORITHMS = {
    // Homepage "Hot Picks & Expert Insights" - Focus on trending and high engagement
    FEATURED_POSTS: {
      recency: 0.3,
      views: 0.4,
      engagement: 0.4,
      trending: 0.5,
      diversity: 0.6
    },
    
    // "Fresh Insights & Winning Predictions" - Balance recency with quality
    FRESH_INSIGHTS: {
      recency: 0.6,
      views: 0.3,
      engagement: 0.3,
      trending: 0.4,
      diversity: 0.5
    },
    
    // "Hot Right Now" sidebar - Pure trending focus
    HOT_RIGHT_NOW: {
      recency: 0.2,
      views: 0.5,
      engagement: 0.6,
      trending: 0.8,
      diversity: 0.3
    },
    
    // Category pages - Balance quality with category relevance
    CATEGORY_POSTS: {
      recency: 0.4,
      views: 0.4,
      engagement: 0.4,
      trending: 0.3,
      diversity: 0.1
    },
    
    // Related posts - Similar content focus
    RELATED_POSTS: {
      recency: 0.3,
      views: 0.4,
      engagement: 0.3,
      trending: 0.2,
      diversity: 0.8
    }
  };

  /**
   * Calculate engagement score combining likes, shares, favorites, and comments
   */
  static calculateEngagementScore(post: PostMetrics): number {
    const likes = post.like_count || 0;
    const shares = post.share_count || 0;
    const favorites = post.favorite_count || 0;
    const comments = post.comment_count || 0;
    
    // Weighted engagement score (shares are most valuable for SEO)
    return (shares * 3) + (likes * 2) + (favorites * 2) + (comments * 1.5);
  }

  /**
   * Calculate trending velocity (how fast a post is gaining engagement)
   */
  static calculateTrendingScore(post: PostMetrics): number {
    const now = new Date();
    const publishedAt = new Date(post.published_at);
    const hoursOld = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60);
    
    // Avoid division by zero for very new posts
    const safeHoursOld = Math.max(hoursOld, 1);
    
    const views = post.view_count || 0;
    const engagement = this.calculateEngagementScore(post);
    
    // Calculate velocity: engagement per hour with recency boost
    const velocity = (views + engagement) / safeHoursOld;
    
    // Boost posts from last 24 hours
    const recencyBoost = hoursOld <= 24 ? 1.5 : 1;
    
    return velocity * recencyBoost;
  }

  /**
   * Calculate recency score with decay
   */
  static calculateRecencyScore(post: PostMetrics): number {
    const now = new Date();
    const publishedAt = new Date(post.published_at);
    const daysOld = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Exponential decay: newer posts get higher scores
    return Math.exp(-daysOld / 7); // 7-day half-life
  }

  /**
   * Calculate view count score with normalization
   */
  static calculateViewScore(post: PostMetrics, maxViews: number): number {
    const views = post.view_count || 0;
    return maxViews > 0 ? views / maxViews : 0;
  }

  /**
   * Main algorithm to score posts for different sections
   */
  static scorePosts(
    posts: PostMetrics[], 
    algorithm: keyof typeof BlogAlgorithm.ALGORITHMS,
    categoryFilter?: string
  ): PostMetrics[] {
    if (!posts.length) return [];

    const weights = this.ALGORITHMS[algorithm];
    const maxViews = Math.max(...posts.map(p => p.view_count || 0));
    
    // Filter by category if specified
    const filteredPosts = categoryFilter 
      ? posts.filter(p => p.categories?.slug === categoryFilter)
      : posts;

    if (!filteredPosts.length) return [];

    // Diversity map: reward under-represented categories in this pool
    const categoryCounts = filteredPosts.reduce<Record<string, number>>((acc, p) => {
      const slug = p.categories?.slug || 'unknown';
      acc[slug] = (acc[slug] || 0) + 1;
      return acc;
    }, {});
    const maxCategoryCount = Math.max(...Object.values(categoryCounts));

    // Calculate scores for each post
    const scoredPosts = filteredPosts.map(post => {
      const recencyScore = this.calculateRecencyScore(post);
      const viewScore = this.calculateViewScore(post, maxViews);
      const engagementScore = this.calculateEngagementScore(post);
      const trendingScore = this.calculateTrendingScore(post);
      
      // Normalize engagement score
      const maxEngagement = Math.max(...filteredPosts.map(p => this.calculateEngagementScore(p)));
      const normalizedEngagement = maxEngagement > 0 ? engagementScore / maxEngagement : 0;
      
      // Normalize trending score
      const maxTrending = Math.max(...filteredPosts.map(p => this.calculateTrendingScore(p)));
      const normalizedTrending = maxTrending > 0 ? trendingScore / maxTrending : 0;

      // Diversity score: higher when category appears less in the pool
      const cat = post.categories?.slug || 'unknown';
      const catCount = categoryCounts[cat] || 1;
      const diversityScore = maxCategoryCount > 0 ? (1 / catCount) / (1 / 1) : 0; // range roughly (0,1]
      
      // Calculate final weighted score including diversity
      const finalScore = 
        (recencyScore * weights.recency) +
        (viewScore * weights.views) +
        (normalizedEngagement * weights.engagement) +
        (normalizedTrending * weights.trending) +
        (diversityScore * (weights as any).diversity || 0);

      return {
        ...post,
        algorithmScore: finalScore,
        metrics: {
          recencyScore,
          viewScore,
          engagementScore,
          trendingScore: normalizedTrending,
          diversityScore
        }
      };
    });

    // Sort by score (highest first)
    return scoredPosts.sort((a, b) => (b as any).algorithmScore - (a as any).algorithmScore);
  }

  /**
   * Get posts for homepage "Featured Posts" section
   */
  static getFeaturedPosts(posts: PostMetrics[], limit: number = 3): PostMetrics[] {
    return this.scorePosts(posts, 'FEATURED_POSTS').slice(0, limit);
  }

  /**
   * Get posts for "Fresh Insights & Winning Predictions" section
   */
  static getFreshInsights(posts: PostMetrics[], limit: number = 6): PostMetrics[] {
    return this.scorePosts(posts, 'FRESH_INSIGHTS').slice(0, limit);
  }

  /**
   * Get posts for "Hot Right Now" sidebar
   */
  static getHotRightNow(posts: PostMetrics[], limit: number = 4): PostMetrics[] {
    return this.scorePosts(posts, 'HOT_RIGHT_NOW').slice(0, limit);
  }

  /**
   * Get posts for category pages
   */
  static getCategoryPosts(
    posts: PostMetrics[], 
    category: string, 
    limit: number = 12
  ): PostMetrics[] {
    return this.scorePosts(posts, 'CATEGORY_POSTS', category).slice(0, limit);
  }

  /**
   * Get related posts for individual post pages
   */
  static getRelatedPosts(
    posts: PostMetrics[], 
    currentPost: PostMetrics, 
    limit: number = 6
  ): PostMetrics[] {
    // Filter out current post and prioritize same category
    const otherPosts = posts.filter(p => p.id !== currentPost.id);
    const sameCategoryPosts = otherPosts.filter(
      p => p.categories?.slug === currentPost.categories?.slug
    );
    
    // If we have enough same-category posts, use them; otherwise include all
    const candidatePosts = sameCategoryPosts.length >= limit 
      ? sameCategoryPosts 
      : otherPosts;
    
    return this.scorePosts(candidatePosts, 'RELATED_POSTS').slice(0, limit);
  }

  /**
   * Get trending categories based on post performance
   */
  static getTrendingCategories(posts: PostMetrics[]): Array<{
    category: string;
    name: string;
    score: number;
    postCount: number;
  }> {
    const categoryStats = new Map();
    
    posts.forEach(post => {
      const categorySlug = post.categories?.slug;
      const categoryName = post.categories?.name;
      
      if (categorySlug) {
        const existing = categoryStats.get(categorySlug) || {
          category: categorySlug,
          name: categoryName,
          totalScore: 0,
          postCount: 0
        };
        
        existing.totalScore += this.calculateTrendingScore(post);
        existing.postCount += 1;
        categoryStats.set(categorySlug, existing);
      }
    });
    
    return Array.from(categoryStats.values())
      .map(stat => ({
        ...stat,
        score: stat.totalScore / stat.postCount // Average trending score
      }))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Get posts optimized for SEO (high engagement, good keywords)
   */
  static getSEOOptimizedPosts(posts: PostMetrics[], limit: number = 10): PostMetrics[] {
    // SEO-focused scoring: prioritize high engagement and views
    const seoWeights = {
      recency: 0.2,
      views: 0.5,
      engagement: 0.6,
      trending: 0.4,
      diversity: 0.3
    };
    
    const scoredPosts = posts.map(post => {
      const recencyScore = this.calculateRecencyScore(post);
      const viewScore = this.calculateViewScore(post, Math.max(...posts.map(p => p.view_count || 0)));
      const engagementScore = this.calculateEngagementScore(post);
      const trendingScore = this.calculateTrendingScore(post);
      
      const maxEngagement = Math.max(...posts.map(p => this.calculateEngagementScore(p)));
      const normalizedEngagement = maxEngagement > 0 ? engagementScore / maxEngagement : 0;
      
      const seoScore = 
        (recencyScore * seoWeights.recency) +
        (viewScore * seoWeights.views) +
        (normalizedEngagement * seoWeights.engagement) +
        (trendingScore * seoWeights.trending);

      return { ...post, seoScore };
    });
    
    return scoredPosts
      .sort((a, b) => (b as any).seoScore - (a as any).seoScore)
      .slice(0, limit);
  }
} 