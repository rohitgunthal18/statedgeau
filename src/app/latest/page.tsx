import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Latest Analysis',
  description: 'Latest expert analysis and predictions from StatEdge AU across AFL, NRL, racing and more.',
  alternates: { canonical: '/latest' },
  robots: { index: true, follow: true },
};

export default function LatestPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest Analysis</h1>
          <p className="text-gray-600 mb-8">Daily updates with fresh previews, predictions, and match reports.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* In a real app, fetch recent posts; here we link to category hubs */}
            {[
              { href: '/afl', title: 'AFL: Round Previews & Predictions' },
              { href: '/nrl', title: 'NRL: Weekly Insights & Try-Scorer Picks' },
              { href: '/racing', title: 'Racing: Saturday Speed Maps & Shortlists' },
              { href: '/cricket', title: 'Cricket: Match Previews & Player Form' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="block p-5 rounded-xl border border-gray-200 hover:border-navy/30 hover:shadow-md transition-all">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h2>
                <p className="text-sm text-gray-600">Explore the newest posts and updates from our analysts.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 