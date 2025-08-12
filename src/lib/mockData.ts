import type { BlogPost, Category, Author, Tag, NavigationItem, PopularSearch, WebStory } from "@/types";

// Sample Authors
export const AUTHORS: Author[] = [
  {
    id: "1",
    name: "Mike Thompson",
    bio: "AFL betting expert with 10+ years experience",
    expertise: ["AFL", "NRL", "Multi-Sport"],
  },
  {
    id: "2", 
    name: "Sarah Chen",
    bio: "Horse racing specialist and data analyst",
    expertise: ["Horse Racing", "Cricket"],
  },
  {
    id: "3",
    name: "David Wilson",
    bio: "Professional sports analyst and former NRL player",
    expertise: ["NRL", "Soccer", "Tennis"],
  },
];

// Sample Categories
export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "AFL Analysis",
    slug: "afl",
    description: "Expert AFL previews, predictions, and player performance insights.",
    sportType: "afl",
    color: "#ff6b35",
    icon: "🏈",
  },
  {
    id: "2",
    name: "NRL Analysis", 
    slug: "nrl",
    description: "Comprehensive NRL previews, predictions, and weekly insights.",
    sportType: "nrl",
    color: "#1976d2",
    icon: "🏈",
  },
  {
    id: "3",
    name: "Racing Insights",
    slug: "racing",
    description: "Saturday racing previews with speed maps, track pattern notes, and shortlists.",
    sportType: "racing",
    color: "#00c853",
    icon: "🏇",
  },
  {
    id: "4",
    name: "Cricket",
    slug: "cricket", 
    description: "BBL and international cricket previews with player performance analysis.",
    sportType: "cricket",
    color: "#388e3c",
    icon: "🏏",
  },
];

// Sample Tags
export const TAGS: Tag[] = [
  { id: "1", name: "AFL Tips", slug: "afl-tips" },
  { id: "2", name: "NRL Analysis", slug: "nrl-analysis" },
  { id: "3", name: "Horse Racing", slug: "horse-racing" },
  { id: "4", name: "Multi Bets", slug: "multi-bets" },
  { id: "5", name: "Live Betting", slug: "live-betting" },
  { id: "6", name: "Player Props", slug: "player-props" },
];

