"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { 
  TrendingUp, 
  Star, 
  Users, 
  Target, 
  Calendar, 
  ArrowRight, 
  MessageCircle,
  Zap,
  Trophy,
  Shield,
  TrendingDown,
  Clock,
  Play,
  CheckCircle2,
  Eye,
  Film
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/blog/PostCard";
import { WebStoryCard } from "@/components/blog/WebStoryCard";
import { 
  getFeaturedPosts, 
  getRecentPosts, 
  TRENDING_POSTS, 
  CATEGORIES,
  POPULAR_SEARCHES,
  getFeaturedWebStories
} from "@/lib/mockData";
import { getSportConfig, formatNumber, getPostUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState(getFeaturedPosts());
  const [freshInsights, setFreshInsights] = useState<any[]>([]);
  const [hotRightNow, setHotRightNow] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllSections() {
      try {
        console.log('Homepage: Fetching algorithm-optimized content...');
        setLoading(true);
        
        // Fetch different sections in parallel for optimal performance
        const [featuredResponse, freshResponse, hotResponse] = await Promise.all([
          fetch('/api/posts/featured?section=featured&limit=3'),
          fetch('/api/posts/featured?section=fresh&limit=6'),
          fetch('/api/posts/featured?section=hot&limit=4')
        ]);

        // Process featured posts
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          if (featuredData.success && featuredData.posts.length > 0) {
            const mappedFeatured = featuredData.posts.map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: p.excerpt || 'Expert analysis and insights...',
              content: '',
              featuredImage: p.featured_image || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop',
              featuredImageAlt: p.featured_image_alt || p.title,
              author: { id: 'admin', name: 'StatEdge Analyst', expertise: ['Sports Analysis', 'Performance Trends'] },
              category: { 
                id: p.categories?.id || 'general', 
                name: p.categories?.name || 'Sports Analysis', 
                slug: p.categories?.slug || 'sports', 
                description: `Expert ${p.categories?.name || 'sports'} analysis`, 
                sportType: p.categories?.sport_type || 'multi',
                color: p.categories?.color || '#1a237e'
              },
              tags: [],
              publishedAt: p.published_at || p.created_at || new Date().toISOString(),
              updatedAt: p.published_at || p.created_at || new Date().toISOString(),
              status: 'published' as const,
              engagement: { 
                viewCount: p.view_count || 0, 
                shareCount: p.share_count || 0, 
                favoriteCount: p.favorite_count || 0, 
                commentCount: p.comment_count || 0, 
                likeCount: p.like_count || 0,
                readingTime: p.reading_time || Math.ceil((p.content?.length || 1000) / 1000), 
                isTrending: (p.view_count || 0) > 100
              },
              seo: {
                title: p.title,
                description: p.excerpt || 'Expert analysis and insights',
                keywords: []
              },
            }));
            setFeaturedPosts(mappedFeatured);
            console.log('Homepage: Set featured posts:', mappedFeatured.length);
          }
        }

        // Process fresh insights
        if (freshResponse.ok) {
          const freshData = await freshResponse.json();
          if (freshData.success && freshData.posts.length > 0) {
            const mappedFresh = freshData.posts.map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: p.excerpt || 'Expert analysis and insights...',
              content: '',
              featuredImage: p.featured_image || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop',
              featuredImageAlt: p.featured_image_alt || p.title,
              author: { id: 'admin', name: 'StatEdge Analyst', expertise: ['Sports Analysis', 'Performance Trends'] },
              category: { 
                id: p.categories?.id || 'general', 
                name: p.categories?.name || 'Sports Analysis', 
                slug: p.categories?.slug || 'sports', 
                description: `Expert ${p.categories?.name || 'sports'} analysis`, 
                sportType: p.categories?.sport_type || 'multi',
                color: p.categories?.color || '#1a237e'
              },
              tags: [],
              publishedAt: p.published_at || p.created_at || new Date().toISOString(),
              updatedAt: p.published_at || p.created_at || new Date().toISOString(),
              status: 'published' as const,
              engagement: { 
                viewCount: p.view_count || 0, 
                shareCount: p.share_count || 0, 
                favoriteCount: p.favorite_count || 0, 
                commentCount: p.comment_count || 0, 
                likeCount: p.like_count || 0,
                readingTime: p.reading_time || Math.ceil((p.content?.length || 1000) / 1000), 
                isTrending: (p.view_count || 0) > 100
              },
              seo: {
                title: p.title,
                description: p.excerpt || 'Expert analysis and insights',
                keywords: []
              },
            }));
            setFreshInsights(mappedFresh);
            console.log('Homepage: Set fresh insights:', mappedFresh.length);
          }
        }

        // Process hot right now
        if (hotResponse.ok) {
          const hotData = await hotResponse.json();
          if (hotData.success && hotData.posts.length > 0) {
            const mappedHot = hotData.posts.map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              excerpt: p.excerpt || 'Expert analysis and insights...',
              content: '',
              featuredImage: p.featured_image || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop',
              featuredImageAlt: p.featured_image_alt || p.title,
              author: { id: 'admin', name: 'StatEdge Analyst', expertise: ['Sports Analysis', 'Performance Trends'] },
              category: { 
                id: p.categories?.id || 'general', 
                name: p.categories?.name || 'Sports Analysis', 
                slug: p.categories?.slug || 'sports', 
                description: `Expert ${p.categories?.name || 'sports'} analysis`, 
                sportType: p.categories?.sport_type || 'multi',
                color: p.categories?.color || '#1a237e'
              },
              tags: [],
              publishedAt: p.published_at || p.created_at || new Date().toISOString(),
              updatedAt: p.published_at || p.created_at || new Date().toISOString(),
              status: 'published' as const,
              engagement: { 
                viewCount: p.view_count || 0, 
                shareCount: p.share_count || 0, 
                favoriteCount: p.favorite_count || 0, 
                commentCount: p.comment_count || 0, 
                likeCount: p.like_count || 0,
                readingTime: p.reading_time || Math.ceil((p.content?.length || 1000) / 1000), 
                isTrending: (p.view_count || 0) > 100
              },
              seo: {
                title: p.title,
                description: p.excerpt || 'Expert analysis and insights',
                keywords: []
              },
            }));
            setHotRightNow(mappedHot);
            console.log('Homepage: Set hot right now:', mappedHot.length);
          }
        }

      } catch (error) {
        console.error('Homepage: Error fetching algorithm content:', error);
        // Fallback to mock data
        setFeaturedPosts(getFeaturedPosts());
        setFreshInsights(getRecentPosts(6));
      } finally {
        setLoading(false);
      }
    }

    fetchAllSections();
  }, []);

  const topCategories = CATEGORIES.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Enhanced Hero Section */}
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
          
          <div className="relative container mx-auto px-4 py-8 md:py-16 lg:py-24">
            <div className="max-w-6xl mx-auto">
              {/* Trust Badge */}
              <div className="flex justify-center mb-4 md:mb-8">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl px-4 md:px-6 py-2 md:py-3 border border-white/20">
                  <Shield className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 text-golden" />
                  <span className="text-xs md:text-sm font-semibold">Australia's #1 Trusted Sports Analysis Platform</span>
                  <div className="ml-2 md:ml-3 flex items-center">
                    <Star className="w-3 md:w-4 h-3 md:h-4 text-golden fill-current" />
                    <span className="ml-1 text-xs md:text-sm font-bold">4.8/5</span>
                  </div>
                </div>
              </div>
              
              {/* Main Headline */}
              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                  <span className="block">Turn Your Sports</span>
                  <span className="block bg-gradient-to-r from-golden via-emerald to-golden bg-clip-text text-transparent">
                    Knowledge Into
                  </span>
                  <span className="block">Smarter Decisions</span>
                </h1>
                
                <p className="text-base md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto px-2">
                  Get expert data-driven analysis for AFL, NRL, horse racing, and cricket. 
                  Join <span className="font-bold text-golden">50,000+ Australian readers</span> who 
                  trust our insights and in-depth previews.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
                <div className="text-center p-3 md:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-golden mb-1 md:mb-2">50K+</div>
                  <div className="text-gray-300 text-xs md:text-sm">Monthly Users</div>
                </div>
                <div className="text-center p-3 md:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald mb-1 md:mb-2">85%</div>
                  <div className="text-gray-300 text-xs md:text-sm">Success Rate</div>
                </div>
                <div className="text-center p-3 md:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-coral mb-1 md:mb-2">24/7</div>
                  <div className="text-gray-300 text-xs md:text-sm">Live Analysis</div>
                </div>
                <div className="text-center p-3 md:p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-golden mb-1 md:mb-2">10K+</div>
                  <div className="text-gray-300 text-xs md:text-sm">Telegram Members</div>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
                <Link
                  href="/afl"
                  className="group relative overflow-hidden bg-gradient-to-r from-golden to-golden/80 text-navy px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg w-full sm:w-auto flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:from-golden/90 hover:to-golden"
                >
                  <Trophy className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  <span>Get AFL Tips Now</span>
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>
                
                <a
                  href="https://t.me/+K1GjvOY331JhNGM1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg w-full sm:w-auto flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-105"
                >
                  <MessageCircle className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  <span>Join Free Channel</span>
                  <div className="ml-2 md:ml-3 flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald rounded-full animate-pulse"></div>
                    <span className="text-xs md:text-sm">LIVE</span>
                  </div>
                </a>
              </div>

              {/* Value Propositions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                <div className="text-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-golden/20 to-golden/40 rounded-2xl flex items-center justify-center">
                    <Target className="w-6 md:w-8 h-6 md:h-8 text-golden" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Expert Analysis</h3>
                  <p className="text-gray-300 text-xs md:text-sm">Professional analysts with 10+ years experience</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-emerald/20 to-emerald/40 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 md:w-8 h-6 md:h-8 text-emerald" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Real-Time Updates</h3>
                  <p className="text-gray-300 text-xs md:text-sm">Live odds, injury reports, and breaking news</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-coral/20 to-coral/40 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 md:w-8 h-6 md:h-8 text-coral" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Proven Results</h3>
                  <p className="text-gray-300 text-xs md:text-sm">Track record of 85% successful predictions</p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 md:mt-12 text-center">
                <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4">Trusted by Australian fans nationwide</p>
                <div className="flex items-center justify-center gap-4 md:gap-8 text-gray-400">
                  <span className="flex items-center gap-1 md:gap-2">
                    <Shield className="w-3 md:w-4 h-3 md:h-4" />
                    <span className="text-xs">Licensed</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-2">
                    <Clock className="w-3 md:w-4 h-3 md:h-4" />
                    <span className="text-xs">Est. 2020</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-2">
                    <Users className="w-3 md:w-4 h-3 md:h-4" />
                    <span className="text-xs">50K+ Users</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-2">
                    <Trophy className="w-3 md:w-4 h-3 md:h-4" />
                    <span className="text-xs">Award Winning</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Featured Posts Section */}
        <section className="py-20 bg-white relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-white"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-coral/10 text-coral px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                🔥 Trending Analysis
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Expert Sports Analysis & Predictions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Our most popular AFL analysis, NRL predictions and expert insights from professional sports analysts. 
                Get data-driven analysis to stay ahead of the game.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post: any) => (
                <div key={post.id}>
                  <PostCard 
                    post={post} 
                    variant="default"
                  />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/trending" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-navy to-emerald text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                View All Trending Analysis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Web Stories Section */}
        <section className="py-20 bg-gradient-to-br from-navy/5 via-emerald/5 to-golden/5 relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-golden/10 text-golden px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Film className="w-4 h-4 mr-2" />
                🎬 Visual Stories
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Interactive Web Stories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Dive into immersive visual experiences that bring insights to life. 
                Swipe through expert analysis and breaking news in story format.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFeaturedWebStories().map((story) => (
                <WebStoryCard key={story.id} story={story} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/stories" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-golden to-coral text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                View All Web Stories
                <Play className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Sports Categories Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-emerald/10 text-emerald px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Trophy className="w-4 h-4 mr-2" />
                🏆 Complete Sports Coverage
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Expert Analysis Across All Major Sports
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                From AFL grand finals to Melbourne Cup, we cover every major Australian sporting event 
                with in-depth analysis and actionable previews.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCategories.map((category) => {
                const config = getSportConfig(category.sportType);
                const postCount = getRecentPosts().filter(p => p.category.id === category.id).length;
                
                return (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    className="group relative bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="relative">
                      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {config.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-navy transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{postCount} expert articles</span>
                        <span className="text-emerald font-semibold flex items-center group-hover:gap-2 transition-all">
                          <span>Explore</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest Articles with Enhanced Sidebar */}
        <section className="py-20 bg-white relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Enhanced Main Content */}
              <div className="lg:col-span-3">
                <div className="text-center lg:text-left mb-16">
                  <div className="inline-flex items-center bg-navy/10 text-navy px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    📈 Latest Expert Analysis
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Fresh Insights & Expert Predictions
                  </h2>
                  <p className="text-gray-600 text-lg max-w-3xl">
                    Stay ahead of the game with our latest analysis, expert predictions, 
                    and data-driven insights from Australia's top sports analysts.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(freshInsights.length > 0 ? freshInsights : getRecentPosts(6)).map((post, index) => (
                    <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-16">
                  <Link 
                    href="/latest" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-navy to-emerald text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    View All Latest Analysis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <p className="text-sm text-gray-500 mt-4">
                    📊 Updated daily with fresh insights • 🎯 Expert analysis • 🏆 Proven track record
                  </p>
                </div>
              </div>

              {/* Enhanced Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Enhanced Trending Posts Widget */}
                <div className="card-interactive p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-coral to-coral/80 rounded-lg flex items-center justify-center mr-3">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      Hot Right Now
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-coral font-medium">
                      <div className="w-2 h-2 bg-coral rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {(hotRightNow.length > 0 ? hotRightNow : TRENDING_POSTS.slice(0, 4)).map((post, index) => (
                      <Link
                        key={post.id}
                        href={getPostUrl(post.category?.slug || 'sports', post.slug)}
                        className="block group"
                      >
                        <div className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-coral to-golden rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 group-hover:text-navy transition-colors line-clamp-2 mb-2">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <div className={getSportConfig(post.category?.sportType || 'multi').icon}>
                                  {getSportConfig(post.category?.sportType || 'multi').icon}
                                </div>
                                <span>{post.category?.name || 'Sports'}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatNumber(post.engagement?.viewCount || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <Link
                      href="/trending"
                      className="flex items-center justify-center gap-2 text-sm font-medium text-coral hover:text-coral/80 transition-colors"
                    >
                      <span>View All Trending</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Enhanced Popular Searches Widget */}
                <div className="card-interactive p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald to-emerald/80 rounded-lg flex items-center justify-center mr-3">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    What Others Search
                  </h3>
                  <div className="space-y-3">
                    {POPULAR_SEARCHES.slice(0, 8).map((search, index) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(search.query)}`}
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-navy transition-colors p-3 rounded-lg hover:bg-gray-50 group"
                      >
                        <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                          {search.query}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-medium">
                            {formatNumber(search.count)}
                          </span>
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            search.trend === 'up' ? 'bg-emerald animate-pulse' : 
                            search.trend === 'down' ? 'bg-coral' : 'bg-gray-400'
                          )} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Enhanced Newsletter/Telegram CTA */}
                <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy/95 to-emerald text-white rounded-2xl p-8 shadow-2xl">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-golden/20 rounded-full blur-xl animate-pulse"></div>
                  
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-golden/20 to-golden/40 rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-golden" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Join Our VIP Community</h3>
                    <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                      Get instant access to exclusive analysis updates and breaking news.
                    </p>
                    <a
                      href="https://t.me/+K1GjvOY331JhNGM1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-golden text-navy px-6 py-3 rounded-xl font-bold text-sm hover:bg-golden/90 transition-all duration-300 hover:scale-105 shadow-lg w-full justify-center"
                    >
                      <Users className="w-4 h-4" />
                      <span>Join 10,000+ Winners</span>
                    </a>
                    <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-300">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald" />
                        <span>Free Forever</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-golden" />
                        <span>Live Updates</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-coral" />
                        <span>Expert Tips</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Community Stats */}
                <div className="card-interactive p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-navy to-navy/80 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    Community Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Monthly Readers</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy text-lg">50.2K</span>
                        <div className="flex items-center gap-1 text-xs text-emerald">
                          <TrendingUp className="w-3 h-3" />
                          <span>+12%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Success Rate</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald text-lg">85%</span>
                        <div className="flex items-center gap-1 text-xs text-emerald">
                          <Trophy className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Expert Analysts</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-golden text-lg">12</span>
                        <div className="flex items-center gap-1 text-xs text-golden">
                          <Star className="w-3 h-3 fill-current" />
                          <span>4.8/5</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">Telegram Members</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-coral text-lg">10.1K</span>
                        <div className="flex items-center gap-1 text-xs text-coral">
                          <div className="w-2 h-2 bg-coral rounded-full animate-pulse"></div>
                          <span>Growing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Call to Action Section */}
        <section className="py-20 bg-gradient-to-r from-emerald via-navy to-emerald text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-golden/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-coral/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-white/20 mb-8">
                <Trophy className="w-5 h-5 mr-3 text-golden" />
                <span className="font-semibold">Ready to Dive Deeper?</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Build Your Strategy Today
              </h2>
              <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
                Join thousands of Australian readers who've already discovered the power of 
                data-driven sports analysis.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                <Link 
                  href="/afl"
                  className="inline-flex items-center gap-2 bg-white text-navy px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Trophy className="w-4 h-4 text-navy mr-2" />
                  <span>AFL Predictions</span>
                </Link>
                
                <Link
                  href="/nrl"
                  className="inline-flex items-center gap-2 bg-white text-navy px-4 py-2 rounded-xl shadow hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Target className="w-4 h-4 text-navy mr-2" />
                  <span>NRL Analysis</span>
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="https://t.me/+K1GjvOY331JhNGM1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 bg-golden text-navy px-8 py-4 rounded-2xl font-bold text-lg hover:bg-golden/90 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Get Instant Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <Link
                  href="/about"
                  className="flex items-center gap-2 text-white hover:text-golden transition-colors font-medium"
                >
                  <span>Learn About Our Methods</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-golden mb-2">🎯</div>
                  <div className="text-sm text-gray-300">Expert Analysis</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald mb-2">📊</div>
                  <div className="text-sm text-gray-300">Data-Driven</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-coral mb-2">🏆</div>
                  <div className="text-sm text-gray-300">Proven Results</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-golden mb-2">⚡</div>
                  <div className="text-sm text-gray-300">Real-Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
