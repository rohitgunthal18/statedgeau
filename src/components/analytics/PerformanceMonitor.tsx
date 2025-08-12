'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PerformanceMonitorProps {
  pageType?: string;
  postId?: string;
}

export default function PerformanceMonitor({ pageType = 'page', postId }: PerformanceMonitorProps) {
  const pathname = usePathname();
  const startTime = useRef<number>(Date.now());
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Track page load performance
    const trackPagePerformance = async () => {
      try {
        // Wait for page to fully load
        if (document.readyState === 'complete') {
          await trackPerformance();
        } else {
          window.addEventListener('load', trackPerformance);
        }
      } catch (error) {
        console.error('Error tracking performance:', error);
      }
    };

    const trackPerformance = async () => {
      const loadTime = Date.now() - startTime.current;
      
      // Get Core Web Vitals
      const fcp = getFirstContentfulPaint();
      const lcp = await getLargestContentfulPaint();
      const cls = getCumulativeLayoutShift();
      const fid = await getFirstInputDelay();

      // Send performance data to analytics
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'page_performance',
          pageUrl: pathname,
          pageType,
          performance: {
            loadTime,
            firstContentfulPaint: fcp,
            largestContentfulPaint: lcp,
            cumulativeLayoutShift: cls,
            firstInputDelay: fid,
          },
        }),
      });
    };

    // Track scroll depth for posts
    if (postId) {
      trackScrollDepth(postId);
    }

    // Track time on page
    const timeOnPageInterval = setInterval(async () => {
      if (postId) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        if (timeSpent % 30 === 0) { // Track every 30 seconds
          await fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'time_on_page',
              postId,
              metadata: { timeSpent },
            }),
          });
        }
      }
    }, 1000);

    trackPagePerformance();

    return () => {
      clearInterval(timeOnPageInterval);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname, pageType, postId]);

  const getFirstContentfulPaint = (): number | undefined => {
    const fcpEntries = performance.getEntriesByType('paint');
    const fcpEntry = fcpEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry ? Math.round(fcpEntry.startTime) : undefined;
  };

  const getLargestContentfulPaint = (): Promise<number | undefined> => {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry ? Math.round(lastEntry.startTime) : undefined);
        });

        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        observerRef.current = observer;

        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(undefined);
        }, 5000);
      } else {
        resolve(undefined);
      }
    });
  };

  const getCumulativeLayoutShift = (): number => {
    let cls = 0;
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value;
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Calculate CLS after a delay
      setTimeout(() => {
        observer.disconnect();
      }, 5000);
    }
    return Math.round(cls * 1000) / 1000; // Round to 3 decimal places
  };

  const getFirstInputDelay = (): Promise<number | undefined> => {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const firstInputEntry = entry as any;
            resolve(Math.round(firstInputEntry.processingStart - firstInputEntry.startTime));
            observer.disconnect();
            return;
          }
        });

        observer.observe({ entryTypes: ['first-input'] });
        
        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(undefined);
        }, 5000);
      } else {
        resolve(undefined);
      }
    });
  };

  const trackScrollDepth = (postId: string) => {
    let maxScrollDepth = 0;
    let scrollTrackingInterval: NodeJS.Timeout;

    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        
        // Track scroll depth at key milestones
        if ([25, 50, 75, 90, 100].includes(scrollPercentage)) {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'scroll_depth',
              postId,
              metadata: { scrollPercentage },
            }),
          }).catch(console.error);
        }
      }
    };

    // Track scroll on scroll events
    window.addEventListener('scroll', trackScroll, { passive: true });

    // Also track scroll periodically
    scrollTrackingInterval = setInterval(trackScroll, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScroll);
      clearInterval(scrollTrackingInterval);
    };
  };

  // Track page view
  useEffect(() => {
    const trackPageView = async () => {
      if (postId) {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'view',
            postId,
            metadata: { pageUrl: pathname },
          }),
        });
      }

      // Update user session
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'session_update',
          pageUrl: pathname,
        }),
      });
    };

    trackPageView();
  }, [pathname, postId]);

  return null; // This component doesn't render anything
} 