// Sample Blog Posts
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "AFL Round 23 Preview: Grand Final Spots Up for Grabs",
    slug: "afl-round-23-preview-grand-final-spots",
    excerpt: "The final round of the AFL regular season is here with crucial matches determining the last finals spots. Our experts break down the key matchups and betting opportunities.",
    content: "Full analysis content here...",
    featuredImage: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=600&fit=crop",
    featuredImageAlt: "AFL players in action during a match",
    author: AUTHORS[0],
    category: CATEGORIES[0],
    tags: [TAGS[0], TAGS[4]],
    publishedAt: "2024-08-15T10:00:00Z",
    updatedAt: "2024-08-15T10:00:00Z",
    status: "published",
    engagement: {
      viewCount: 15420,
      shareCount: 324,
      favoriteCount: 156,
      commentCount: 42,
      readingTime: 6,
      isTrending: true,
    },
    seo: {
      title: "AFL Round 23 Preview & Betting Tips | Australian Betting Insights",
      description: "Expert AFL Round 23 analysis and betting tips for the final regular season matches.",
      keywords: ["AFL", "Round 23", "betting tips", "grand final"],
    },
  },
  {
    id: "2",
    title: "NRL Finals Week 1: Upset Alert for Premiership Favourites",
    slug: "nrl-finals-week-1-upset-alert",
    excerpt: "The NRL finals are here and we're seeing some intriguing betting markets. Could there be major upsets in week 1? Our analysis suggests yes.",
    content: "Full analysis content here...",
    featuredImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    featuredImageAlt: "NRL rugby league action shot",
    author: AUTHORS[2],
    category: CATEGORIES[1],
    tags: [TAGS[1], TAGS[4]],
    publishedAt: "2024-08-14T14:30:00Z",
    updatedAt: "2024-08-14T14:30:00Z",
    status: "published",
    engagement: {
      viewCount: 12850,
      shareCount: 287,
      favoriteCount: 98,
      commentCount: 31,
      readingTime: 8,
      isTrending: true,
    },
    seo: {
      title: "NRL Finals Week 1 Betting Tips & Analysis",
      description: "Expert NRL finals betting analysis with upset predictions and value bets.",
      keywords: ["NRL", "finals", "betting tips", "upsets"],
    },
  },
  {
    id: "3",
    title: "Melbourne Cup 2024: Early Form Guide and Betting Analysis",
    slug: "melbourne-cup-2024-early-form-guide",
    excerpt: "It's never too early to start analyzing the Melbourne Cup field. We look at the early contenders and identify potential value in the betting markets.",
    content: "Full analysis content here...",
    featuredImage: "https://images.unsplash.com/photo-1574771324815-dc0c9df1c4bb?w=800&h=600&fit=crop",
    featuredImageAlt: "Horse racing action at Flemington",
    author: AUTHORS[1],
    category: CATEGORIES[2],
    tags: [TAGS[2], TAGS[3]],
    publishedAt: "2024-08-13T09:15:00Z",
    updatedAt: "2024-08-13T09:15:00Z",
    status: "published",
    engagement: {
      viewCount: 9340,
      shareCount: 156,
      favoriteCount: 203,
      commentCount: 18,
      readingTime: 10,
      isTrending: false,
    },
    seo: {
      title: "Melbourne Cup 2024 Form Guide & Betting Tips",
      description: "Early Melbourne Cup 2024 analysis with form guide and betting insights.",
      keywords: ["Melbourne Cup", "2024", "form guide", "horse racing"],
    },
  },
  {
    id: "4",
    title: "BBL 2024/25 Season Preview: Teams to Watch and Betting Value",
    slug: "bbl-2024-25-season-preview",
    excerpt: "The Big Bash League is back! We preview all eight teams and identify the best betting opportunities for the upcoming season.",
    content: "Full analysis content here...",
    featuredImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop",
    featuredImageAlt: "Cricket player hitting a six during BBL match",
    author: AUTHORS[1],
    category: CATEGORIES[3],
    tags: [TAGS[5], TAGS[3]],
    publishedAt: "2024-08-12T16:45:00Z",
    updatedAt: "2024-08-12T16:45:00Z",
    status: "published",
    engagement: {
      viewCount: 7680,
      shareCount: 89,
      favoriteCount: 67,
      commentCount: 12,
      readingTime: 7,
      isTrending: false,
    },
    seo: {
      title: "BBL 2024/25 Season Preview & Betting Tips",
      description: "Complete BBL season preview with team analysis and betting insights.",
      keywords: ["BBL", "Big Bash", "cricket", "season preview"],
    },
  },
  {
    id: "5",
    title: "Multi-Sport Weekend: AFL, NRL, and Racing Accumulator Tips",
    slug: "multi-sport-weekend-accumulator-tips",
    excerpt: "Make the most of a bumper weekend of Australian sport with our expertly crafted accumulator bets across AFL, NRL, and horse racing.",
    content: "Full analysis content here...",
    featuredImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop",
    featuredImageAlt: "Mixed collage of Australian sports",
    author: AUTHORS[0],
    category: CATEGORIES[0],
    tags: [TAGS[3], TAGS[0], TAGS[1]],
    publishedAt: "2024-08-11T11:20:00Z",
    updatedAt: "2024-08-11T11:20:00Z",
    status: "published",
    engagement: {
      viewCount: 11250,
      shareCount: 198,
      favoriteCount: 134,
      commentCount: 25,
      readingTime: 5,
      isTrending: true,
    },
    seo: {
      title: "Multi-Sport Weekend Accumulator Tips | AFL, NRL, Racing",
      description: "Expert multi-sport accumulator tips for AFL, NRL, and horse racing.",
      keywords: ["multi bet", "accumulator", "AFL", "NRL", "racing"],
    },
  },
];

