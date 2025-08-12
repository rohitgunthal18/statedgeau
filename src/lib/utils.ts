import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: string | Date, format: "short" | "long" | "relative" = "short"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (format === "relative") {
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    return `${Math.floor(diffInDays / 30)}mo ago`;
  }
  
  if (format === "long") {
    return dateObj.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  return dateObj.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Number formatting utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

// Sport configuration utilities
export function getSportConfig(sportType: string) {
  const configs = {
    afl: { icon: "🏈", color: "orange", name: "AFL" },
    nrl: { icon: "🏈", color: "blue", name: "NRL" },
    racing: { icon: "🏇", color: "green", name: "Racing" },
    cricket: { icon: "🏏", color: "green", name: "Cricket" },
    soccer: { icon: "⚽", color: "purple", name: "Soccer" },
    tennis: { icon: "🎾", color: "orange", name: "Tennis" },
    basketball: { icon: "🏀", color: "red", name: "Basketball" },
    multi: { icon: "🎯", color: "yellow", name: "Multi-Sport" },
  };
  
  return configs[sportType as keyof typeof configs] || configs.multi;
}

// Sport badge class utilities
export function getSportBadgeClass(sportType: string): string {
  const classes = {
    afl: "sport-badge-afl",
    nrl: "sport-badge-nrl", 
    racing: "sport-badge-racing",
    cricket: "sport-badge-cricket",
    soccer: "sport-badge-soccer",
    tennis: "sport-badge-tennis",
    basketball: "sport-badge-basketball",
    multi: "sport-badge-multi",
  };
  
  return classes[sportType as keyof typeof classes] || classes.multi;
}

// URL utilities
export function getPostUrl(categorySlug: string, postSlug: string): string {
  // Route to the posts dynamic page
  return `/posts/${postSlug}`;
}

// Share utilities
export function generateShareData(post: any, baseUrl: string) {
  const url = `${baseUrl}${getPostUrl(post.category.slug, post.slug)}`;
  const title = post.title;
  const text = post.excerpt;
  
  return { url, title, text };
}

export function getShareUrl(platform: string, shareData: { url: string; title: string; text: string }): string {
  const { url, title, text } = shareData;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text);
  
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };
  
  return urls[platform as keyof typeof urls] || urls.facebook;
}

// Local storage utilities
export const storage = {
  // Favorites
  addFavorite: (postId: string) => {
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (!favorites.includes(postId)) {
        favorites.push(postId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    }
  },
  
  removeFavorite: (postId: string) => {
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updated = favorites.filter((id: string) => id !== postId);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  },
  
  isFavorite: (postId: string): boolean => {
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      return favorites.includes(postId);
    }
    return false;
  },
  
  // View history
  addToViewHistory: (postId: string) => {
    if (typeof window !== "undefined") {
      const history = JSON.parse(localStorage.getItem("viewHistory") || "[]");
      const updated = [postId, ...history.filter((id: string) => id !== postId)].slice(0, 50);
      localStorage.setItem("viewHistory", JSON.stringify(updated));
    }
  },
  
  getViewHistory: (): string[] => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("viewHistory") || "[]");
    }
    return [];
  },
}; 