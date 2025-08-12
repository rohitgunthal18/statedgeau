import { PostCard } from '@/components/blog/PostCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Target, TrendingUp, Calendar, Users } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: 'Cricket Analysis & Predictions | Big Bash League Tips Australia',
  description: 'Expert cricket analysis, BBL predictions, Australian cricket insights, player stats and match previews. Get the best cricket analysis and tips.',
  keywords: [
    'cricket analysis',
    'Big Bash League predictions',
    'BBL tips',
    'Australian cricket',
    'cricket predictions',
    'cricket match previews',
    'cricket player stats',
    'cricket analysis Australia',
    'T20 cricket tips',
    'cricket world cup',
    'Australian cricket team',
    'cricket form guide'
  ],
  openGraph: {
    title: 'Cricket Analysis & Predictions | SportsPulse AU',
    description: 'Expert cricket analysis, BBL predictions and Australian cricket insights from leading cricket analysts.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default async function CricketAnalysisPage() {
  const { data: dbPosts } = await supabase
    .from('posts')
    .select(`
      id, title, slug, excerpt, featured_image, published_at, view_count,
      share_count, favorite_count, like_count, reading_time,
      categories(name, slug, sport_type, color)
    `)
    .eq('status', 'published')
    .eq('categories.slug', 'cricket-analysis')
    .order('published_at', { ascending: false })
    .limit(24);

  const posts = dbPosts?.map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: '',
    featuredImage: p.featured_image || 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
    featuredImageAlt: p.title,
    author: { id: 'admin', name: 'Cricket Expert', expertise: ['Cricket Analysis'] },
    category: {
      id: 'cricket',
      name: 'Cricket Analysis',
      slug: 'cricket-analysis',
      description: 'Cricket analysis and predictions',
      sportType: 'cricket',
      color: '#ff5722'
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
      <section className="bg-gradient-to-br from-coral via-coral/90 to-golden/20 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              🏏 Cricket Analysis Hub
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cricket Analysis & Expert Predictions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Get expert cricket analysis, Big Bash League predictions, Australian cricket insights, 
              player statistics and comprehensive match previews for all formats.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Match Previews</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>BBL Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Player Stats</span>
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
            <li className="before:content-['/'] before:mx-2">Cricket Analysis</li>
          </ol>
        </nav>

        {/* Content */}
        {posts.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Latest Cricket Analysis & Predictions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stay ahead with expert cricket analysis, BBL insights, player form guides and match predictions 
                from Australia's leading cricket analysts.
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
              <Target className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cricket Content Coming Soon</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We're preparing comprehensive cricket analysis and BBL predictions. Check back soon for expert insights!
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-coral to-golden text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
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