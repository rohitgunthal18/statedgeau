// The Odds API integration for live sports betting odds
// Website: https://the-odds-api.com/
// Free tier: 500 requests/month

interface OddsApiResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    last_update: string;
    markets: {
      key: string; // h2h, spreads, totals
      outcomes: {
        name: string;
        price: number;
        point?: number; // for spreads/totals
      }[];
    }[];
  }[];
}

interface ProcessedOddsData {
  id: string;
  sport: string;
  status: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  venue: string;
  markets: {
    headToHead?: {
      home: { odds: number; movement: string };
      away: { odds: number; movement: string };
    };
    line?: {
      home: { odds: number; handicap: number; movement: string };
      away: { odds: number; handicap: number; movement: string };
    };
    total?: {
      over: { odds: number; points: number; movement: string };
      under: { odds: number; points: number; movement: string };
    };
  };
  bookmakers?: {
    name: string;
    odds: number;
    best: boolean;
  }[];
  featured: boolean;
  volume: string;
}

// Australian sports mapping for The Odds API
const SPORT_KEYS = {
  AFL: 'aussierules_afl',
  NRL: 'rugbyleague_nrl', 
  Cricket: 'cricket_test_match', // or cricket_big_bash, cricket_odi
  Soccer: 'soccer_australia_aleague'
};

// Bookmaker mapping for Australian market
const BOOKMAKER_MAPPING: Record<string, string> = {
  'sportsbet': 'Sportsbet',
  'tab': 'TAB',
  'ladbrokes_au': 'Ladbrokes',
  'bet365': 'Bet365',
  'pointsbet_au': 'PointsBet',
  'unibet_au': 'Unibet'
};

