"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostCard } from '@/components/blog/PostCard';
import { 
  TrendingUp, 
  Calendar, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Grid3X3,
  List,
  BarChart3,
  Trophy,
  Zap,
  Target,
  Users,
  Star
} from 'lucide-react';
import { getSportConfig } from '@/lib/utils';

interface CategoryPageData {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
    sport_type: string;
    color: string;
    stats: {
      postCount: number;
      score: number;
    };
  };
  posts: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  
  const [data, setData] = useState<CategoryPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchCategoryData = async (page: number = 1) => {
    try {
      setLoading(true);
      console.log(`Fetching category data for: ${categorySlug}, page: ${page}`);
      
      const response = await fetch(`/api/posts/category/${categorySlug}?page=${page}&limit=12`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Category not found');
        } else {
          setError('Failed to load category posts');
        }
        return;
      }
      
      const result = await response.json();
      console.log('Category API response:', result);
      
      if (!result.success) {
        setError(result.error || 'Failed to load posts');
        return;
      }
      
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching category data:', err);
      setError('Failed to load category posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryData(currentPage);
    }
  }, [categorySlug, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
            <p className="text-gray-600">Loading category insights...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{error}</h1>
            <p className="text-gray-600 mb-8">The category you're looking for doesn't exist or has no content yet.</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-navy to-emerald text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Homepage
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = data.category;
  const posts = data.posts;
  const pagination = data.pagination;
  const sportConfig = getSportConfig(category.sport_type);

  // Map posts to PostCard format
  const mappedPosts = posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || 'Expert betting analysis and insights...',
    content: '',
    featuredImage: post.featured_image || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop',
    featuredImageAlt: post.featured_image_alt || post.title,
    author: { id: 'admin', name: 'BETIQ Expert', expertise: ['Sports Analysis', 'Betting Strategy'] },
    category: { 
      id: category.id, 
      name: category.name, 
      slug: category.slug, 
      description: category.description, 
      sportType: category.sport_type,
      color: category.color
    },
    tags: [],
    publishedAt: post.published_at || post.created_at || new Date().toISOString(),
    updatedAt: post.published_at || post.created_at || new Date().toISOString(),
    status: 'published' as const,
    engagement: { 
      viewCount: post.view_count || 0, 
      shareCount: post.share_count || 0, 
      favoriteCount: post.favorite_count || 0, 
      commentCount: post.comment_count || 0, 
      likeCount: post.like_count || 0,
      readingTime: post.reading_time || 5, 
      isTrending: (post.view_count || 0) > 100
    },
    seo: {
      title: post.title,
      description: post.excerpt || 'Expert betting analysis and insights',
      keywords: []
    },
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Enhanced Category Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy/95 to-emerald text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-golden/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-coral/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <div className="text-4xl">{sportConfig.icon}</div>
            </div>
            
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{category.name}</span>
            </nav>
            
            {/* Category Title & Description */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {category.name}
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              {category.description || `Expert analysis and predictions for ${category.name.toLowerCase()}.`}
            </p>
            
            {/* Category Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-golden mb-2">{category.stats.postCount}</div>
                <div className="text-gray-300 text-sm">Expert Articles</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-emerald mb-2">{Math.round(category.stats.score * 100) || 95}%</div>
                <div className="text-gray-300 text-sm">Quality Score</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-coral mb-2">24/7</div>
                <div className="text-gray-300 text-sm">Live Updates</div>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-golden mb-2">Pro</div>
                <div className="text-gray-300 text-sm">Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header with Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <div className="inline-flex items-center bg-emerald/10 text-emerald px-4 py-2 rounded-full text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                🎯 Algorithm Optimized
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest {category.name} Analysis
              </h2>
              <p className="text-gray-600 text-lg">
                {pagination.total} expert articles ranked by engagement, recency, and trending velocity.
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-4 mt-8 md:mt-0">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-navy shadow-sm' : 'text-gray-600 hover:text-navy'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-navy shadow-sm' : 'text-gray-600 hover:text-navy'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Posts Grid/List */}
          {mappedPosts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
              : 'space-y-6'
            }>
              {mappedPosts.map((post: any, index: number) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard 
                    post={post} 
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Posts Yet</h3>
              <p className="text-gray-600 mb-8">
                We're working on bringing you expert {category.name.toLowerCase()} analysis. Check back soon!
              </p>
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-navy to-emerald text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
              >
                Explore Other Categories
              </Link>
            </div>
          )}
          
          {/* Enhanced Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    const isActive = pageNumber === currentPage;
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          isActive 
                            ? 'bg-navy text-white' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} articles
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 