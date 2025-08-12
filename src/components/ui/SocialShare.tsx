'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon, Check, Copy } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { trackPostShare } from '@/lib/analytics';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  postId?: string;
  image?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'floating';
}

export function SocialShare({ 
  url, 
  title, 
  description, 
  postId, 
  image, 
  className = '',
  variant = 'default' 
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  // Track share event
  const trackShare = async (platform: string) => {
    try {
      if (postId) {
        // Track in Supabase
        await supabase.from('post_engagement').insert({
          post_id: postId,
          action_type: 'share',
          timestamp: new Date().toISOString(),
          referrer: platform,
          session_id: 'anonymous'
        });

        // Update post share count
        const { data: post } = await supabase
          .from('posts')
          .select('share_count')
          .eq('id', postId)
          .single();

        if (post) {
          await supabase
            .from('posts')
            .update({ share_count: (post.share_count || 0) + 1 })
            .eq('id', postId);
          
          setShareCount(prev => prev + 1);
        }

        // Track in Google Analytics
        trackPostShare(postId, title, platform, 'sports');
      }
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  // Share handlers
  const shareToFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('facebook');
  };

  const shareToTwitter = () => {
    const text = `${title}\n\n${description}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('twitter');
  };

  const shareToLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare('linkedin');
  };

  const shareToWhatsApp = () => {
    const text = `${title}\n\n${description}\n\n${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    trackShare('whatsapp');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackShare('copy_link');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Native share API for mobile
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        trackShare('native_share');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  // Check if native sharing is available
  const canShare = typeof navigator !== 'undefined' && navigator.share;

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-navy transition-colors rounded-lg hover:bg-gray-100"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50 min-w-[200px]">
              <div className="space-y-1">
                {canShare && (
                  <button
                    onClick={() => { nativeShare(); setIsOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                )}
                <button
                  onClick={() => { shareToFacebook(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </button>
                <button
                  onClick={() => { shareToTwitter(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-400 rounded-md transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={() => { shareToLinkedIn(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </button>
                <button
                  onClick={() => { shareToWhatsApp(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={() => { copyToClipboard(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
          <div className="flex flex-col gap-2">
            {canShare && (
              <button
                onClick={nativeShare}
                className="p-2 text-gray-600 hover:text-navy hover:bg-gray-100 rounded-full transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={shareToFacebook}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={shareToTwitter}
              className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
              title="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              onClick={shareToLinkedIn}
              className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </button>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              title="Copy Link"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <div className="flex items-center gap-2">
        {canShare && (
          <button
            onClick={nativeShare}
            className="p-2 text-gray-600 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={shareToFacebook}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Share on Facebook"
        >
          <Facebook className="w-5 h-5" />
        </button>
        <button
          onClick={shareToTwitter}
          className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </button>
        <button
          onClick={shareToLinkedIn}
          className="p-2 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </button>
        <button
          onClick={shareToWhatsApp}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <button
          onClick={copyToClipboard}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          title="Copy Link"
        >
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>
      {shareCount > 0 && (
        <span className="text-xs text-gray-500 ml-2">
          {shareCount} share{shareCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
} 