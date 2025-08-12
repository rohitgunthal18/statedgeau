"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Bookmark, ArrowLeft, Trash2 } from 'lucide-react';

interface SavedPost {
  id: string;
  title: string;
  slug: string;
  savedAt: string;
}

export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    setSavedPosts(saved);
    setLoading(false);
  }, []);

  const removeSavedPost = (postId: string) => {
    const updated = savedPosts.filter(post => post.id !== postId);
    setSavedPosts(updated);
    localStorage.setItem('savedPosts', JSON.stringify(updated));
    
    // Trigger custom event to update header counts
    window.dispatchEvent(new Event('localStorageChange'));
  };

  const clearAllSaved = () => {
    setSavedPosts([]);
    localStorage.removeItem('savedPosts');
    window.dispatchEvent(new Event('localStorageChange'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your saved posts...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-navy hover:text-navy/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Bookmark className="w-8 h-8 text-navy" />
                  Saved Posts
                </h1>
                <p className="text-gray-600 mt-1">
                  {savedPosts.length} {savedPosts.length === 1 ? 'post' : 'posts'} saved for later
                </p>
              </div>
            </div>
            
            {savedPosts.length > 0 && (
              <button
                onClick={clearAllSaved}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Content */}
          {savedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Bookmark className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No saved posts yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save interesting posts to read later and find them here.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl hover:bg-navy/90 transition-colors font-medium"
              >
                Explore Posts
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {savedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="group"
                      >
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-navy transition-colors mb-2">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-sm">
                        Saved on {new Date(post.savedAt).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Link 
                        href={`/posts/${post.slug}`}
                        className="text-sm text-emerald hover:text-emerald/80 transition-colors font-medium"
                      >
                        Read Post
                      </Link>
                      <button
                        onClick={() => removeSavedPost(post.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 