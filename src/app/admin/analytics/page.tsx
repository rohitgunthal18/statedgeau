"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Users, 
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Activity,
  Share2,
  Heart,
  Bookmark,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  AlertCircle
} from 'lucide-react';

// Define types for analytics data
interface AnalyticsOverview {
  totalViews: number;
  monthlyViews: number;
  totalPosts: number;
  publishedPosts: number;
  avgTimeOnPage: number;
  bounceRate: number;
  uniqueVisitors: number;
  returningVisitors: number;
  totalShares: number;
  totalFavorites: number;
  totalLikes: number;
  viewsGrowth: number;
  visitorsGrowth: number;
}

interface TopPost {
  id: string;
  title: string;
  slug: string;
  views: number;
  shares: number;
  likes: number;
  favorites: number;
  category: string;
  avgTime: number;
}

interface TrafficSource {
  source: string;
  percentage: number;
  visitors: number;
}

interface MonthlyData {
  month: string;
  views: number;
  posts: number;
}

interface RealTimeStats {
  last24Hours: number;
  currentOnline: number;
  recentActions: any[];
}

interface AnalyticsData {
  overview: AnalyticsOverview;
  topPosts: TopPost[];
  trafficSources: TrafficSource[];
  monthlyData: MonthlyData[];
  realTimeStats: RealTimeStats;
  timeRange: string;
  lastUpdated: string;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (range?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentRange = range || timeRange;
      const response = await fetch(`/api/admin/analytics?timeRange=${currentRange}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch analytics');
      }

      setAnalyticsData(result.data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh every 2 minutes
    const interval = setInterval(() => fetchAnalytics(), 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [timeRange]);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
    fetchAnalytics(newRange);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = async () => {
    if (!analyticsData) return;
    
    const exportObj = {
      exportDate: new Date().toISOString(),
      timeRange: analyticsData.timeRange,
      overview: analyticsData.overview,
      topPosts: analyticsData.topPosts,
      trafficSources: analyticsData.trafficSources,
      monthlyData: analyticsData.monthlyData
    };
    
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `betiq-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading && !analyticsData) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-navy" />
              <span className="text-gray-600">Loading analytics...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights into your blog performance and audience engagement.</p>
            {analyticsData?.lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {formatDate(analyticsData.lastUpdated)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={() => fetchAnalytics()}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={exportData}
              className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Real-Time Activity Bar */}
        <div className="bg-gradient-to-r from-navy to-emerald rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Live Activity</h3>
                <p className="text-sm opacity-90">{analyticsData?.realTimeStats.currentOnline || 0} users online now</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{analyticsData?.realTimeStats.last24Hours || 0}</div>
              <div className="text-sm opacity-90">actions in 24h</div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.overview.totalViews || 0)}</p>
              </div>
              <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-navy" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {(analyticsData?.overview.viewsGrowth || 0) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${(analyticsData?.overview.viewsGrowth || 0) >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                {(analyticsData?.overview.viewsGrowth || 0) >= 0 ? '+' : ''}{analyticsData?.overview.viewsGrowth?.toFixed(1) || 0}% from previous period
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.overview.uniqueVisitors || 0)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {(analyticsData?.overview.visitorsGrowth || 0) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${(analyticsData?.overview.visitorsGrowth || 0) >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                {(analyticsData?.overview.visitorsGrowth || 0) >= 0 ? '+' : ''}{analyticsData?.overview.visitorsGrowth?.toFixed(1) || 0}% from previous period
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time on Page</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(analyticsData?.overview.avgTimeOnPage || 0)}</p>
              </div>
              <div className="w-12 h-12 bg-golden/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-golden" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald" />
              <span className="text-sm text-emerald">Good engagement</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData?.overview.bounceRate?.toFixed(1) || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-coral/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-coral" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald" />
              <span className="text-sm text-emerald">Lower is better</span>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-coral/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-6 h-6 text-coral" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.overview.totalShares || 0)}</div>
            <div className="text-sm text-gray-600">Total Shares</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.overview.totalLikes || 0)}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="w-12 h-12 bg-golden/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6 text-golden" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.overview.totalFavorites || 0)}</div>
            <div className="text-sm text-gray-600">Total Bookmarks</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Posts */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
            {analyticsData?.topPosts && analyticsData.topPosts.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.topPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{post.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(post.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            {post.shares}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-3 h-3" />
                            {post.favorites}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{formatTime(post.avgTime)}</div>
                      <div className="text-xs text-gray-500">avg. time</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No post data available</p>
              </div>
            )}
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            {analyticsData?.trafficSources && analyticsData.trafficSources.length > 0 ? (
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-navy' :
                        index === 1 ? 'bg-emerald' :
                        index === 2 ? 'bg-coral' :
                        index === 3 ? 'bg-golden' : 'bg-gray-400'
                      }`}></div>
                      <span className="font-medium text-gray-900">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{source.percentage}%</div>
                      <div className="text-xs text-gray-500">{formatNumber(source.visitors)} visitors</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No traffic data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          {analyticsData?.monthlyData && analyticsData.monthlyData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Views Chart */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Page Views</h4>
                <div className="space-y-2">
                  {analyticsData.monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-navy h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((data.views / Math.max(...analyticsData.monthlyData.map(d => d.views))) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">{formatNumber(data.views)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posts Chart */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Posts Published</h4>
                <div className="space-y-2">
                  {analyticsData.monthlyData.map((data) => (
                    <div key={data.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((data.posts / Math.max(...analyticsData.monthlyData.map(d => d.posts))) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-16 text-right">{data.posts}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No monthly data available</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-navy">{analyticsData?.overview.publishedPosts || 0}</div>
            <div className="text-sm text-gray-600">Published Posts</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-emerald">{formatNumber(analyticsData?.overview.returningVisitors || 0)}</div>
            <div className="text-sm text-gray-600">Returning Visitors</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-2xl font-bold text-golden">{formatNumber(analyticsData?.overview.monthlyViews || 0)}</div>
            <div className="text-sm text-gray-600">Monthly Views</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 