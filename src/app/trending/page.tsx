import { PostCard } from '@/components/blog/PostCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TRENDING_POSTS } from '@/lib/mockData';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: 'Trending Sports Analysis',
  description: 'Discover the most popular AFL analysis, NRL predictions, horse racing tips and cricket insights trending right now in Australia.',
  keywords: [
    'trending sports analysis',
    'popular AFL tips',
    'trending NRL predictions',
    'hot sports topics Australia',
    'viral sports content',
    'trending footy analysis'
  ],
  robots: { index: true, follow: true },
};

export default async function TrendingPage() {
  const { data: dbPosts } = await supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, featured_image, published_at, view_count,
      share_count, favorite_count, like_count, reading_time,
      categories(name, slug, sport_type)
    `)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(24); // Show up to 24 trending posts

  const posts = (dbPosts && dbPosts.length > 0)
    ? dbPosts.map((p: any) => ({
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
          sportType: p.categories?.sport_type || 'multi' 
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
          isTrending: true
        },
        seo: {},
      }))
    : TRENDING_POSTS;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trending Sports Analysis</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular AFL analysis, NRL predictions, horse racing tips and cricket insights 
            that are trending right now across Australia.
          </p>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} variant="default" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Trending Posts Yet</h3>
            <p className="text-gray-600 mb-8">
              We're building our collection of trending sports analysis. Check back soon for the hottest content!
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-navy to-emerald text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
            >
              Back to Homepage
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 