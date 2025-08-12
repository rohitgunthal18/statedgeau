'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, ExternalLink } from 'lucide-react';
import analytics from '@/lib/analytics';

interface SocialShareProps {
  postId: string;
  title: string;
  url: string;
  description?: string;
  image?: string;
  className?: string;
}

export default function SocialShare({ 
  postId, 
  title, 
  url, 
  description, 
  image, 
  className = '' 
}: SocialShareProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aussiesportsinsights.com';
  const fullUrl = `${baseUrl}${url}`;
  const shareText = `${title} - StatEdge AU`;

  const sharePlatforms = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}&quote=${encodeURIComponent(shareText)}`,
      platform: 'facebook' as const,
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
      platform: 'twitter' as const,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`,
      platform: 'linkedin' as const,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`,
      platform: 'whatsapp' as const,
    },
    {
      name: 'Telegram',
      icon: ExternalLink,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`,
      platform: 'telegram' as const,
    },
  ];

  const handleShare = async (platform: string, shareUrl: string) => {
    try {
      // Track share event
      await analytics.trackPostShare(postId, title, platform, 'sports');

      // Update share count
      setShareCount(prev => prev + 1);

      // Open share dialog
      window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');

      // Close share menu
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || shareText,
          url: fullUrl,
        });

        // Track native share
        await analytics.trackPostShare(postId, title, 'native', 'sports');

        setShareCount(prev => prev + 1);
      } catch (error) {
        console.error('Error with native share:', error);
      }
    } else {
      // Fallback to custom share menu
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Share2 size={18} />
        <span className="font-medium">Share</span>
        {shareCount > 0 && (
          <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-sm">
            {shareCount}
          </span>
        )}
      </button>

      {/* Custom Share Menu */}
      {showShareMenu && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50 min-w-[200px]">
          <div className="grid grid-cols-2 gap-2">
            {sharePlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform.platform, platform.url)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white transition-all duration-200 ${platform.color}`}
              >
                <platform.icon size={16} />
                <span className="text-sm font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
          
          {/* Copy Link */}
          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(fullUrl);
                  
                  // Track copy link
                  await analytics.trackPostShare(postId, title, 'copy', 'sports');

                  setShareCount(prev => prev + 1);
                  setShowShareMenu(false);
                } catch (error) {
                  console.error('Error copying link:', error);
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ExternalLink size={16} />
              <span className="text-sm font-medium">Copy Link</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
} 