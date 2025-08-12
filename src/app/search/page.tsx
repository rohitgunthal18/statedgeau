'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostCard } from '@/components/blog/PostCard';
import { Search, Filter, X, TrendingUp, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { debounce } from 'lodash';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SearchFilters {
  category: string;
  sortBy: 'relevance' | 'date' | 'views';
  timeRange: 'all' | 'week' | 'month' | 'year';
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    sortBy: 'relevance',
    timeRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string, searchFilters: SearchFilters) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setTotalResults(0);
        return;
      }

      setLoading(true);
      try {
        // Track search query
        await supabase.from('search_queries').insert({
          query: searchQuery,
          timestamp: new Date().toISOString(),
          user_session: 'anonymous'
        });

        // Build search query
        let supabaseQuery = supabase
          .from('posts')
          .select(`
            id, title, slug, excerpt, featured_image, published_at,
            view_count, share_count, favorite_count, reading_time,
            categories(name, slug, sport_type, color)
          `)
          .eq('status', 'published')
          .or(`title.ilike.%${searchQuery}%, excerpt.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`);

        // Apply category filter
        if (searchFilters.category !== 'all') {
          supabaseQuery = supabaseQuery.eq('categories.slug', searchFilters.category);
        }

        // Apply time range filter
        if (searchFilters.timeRange !== 'all') {
          const now = new Date();
          let startDate = new Date();
          
          switch (searchFilters.timeRange) {
            case 'week':
              startDate.setDate(now.getDate() - 7);
              break;
            case 'month':
              startDate.setMonth(now.getMonth() - 1);
              break;
            case 'year':
              startDate.setFullYear(now.getFullYear() - 1);
              break;
          }
          
          supabaseQuery = supabaseQuery.gte('published_at', startDate.toISOString());
        }

        // Apply sorting
        switch (searchFilters.sortBy) {
          case 'date':
            supabaseQuery = supabaseQuery.order('published_at', { ascending: false });
            break;
          case 'views':
            supabaseQuery = supabaseQuery.order('view_count', { ascending: false });
            break;
          default: // relevance - we'll use a combination of factors
            supabaseQuery = supabaseQuery.order('view_count', { ascending: false });
            break;
        }

        const { data, error } = await supabaseQuery.limit(20);

        if (error) throw error;

        const formattedResults = data?.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || '',
          content: '',
          featuredImage: p.featured_image || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
          featuredImageAlt: p.title,
          author: { id: 'admin', name: 'Sports Expert', expertise: ['Sports Analysis'] },
          category: {
            id: 'cat',
            name: p.categories?.name || 'Sports Analysis',
            slug: p.categories?.slug || 'sports',
            description: '',
            sportType: p.categories?.sport_type || 'multi',
            color: p.categories?.color || '#1a237e'
          },
          tags: [],
          publishedAt: p.published_at || new Date().toISOString(),
          updatedAt: p.published_at || new Date().toISOString(),
          status: 'published' as const,
          engagement: {
            viewCount: p.view_count || 0,
            shareCount: p.share_count || 0,
            favoriteCount: p.favorite_count || 0,
            commentCount: 0,
            readingTime: p.reading_time || 5,
            isTrending: false
          },
          seo: {},
        })) || [];

        setResults(formattedResults);
        setTotalResults(formattedResults.length);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Load popular searches
  useEffect(() => {
    const loadPopularSearches = async () => {
      try {
        const { data } = await supabase
          .from('search_queries')
          .select('query')
          .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('timestamp', { ascending: false })
          .limit(50);

        if (data && data.length > 0) {
          // Count occurrences and get top searches
          const queryCounts = data.reduce((acc: Record<string, number>, item) => {
            acc[item.query] = (acc[item.query] || 0) + 1;
            return acc;
          }, {});
          
          const sortedQueries = Object.entries(queryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([query]) => query);
          
          setPopularSearches(sortedQueries);
        } else {
          // Fallback popular searches
          setPopularSearches([
            'AFL finals predictions',
            'NRL grand final',
            'Melbourne Cup tips',
            'State of Origin',
            'Big Bash League',
            'Australian Open tennis',
            'A-League analysis',
            'cricket world cup'
          ]);
        }
      } catch (error) {
        // Fallback popular searches
        setPopularSearches([
          'AFL finals predictions',
          'NRL grand final',
          'Melbourne Cup tips',
          'State of Origin',
          'Big Bash League',
          'Australian Open tennis',
          'A-League analysis',
          'cricket world cup'
        ]);
      }
    };

    loadPopularSearches();
  }, []);

  // Trigger search when query or filters change
  useEffect(() => {
    debouncedSearch(query, filters);
  }, [query, filters, debouncedSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      sortBy: 'relevance',
      timeRange: 'all'
    });
  };

  const handlePopularSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Search Sports Analysis
          </h1>
          
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AFL analysis, NRL predictions, horse racing tips..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy focus:border-transparent text-lg"
            />
          </div>

          {/* Search Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {(filters.category !== 'all' || filters.sortBy !== 'relevance' || filters.timeRange !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-coral/10 text-coral rounded-lg hover:bg-coral/20"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}

            {totalResults > 0 && (
              <span className="text-gray-600">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  >
                    <option value="all">All Sports</option>
                    <option value="afl-analysis">AFL Analysis</option>
                    <option value="nrl-analysis">NRL Analysis</option>
                    <option value="horse-racing">Horse Racing</option>
                    <option value="cricket-analysis">Cricket</option>
                    <option value="soccer-analysis">Soccer</option>
                    <option value="tennis-analysis">Tennis</option>
                    <option value="basketball-analysis">Basketball</option>
                  </select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="date">Most Recent</option>
                    <option value="views">Most Popular</option>
                  </select>
                </div>

                {/* Time Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <select
                    value={filters.timeRange}
                    onChange={(e) => handleFilterChange('timeRange', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!query && popularSearches.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-coral" />
                Popular Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearchClick(search)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-navy hover:text-white transition-colors duration-200 text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any articles matching "{query}". Try adjusting your search terms or filters.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Suggestions:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Try broader search terms</li>
                  <li>• Check your spelling</li>
                  <li>• Use different keywords</li>
                  <li>• Browse our popular searches above</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Search</h3>
              <p className="text-gray-600 mb-8">
                Enter a search term above to find AFL analysis, NRL predictions, horse racing tips and more.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
} 