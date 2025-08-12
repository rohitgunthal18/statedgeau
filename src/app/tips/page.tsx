import { Metadata } from "next";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  Filter,
  ChevronDown,
  Star,
  Zap,
  Calendar,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Users,
  ArrowRight,
  Flame,
  Award
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Expert Betting Tips | AFL, NRL, Racing Tips | Aussie Insights",
  description: "Daily expert betting tips for AFL, NRL, horse racing and more. Professional analysis with proven track record from Australia's trusted tipsters.",
  keywords: ["betting tips", "AFL tips", "NRL tips", "horse racing tips", "daily tips", "expert tipsters"],
};

// Mock data for tips
const DAILY_TIPS = [
  {
    id: "1",
    sport: "AFL",
    match: "Melbourne vs Collingwood",
    tip: "Melbourne -5.5 Points",
    odds: 1.90,
    stake: "3 Units",
    confidence: 85,
    reason: "Melbourne's superior form at the MCG and Collingwood's injury concerns make this a solid bet.",
    tipster: "Mike Thompson",
    time: "7:50 PM AEST",
    status: "active",
    category: "Head to Head",
    value: "High"
  },
  {
    id: "2", 
    sport: "NRL",
    match: "Panthers vs Storm",
    tip: "Under 42.5 Total Points",
    odds: 1.85,
    stake: "2 Units", 
    confidence: 78,
    reason: "Both teams have strong defensive records and this should be a low-scoring affair.",
    tipster: "David Wilson",
    time: "8:00 PM AEST",
    status: "active",
    category: "Totals",
    value: "Medium"
  },
  {
    id: "3",
    sport: "Racing", 
    match: "Randwick Race 7",
    tip: "Winx Legacy - Each Way",
    odds: 4.50,
    stake: "1.5 Units",
    confidence: 72,
    reason: "Great form from this distance and jockey booking suggests strong chance.",
    tipster: "Sarah Chen",
    time: "4:20 PM AEST",
    status: "won",
    category: "Each Way",
    value: "High"
  },
  {
    id: "4",
    sport: "Cricket",
    match: "Australia vs England T20",
    tip: "Australia -1.5 Runs", 
    odds: 2.10,
    stake: "2 Units",
    confidence: 80,
    reason: "Home advantage and England's recent poor form make this great value.",
    tipster: "Sarah Chen", 
    time: "7:00 PM AEST",
    status: "active",
    category: "Handicap",
    value: "Medium"
  }
];

const FEATURED_TIPSTERS = [
  {
    name: "Mike Thompson",
    sport: "AFL Expert",
    winRate: "78%",
    profit: "+45.2 Units",
    followers: "12.4K",
    avatar: "MT",
    verified: true,
    streak: 7
  },
  {
    name: "Sarah Chen", 
    sport: "Racing Specialist",
    winRate: "72%",
    profit: "+38.7 Units", 
    followers: "8.9K",
    avatar: "SC",
    verified: true,
    streak: 5
  },
  {
    name: "David Wilson",
    sport: "NRL Analyst", 
    winRate: "74%",
    profit: "+29.8 Units",
    followers: "9.7K", 
    avatar: "DW",
    verified: true,
    streak: 3
  }
];

const TIP_CATEGORIES = [
  { name: "All Tips", count: 28, active: true },
  { name: "AFL", count: 12, active: false },
  { name: "NRL", count: 8, active: false }, 
  { name: "Racing", count: 6, active: false },
  { name: "Cricket", count: 2, active: false }
];

