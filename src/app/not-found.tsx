'use client';

import Link from 'next/link';
import { Search, Home, TrendingUp, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 bg-navy/10 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-navy" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or the URL might be incorrect.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-navy text-white px-6 py-3 rounded-lg hover:bg-navy/90 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            
            <Link
              href="/search"
              className="flex items-center justify-center gap-2 bg-emerald text-white px-6 py-3 rounded-lg hover:bg-emerald/90 transition-colors font-medium"
            >
              <Search className="w-4 h-4" />
              Search Posts
            </Link>
            
            <Link
              href="/trending"
              className="flex items-center justify-center gap-2 bg-coral text-white px-6 py-3 rounded-lg hover:bg-coral/90 transition-colors font-medium"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </Link>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/afl-analysis" className="text-navy hover:text-navy/80 font-medium">
                AFL Analysis
              </Link>
              <Link href="/nrl-analysis" className="text-navy hover:text-navy/80 font-medium">
                NRL Analysis
              </Link>
              <Link href="/horse-racing" className="text-navy hover:text-navy/80 font-medium">
                Horse Racing
              </Link>
              <Link href="/cricket-analysis" className="text-navy hover:text-navy/80 font-medium">
                Cricket Analysis
              </Link>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back to previous page
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 