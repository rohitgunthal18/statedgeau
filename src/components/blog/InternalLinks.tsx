'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRelatedPostsByCategory, getTrendingPosts, RelatedPost } from '@/lib/relatedPosts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Link as LinkIcon, TrendingUp, Target } from 'lucide-react';

interface InternalLinksProps {
  currentPostId: string;
  currentCategory?: string;
  currentSportType?: string;
  className?: string;
}

export function InternalLinks({
  currentPostId,
  currentCategory,
  currentSportType,
  className = ''
}: InternalLinksProps) {
  const [suggestedLinks, setSuggestedLinks] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Analytics tracking
  const { trackSocial } = useAnalytics();

  useEffect(() => {
    const fetchSuggestedLinks = async () => {
      setLoading(true);
      try {
        let links: RelatedPost[] = [];

        // Get category-related posts
        if (currentCategory) {
          const categoryLinks = await getRelatedPostsByCategory(currentCategory, currentPostId, 3);
          links.push(...categoryLinks);
        }

        // Get trending posts to fill remaining slots
        const trendingLinks = await getTrendingPosts(3);
        const existingIds = new Set(links.map(link => link.id));
        const uniqueTrending = trendingLinks.filter(link => !existingIds.has(link.id));
        links.push(...uniqueTrending.slice(0, 3 - links.length));

        setSuggestedLinks(links.slice(0, 3));
      } catch (error) {
        console.error('Error fetching suggested links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedLinks();
  }, [currentPostId, currentCategory]);

  const handleLinkClick = (linkType: string, postId: string) => {
    trackSocial('internal_link_click', `${linkType}_${postId}`);
  };

  if (loading) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <LinkIcon className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Related Articles</h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-blue-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestedLinks.length === 0) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <LinkIcon className="w-4 h-4 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Related Articles</h3>
      </div>
      
      <div className="space-y-2">
        {suggestedLinks.map((link, index) => (
          <Link
            key={link.id}
            href={`/posts/${link.slug}`}
            onClick={() => handleLinkClick(index === 0 ? 'primary' : 'secondary', link.id)}
            className="block p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {index === 0 ? (
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                ) : (
                  <Target className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {link.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {link.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {link.category.name}
                  </span>
                  <span>{link.engagement.viewCount} views</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-blue-200">
        <Link
          href={currentCategory ? `/${currentCategory}` : '/trending'}
          onClick={() => trackSocial('internal_link_click', 'view_more')}
          className="text-sm text-blue-700 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          View more {currentCategory?.replace('-', ' ') || 'trending'} articles
          <LinkIcon className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
} 