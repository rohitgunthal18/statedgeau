import { PostCard } from '@/components/blog/PostCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, TrendingUp, Calendar, Users } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: 'Tennis Analysis & Predictions | Australian Open Tips & ATP Analysis',
  description: 'Expert tennis analysis, Australian Open predictions, ATP tips, Grand Slam insights and match previews. Get the best tennis analysis from Australia.',
  keywords: [
    'tennis analysis',
    'Australian Open predictions',
    'ATP tips',
    'tennis predictions',
    'Grand Slam analysis',
    'tennis match previews',
    'tennis player stats',
    'Australian Open tips',
    'Wimbledon predictions',
    'US Open analysis',
    'French Open tips',
    'tennis form guide'
  ],
  openGraph: {
    title: 'Tennis Analysis & Predictions | SportsPulse AU',
    description: 'Expert tennis analysis, Australian Open predictions and ATP insights from Australia\'s leading tennis analysts.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default async function TennisAnalysisPage() {
  const { data: dbPosts } = await supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, featured_image, published_at, view_count,
      share_count, favorite_count, like_count, reading_time,
      categories(name, slug, sport_type, color)
    `)
    .eq('status', 'published')
    .eq('categories.slug', 'tennis-analysis')
    .order('published_at', { ascending: false })
    .limit(24);

  const posts = dbPosts?.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: '',
    featuredImage: p.featured_image || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    featuredImageAlt: p.title,
    author: { id: 'admin', name: 'Tennis Expert', expertise: ['Tennis Analysis'] },
    category: {
      id: 'tennis',
      name: 'Tennis Analysis',
      slug: 'tennis-analysis',
      description: 'Tennis analysis and predictions',
      sportType: 'tennis',
      color: '#9c27b0'
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-600/90 to-pink-500/20 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              🎾 Tennis Analysis Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tennis Analysis & Expert Predictions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Get expert tennis analysis, Australian Open predictions, ATP insights, Grand Slam coverage 
              and comprehensive match previews from Australia's leading tennis analysts.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Match Previews</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Australian Open</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Player Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-navy">Home</Link></li>
            <li className="before:content-['/'] before:mx-2">Tennis Analysis</li>
          </ol>
        </nav>

        {/* Content */}
        {posts.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Tennis Analysis & Predictions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stay ahead with expert tennis analysis, Australian Open insights, ATP predictions and match previews 
                from Australia's leading tennis analysts.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Zap className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Tennis Content Coming Soon</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're preparing comprehensive tennis analysis and Australian Open predictions. Check back soon!
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
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