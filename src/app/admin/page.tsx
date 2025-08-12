"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  FileText, 
  Eye, 
  TrendingUp, 
  Users, 
  Plus, 
  Calendar,
  BarChart3,
  Clock,
  Target,
  Star,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Activity
} from 'lucide-react';
import Link from 'next/link';

// Define types for our data
interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  totalComments: number;
  monthlyGrowth: number;
  recentActivity: {
    views24h: number;
    shares24h: number;
    likes24h: number;
    total24h: number;
  };
  trends: {
    currentMonthViews: number;
    lastMonthViews: number;
    growthDirection: 'up' | 'down';
  };
  lastUpdated: string;
}

interface RecentPost {
  id: string;
  title: string;
  status: string;
  views: number;
  createdAt: string;
  category: string;
}

// Quick actions configuration
const quickActions = [
  {
    title: 'Write New Post',
    description: 'Create fresh content',
    href: '/admin/posts/new',
    icon: Plus,
    color: 'bg-navy'
  },
  {
    title: 'Manage Posts',
    description: 'Edit existing content',
    href: '/admin/posts',
    icon: FileText,
    color: 'bg-emerald'
  },
  {
    title: 'View Live Site',
    description: 'See your blog',
    href: '/',
    icon: ExternalLink,
    color: 'bg-emerald',
    external: true
  },
  {
    title: 'Media Library',
    description: 'Manage uploaded files',
    href: '/admin/media',
    icon: FileText,
    color: 'bg-golden'
  },
  {
    title: 'Analytics',
    description: 'View detailed stats',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'bg-coral'
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard-stats');
      const statsData = await statsResponse.json();

      if (!statsData.success) {
        throw new Error(statsData.error || 'Failed to fetch stats');
      }

      setStats(statsData.data);

      // Fetch recent posts (we'll use the existing posts API)
      const postsResponse = await fetch('/api/admin/posts?limit=5');
      const postsData = await postsResponse.json();

      if (postsData.success && postsData.posts) {
        const formattedPosts = postsData.posts.map((post: any) => ({
          id: post.id,
          title: post.title,
          status: post.status,
          views: post.view_count || 0,
          createdAt: post.created_at,
          category: post.categories?.[0]?.name || 'General'
        }));
        setRecentPosts(formattedPosts);
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      
      // Fallback to basic stats on error
      setStats({
        totalPosts: 0,
        totalViews: 0,
        totalComments: 0,
        monthlyGrowth: 0,
        recentActivity: { views24h: 0, shares24h: 0, likes24h: 0, total24h: 0 },
        trends: { currentMonthViews: 0, lastMonthViews: 0, growthDirection: 'up' },
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !stats) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-navy" />
              <span className="text-gray-600">Loading dashboard...</span>
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
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your blog.</p>
            {stats?.lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {formatDate(stats.lastUpdated)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Post</span>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats?.totalPosts || 0}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-navy" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4 flex items-center gap-2 text-xs lg:text-sm text-gray-600">
              <span>Published content</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Monthly Views</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats?.trends.currentMonthViews.toLocaleString() || 0}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 lg:w-6 lg:h-6 text-emerald" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4 flex items-center gap-2">
              <div className={`flex items-center gap-1 text-xs lg:text-sm ${stats?.trends.growthDirection === 'up' ? 'text-emerald' : 'text-red-500'}`}>
                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>{(stats?.monthlyGrowth ?? 0) >= 0 ? '+' : ''}{stats?.monthlyGrowth ?? 0}%</span>
              </div>
              <span className="text-xs lg:text-sm text-gray-600">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats?.totalViews.toLocaleString() || 0}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-golden/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-golden" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4">
              <span className="text-xs lg:text-sm text-gray-600">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stats?.totalComments || 0}</p>
              </div>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-coral/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-coral" />
              </div>
            </div>
            <div className="mt-3 lg:mt-4">
              <span className="text-xs lg:text-sm text-gray-600">Total interactions</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                className="group p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-gray-700 text-sm lg:text-base truncate">
                      {action.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link 
              href="/admin/posts" 
              className="text-sm text-navy hover:text-navy/80 font-medium transition-colors"
            >
              View all
            </Link>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.slice(0, 5).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      post.status === 'published' ? 'bg-emerald' : 
                      post.status === 'draft' ? 'bg-golden' : 'bg-gray-400'
                    }`}></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">{post.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{post.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-emerald/10 text-emerald' : 
                      post.status === 'draft' ? 'bg-golden/10 text-golden' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {post.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No posts found</p>
              <Link 
                href="/admin/posts/new"
                className="text-navy hover:text-navy/80 text-sm font-medium mt-2 inline-block"
              >
                Create your first post
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 