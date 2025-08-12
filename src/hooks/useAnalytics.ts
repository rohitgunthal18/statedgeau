import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  trackPageView,
  trackPostView,
  trackPostShare,
  trackPostFavorite,
  trackSearch,
  trackCategoryView,
  trackSocialClick,
  EngagementTracker,
  hasAnalyticsConsent,
  trackError
} from '@/lib/analytics';

// Hook for page tracking
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (hasAnalyticsConsent()) {
      trackPageView(pathname);
    }
  }, [pathname]);
}

// Hook for post engagement tracking
export function usePostTracking(postId: string, title: string, category: string, sportType: string) {
  const trackerRef = useRef<EngagementTracker | null>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    // Track post view (only once per session)
    if (!hasTrackedView.current) {
      trackPostView(postId, title, category, sportType);
      hasTrackedView.current = true;
    }

    // Initialize engagement tracker
    trackerRef.current = new EngagementTracker(postId, sportType);

    return () => {
      if (trackerRef.current) {
        trackerRef.current.destroy();
      }
    };
  }, [postId, title, category, sportType]);

  const trackShare = useCallback((platform: string) => {
    if (hasAnalyticsConsent()) {
      trackPostShare(postId, title, platform, sportType);
    }
  }, [postId, title, sportType]);

  const trackFavorite = useCallback(() => {
    if (hasAnalyticsConsent()) {
      trackPostFavorite(postId, title, sportType);
    }
  }, [postId, title, sportType]);

  return {
    trackShare,
    trackFavorite,
  };
}

// Hook for category page tracking
export function useCategoryTracking(category: string, sportType: string) {
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    if (!hasTrackedView.current) {
      trackCategoryView(category, sportType);
      hasTrackedView.current = true;
    }
  }, [category, sportType]);
}

// Hook for search tracking
export function useSearchTracking() {
  const trackSearchQuery = useCallback((searchTerm: string, resultsCount: number, category?: string) => {
    if (hasAnalyticsConsent()) {
      trackSearch(searchTerm, resultsCount, category);
    }
  }, []);

  return {
    trackSearch: trackSearchQuery,
  };
}

// Hook for social media tracking
export function useSocialTracking() {
  const trackSocial = useCallback((platform: string, source: string) => {
    if (hasAnalyticsConsent()) {
      trackSocialClick(platform, source);
    }
  }, []);

  return {
    trackSocial,
  };
}

// Hook for error tracking
export function useErrorTracking() {
  const trackErrorEvent = useCallback((error: Error, errorInfo?: any) => {
    if (hasAnalyticsConsent()) {
      trackError(error, errorInfo);
    }
  }, []);

  return {
    trackError: trackErrorEvent,
  };
}

// Hook for performance tracking
export function usePerformanceTracking() {
  useEffect(() => {
    if (!hasAnalyticsConsent()) return;

    // Track basic performance metrics
    const trackBasicPerformance = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation && typeof window !== 'undefined' && window.gtag) {
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          const firstContentfulPaint = navigation.responseEnd - navigation.fetchStart;
          
          window.gtag('event', 'page_timing', {
            name: 'page_load_time',
            value: Math.round(pageLoadTime),
            custom_parameter_1: Math.round(domContentLoaded),
            custom_parameter_2: Math.round(firstContentfulPaint),
          });
        }
      } catch (error) {
        console.warn('Performance tracking error:', error);
      }
    };

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackBasicPerformance();
    } else {
      window.addEventListener('load', trackBasicPerformance, { once: true });
    }

    // Optional: Try to load web-vitals dynamically if available
    const trackWebVitals = async () => {
      try {
        const webVitals = await import('web-vitals');
        
        // Use any available web vitals functions
        if ('onCLS' in webVitals) {
          webVitals.onCLS((metric: any) => {
            if (hasAnalyticsConsent() && typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'web_vital', {
                name: 'CLS',
                value: Math.round(metric.value * 1000),
                event_label: metric.id,
              });
            }
          });
        }

        if ('onLCP' in webVitals) {
          webVitals.onLCP((metric: any) => {
            if (hasAnalyticsConsent() && typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'web_vital', {
                name: 'LCP',
                value: Math.round(metric.value),
                event_label: metric.id,
              });
            }
          });
        }
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    // Delay to ensure page is fully loaded
    const timer = setTimeout(trackWebVitals, 2000);
    return () => clearTimeout(timer);
  }, []);
}

// Combined hook for common analytics needs
export function useAnalytics() {
  usePageTracking();
  usePerformanceTracking();
  
  const errorTracking = useErrorTracking();
  const socialTracking = useSocialTracking();
  const searchTracking = useSearchTracking();

  return {
    ...errorTracking,
    ...socialTracking,
    ...searchTracking,
  };
} 