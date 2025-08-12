'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { oddsApiService, ProcessedOddsData } from '@/lib/oddsApi';

interface UseLiveOddsOptions {
  sport?: 'AFL' | 'NRL' | 'Cricket' | 'Soccer';
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseLiveOddsReturn {
  odds: ProcessedOddsData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  apiUsage: { requestsUsed: number; requestsRemaining: number } | null;
}

export function useLiveOdds(options: UseLiveOddsOptions = {}): UseLiveOddsReturn {
  const {
    sport,
    autoRefresh = true,
    refreshInterval = 30000 // 30 seconds default
  } = options;

  const [odds, setOdds] = useState<ProcessedOddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiUsage, setApiUsage] = useState<{ requestsUsed: number; requestsRemaining: number } | null>(null);

  const intervalRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  // Fetch odds data
  const fetchOdds = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      let data: ProcessedOddsData[];
      
      if (sport) {
        data = await oddsApiService.getLiveOdds(sport);
      } else {
        data = await oddsApiService.getAllLiveOdds();
      }

      if (mountedRef.current) {
        setOdds(data);
        setLastUpdated(new Date());
        
        // Update API usage stats
        const usage = await oddsApiService.getApiUsage();
        setApiUsage(usage);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch odds');
        console.error('Error fetching live odds:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [sport]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchOdds();
  }, [fetchOdds]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchOdds, refreshInterval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchOdds]);

  // Initial fetch
  useEffect(() => {
    fetchOdds();
  }, [fetchOdds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Pause auto-refresh when page is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is not visible, pause auto-refresh
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        // Page is visible, resume auto-refresh
        if (autoRefresh && refreshInterval > 0) {
          intervalRef.current = setInterval(fetchOdds, refreshInterval);
          // Fetch fresh data when page becomes visible
          fetchOdds();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoRefresh, refreshInterval, fetchOdds]);

  return {
    odds,
    loading,
    error,
    lastUpdated,
    refresh,
    apiUsage
  };
}

// Hook for filtered odds (by sport, status, etc.)
export function useFilteredLiveOdds(
  options: UseLiveOddsOptions & {
    statusFilter?: string[];
    featuredOnly?: boolean;
  } = {}
): UseLiveOddsReturn & { filteredOdds: ProcessedOddsData[] } {
  const { statusFilter, featuredOnly, ...baseOptions } = options;
  const baseResult = useLiveOdds(baseOptions);

  const filteredOdds = baseResult.odds.filter(match => {
    // Filter by status
    if (statusFilter && statusFilter.length > 0) {
      if (!statusFilter.includes(match.status)) {
        return false;
      }
    }

    // Filter by featured
    if (featuredOnly && !match.featured) {
      return false;
    }

    return true;
  });

  return {
    ...baseResult,
    filteredOdds
  };
}

// Hook for odds comparison across bookmakers
export function useOddsComparison(matchId?: string) {
  const { odds } = useLiveOdds();
  
  const getComparison = useCallback((targetMatchId: string) => {
    const match = odds.find(m => m.id === targetMatchId);
    return match?.bookmakers || [];
  }, [odds]);

  if (matchId) {
    return getComparison(matchId);
  }

  return getComparison;
}

// Hook for tracking odds movements
export function useOddsMovements() {
  const [previousOdds, setPreviousOdds] = useState<Record<string, ProcessedOddsData>>({});
  const { odds } = useLiveOdds();

  const movements = odds.map(currentMatch => {
    const previous = previousOdds[currentMatch.id];
    const movements: Array<{
      market: string;
      selection: string;
      oldOdds?: number;
      newOdds: number;
      change: number;
      changePercent: number;
    }> = [];

    if (previous && currentMatch.markets.headToHead && previous.markets.headToHead) {
      // Check home team movement
      const oldHomeOdds = previous.markets.headToHead.home.odds;
      const newHomeOdds = currentMatch.markets.headToHead.home.odds;
      if (oldHomeOdds !== newHomeOdds) {
        movements.push({
          market: 'Head to Head',
          selection: currentMatch.homeTeam,
          oldOdds: oldHomeOdds,
          newOdds: newHomeOdds,
          change: newHomeOdds - oldHomeOdds,
          changePercent: ((newHomeOdds - oldHomeOdds) / oldHomeOdds) * 100
        });
      }

      // Check away team movement
      const oldAwayOdds = previous.markets.headToHead.away.odds;
      const newAwayOdds = currentMatch.markets.headToHead.away.odds;
      if (oldAwayOdds !== newAwayOdds) {
        movements.push({
          market: 'Head to Head',
          selection: currentMatch.awayTeam,
          oldOdds: oldAwayOdds,
          newOdds: newAwayOdds,
          change: newAwayOdds - oldAwayOdds,
          changePercent: ((newAwayOdds - oldAwayOdds) / oldAwayOdds) * 100
        });
      }
    }

    return {
      matchId: currentMatch.id,
      match: `${currentMatch.homeTeam} vs ${currentMatch.awayTeam}`,
      movements
    };
  }).filter(m => m.movements.length > 0);

  // Update previous odds for next comparison
  useEffect(() => {
    const oddsMap = odds.reduce((acc, match) => {
      acc[match.id] = match;
      return acc;
    }, {} as Record<string, ProcessedOddsData>);
    
    setPreviousOdds(oddsMap);
  }, [odds]);

  return movements;
}

export default useLiveOdds; 