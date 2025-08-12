import { Metadata } from "next";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Target, 
  Calculator,
  Brain,
  LineChart,
  Activity,
  Zap,
  Calendar,
  Database,
  Award,
  Eye,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Download,
  Share2,
  BookOpen,
  Users,
  Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sports Betting Analysis & Data Insights | Aussie Insights",
  description: "In-depth statistical analysis and data-driven insights for AFL, NRL, horse racing and cricket betting. Professional analysis tools and trends.",
  keywords: ["betting analysis", "sports statistics", "AFL data", "NRL trends", "horse racing form", "betting insights"],
};

// Mock data for analysis
const FEATURED_ANALYSIS = [
  {
    id: "1",
    title: "AFL Home Ground Advantage: 2024 Statistical Breakdown",
    type: "Statistical Report",
    sport: "AFL",
    readTime: "12 min",
    keyInsight: "Home teams are winning 67% of matches this season",
    tags: ["Statistics", "Home Advantage", "AFL"],
    author: "Mike Thompson",
    publishedAt: "2024-08-15",
    views: 8420,
    featured: true,
    summary: "Comprehensive analysis of home ground advantage across all AFL venues, examining win rates, margin differences, and betting implications.",
    image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&h=400&fit=crop"
  },
  {
    id: "2", 
    title: "NRL Finals Form Guide: Momentum vs Experience Analysis",
    type: "Performance Study",
    sport: "NRL",
    readTime: "15 min",
    keyInsight: "Teams in form for last 6 weeks have 78% finals success rate",
    tags: ["Finals", "Form Analysis", "NRL"],
    author: "David Wilson",
    publishedAt: "2024-08-14",
    views: 6750,
    featured: true,
    summary: "Deep dive into which factors matter most in NRL finals: recent form, experience, or individual brilliance.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
  },
  {
    id: "3",
    title: "Melbourne Cup Barrier Draw Impact: 20-Year Historical Analysis", 
    type: "Historical Study",
    sport: "Racing",
    readTime: "18 min",
    keyInsight: "Barriers 6-12 have produced 60% of Cup winners since 2004",
    tags: ["Melbourne Cup", "Barrier Analysis", "Historical Data"],
    author: "Sarah Chen",
    publishedAt: "2024-08-13",
    views: 9240,
    featured: true,
    summary: "Statistical breakdown of barrier draw success rates in Australia's greatest race over the past two decades.",
    image: "https://images.unsplash.com/photo-1574771324815-dc0c9df1c4bb?w=800&h=400&fit=crop"
  }
];

const TRENDING_INSIGHTS = [
  {
    title: "Wet Weather Impact on AFL Scoring",
    metric: "23% decrease in total points",
    trend: "down",
    sport: "AFL",
    confidence: 92
  },
  {
    title: "NRL Golden Point Record",
    metric: "Home teams win 68% of golden point games", 
    trend: "up",
    sport: "NRL",
    confidence: 85
  },
  {
    title: "Spring Carnival Favourites",
    metric: "Favourites winning at 34% rate",
    trend: "up", 
    sport: "Racing",
    confidence: 78
  },
  {
    title: "BBL Powerplay Scoring Surge",
    metric: "12% increase in powerplay runs",
    trend: "up",
    sport: "Cricket", 
    confidence: 89
  }
];

const ANALYSIS_CATEGORIES = [
  { name: "All Analysis", count: 47, icon: BarChart3, active: true },
  { name: "Statistical Reports", count: 18, icon: Calculator, active: false },
  { name: "Trend Analysis", count: 15, icon: TrendingUp, active: false },
  { name: "Performance Studies", count: 9, icon: Target, active: false },
  { name: "Historical Data", count: 5, icon: Database, active: false }
];

const STATS_WIDGETS = [
  {
    title: "Win Rate Analysis",
    subtitle: "AFL Home vs Away",
    data: [
      { label: "Home", value: 67, color: "emerald" },
      { label: "Away", value: 33, color: "coral" }
    ]
  },
  {
    title: "Scoring Trends", 
    subtitle: "NRL Total Points per Game",
    data: [
      { label: "2024", value: 42.3, trend: "up" },
      { label: "2023", value: 39.8, trend: "down" },
      { label: "2022", value: 41.2, trend: "up" }
    ]
  },
  {
    title: "Form Indicators",
    subtitle: "Last 5 Games Performance",
    data: [
      { team: "Melbourne", wins: 5, form: "excellent" },
      { team: "Collingwood", wins: 4, form: "good" },
      { team: "Brisbane", wins: 3, form: "average" }
    ]
  }
];

