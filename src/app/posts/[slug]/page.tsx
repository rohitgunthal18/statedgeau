"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { PostCard } from '@/components/blog/PostCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Calendar, 
  Eye, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Bookmark,
  MessageCircle,
  TrendingUp,
  User,
  ChevronRight,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check,
  ThumbsUp,
  StarIcon,
  Tag,
  Zap,
  Play,
  Film
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getFeaturedWebStories } from '@/lib/mockData';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PageProps {
  params: { slug: string };
}

export default function PostPage({ params }: PageProps) {
  const [post, setPost] = useState<any>(null);
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [webStories, setWebStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the main post
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select(`
            id, title, slug, content, excerpt, featured_image, published_at, created_at, view_count,
            categories(name, slug, sport_type)
          `)
          .eq('slug', params.slug)
          .eq('status', 'published')
          .maybeSingle();

        if (postError) {
          setError('Failed to load post');
          setLoading(false);
          return;
        }

        if (!postData) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        setPost(postData);

        // Track view using our API endpoint
        try {
          const trackResponse = await fetch('/api/track-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: postData.id })
          });
          
          if (trackResponse.ok) {
            const trackData = await trackResponse.json();
            // Update the local post data with new view count
            setPost((prev: any) => prev ? { ...prev, view_count: trackData.viewCount } : prev);
          }
        } catch (error) {
          console.error('Failed to track view:', error);
        }

        // Fetch trending/related posts for sidebar (exclude current post)
        const { data: trendingData } = await supabase
          .from('posts')
          .select(`
            id, title, slug, excerpt, featured_image, published_at, view_count,
            categories(name, slug, sport_type)
          `)
          .eq('status', 'published')
          .neq('slug', params.slug)
          .order('view_count', { ascending: false })
          .limit(6);

        setTrendingPosts(trendingData || []);

        // Get web stories for the sidebar
        setWebStories(getFeaturedWebStories());

        setLoading(false);
      } catch (err) {
        setError('Failed to load post');
        setLoading(false);
      }
    }

    fetchData();
  }, [params.slug]);

  const handleLike = () => {
    const liked = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    const isLiked = liked.some((p: any) => p.id === post.id);
    const likeBtn = document.getElementById('like-btn');
    if (!likeBtn) return;
    
    if (isLiked) {
      const updated = liked.filter((p: any) => p.id !== post.id);
      localStorage.setItem('likedPosts', JSON.stringify(updated));
      likeBtn.innerHTML = '<svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg><span>Like</span>';
    } else {
      liked.push({id: post.id, title: post.title, slug: post.slug, likedAt: new Date().toISOString()});
      localStorage.setItem('likedPosts', JSON.stringify(liked));
      likeBtn.innerHTML = '<svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg><span>Liked</span>';
    }
    
    // Trigger custom event to update header counts
    window.dispatchEvent(new Event('localStorageChange'));
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    const isSaved = saved.some((p: any) => p.id === post.id);
    const saveBtn = document.getElementById('save-btn');
    if (!saveBtn) return;
    
    if (isSaved) {
      const updated = saved.filter((p: any) => p.id !== post.id);
      localStorage.setItem('savedPosts', JSON.stringify(updated));
      saveBtn.innerHTML = '<svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg><span>Save</span>';
    } else {
      saved.push({id: post.id, title: post.title, slug: post.slug, savedAt: new Date().toISOString()});
      localStorage.setItem('savedPosts', JSON.stringify(saved));
      saveBtn.innerHTML = '<svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg><span>Saved</span>';
    }
    
    // Trigger custom event to update header counts
    window.dispatchEvent(new Event('localStorageChange'));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  // Initialize like/save button states
  useEffect(() => {
    if (!post) return;

    const liked = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    
    const likeBtn = document.getElementById('like-btn');
    const saveBtn = document.getElementById('save-btn');

    if (liked.some((p: any) => p.id === post.id) && likeBtn) {
      likeBtn.innerHTML = '<svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg><span>Liked</span>';
    }
    
    if (saved.some((p: any) => p.id === post.id) && saveBtn) {
      saveBtn.innerHTML = '<svg class="w-4 h-4 md:w-5 md:h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg><span>Saved</span>';
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed from our platform.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-navy to-emerald text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
              <ArrowLeft className="w-5 h-5" />
              Back to Homepage
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  const publishedDate = new Date(post.published_at || post.created_at);
  const readingTime = Math.ceil((post.content?.length || 0) / 200) || 5;

  // Map trending posts to PostCard format with real view counts
  const mappedTrendingPosts = trendingPosts.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: '',
    featuredImage: p.featured_image || 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    featuredImageAlt: p.title,
    author: { id: 'admin', name: 'Expert Analyst', expertise: ['Betting Analysis'] },
    category: { 
      id: 'cat', 
      name: p.categories?.name || 'Sports Betting', 
      slug: p.categories?.slug || 'sports', 
      description: '', 
      sportType: p.categories?.sport_type || 'multi' 
    },
    tags: [],
    publishedAt: p.published_at || new Date().toISOString(),
    updatedAt: p.published_at || new Date().toISOString(),
    status: 'published' as const,
    engagement: { 
      viewCount: p.view_count || 0,
      shareCount: Math.floor(Math.random() * 100) + 20,
      favoriteCount: Math.floor(Math.random() * 50) + 10,
      commentCount: Math.floor(Math.random() * 25) + 5,
      readingTime: Math.ceil(Math.random() * 8) + 3,
      isTrending: true
    },
    seo: {},
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Enhanced Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-navy transition-colors font-medium">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            {category?.name && (
              <>
                <Link href={`/${category.slug}`} className="hover:text-navy transition-colors font-medium">
                  {category.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-none">
              {post.title}
            </span>
          </nav>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Desktop: Card layout, Mobile: Full-screen layout */}
            <article className="bg-white lg:rounded-3xl lg:shadow-xl overflow-hidden">
              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  {category?.name && (
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                      <span className="inline-flex items-center bg-white/90 backdrop-blur-sm text-navy px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg">
                        {category.name}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 md:p-6 lg:p-8 xl:p-12">
                {/* Article Header */}
                <header className="mb-6 md:mb-8">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
                    {post.title}
                  </h1>
                  
                  {post.excerpt && (
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6 lg:mb-8 font-medium">
                      {post.excerpt}
                    </p>
                  )}
                  
                  {/* Enhanced Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 lg:gap-6 py-4 lg:py-6 border-t border-b border-gray-100">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-navy to-emerald rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm md:text-base">Expert Analyst</div>
                        <div className="text-xs md:text-sm text-gray-500">Sports Betting Specialist</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 md:gap-2 text-gray-500">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-medium">
                        {publishedDate.toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 md:gap-2 text-gray-500">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-medium">{readingTime} min read</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 md:gap-2 text-gray-500">
                      <Eye className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-medium">{(post.view_count || 0) + 1} views</span>
                    </div>

                    <div className="flex items-center gap-1.5 md:gap-2 text-emerald">
                      <Zap className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-bold">TRENDING</span>
                    </div>
                  </div>
                </header>

                {/* Enhanced Content - Mobile optimized typography */}
                <div className="prose prose-sm md:prose-base lg:prose-lg prose-emerald max-w-none mb-8 md:mb-10 lg:mb-12">
                  <div 
                    dangerouslySetInnerHTML={{ __html: post.content || '<p>Content will be available soon. Stay tuned for expert analysis and insights!</p>' }} 
                    className="text-gray-800 leading-relaxed [&>p]:text-sm [&>p]:md:text-base [&>p]:lg:text-lg [&>p]:leading-relaxed [&>p]:mb-4 [&>h1]:text-lg [&>h1]:md:text-xl [&>h1]:lg:text-2xl [&>h2]:text-base [&>h2]:md:text-lg [&>h2]:lg:text-xl [&>h3]:text-sm [&>h3]:md:text-base [&>h3]:lg:text-lg"
                  />
                </div>

                {/* Enhanced Social Actions - Mobile optimized with localStorage functionality */}
                <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                      <button 
                        id="like-btn"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-coral hover:bg-coral hover:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-coral/20 text-sm md:text-base"
                        onClick={handleLike}
                      >
                        <Heart className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Like</span>
                      </button>
                      
                      <button 
                        id="save-btn"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-navy hover:bg-navy hover:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md border border-navy/20 text-sm md:text-base"
                        onClick={handleSave}
                      >
                        <Bookmark className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Save</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-center">
                      <span className="text-xs md:text-sm font-medium text-gray-600 mr-1 md:mr-2">Share:</span>
                      
                      <button className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                        <Facebook className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      <button className="w-9 h-9 md:w-10 md:h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition-colors">
                        <Twitter className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      <button className="w-9 h-9 md:w-10 md:h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition-colors">
                        <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      <button 
                        className="w-9 h-9 md:w-10 md:h-10 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
                        onClick={handleCopyLink}
                      >
                        <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Call to Action - Mobile optimized */}
                <div className="bg-gradient-to-br from-navy to-emerald text-white rounded-xl lg:rounded-2xl p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Want More Expert Analysis?</h3>
                  <p className="text-gray-200 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">Join our Telegram channel for instant access to live betting tips and breaking sports news.</p>
                  <a 
                    href="https://t.me/AussieBettingInsights"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-golden text-navy px-6 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold hover:bg-golden/90 transition-all duration-300 hover:scale-105 text-sm md:text-base"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    Join Free Channel
                  </a>
                </div>
              </div>
            </article>

            {/* Navigation - Mobile optimized */}
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
              <Link 
                href="/"
                className="inline-flex items-center justify-center sm:justify-start gap-2 text-navy hover:text-navy/80 transition-colors font-medium text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              
              <Link 
                href="/trending"
                className="inline-flex items-center justify-center sm:justify-end gap-2 text-emerald hover:text-emerald/80 transition-colors font-medium text-sm md:text-base"
              >
                More Articles
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Enhanced Sidebar - Hidden on mobile, visible on desktop */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-8 space-y-6">
              {/* Modern Trending Posts with Enhanced Design */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-coral to-orange-500 text-white p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      Trending Now
                      <div className="ml-auto text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
                        {mappedTrendingPosts.length}
                      </div>
                    </h3>
                    <p className="text-xs text-white/80 mt-1">Most viewed this week</p>
                  </div>
                </div>
                
                {/* Enhanced Scrollable Content */}
                <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="p-4 space-y-4">
                    {mappedTrendingPosts.map((trendingPost, index) => (
                      <Link key={trendingPost.id} href={`/posts/${trendingPost.slug}`} className="block group">
                        <div className="relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-coral/30 bg-white">
                          {/* Featured Image Background */}
                          <div className="aspect-video relative overflow-hidden">
                            <img 
                              src={trendingPost.featuredImage} 
                              alt={trendingPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            {/* Ranking Badge */}
                            <div className="absolute top-3 left-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-coral to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                            </div>
                            
                            {/* Category Badge */}
                            <div className="absolute top-3 right-3">
                              <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-semibold">
                                {trendingPost.category.name}
                              </span>
                            </div>
                            
                            {/* Quick Stats Overlay */}
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="flex items-center justify-between text-white text-xs">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <Eye className="w-3 h-3" />
                                    {trendingPost.engagement.viewCount > 1000 
                                      ? `${(trendingPost.engagement.viewCount / 1000).toFixed(1)}k` 
                                      : trendingPost.engagement.viewCount}
                                  </span>
                                  <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <Clock className="w-3 h-3" />
                                    {trendingPost.engagement.readingTime}m
                                  </span>
                                </div>
                                <span className="flex items-center gap-1 bg-coral/80 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <Heart className="w-3 h-3" />
                                  {trendingPost.engagement.favoriteCount}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content Area */}
                          <div className="p-4">
                            <h4 className="font-bold text-gray-900 group-hover:text-coral transition-colors line-clamp-2 text-sm mb-2 leading-tight">
                              {trendingPost.title}
                            </h4>
                            
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                              {trendingPost.excerpt}
                            </p>
                            
                            {/* Author and Time */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-coral to-orange-500 rounded-full flex items-center justify-center">
                                  <User className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-xs font-medium text-gray-700">Expert</span>
                              </div>
                              <span className="text-xs text-gray-500">2h ago</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-t">
                  <Link href="/trending" className="block w-full text-center bg-gradient-to-r from-coral to-orange-500 text-white hover:from-coral/90 hover:to-orange-500/90 font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg">
                    Explore All Trending Articles →
                  </Link>
                </div>
              </div>

              {/* Enhanced Web Stories - Already Good Design */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Film className="w-4 h-4" />
                      </div>
                      Trending Stories
                      <div className="ml-auto text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
                        {webStories.length}
                      </div>
                    </h3>
                    <p className="text-xs text-white/80 mt-1">Quick visual insights</p>
                  </div>
                </div>
                
                {/* Stories Grid */}
                <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
                  <div className="p-4 grid grid-cols-2 gap-3">
                    {webStories.map((story, index) => (
                      <Link key={story.id} href={`/stories/${story.slug}`} className="block group">
                        <div className="relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                          <div className="aspect-[3/4] relative">
                            <img 
                              src={story.coverImage} 
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            
                            {/* Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white ml-0.5" />
                              </div>
                            </div>
                            
                            {/* Story Info */}
                            <div className="absolute bottom-3 left-3 right-3">
                              <h4 className="font-bold text-white text-xs line-clamp-2 mb-2 leading-tight">
                                {story.title}
                              </h4>
                              <div className="flex items-center justify-between text-xs text-white/80">
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
                                  {story.duration}s
                                </span>
                                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <Eye className="w-3 h-3" />
                                  {story.engagement.viewCount > 1000 
                                    ? `${(story.engagement.viewCount / 1000).toFixed(1)}k` 
                                    : story.engagement.viewCount}
                                </span>
                              </div>
                            </div>
                            
                            {/* Story Number Badge */}
                            <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">{index + 1}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 border-t">
                  <Link href="/stories" className="block w-full text-center bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-600/90 hover:to-purple-500/90 font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg">
                    Watch All Stories →
                  </Link>
                </div>
              </div>

              {/* Modern More Articles Section */}
              {mappedTrendingPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald to-teal-500 text-white p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <StarIcon className="w-4 h-4" />
                        </div>
                        More Articles
                      </h3>
                      <p className="text-xs text-white/80 mt-1">Latest insights</p>
                    </div>
                  </div>
                  
                  <div className="h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
                    <div className="p-4 space-y-3">
                      {mappedTrendingPosts.slice(0, 10).map((article, index) => (
                        <Link key={article.id} href={`/posts/${article.slug}`} className="block group">
                          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-emerald/20">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                              <img 
                                src={article.featuredImage} 
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald/20 to-transparent"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 group-hover:text-emerald transition-colors text-xs line-clamp-2 leading-tight mb-1">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {article.engagement.readingTime}m
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {article.engagement.viewCount}
                                </span>
                                <span className="flex items-center gap-1 text-emerald">
                                  <TrendingUp className="w-3 h-3" />
                                  Hot
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Newsletter CTA */}
              <div className="bg-gradient-to-br from-navy via-navy/95 to-emerald text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-golden/20 rounded-full blur-xl animate-pulse-soft"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-coral/20 rounded-full blur-xl animate-pulse-soft"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-emerald/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-golden/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <MessageCircle className="w-6 h-6 text-golden" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">Join VIP Community</h3>
                  <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                    Get exclusive betting tips, live odds alerts, and breaking news delivered instantly.
                  </p>
                  
                  <a 
                    href="https://t.me/AussieBettingInsights"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-golden text-navy text-center py-3 rounded-xl font-bold hover:bg-golden/90 transition-all duration-300 hover:scale-105 mb-4 shadow-lg"
                  >
                    Join 10,000+ Winners
                  </a>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald rounded-full"></span>
                      Free Forever
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-golden rounded-full"></span>
                      Live Updates
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-coral rounded-full"></span>
                      Expert Tips
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Trending Section - Enhanced Modern Design */}
        <div className="lg:hidden mt-8 space-y-6">
          {/* Mobile Trending Articles - Modern Card Design */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-coral to-orange-500 text-white p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  More Articles
                  <div className="ml-auto text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
                    {mappedTrendingPosts.length}
                  </div>
                </h3>
                <p className="text-xs text-white/80 mt-1">Most viewed this week</p>
              </div>
            </div>
            
            <div className="h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="p-4 space-y-4">
                {mappedTrendingPosts.map((trendingPost, index) => (
                  <Link key={trendingPost.id} href={`/posts/${trendingPost.slug}`} className="block group">
                    <div className="relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-coral/30 bg-white">
                      {/* Mobile Card Layout */}
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <img 
                          src={trendingPost.featuredImage} 
                          alt={trendingPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Ranking Badge */}
                        <div className="absolute top-3 left-3">
                          <div className="w-7 h-7 bg-gradient-to-br from-coral to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-lg text-xs font-semibold">
                            {trendingPost.category.name}
                          </span>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <div className="flex items-center justify-between text-white text-xs">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                <Eye className="w-3 h-3" />
                                {trendingPost.engagement.viewCount > 1000 
                                  ? `${(trendingPost.engagement.viewCount / 1000).toFixed(1)}k` 
                                  : trendingPost.engagement.viewCount}
                              </span>
                              <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                <Clock className="w-3 h-3" />
                                {trendingPost.engagement.readingTime}m
                              </span>
                            </div>
                            <span className="flex items-center gap-1 bg-coral/80 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Heart className="w-3 h-3" />
                              {trendingPost.engagement.favoriteCount}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content Area */}
                      <div className="p-4">
                        <h4 className="font-bold text-gray-900 group-hover:text-coral transition-colors line-clamp-2 text-sm mb-2 leading-tight">
                          {trendingPost.title}
                        </h4>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                          {trendingPost.excerpt}
                        </p>
                        
                        {/* Author and Time */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-gradient-to-br from-coral to-orange-500 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-700">Expert</span>
                          </div>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t">
              <Link href="/trending" className="block w-full text-center bg-gradient-to-r from-coral to-orange-500 text-white hover:from-coral/90 hover:to-orange-500/90 font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg">
                Explore All Articles →
              </Link>
            </div>
          </div>

          {/* Mobile Web Stories - Enhanced Design */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  Trending Stories
                  <div className="ml-auto text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
                    {webStories.length}
                  </div>
                </h3>
                <p className="text-xs text-white/80 mt-1">Quick visual insights</p>
              </div>
            </div>
            
            <div className="h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100">
              <div className="p-4 grid grid-cols-2 gap-3">
                {webStories.map((story, index) => (
                  <Link key={story.id} href={`/stories/${story.slug}`} className="block group">
                    <div className="relative rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[3/4] relative">
                        <img 
                          src={story.coverImage} 
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                        
                        {/* Story Info */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h4 className="font-bold text-white text-xs line-clamp-2 mb-2 leading-tight">
                            {story.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-white/80">
                            <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full font-medium">
                              {story.duration}s
                            </span>
                            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                              <Eye className="w-3 h-3" />
                              {story.engagement.viewCount > 1000 
                                ? `${(story.engagement.viewCount / 1000).toFixed(1)}k` 
                                : story.engagement.viewCount}
                            </span>
                          </div>
                        </div>
                        
                        {/* Story Number Badge */}
                        <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 border-t">
              <Link href="/stories" className="block w-full text-center bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-600/90 hover:to-purple-500/90 font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg">
                Watch All Stories →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 