const RECENT_RESULTS = [
  { tip: "Richmond +12.5", result: "Won", profit: "+3.8", sport: "AFL" },
  { tip: "Rabbitohs -6.5", result: "Won", profit: "+2.1", sport: "NRL" },
  { tip: "Nature Strip Win", result: "Lost", profit: "-2.0", sport: "Racing" },
  { tip: "Over 180.5 Points", result: "Won", profit: "+1.9", sport: "AFL" }
];

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy via-navy to-emerald py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-golden/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-golden/20 backdrop-blur-sm px-4 py-2 rounded-full border border-golden/30">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-golden" />
                  <span className="text-sm font-medium">78% Win Rate This Month</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Expert Betting Tips
              <span className="block text-3xl lg:text-5xl text-golden mt-2">
                From Australia's Best Tipsters
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Daily expert tips across AFL, NRL, horse racing and more. Professional analysis with proven results from our team of specialist tipsters.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">78%</div>
                <div className="text-sm text-gray-300">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">+127</div>
                <div className="text-sm text-gray-300">Units Profit</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">15K+</div>
                <div className="text-sm text-gray-300">Daily Tips</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">50K+</div>
                <div className="text-sm text-gray-300">Followers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Tips Alert Bar */}
      <div className="bg-coral text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>🔥 LIVE TIP:</span>
            </div>
            <span>Melbourne -5.5 vs Collingwood (7:50 PM) - 85% Confidence</span>
            <Link href="#daily-tips" className="underline hover:no-underline">
              View Details →
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Today's Tips</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Filter by sport</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {TIP_CATEGORIES.map((category, index) => (
                  <button
                    key={index}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                      category.active
                        ? "bg-navy text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {category.name}
                    <span className="ml-2 text-xs opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>

              {/* Daily Tips */}
              <div id="daily-tips" className="space-y-4">
                {DAILY_TIPS.map((tip) => (
                  <div
                    key={tip.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold text-white",
                          tip.sport === "AFL" ? "bg-orange-500" :
                          tip.sport === "NRL" ? "bg-blue-500" :
                          tip.sport === "Racing" ? "bg-green-500" : "bg-purple-500"
                        )}>
                          {tip.sport}
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-md text-xs font-medium",
                          tip.value === "High" ? "bg-emerald-100 text-emerald-700" :
                          tip.value === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        )}>
                          {tip.value} Value
                        </div>
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          tip.status === "active" ? "bg-green-400 animate-pulse" :
                          tip.status === "won" ? "bg-emerald-500" :
                          "bg-coral"
                        )}></div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{tip.time}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-lg font-bold text-navy">${tip.odds}</span>
                          <span className="text-sm text-gray-600">({tip.stake})</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{tip.match}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-navy text-lg">{tip.tip}</span>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-600">{tip.confidence}% Confidence</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{tip.reason}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {tip.tipster.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{tip.tipster}</div>
                          <div className="text-xs text-gray-500">{tip.category}</div>
                        </div>
                      </div>
                      
                      <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors flex items-center gap-2">
                        <span>Follow Tip</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Button */}
              <div className="text-center mt-8">
                <button className="bg-gradient-to-r from-navy to-emerald text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                  Load More Tips
                </button>
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                Recent Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RECENT_RESULTS.map((result, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{result.tip}</span>
                      <div className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        result.result === "Won" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-coral/10 text-coral"
                      )}>
                        {result.result}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{result.sport}</span>
                      <span className={cn(
                        "font-bold",
                        result.result === "Won" ? "text-emerald-600" : "text-coral"
                      )}>
                        {result.profit} Units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Tipsters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-golden" />
                Top Tipsters
              </h3>
              
              <div className="space-y-4">
                {FEATURED_TIPSTERS.map((tipster, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-navy to-emerald text-white rounded-full flex items-center justify-center font-bold">
                        {tipster.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{tipster.name}</span>
                          {tipster.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{tipster.sport}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">Win Rate</div>
                        <div className="font-bold text-emerald-600">{tipster.winRate}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Profit</div>
                        <div className="font-bold text-navy">{tipster.profit}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{tipster.followers}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600">{tipster.streak} win streak</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                View All Tipsters
              </button>
            </div>

            {/* Statistics Widget */}
            <div className="bg-gradient-to-br from-navy to-emerald rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                This Week's Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Total Tips</span>
                  <span className="font-bold text-xl">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tips Won</span>
                  <span className="font-bold text-xl text-golden">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Win Rate</span>
                  <span className="font-bold text-xl text-golden">70.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Profit</span>
                  <span className="font-bold text-xl text-golden">+43.2</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-golden mb-1">🏆</div>
                  <div className="text-sm">Top performing week!</div>
                </div>
              </div>
            </div>

            {/* Telegram CTA */}
            <div className="bg-gradient-to-br from-emerald to-navy rounded-2xl p-6 text-white text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Get Instant Tips</h3>
              <p className="text-gray-200 mb-4 text-sm">
                Join 50,000+ punters getting real-time tips delivered to their phone
              </p>
              <Link
                href="https://t.me/AussieBettingInsights"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Join Telegram
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 