// Sample Web Stories
export const WEB_STORIES: WebStory[] = [
  {
    id: "story-1",
    title: "AFL Grand Final Race: Who's In The Box Seat?",
    slug: "afl-grand-final-race-2024",
    description: "A visual journey through the top AFL teams fighting for grand final spots with live odds and expert predictions.",
    coverImage: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=700&fit=crop",
    coverImageAlt: "AFL players celebrating victory",
    duration: 45,
    category: CATEGORIES[0],
    author: AUTHORS[0],
    publishedAt: "2024-08-15T08:00:00Z",
    engagement: {
      viewCount: 8420,
      shareCount: 156,
      completionRate: 78,
    },
    slides: [
      {
        id: "slide-1",
        type: "image",
        content: "Current AFL Ladder Top 8",
        media: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=700&fit=crop",
        duration: 5,
        overlay: {
          title: "Grand Final Race",
          text: "8 teams fighting for 4 spots"
        }
      },
      {
        id: "slide-2", 
        type: "text",
        content: "Melbourne ($3.50) leads premiership odds",
        duration: 4,
        overlay: {
          title: "Favorites",
          text: "Melbourne remains bookies' choice"
        }
      },
      {
        id: "slide-3",
        type: "image",
        content: "Key matchups this weekend",
        media: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=700&fit=crop",
        duration: 6,
        overlay: {
          cta: {
            text: "Get AFL Tips",
            url: "/afl-betting"
          }
        }
      }
    ]
  },
  {
    id: "story-2", 
    title: "Melbourne Cup 2024: International Raiders",
    slug: "melbourne-cup-international-raiders-2024",
    description: "Meet the international horses set to challenge for Australia's greatest race with form analysis and betting insights.",
    coverImage: "https://images.unsplash.com/photo-1574771324815-dc0c9df1c4bb?w=400&h=700&fit=crop",
    coverImageAlt: "Racehorse in action at Melbourne Cup",
    duration: 50,
    category: CATEGORIES[2],
    author: AUTHORS[1],
    publishedAt: "2024-08-14T12:00:00Z",
    engagement: {
      viewCount: 6750,
      shareCount: 98,
      completionRate: 82,
    },
    slides: [
      {
        id: "slide-1",
        type: "image",
        content: "International horses arriving",
        media: "https://images.unsplash.com/photo-1574771324815-dc0c9df1c4bb?w=400&h=700&fit=crop",
        duration: 5,
        overlay: {
          title: "Cup Raiders",
          text: "12 international horses nominated"
        }
      },
      {
        id: "slide-2",
        type: "text", 
        content: "European form guide analysis",
        duration: 4,
        overlay: {
          title: "Form Analysis",
          text: "Strong European spring form"
        }
      },
      {
        id: "slide-3",
        type: "image",
        content: "Betting market movements",
        media: "https://images.unsplash.com/photo-1574771324815-dc0c9df1c4bb?w=400&h=700&fit=crop",
        duration: 6,
        overlay: {
          cta: {
            text: "Cup Tips",
            url: "/horse-racing"
          }
        }
      }
    ]
  },
  {
    id: "story-3",
    title: "NRL Finals: The Ultimate Playoff Guide",
    slug: "nrl-finals-ultimate-playoff-guide-2024", 
    description: "Everything you need to know about the NRL finals series with team analysis, key players, and betting strategies.",
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=700&fit=crop",
    coverImageAlt: "NRL finals action with players in tackle",
    duration: 55,
    category: CATEGORIES[1],
    author: AUTHORS[2],
    publishedAt: "2024-08-13T16:30:00Z",
    engagement: {
      viewCount: 9240,
      shareCount: 187,
      completionRate: 75,
    },
    slides: [
      {
        id: "slide-1",
        type: "image",
        content: "Finals week 1 matchups",
        media: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=700&fit=crop",
        duration: 5,
        overlay: {
          title: "Finals Time",
          text: "8 teams, 4 weeks, 1 winner"
        }
      },
      {
        id: "slide-2",
        type: "text",
        content: "Key players to watch",
        duration: 4,
        overlay: {
          title: "Star Players",
          text: "Who will step up in the big moments?"
        }
      },
      {
        id: "slide-3",
        type: "image",
        content: "Premiership odds update",
        media: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=700&fit=crop",
        duration: 6,
        overlay: {
          cta: {
            text: "NRL Tips",
            url: "/nrl-betting"
          }
        }
      }
    ]
  }
];

// Navigation Items
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "AFL Analysis",
    href: "/afl",
  },
  {
    label: "NRL Analysis",
    href: "/nrl",
  },
  {
    label: "Racing Insights",
    href: "/racing",
  },
  {
    label: "Cricket",
    href: "/cricket",
  },
];

// Popular Searches
export const POPULAR_SEARCHES: PopularSearch[] = [
  { query: "AFL round preview", count: 12340, trend: "up" },
  { query: "NRL try-scorer insights", count: 8421, trend: "stable" },
  { query: "Saturday racing speed maps", count: 6789, trend: "up" },
  { query: "BBL tonight preview", count: 5432, trend: "up" },
];

// Trending Posts (subset of blog posts)
export const TRENDING_POSTS = BLOG_POSTS.filter(post => post.engagement.isTrending);

// Helper functions
export function getFeaturedPosts() {
  return TRENDING_POSTS.slice(0, 6);
}

export function getRecentPosts(limit?: number): BlogPost[] {
  const sorted = [...BLOG_POSTS].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return BLOG_POSTS.filter(post => post.category.slug === categorySlug);
}

export function getTrendingPosts(): BlogPost[] {
  return TRENDING_POSTS;
}

// Web Stories helper functions
export function getFeaturedWebStories(): WebStory[] {
  return WEB_STORIES.slice(0, 3);
}

export function getWebStoriesByCategory(categorySlug: string): WebStory[] {
  return WEB_STORIES.filter(story => story.category.slug === categorySlug);
} 