const RECENT_ANALYSIS = [
  {
    title: "Thursday Night Football: Home Team Advantage Amplified",
    sport: "AFL",
    type: "Quick Insight",
    readTime: "3 min",
    keyPoint: "Home teams win 78% of Thursday night games vs 67% overall",
    views: 2340
  },
  {
    title: "Origin Period Impact on NRL Club Performance",
    sport: "NRL", 
    type: "Performance Study",
    readTime: "8 min",
    keyPoint: "Teams lose 15% more games during Origin period",
    views: 3450
  },
  {
    title: "Jockey-Trainer Combinations: Success Rates by Track",
    sport: "Racing",
    type: "Statistical Report", 
    readTime: "10 min",
    keyPoint: "Top 5 combos have 28% win rate vs 12% average",
    views: 1890
  },
  {
    title: "T20 Death Overs: Bowling Strategy Analysis",
    sport: "Cricket",
    type: "Tactical Analysis",
    readTime: "6 min", 
    keyPoint: "Pace bowling yields 1.2 runs less per ball in death overs",
    views: 1120
  }
];

export default function AnalysisPage() {
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
                  <Brain className="w-5 h-5 text-golden" />
                  <span className="text-sm font-medium">Advanced Analytics Platform</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Data-Driven Analysis
              <span className="block text-3xl lg:text-5xl text-golden mt-2">
                Uncover Hidden Betting Edges
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional statistical analysis and insights across AFL, NRL, horse racing and cricket. 
              Turn data into winning decisions with our expert research team.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">500+</div>
                <div className="text-sm text-gray-300">Analysis Reports</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">92%</div>
                <div className="text-sm text-gray-300">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">24/7</div>
                <div className="text-sm text-gray-300">Data Updates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">15+</div>
                <div className="text-sm text-gray-300">Data Sources</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Insights Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 text-sm overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 text-navy font-semibold flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
              <span>Live Insights:</span>
            </div>
            {TRENDING_INSIGHTS.map((insight, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-shrink-0">
                <div className={cn(
                  "px-2 py-0.5 rounded text-xs font-bold text-white",
                  insight.sport === "AFL" ? "bg-orange-500" :
                  insight.sport === "NRL" ? "bg-blue-500" :
                  insight.sport === "Racing" ? "bg-green-500" : "bg-purple-500"
                )}>
                  {insight.sport}
                </div>
                <span className="font-medium">{insight.metric}</span>
                <div className={cn(
                  "flex items-center",
                  insight.trend === "up" ? "text-emerald-600" :
                  insight.trend === "down" ? "text-coral" : "text-gray-500"
                )}>
                  {insight.trend === "up" ? <ArrowUp className="w-3 h-3" /> :
                   insight.trend === "down" ? <ArrowDown className="w-3 h-3" /> :
                   <Minus className="w-3 h-3" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-golden" />
                  Featured Analysis
                </h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-navy transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-navy transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {FEATURED_ANALYSIS.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={analysis.image}
                          alt={analysis.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold text-white",
                            analysis.sport === "AFL" ? "bg-orange-500" :
                            analysis.sport === "NRL" ? "bg-blue-500" :
                            analysis.sport === "Racing" ? "bg-green-500" : "bg-purple-500"
                          )}>
                            {analysis.sport}
                          </div>
                          <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            {analysis.type}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{analysis.readTime}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-xl text-gray-900 mb-2 hover:text-navy transition-colors cursor-pointer">
                          {analysis.title}
                        </h3>

                        <div className="bg-emerald-50 border-l-4 border-emerald-400 p-3 mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-800">Key Insight:</span>
                          </div>
                          <p className="text-emerald-700 text-sm mt-1">{analysis.keyInsight}</p>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{analysis.summary}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <span>By {analysis.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{analysis.views.toLocaleString()} views</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-navy transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                            <Link
                              href={`/analysis/${analysis.id}`}
                              className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy/90 transition-colors flex items-center gap-2"
                            >
                              <BookOpen className="w-4 h-4" />
                              Read Analysis
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Browse by Category</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ANALYSIS_CATEGORIES.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={index}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                        category.active 
                          ? "border-navy bg-navy/5 shadow-md" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            category.active ? "bg-navy text-white" : "bg-gray-100 text-gray-600"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-500">{category.count} reports available</p>
                          </div>
                        </div>
                        <div className={cn(
                          "text-sm font-bold px-2 py-1 rounded-full",
                          category.active 
                            ? "bg-navy text-white" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {category.count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                Latest Analysis
              </h3>
              
              <div className="space-y-4">
                {RECENT_ANALYSIS.map((analysis, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold text-white",
                          analysis.sport === "AFL" ? "bg-orange-500" :
                          analysis.sport === "NRL" ? "bg-blue-500" :
                          analysis.sport === "Racing" ? "bg-green-500" : "bg-purple-500"
                        )}>
                          {analysis.sport}
                        </div>
                        <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {analysis.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{analysis.readTime}</span>
                      </div>
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-navy transition-colors">
                      {analysis.title}
                    </h4>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mb-3">
                      <p className="text-blue-700 text-sm">{analysis.keyPoint}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{analysis.views.toLocaleString()} views</span>
                      </div>
                      <button className="text-navy font-medium hover:underline">
                        Read More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Statistics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-500" />
                Live Statistics
              </h3>
              
              <div className="space-y-6">
                {STATS_WIDGETS.map((widget, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{widget.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{widget.subtitle}</p>
                    
                    {widget.data[0].hasOwnProperty('color') && (
                      <div className="space-y-2">
                        {widget.data.map((item: any, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={cn(
                                    "h-2 rounded-full",
                                    item.color === "emerald" ? "bg-emerald-500" : "bg-coral"
                                  )}
                                  style={{ width: `${item.value}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold">{item.value}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {widget.data[0].hasOwnProperty('trend') && (
                      <div className="space-y-2">
                        {widget.data.map((item: any, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{item.label}</span>
                            <div className="flex items-center gap-1">
                              <span className="font-bold">{item.value}</span>
                              <div className={cn(
                                "flex items-center",
                                item.trend === "up" ? "text-emerald-600" : "text-coral"
                              )}>
                                {item.trend === "up" ? 
                                  <ArrowUp className="w-3 h-3" /> : 
                                  <ArrowDown className="w-3 h-3" />
                                }
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {widget.data[0].hasOwnProperty('team') && (
                      <div className="space-y-2">
                        {widget.data.map((item: any, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{item.team}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{item.wins}/5</span>
                              <div className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                item.form === "excellent" ? "bg-emerald-100 text-emerald-700" :
                                item.form === "good" ? "bg-blue-100 text-blue-700" :
                                "bg-yellow-100 text-yellow-700"
                              )}>
                                {item.form}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Tools */}
            <div className="bg-gradient-to-br from-navy to-emerald rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-6 h-6" />
                Analysis Tools
              </h3>
              
              <div className="space-y-4">
                <button className="w-full bg-white/20 backdrop-blur-sm p-3 rounded-lg text-left hover:bg-white/30 transition-colors">
                  <div className="font-medium">Odds Calculator</div>
                  <div className="text-sm text-gray-200">Calculate returns and value</div>
                </button>
                
                <button className="w-full bg-white/20 backdrop-blur-sm p-3 rounded-lg text-left hover:bg-white/30 transition-colors">
                  <div className="font-medium">Form Analyzer</div>
                  <div className="text-sm text-gray-200">Team performance trends</div>
                </button>
                
                <button className="w-full bg-white/20 backdrop-blur-sm p-3 rounded-lg text-left hover:bg-white/30 transition-colors">
                  <div className="font-medium">Head-to-Head Stats</div>
                  <div className="text-sm text-gray-200">Historical matchup data</div>
                </button>
                
                <button className="w-full bg-white/20 backdrop-blur-sm p-3 rounded-lg text-left hover:bg-white/30 transition-colors">
                  <div className="font-medium">Weather Impact</div>
                  <div className="text-sm text-gray-200">Conditions effect analysis</div>
                </button>
              </div>
            </div>

            {/* Weekly Report Signup */}
            <div className="bg-gradient-to-br from-emerald to-navy rounded-2xl p-6 text-white text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Weekly Analysis Report</h3>
              <p className="text-gray-200 mb-4 text-sm">
                Get our comprehensive weekly analysis report delivered to your Telegram
              </p>
              <Link
                href="https://t.me/AussieBettingInsights"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-navy px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Join Channel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 