// Google Analytics 4 Integration with Consent Management
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  // Set default consent state (denied until user consents)
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted', // Always granted for security
  });

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    send_page_view: true,
    cookie_flags: 'SameSite=Lax;Secure',
  });
};

// Update consent based on user preferences
export const updateConsent = (preferences: {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    functionality_storage: preferences.functional ? 'granted' : 'denied',
  });
};

// Check if user has consented to analytics
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const consent = localStorage.getItem('cookie-preferences');
  if (!consent) return false;
  
  try {
    const preferences = JSON.parse(consent);
    return preferences.analytics === true;
  } catch {
    return false;
  }
};

// Page view tracking
export const trackPageView = (url: string, title?: string) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

// Custom event tracking for sports content
export interface SportEventParams {
  sport_type?: string;
  category?: string;
  post_id?: string;
  post_title?: string;
  author?: string;
  engagement_type?: 'view' | 'share' | 'favorite' | 'comment' | 'time_on_page';
  value?: number;
  currency?: string;
  method?: string;
  content_type?: string;
  search_term?: string;
  source?: string;
  ad_id?: string;
  placement?: string;
  custom_parameter_1?: string | number;
}

export const trackEvent = (eventName: string, parameters: SportEventParams = {}) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    ...parameters,
    timestamp: Date.now(),
  });
};

// Specific tracking functions for sports content
export const trackPostView = (postId: string, title: string, category: string, sportType: string) => {
  trackEvent('post_view', {
    sport_type: sportType,
    category: category,
          post_id: postId,
    post_title: title,
    engagement_type: 'view',
  });
};

export const trackPostShare = (postId: string, title: string, platform: string, sportType: string) => {
  trackEvent('share', {
    method: platform,
    content_type: 'post',
    sport_type: sportType,
    post_id: postId,
    post_title: title,
    engagement_type: 'share',
  });
};

export const trackPostFavorite = (postId: string, title: string, sportType: string) => {
  trackEvent('add_to_favorites', {
    sport_type: sportType,
    post_id: postId,
    post_title: title,
    engagement_type: 'favorite',
  });
};

export const trackSearch = (searchTerm: string, resultsCount: number, category?: string) => {
  trackEvent('search', {
    search_term: searchTerm,
    category: category,
    value: resultsCount,
  });
};

export const trackTimeOnPage = (postId: string, timeSpent: number, sportType: string) => {
  trackEvent('page_engagement', {
    sport_type: sportType,
          post_id: postId,
    engagement_type: 'time_on_page',
    value: Math.round(timeSpent / 1000), // Convert to seconds
  });
};

export const trackScrollDepth = (postId: string, depth: number, sportType: string) => {
  trackEvent('scroll', {
    sport_type: sportType,
          post_id: postId,
    value: depth,
  });
};

export const trackCategoryView = (category: string, sportType: string) => {
  trackEvent('category_view', {
    sport_type: sportType,
    category: category,
  });
};

export const trackNewsletterSignup = (source: string) => {
  trackEvent('sign_up', {
    method: 'newsletter',
    source: source,
  });
};

export const trackSocialClick = (platform: string, source: string) => {
  trackEvent('social_click', {
    method: platform,
    source: source,
  });
};

// Enhanced ecommerce tracking for potential future monetization
export const trackAdClick = (adId: string, placement: string, sportType?: string) => {
  trackEvent('ad_click', {
    sport_type: sportType,
    value: 1,
    currency: 'AUD',
    ad_id: adId,
    placement: placement,
  });
};

// Performance tracking
export const trackPerformance = () => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined') return;

  // Track Core Web Vitals
  if ('web-vital' in window) {
    // This would typically use the web-vitals library
    // For now, we'll track basic performance metrics
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      
      trackEvent('page_timing', {
        value: Math.round(pageLoadTime),
        custom_parameter_1: Math.round(domContentLoaded),
      });
    }
  }
};

// User engagement tracking
export class EngagementTracker {
  private startTime: number;
  private lastScrollDepth: number = 0;
  private postId: string;
  private sportType: string;
  private scrollThresholds: number[] = [25, 50, 75, 90];
  private trackedThresholds: Set<number> = new Set();

  constructor(postId: string, sportType: string) {
    this.postId = postId;
    this.sportType = sportType;
    this.startTime = Date.now();
    this.initScrollTracking();
    this.initTimeTracking();
  }

  private initScrollTracking() {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);

      this.lastScrollDepth = Math.max(this.lastScrollDepth, scrollDepth);

      // Track scroll milestones
      this.scrollThresholds.forEach(threshold => {
        if (scrollDepth >= threshold && !this.trackedThresholds.has(threshold)) {
          this.trackedThresholds.add(threshold);
          trackScrollDepth(this.postId, threshold, this.sportType);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private initTimeTracking() {
    if (typeof window === 'undefined') return;

    // Track time on page when user leaves
    const trackTimeSpent = () => {
      const timeSpent = Date.now() - this.startTime;
      if (timeSpent > 5000) { // Only track if user spent more than 5 seconds
        trackTimeOnPage(this.postId, timeSpent, this.sportType);
      }
    };

    window.addEventListener('beforeunload', trackTimeSpent);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackTimeSpent();
      }
    });

    // Track engaged time milestones
    const engagementMilestones = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
    engagementMilestones.forEach(seconds => {
      setTimeout(() => {
        if (document.visibilityState === 'visible') {
          trackEvent('engagement_milestone', {
            sport_type: this.sportType,
            post_id: this.postId,
            value: seconds,
          });
        }
      }, seconds * 1000);
    });
  }

  public destroy() {
    // Clean up event listeners if needed
    const timeSpent = Date.now() - this.startTime;
    if (timeSpent > 5000) {
      trackTimeOnPage(this.postId, timeSpent, this.sportType);
    }
  }
}

// Error tracking
export const trackError = (error: Error, errorInfo?: any) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'exception', {
    description: error.message,
    fatal: false,
    error_stack: error.stack,
    custom_parameter_1: errorInfo ? JSON.stringify(errorInfo) : undefined,
  });
};

// Conversion tracking for future monetization
export const trackConversion = (conversionType: string, value?: number) => {
  if (!hasAnalyticsConsent() || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'conversion', {
    send_to: GA_MEASUREMENT_ID,
    value: value || 1,
    currency: 'AUD',
    conversion_type: conversionType,
  });
};

export default {
  initGA,
  updateConsent,
  hasAnalyticsConsent,
  trackPageView,
  trackEvent,
  trackPostView,
  trackPostShare,
  trackPostFavorite,
  trackSearch,
  trackTimeOnPage,
  trackScrollDepth,
  trackCategoryView,
  trackNewsletterSignup,
  trackSocialClick,
  trackAdClick,
  trackPerformance,
  EngagementTracker,
  trackError,
  trackConversion,
}; 