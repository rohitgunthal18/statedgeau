import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About StatEdge AU',
  description: 'Learn about StatEdge AU: our mission, methodology, and team behind Australia’s leading sports analysis platform.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About StatEdge AU</h1>
        <p className="text-gray-600 mb-8">Data-driven Australian sports analysis, predictions, and reports.</p>

        <div className="prose prose-gray max-w-none">
          <h2>Our Mission</h2>
          <p>
            We help Australian fans make sense of the numbers with clear, data-backed analysis across AFL, NRL, racing, and more.
          </p>
          <h2>Our Methodology</h2>
          <ul>
            <li>Performance models blending form, injuries, and matchup context</li>
            <li>Surface/track and weather adjustments for racing and cricket</li>
            <li>Human-in-the-loop analyst review for context and clarity</li>
          </ul>
          <h2>Contact</h2>
          <p>
            For media and partnerships: <a href="mailto:hello@statedge.au">hello@statedge.au</a>
          </p>
        </div>
      </section>
    </main>
  );
} 