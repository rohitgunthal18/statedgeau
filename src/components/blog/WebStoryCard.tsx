"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Play, 
  Eye, 
  Share2, 
  Clock, 
  Calendar,
  TrendingUp,
  User,
  BarChart3,
  Zap
} from "lucide-react";
import type { WebStoryCardProps } from "@/types";
import { 
  cn, 
  formatDate, 
  formatNumber, 
  getSportBadgeClass 
} from "@/lib/utils";

export function WebStoryCard({ story, variant = "default" }: WebStoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const storyUrl = `/stories/${story.slug}`;
  
  return (
    <article 
      className={cn(
        "group relative bg-gradient-to-b from-white to-gray-50 rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer border border-gray-100 shadow-lg",
        "hover:shadow-2xl hover:-translate-y-2 hover:from-white hover:to-white",
        variant === "featured" ? "h-[520px]" : "h-[480px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={storyUrl} className="block h-full">
        {/* Story Cover Image */}
        <div className="relative h-72 overflow-hidden">
          <Image
            src={story.coverImage}
            alt={story.coverImageAlt}
            width={400}
            height={288}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/30",
              isHovered ? "scale-110 bg-white/30" : "scale-100"
            )}>
              <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm border border-white/20 shadow-lg",
              getSportBadgeClass(story.category.sportType)
            )}>
              {story.category.name}
            </span>
          </div>

          {/* Story Duration */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              <span>{story.duration}s</span>
            </div>
          </div>

          {/* Web Story Label */}
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-1 bg-gradient-to-r from-coral to-golden text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              <Zap className="w-3 h-3" />
              <span>WEB STORY</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col h-48">
          {/* Engagement Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(story.engagement.viewCount)}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                {formatNumber(story.engagement.shareCount)}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-emerald/10 text-emerald px-2 py-1 rounded-full text-xs font-medium">
              <BarChart3 className="w-3 h-3" />
              <span>{story.engagement.completionRate}% completion</span>
            </div>
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-bold leading-tight group-hover:text-navy transition-colors mb-3 line-clamp-2",
            variant === "featured" ? "text-xl" : "text-lg"
          )}>
            {story.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">
            {story.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-navy to-emerald rounded-full flex items-center justify-center text-white text-xs font-bold">
                {story.author.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700">{story.author.name}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(story.publishedAt, "relative")}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">{story.slides.length} slides</div>
              <div className="flex items-center gap-1 text-emerald text-sm font-semibold">
                <span>Watch Story</span>
                <Play className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
} 