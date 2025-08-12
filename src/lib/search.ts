import { createClient } from '@supabase/supabase-js';
import analytics, { trackEvent } from './analytics';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface SearchFilters {
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  readingTime?: {
    min: number;
    max: number;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  view_count: number;
  share_count: number;
  reading_time: number;
  published_at: string;
  categories: {
    name: string;
    slug: string;
    color: string;
    icon: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
    color: string;
  }>;
  relevance_score?: number;
}

export interface SearchSuggestion {
  query: string;
  count: number;
  type: 'popular' | 'recent' | 'suggestion';
}

class SearchService {
  private searchCache = new Map<string, SearchResult[]>();
  private suggestionCache = new Map<string, SearchSuggestion[]>();

  // Full-text search with highlighting
  async searchPosts(
    query: string,
    filters: SearchFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<{ results: SearchResult[]; total: number; suggestions: SearchSuggestion[] }> {
    try {
      // Track search query
      trackEvent('search', {
        search_term: query,
        value: 0, // Will be updated after search
        category: filters.category,
      });

      // Build search query
      let searchQuery = supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          view_count,
          share_count,
          reading_time,
          published_at,
          categories!inner(name, slug, color, icon),
          post_tags(tags(name, slug, color))
        `)
        .eq('status', 'published');

      // Apply text search
      if (query.trim()) {
        searchQuery = searchQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      // Apply filters
      if (filters.category) {
        searchQuery = searchQuery.eq('categories.slug', filters.category);
      }

      if (filters.dateRange) {
        searchQuery = searchQuery
          .gte('published_at', filters.dateRange.start.toISOString())
          .lte('published_at', filters.dateRange.end.toISOString());
      }

      if (filters.readingTime) {
        searchQuery = searchQuery
          .gte('reading_time', filters.readingTime.min)
          .lte('reading_time', filters.readingTime.max);
      }

      // Get total count using a separate query
      const countQuery = supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published');

      // Apply same filters to count query
      if (query.trim()) {
        countQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      if (filters.category) {
        countQuery.eq('categories.slug', filters.category);
      }

      if (filters.dateRange) {
        countQuery
          .gte('published_at', filters.dateRange.start.toISOString())
          .lte('published_at', filters.dateRange.end.toISOString());
      }

      if (filters.readingTime) {
        countQuery
          .gte('reading_time', filters.readingTime.min)
          .lte('reading_time', filters.readingTime.max);
      }

      const { count } = await countQuery;

      // Apply pagination and ordering
      const { data, error } = await searchQuery
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Process results and add relevance scoring
      const results = this.processSearchResults(data || [], query);
      
      // Get search suggestions
      const suggestions = await this.getSearchSuggestions(query);

      // Update analytics with actual result count
      trackEvent('search', {
        search_term: query,
        value: results.length,
        category: filters.category,
      });

      return {
        results,
        total: count || 0,
        suggestions,
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      return { results: [], total: 0, suggestions: [] };
    }
  }

  // Process search results and add relevance scoring
  private processSearchResults(posts: any[], query: string): SearchResult[] {
    return posts.map(post => {
      let relevanceScore = 0;
      const queryLower = query.toLowerCase();

      // Title relevance (highest weight)
      if (post.title.toLowerCase().includes(queryLower)) {
        relevanceScore += 10;
        if (post.title.toLowerCase().startsWith(queryLower)) {
          relevanceScore += 5;
        }
      }

      // Excerpt relevance
      if (post.excerpt?.toLowerCase().includes(queryLower)) {
        relevanceScore += 3;
      }

      // Category relevance
      if (post.categories?.name.toLowerCase().includes(queryLower)) {
        relevanceScore += 2;
      }

      // Tag relevance
      if (post.post_tags) {
        post.post_tags.forEach((tag: any) => {
          if (tag.tags?.name.toLowerCase().includes(queryLower)) {
            relevanceScore += 1;
          }
        });
      }

      // View count bonus (popularity)
      relevanceScore += Math.min(post.view_count / 100, 5);

      return {
        ...post,
        relevance_score: relevanceScore,
        tags: post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) || [],
      };
    }).sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
  }

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<SearchSuggestion[]> {
    try {
      const cacheKey = `suggestions_${query}`;
      
      // Check cache first
      if (this.suggestionCache.has(cacheKey)) {
        return this.suggestionCache.get(cacheKey)!;
      }

      const suggestions: SearchSuggestion[] = [];

      // Get popular search queries
      const { data: popularQueries } = await supabase
        .from('search_queries')
        .select('query, result_count')
        .ilike('query', `%${query}%`)
        .order('result_count', { ascending: false })
        .limit(5);

      popularQueries?.forEach(q => {
        suggestions.push({
          query: q.query,
          count: q.result_count,
          type: 'popular',
        });
      });

      // Get category suggestions
      const { data: categories } = await supabase
        .from('categories')
        .select('name, slug')
        .ilike('name', `%${query}%`)
        .limit(3);

      categories?.forEach(cat => {
        suggestions.push({
          query: cat.name,
          count: 0,
          type: 'suggestion',
        });
      });

      // Get tag suggestions
      const { data: tags } = await supabase
        .from('tags')
        .select('name, slug')
        .ilike('name', `%${query}%`)
        .limit(3);

      tags?.forEach(tag => {
        suggestions.push({
          query: tag.name,
          count: 0,
          type: 'suggestion',
        });
      });

      // Cache suggestions
      this.suggestionCache.set(cacheKey, suggestions);

      return suggestions;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  }

  // Get trending search queries
  async getTrendingSearches(limit: number = 10): Promise<SearchSuggestion[]> {
    try {
      const { data, error } = await supabase
        .from('search_queries')
        .select('query, result_count')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('result_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(q => ({
        query: q.query,
        count: q.result_count,
        type: 'popular' as const,
      })) || [];
    } catch (error) {
      console.error('Error getting trending searches:', error);
      return [];
    }
  }

  // Get search autocomplete
  async getAutocomplete(query: string, limit: number = 5): Promise<string[]> {
    try {
      const suggestions = await this.getSearchSuggestions(query);
      return suggestions.slice(0, limit).map(s => s.query);
    } catch (error) {
      console.error('Error getting autocomplete:', error);
      return [];
    }
  }

  // Search by category
  async searchByCategory(
    categorySlug: string,
    query?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ results: SearchResult[]; total: number }> {
    try {
      let searchQuery = supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          view_count,
          share_count,
          reading_time,
          published_at,
          categories!inner(name, slug, color, icon),
          post_tags(tags(name, slug, color))
        `)
        .eq('status', 'published')
        .eq('categories.slug', categorySlug);

      if (query?.trim()) {
        searchQuery = searchQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      // Get count using separate query
      const countQuery = supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('categories.slug', categorySlug);

      if (query?.trim()) {
        countQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      const { count } = await countQuery;

      const { data, error } = await searchQuery
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const results = this.processSearchResults(data || [], query || '');

      return {
        results,
        total: count || 0,
      };
    } catch (error) {
      console.error('Error searching by category:', error);
      return { results: [], total: 0 };
    }
  }

  // Search by tag
  async searchByTag(
    tagSlug: string,
    query?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ results: SearchResult[]; total: number }> {
    try {
      let searchQuery = supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          excerpt,
          featured_image,
          view_count,
          share_count,
          reading_time,
          published_at,
          categories!inner(name, slug, color, icon),
          post_tags!inner(tags!inner(name, slug, color))
        `)
        .eq('status', 'published')
        .eq('post_tags.tags.slug', tagSlug);

      if (query?.trim()) {
        searchQuery = searchQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      // Get count using separate query
      const countQuery = supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('post_tags.tags.slug', tagSlug);

      if (query?.trim()) {
        countQuery.or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`);
      }

      const { count } = await countQuery;

      const { data, error } = await searchQuery
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const results = this.processSearchResults(data || [], query || '');

      return {
        results,
        total: count || 0,
      };
    } catch (error) {
      console.error('Error searching by tag:', error);
      return { results: [], total: 0 };
    }
  }

  // Clear search cache
  clearCache() {
    this.searchCache.clear();
    this.suggestionCache.clear();
  }

  // Get search filters
  async getSearchFilters(): Promise<{
    categories: Array<{ name: string; slug: string; count: number }>;
    tags: Array<{ name: string; slug: string; count: number }>;
  }> {
    try {
      // Get categories with post counts
      const { data: categories } = await supabase
        .from('categories')
        .select(`
          name,
          slug,
          posts!inner(count)
        `)
        .eq('posts.status', 'published');

      // Get tags with post counts
      const { data: tags } = await supabase
        .from('tags')
        .select(`
          name,
          slug,
          post_tags!inner(posts!inner(count))
        `)
        .eq('post_tags.posts.status', 'published');

      return {
        categories: categories?.map(cat => ({
          name: cat.name,
          slug: cat.slug,
          count: cat.posts?.[0]?.count || 0,
        })) || [],
        tags: tags?.map(tag => ({
          name: tag.name,
          slug: tag.slug,
          count: tag.post_tags?.[0]?.posts?.[0]?.count || 0,
        })) || [],
      };
    } catch (error) {
      console.error('Error getting search filters:', error);
      return { categories: [], tags: [] };
    }
  }
}

export const searchService = new SearchService(); 