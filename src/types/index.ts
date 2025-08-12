// Core types for the betting blog application

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  expertise: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  sportType: string;
  color?: string;
  icon?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  count?: number;
}

export interface PostEngagement {
  viewCount: number;
  shareCount: number;
  favoriteCount: number;
  commentCount: number;
  readingTime: number;
  isTrending: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
  engagement: PostEngagement;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface PostCardProps {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
  showEngagement?: boolean;
  showAuthor?: boolean;
  className?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavigationItem[];
}

export interface PopularSearch {
  query: string;
  count: number;
  trend: "up" | "down" | "stable";
}

export interface SocialShareData {
  url: string;
  title: string;
  description: string;
  image?: string;
  hashtags?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  type: "post" | "category" | "tag";
  url: string;
  excerpt?: string;
  image?: string;
}

export interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  userId?: string;
}

// Web Stories Types
export interface WebStory {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
  duration: number; // in seconds
  category: Category;
  author: Author;
  publishedAt: string;
  engagement: {
    viewCount: number;
    shareCount: number;
    completionRate: number; // percentage of users who completed the story
  };
  slides: WebStorySlide[];
}

export interface WebStorySlide {
  id: string;
  type: "image" | "video" | "text";
  content: string;
  media?: string;
  duration: number; // display duration in seconds
  overlay?: {
    title?: string;
    text?: string;
    cta?: {
      text: string;
      url: string;
    };
  };
}

export interface WebStoryCardProps {
  story: WebStory;
  variant?: "default" | "featured";
} 