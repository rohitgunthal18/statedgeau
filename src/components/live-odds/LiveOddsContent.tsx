'use client';

import { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  AlertTriangle,
  Loader2,
  Bell,
  Users
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Simplified component for testing
export function LiveOddsContent() {
  const [loading, setLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | undefined>(undefined);

  // Mock data for testing
  const mockOdds = [
    {
      id: "test-1",
      sport: "AFL",
      status: "Live",
      homeTeam: "Melbourne",
      awayTeam: "Collingwood",
      time: "7:50 PM AEST",
      venue: "MCG",
      markets: {
        headToHead: {
          home: { odds: 1.85, movement: "down" },
          away: { odds: 2.10, movement: "up" }
        }
      },
      featured: true,
      volume: "High"
    }
  ];

  const SPORTS_FILTERS = [
    { name: "All Sports", value: undefined },
    { name: "AFL", value: "AFL" },
    { name: "NRL", value: "NRL" },
    { name: "Cricket", value: "Cricket" }
  ];

  return (
    <>
      {/* Live Updates Bar */}
      <div className="bg-emerald text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>🔴 LIVE:</span>
              </div>
              <span>Testing live odds integration...</span>
            </div>
            <button 
              onClick={() => setLoading(!loading)}
              className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg text-xs hover:bg-white/30 transition-colors"
            >
              <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
              {loading ? "Updating..." : "Manual Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-500" />
                  Live Markets
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {SPORTS_FILTERS.map((filter, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSport(filter.value)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                      selectedSport === filter.value
                        ? "bg-navy text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-navy mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Live Odds...</h3>
                    <p className="text-gray-600">Fetching latest market data from our providers</p>
                  </div>
                </div>
              ) : (
                /* Mock Matches */
                <div className="space-y-4">
                  {mockOdds.map((match) => (
                    <div
                      key={match.id}
                      className="border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 rounded-full text-xs font-bold text-white bg-orange-500">
                            {match.sport}
                          </div>
                          <div className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                            {match.status}
                          </div>
                          <div className="px-2 py-1 bg-golden/20 text-golden rounded-md text-xs font-medium">
                            ⭐ Featured
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{match.venue}</div>
                          <div className="text-sm font-medium">{match.time}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          {match.homeTeam} vs {match.awayTeam}
                        </h3>
                      </div>

                      {/* Head to Head Market */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Head to Head</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-sm text-gray-600">{match.homeTeam}</div>
                            <div className="text-lg font-bold text-navy">
                              ${match.markets.headToHead.home.odds.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="text-sm text-gray-600">{match.awayTeam}</div>
                            <div className="text-lg font-bold text-navy">
                              ${match.markets.headToHead.away.odds.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* API Attribution */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-xs text-gray-500">
                  Odds data provided by{' '}
                  <a 
                    href="https://the-odds-api.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-navy hover:underline"
                  >
                    The Odds API
                  </a>
                  {' '}• Updated every 30 seconds
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Markets */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                Market Movements
              </h3>
              
              <div className="text-center py-8">
                <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Testing mode - No movements to display</p>
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" />
                Live Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Markets</span>
                  <span className="font-bold text-xl text-navy">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Status</span>
                  <span className="font-bold text-xl text-emerald-600">Ready</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">📈</div>
                  <div className="text-sm text-gray-600">Testing live odds integration</div>
                </div>
              </div>
            </div>

            {/* Join Telegram */}
            <div className="bg-gradient-to-br from-emerald to-navy rounded-2xl p-6 text-white text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Odds Alerts</h3>
              <p className="text-gray-200 mb-4 text-sm">
                Get real-time odds movements and value alerts sent directly to your phone
              </p>
              <Link
                href="https://t.me/AussieSportsInsights"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <Bell className="w-5 h-5" />
                Enable Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 