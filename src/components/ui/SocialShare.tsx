'use client';

import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import analytics from '@/lib/analytics';

interface SocialShareProps {
  postId: string;
  title: string;
  url: string;
  excerpt?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ postId, title, url, excerpt }) => {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const shareData = {
    title: title,
    text: excerpt || `Check out this article: ${title}`,
    url: url,
  };

  const handleShare = async (platform: string) => {
    try {
      let shareUrl = '';
      
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share(shareData);
          }
          break;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      // Track share event
      await analytics.trackPostShare(postId, title, platform, 'sports');
      
      // Update share count
      setShareCount(prev => prev + 1);
      
      // Update database
      await supabase
        .from('posts')
        .update({ share_count: shareCount + 1 })
        .eq('id', postId);

    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Track copy event
      await analytics.trackPostShare(postId, title, 'copy', 'sports');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2">
        <Share2 className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleShare('twitter')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Twitter className="w-4 h-4" />
          <span>Twitter</span>
        </button>
        
        <button
          onClick={() => handleShare('facebook')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Facebook className="w-4 h-4" />
          <span>Facebook</span>
        </button>
        
        <button
          onClick={() => handleShare('linkedin')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          <span>LinkedIn</span>
        </button>
        
        {typeof window !== 'undefined' && 'navigator' in window && 'share' in navigator && (
          <button
            onClick={() => handleShare('native')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        )}
        
        <button
          onClick={handleCopy}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
      
      {shareCount > 0 && (
        <div className="text-sm text-gray-500">
          {shareCount} {shareCount === 1 ? 'person' : 'people'} shared this article
        </div>
      )}
    </div>
  );
};

export default SocialShare; 