class OddsApiService {
  private apiKey: string;
  private baseUrl = 'https://api.the-odds-api.com/v4';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30000; // 30 seconds cache

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ODDS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ ODDS_API_KEY not found. Using mock data.');
    }
  }

  // Get live odds for specific sport
  async getLiveOdds(sport: keyof typeof SPORT_KEYS): Promise<ProcessedOddsData[]> {
    try {
      if (!this.apiKey) {
        return this.getMockData(sport);
      }

      const cacheKey = `live-odds-${sport}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const sportKey = SPORT_KEYS[sport];
      const url = `${this.baseUrl}/sports/${sportKey}/odds`;
      
      const params = new URLSearchParams({
        apiKey: this.apiKey,
        regions: 'au', // Australian bookmakers
        markets: 'h2h,spreads,totals',
        oddsFormat: 'decimal',
        dateFormat: 'iso'
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Odds API error: ${response.status}`);
      }

      const data: OddsApiResponse[] = await response.json();
      const processedData = this.processOddsData(data, sport);
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      return processedData;

    } catch (error) {
      console.error('Error fetching odds:', error);
      return this.getMockData(sport); // Fallback to mock data
    }
  }

  // Get odds for all Australian sports
  async getAllLiveOdds(): Promise<ProcessedOddsData[]> {
    try {
      const sportsPromises = Object.keys(SPORT_KEYS).map(sport => 
        this.getLiveOdds(sport as keyof typeof SPORT_KEYS)
      );

      const results = await Promise.allSettled(sportsPromises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<ProcessedOddsData[]> => 
          result.status === 'fulfilled')
        .flatMap(result => result.value)
        .slice(0, 20); // Limit to 20 matches for performance

    } catch (error) {
      console.error('Error fetching all odds:', error);
      return this.getAllMockData();
    }
  }

  // Process raw API data into our format
  private processOddsData(apiData: OddsApiResponse[], sport: string): ProcessedOddsData[] {
    return apiData.map((match, index) => {
      const headToHeadMarket = match.bookmakers[0]?.markets.find(m => m.key === 'h2h');
      const spreadsMarket = match.bookmakers[0]?.markets.find(m => m.key === 'spreads');
      const totalsMarket = match.bookmakers[0]?.markets.find(m => m.key === 'totals');

      const processed: ProcessedOddsData = {
        id: match.id,
        sport: sport.toUpperCase(),
        status: this.getMatchStatus(match.commence_time),
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        time: this.formatMatchTime(match.commence_time),
        venue: this.getVenue(match.home_team, sport),
        markets: {},
        bookmakers: this.getBookmakersComparison(match.bookmakers, 'h2h'),
        featured: index < 3, // First 3 matches are featured
        volume: this.getVolumeIndicator()
      };

      // Process Head to Head odds
      if (headToHeadMarket) {
        const homeOdds = headToHeadMarket.outcomes.find(o => o.name === match.home_team);
        const awayOdds = headToHeadMarket.outcomes.find(o => o.name === match.away_team);
        
        if (homeOdds && awayOdds) {
          processed.markets.headToHead = {
            home: { odds: homeOdds.price, movement: this.getMovement() },
            away: { odds: awayOdds.price, movement: this.getMovement() }
          };
        }
      }

      // Process Spreads (Line betting)
      if (spreadsMarket) {
        const homeSpread = spreadsMarket.outcomes.find(o => o.name === match.home_team);
        const awaySpread = spreadsMarket.outcomes.find(o => o.name === match.away_team);
        
        if (homeSpread && awaySpread && homeSpread.point !== undefined && awaySpread.point !== undefined) {
          processed.markets.line = {
            home: { 
              odds: homeSpread.price, 
              handicap: homeSpread.point,
              movement: this.getMovement() 
            },
            away: { 
              odds: awaySpread.price, 
              handicap: awaySpread.point,
              movement: this.getMovement() 
            }
          };
        }
      }

      // Process Totals
      if (totalsMarket) {
        const overOutcome = totalsMarket.outcomes.find(o => o.name === 'Over');
        const underOutcome = totalsMarket.outcomes.find(o => o.name === 'Under');
        
        if (overOutcome && underOutcome && overOutcome.point !== undefined) {
          processed.markets.total = {
            over: { 
              odds: overOutcome.price, 
              points: overOutcome.point,
              movement: this.getMovement() 
            },
            under: { 
              odds: underOutcome.price, 
              points: overOutcome.point, // Same point value
              movement: this.getMovement() 
            }
          };
        }
      }

      return processed;
    });
  }

  // Get best odds comparison across bookmakers
  private getBookmakersComparison(bookmakers: OddsApiResponse['bookmakers'], market: string) {
    const comparison = bookmakers
      .filter(book => book.markets.some(m => m.key === market))
      .map(book => {
        const marketData = book.markets.find(m => m.key === market);
        const homeOdds = marketData?.outcomes[0]?.price || 0;
        
        return {
          name: BOOKMAKER_MAPPING[book.key] || book.title,
          odds: homeOdds,
          best: false
        };
      });

    // Mark the best odds
    if (comparison.length > 0) {
      const bestOdds = Math.max(...comparison.map(c => c.odds));
      comparison.forEach(c => {
        if (c.odds === bestOdds) c.best = true;
      });
    }

    return comparison;
  }

  // Helper methods
  private getMatchStatus(commenceTime: string): string {
    const now = new Date();
    const matchTime = new Date(commenceTime);
    const diffMinutes = (matchTime.getTime() - now.getTime()) / (1000 * 60);

    if (diffMinutes < -120) return 'Finished';
    if (diffMinutes < 0) return 'Live';
    if (diffMinutes < 60) return 'Starting Soon';
    return 'Upcoming';
  }

  private formatMatchTime(commenceTime: string): string {
    const date = new Date(commenceTime);
    return date.toLocaleString('en-AU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Sydney'
    });
  }

  private getVenue(homeTeam: string, sport: string): string {
    // Simple venue mapping - can be expanded
    const venues: Record<string, Record<string, string>> = {
      AFL: {
        'Melbourne': 'MCG',
        'Collingwood': 'MCG',
        'Richmond': 'MCG',
        'Essendon': 'Marvel Stadium',
        'Carlton': 'Marvel Stadium'
      },
      NRL: {
        'Panthers': 'BlueBet Stadium',
        'Storm': 'AAMI Park',
        'Broncos': 'Suncorp Stadium'
      }
    };

    return venues[sport]?.[homeTeam] || 'TBD';
  }

  private getMovement(): 'up' | 'down' | 'stable' {
    const movements = ['up', 'down', 'stable'] as const;
    return movements[Math.floor(Math.random() * movements.length)];
  }

  private getVolumeIndicator(): 'High' | 'Medium' | 'Low' {
    const volumes = ['High', 'Medium', 'Low'] as const;
    return volumes[Math.floor(Math.random() * volumes.length)];
  }

  // Fallback mock data methods
  private getMockData(sport: string): ProcessedOddsData[] {
    const mockMatches = {
      AFL: [
        {
          id: 'afl-1',
          sport: 'AFL',
          homeTeam: 'Melbourne',
          awayTeam: 'Collingwood',
          venue: 'MCG'
        }
      ],
      NRL: [
        {
          id: 'nrl-1', 
          sport: 'NRL',
          homeTeam: 'Panthers',
          awayTeam: 'Storm',
          venue: 'AAMI Park'
        }
      ],
      Cricket: [
        {
          id: 'cricket-1',
          sport: 'Cricket',
          homeTeam: 'Australia',
          awayTeam: 'England',
          venue: 'MCG'
        }
      ]
    };

    return (mockMatches[sport as keyof typeof mockMatches] || []).map(match => ({
      ...match,
      status: 'Live',
      time: '7:50 PM AEST',
      markets: {
        headToHead: {
          home: { odds: 1.85, movement: 'down' as const },
          away: { odds: 2.10, movement: 'up' as const }
        }
      },
      featured: true,
      volume: 'High' as const
    }));
  }

  private getAllMockData(): ProcessedOddsData[] {
    return [
      ...this.getMockData('AFL'),
      ...this.getMockData('NRL'), 
      ...this.getMockData('Cricket')
    ];
  }

  // Get API usage stats
  async getApiUsage(): Promise<{ requestsUsed: number; requestsRemaining: number }> {
    try {
      if (!this.apiKey) {
        return { requestsUsed: 0, requestsRemaining: 500 };
      }

      const response = await fetch(`${this.baseUrl}/sports?apiKey=${this.apiKey}`);
      
      return {
        requestsUsed: parseInt(response.headers.get('x-requests-used') || '0'),
        requestsRemaining: parseInt(response.headers.get('x-requests-remaining') || '500')
      };
    } catch (error) {
      console.error('Error getting API usage:', error);
      return { requestsUsed: 0, requestsRemaining: 500 };
    }
  }
}

// Export singleton instance
export const oddsApiService = new OddsApiService();

// Export types
export type { ProcessedOddsData, OddsApiResponse }; 