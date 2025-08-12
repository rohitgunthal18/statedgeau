'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { getRelatedPosts, getRelatedPostsByCategory, getTrendingPosts, RelatedPost } from '@/lib/relatedPosts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { TrendingUp, Clock, Target, Sparkles } from 'lucide-react';

interface RelatedPostsProps {
  currentPostId: string;
  currentCategory?: string;
  currentSportType?: string;
  limit?: number;
  showTrending?: boolean;
  className?: string;
}

type RelatedPostsType = 'smart' | 'category' | 'trending' | 'recent';

export function RelatedPosts({
  currentPostId,
  currentCategory,
  currentSportType,
  limit = 6,
  showTrending = true,
  className = ''
}: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<RelatedPostsType>('smart');
  const [error, setError] = useState<string | null>(null);

  // Analytics tracking
  const { trackSocial } = useAnalytics();

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        let posts: RelatedPost[] = [];

        switch (activeType) {
          case 'smart':
            posts = await getRelatedPosts(currentPostId, limit);
            break;
          case 'category':
            if (currentCategory) {
              posts = await getRelatedPostsByCategory(currentCategory, currentPostId, limit);
            } else {
              posts = await getRelatedPosts(currentPostId, limit);
            }
            break;
          case 'trending':
            posts = await getTrendingPosts(limit);
            break;
          case 'recent':
            // For recent, we'll use smart but could implement a separate function
            posts = await getRelatedPosts(currentPostId, limit);
            break;
        }

        setRelatedPosts(posts);
      } catch (err) {
        console.error('Error fetching related posts:', err);
        setError('Failed to load related posts');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, currentCategory, activeType, limit]);

  const handleTypeChange = (type: RelatedPostsType) => {
    setActiveType(type);
  };

  const getTypeConfig = (type: RelatedPostsType) => {
    switch (type) {
      case 'smart':
        return {
          icon: Sparkles,
          label: 'Smart Recommendations',
          description: 'AI-powered content suggestions based on your interests'
        };
      case 'category':
        return {
          icon: Target,
          label: 'Same Category',
          description: `More ${currentCategory?.replace('-', ' ') || 'sports'} content`
        };
      case 'trending':
        return {
          icon: TrendingUp,
          label: 'Trending Now',
          description: 'Most popular and engaging content'
        };
      case 'recent':
        return {
          icon: Clock,
          label: 'Latest Posts',
          description: 'Fresh content from our experts'
        };
    }
  };

  if (error) {
    return (
      <section className={`bg-gray-50 py-12 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Related Posts</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => setActiveType('smart')}
              className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Related Content
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover more expert sports analysis and insights tailored to your interests
          </p>
        </div>

        {/* Type Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(['smart', 'category', 'trending', 'recent'] as RelatedPostsType[]).map((type) => {
            const config = getTypeConfig(type);
            const Icon = config.icon;
            const isActive = activeType === type;

            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-navy text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Type Description */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
            {(() => {
              const config = getTypeConfig(activeType);
              const Icon = config.icon;
              return (
                <>
                  <Icon className="w-4 h-4 text-navy" />
                  <span className="text-sm text-gray-600">{config.description}</span>
                </>
              );
            })()}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
            <p className="text-gray-600">Finding related content...</p>
          </div>
        )}

        {/* Related Posts Grid */}
        {!loading && relatedPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: post.id,
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt,
                  content: '',
                  featuredImage: post.featuredImage,
                  featuredImageAlt: post.title,
                  author: { id: 'expert', name: 'Sports Expert', expertise: ['Sports Analysis'] },
                  category: {
                    id: post.category.slug,
                    name: post.category.name,
                    slug: post.category.slug,
                    description: `${post.category.name} analysis and predictions`,
                    sportType: post.category.sportType,
                    color: '#1a237e'
                  },
                  tags: [],
                  publishedAt: post.publishedAt,
                  updatedAt: post.publishedAt,
                  status: 'published' as const,
                  engagement: {
                    viewCount: post.engagement.viewCount,
                    shareCount: post.engagement.shareCount,
                    favoriteCount: post.engagement.favoriteCount,
                    commentCount: 0,
                    readingTime: 5,
                    isTrending: post.engagement.viewCount > 100
                  },
                  seo: {}
                }}
                variant="compact"
                showEngagement={true}
                showAuthor={false}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && relatedPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Related Content Found</h3>
            <p className="text-gray-600 mb-4">
              We're working on finding more content for you. Check back soon!
            </p>
            <button
              onClick={() => setActiveType('trending')}
              className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
            >
              View Trending Posts
            </button>
          </div>
        )}

        {/* Analytics Tracking */}
        {relatedPosts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Showing {relatedPosts.length} related posts • 
              <button
                onClick={() => {
                  trackSocial('related_posts', activeType);
                }}
                className="text-navy hover:underline ml-1"
              >
                Track engagement
              </button>
            </p>
          </div>
        )}
      </div>
    </section>
  );
} 