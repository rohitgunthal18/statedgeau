import { NextRequest, NextResponse } from 'next/server';
import analytics from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      postId, 
      metadata, 
      pageUrl, 
      pageType, 
      performance 
    } = body;

    switch (type) {
      case 'view':
        if (postId) {
          await analytics.trackPostView(postId, metadata?.title || '', metadata?.category || '', metadata?.sportType || '');
        }
        break;

      case 'share':
        if (postId && metadata?.platform) {
          await analytics.trackPostShare(postId, metadata.title || '', metadata.platform, metadata.sportType || '');
        }
        break;

      case 'scroll_depth':
        if (postId && metadata?.scrollPercentage) {
          await analytics.trackScrollDepth(postId, metadata.scrollPercentage, metadata.sportType || '');
        }
        break;

      case 'time_on_page':
        if (postId && metadata?.timeSpent) {
          await analytics.trackTimeOnPage(postId, metadata.timeSpent, metadata.sportType || '');
        }
        break;

      case 'page_performance':
        if (pageUrl && pageType && performance) {
          await analytics.trackPerformance();
        }
        break;

      case 'session_update':
        if (pageUrl) {
          await analytics.trackPageView(pageUrl);
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid tracking type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Tracking failed' },
      { status: 500 }
    );
  }
} 