"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Share2, 
  Heart, 
  Eye, 
  Clock, 
  Calendar,
  User,
  TrendingUp,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Copy,
  Check,
  Bookmark,
  ExternalLink,
  Zap,
  Trophy,
  Target,
  ThumbsUp,
  Star,
  ArrowRight
} from "lucide-react";
import type { PostCardProps } from "@/types";
import { 
  cn, 
  formatDate, 
  formatNumber, 
  getSportBadgeClass, 
  getPostUrl,
  generateShareData,
  getShareUrl,
  storage 
} from "@/lib/utils";
import { SocialShare } from "@/components/ui/SocialShare";

export function PostCard({ 
  post, 
  variant = "default", 
  showEngagement = true, 
  showAuthor = true 
}: PostCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [localViewCount, setLocalViewCount] = useState(post.engagement.viewCount);
  const [isHovered, setIsHovered] = useState(false);

  // Check if post is favorited on component mount
  useEffect(() => {
    setIsFavorited(storage.isFavorite(post.id));
  }, [post.id]);

  // Handle favorite toggle
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorited) {
      storage.removeFavorite(post.id);
      setIsFavorited(false);
    } else {
      storage.addFavorite(post.id);
      setIsFavorited(true);
      
      // Track favorite action in database
      try {
        await fetch('/api/track-engagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: post.id, action: 'favorite' })
        });
      } catch (error) {
        console.error('Failed to track favorite:', error);
      }
    }
  };

  // Handle share
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportspulse-au.vercel.app';
  const fullUrl = `${baseUrl}${getPostUrl(post.category.slug, post.slug)}`;

  // Handle social share
  const handleSocialShare = async (platform: string) => {
    const shareData = generateShareData(post, baseUrl);
    const shareUrl = getShareUrl(platform, shareData);
    
    window.open(shareUrl, "_blank", "width=550,height=420");
    setShowShareMenu(false);
    
    // Track share action in database
    try {
      await fetch('/api/track-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, action: 'share' })
      });
      console.log(`Shared ${post.title} on ${platform}`);
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  // Handle copy link
  const handleCopyLink = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://australiansportsinsights.com';
    const url = `${baseUrl}${getPostUrl(post.category.slug, post.slug)}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setShowShareMenu(false);
      
      // Track copy link as a share action
      try {
        await fetch('/api/track-engagement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: post.id, action: 'share' })
        });
      } catch (error) {
        console.error('Failed to track link copy:', error);
      }
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Handle post click (track view)
  const handlePostClick = () => {
    // Add to view history
    storage.addToViewHistory(post.id);
    
    // Increment local view count for immediate feedback
    setLocalViewCount(prev => prev + 1);
    
    // In real app, this would call an API to track the view
    console.log(`Viewed post: ${post.title}`);
  };

  const postUrl = getPostUrl(post.category.slug, post.slug);
  
  // Enhanced card classes based on variant
  const cardClasses = cn(
    "group relative bg-white rounded-xl overflow-hidden transition-all duration-300 cursor-pointer border border-gray-100",
    {
      "hover:shadow-xl hover:-translate-y-0.5 h-[360px] flex flex-col": variant === "default",
      "flex flex-row h-28 md:h-32 hover:shadow-lg": variant === "compact",
      "hover:shadow-xl hover:-translate-y-1 h-[400px] flex flex-col": variant === "featured"
    }
  );

  const imageClasses = cn(
    "transition-all duration-500 group-hover:scale-[1.03]",
    {
      "w-full h-36 object-cover flex-shrink-0": variant === "default",
      "w-24 md:w-32 h-full object-cover": variant === "compact",
      "w-full h-44 object-cover flex-shrink-0": variant === "featured"
    }
  );

  return (
    <article 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={postUrl} onClick={handlePostClick} className="block h-full">
        {/* Enhanced Image Container */}
        <div className="relative overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt}
            width={variant === "compact" ? 128 : 500}
            height={variant === "compact" ? 128 : variant === "featured" ? 300 : 240}
            className={imageClasses}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Enhanced Overlay Effects */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Premium Badge for Trending */}
          {post.engagement.isTrending && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 bg-gradient-to-r from-coral to-coral/80 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg">
                <Zap className="w-2.5 h-2.5" />
                <span>TRENDING</span>
              </div>
            </div>
          )}

          {/* Enhanced Category Badge */}
          <div className="absolute top-3 right-3">
            <span className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold shadow-lg backdrop-blur-sm border border-white/20",
              getSportBadgeClass(post.category.sportType)
            )}>
              {post.category.name}
            </span>
          </div>

          {/* Quick Action Buttons - Always visible on mobile, hover on desktop */}
          <div className="absolute bottom-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleFavorite}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-lg",
                  isFavorited 
                    ? "bg-coral text-white scale-110" 
                    : "bg-white/20 text-white hover:bg-white/30 hover:scale-110"
                )}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={cn("w-3.5 h-3.5", isFavorited && "fill-current")} />
              </button>
              
              <div className="relative">
                <SocialShare
                  url={fullUrl}
                  title={post.title}
                  description={post.excerpt}
                  postId={post.id}
                  variant="compact"
                  className="inline-block"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Reading Time Badge */}
          {variant !== "compact" && (
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-[10px] font-medium border border-white/20">
                <Clock className="w-2.5 h-2.5" />
                <span>{post.engagement.readingTime} min read</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Content Section */}
        <div className={cn(
          "p-2.5 flex-1 flex flex-col justify-between min-h-0",
          variant === "compact" && "py-2 px-2.5"
        )}>
          {/* Top Content Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Performance indicator for betting content */}
            {variant === "featured" && (
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 bg-emerald/10 text-emerald px-1.5 py-0.5 rounded-full text-[9px] font-medium">
                    <TrendingUp className="w-2.5 h-2.5" />
                    <span>Data-backed</span>
                  </div>
                  <div className="flex items-center gap-1 bg-golden/10 text-golden px-1.5 py-0.5 rounded-full text-[9px] font-medium">
                    <Trophy className="w-2.5 h-2.5" />
                    <span>Expert View</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Star className="w-2.5 h-2.5 text-golden fill-current" />
                  <span className="text-[10px] font-medium">4.8</span>
                </div>
              </div>
            )}

            {/* Title - Fixed to exactly 2 lines with proper height */}
            <h3 className={cn(
              "font-bold leading-tight group-hover:text-navy transition-colors mb-1 blog-title-clamp",
              {
                "text-sm md:text-base h-12": variant === "default",
                "text-sm md:text-base h-10": variant === "compact",
                "text-base md:text-lg h-14": variant === "featured"
              }
            )}>
              {post.title}
            </h3>

            {/* Excerpt - Fixed to exactly 1 line, hidden on compact */}
            {variant !== "compact" && (
              <p className={cn(
                "text-gray-600 leading-relaxed mb-1.5 blog-excerpt-clamp",
                {
                  "text-xs h-4": variant === "default",
                  "text-sm h-5": variant === "featured"
                }
              )}>
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-1.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                {formatDate(post.publishedAt, "relative")}
              </span>
              {variant === "compact" && showEngagement && (
                <span className="flex items-center gap-1">
                  <Eye className="w-2.5 h-2.5" />
                  {formatNumber(localViewCount)}
                </span>
              )}
            </div>
          </div>

          {/* Bottom Content Section - Always visible */}
          <div className="flex-shrink-0 space-y-1.5">
            {/* Engagement Metrics */}
            {showEngagement && variant !== "compact" && (
              <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatNumber(localViewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" />
                    {formatNumber(post.engagement.favoriteCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" />
                    {formatNumber(post.engagement.shareCount)}
                  </span>
                </div>
                <ArrowRight className={cn(
                  "w-3.5 h-3.5 text-emerald transition-transform duration-300",
                  isHovered && "translate-x-1"
                )} />
              </div>
            )}

            {/* Author Section - Always visible at bottom */}
            {showAuthor && variant !== "compact" && (
              <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-navy to-emerald rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {post.author.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-gray-700">{post.author.name}</div>
                    <div className="text-[9px] text-gray-500">Sports Analyst</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-500">
                  <Target className="w-2.5 h-2.5" />
                  <span>Verified</span>
                </div>
              </div>
            )}

            {/* Featured CTA */}
            {variant === "featured" && (
              <div className="pt-1">
                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-navy/5 to-emerald/5 rounded-lg border border-navy/10">
                  <div className="flex items-center gap-2 text-xs font-medium text-navy">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Premium Analysis</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald text-[11px] font-semibold">
                    <span>Read Full</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
} 