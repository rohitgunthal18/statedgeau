import { Metadata } from "next";
import { 
  Film, 
  Play, 
  Star, 
  Clock, 
  Eye,
  Share2,
  Bookmark,
  Bell,
  Users,
  Zap,
  Sparkles,
  Calendar,
  ChevronRight,
  ExternalLink,
  Gift,
  Rocket,
  Heart,
  TrendingUp,
  Target
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Web Stories - Coming Soon | Aussie Insights",
  description: "Interactive web stories featuring AFL, NRL, horse racing and cricket content. Engaging visual storytelling coming soon to Aussie Insights.",
  keywords: ["web stories", "interactive content", "AFL stories", "NRL stories", "racing stories", "cricket stories"],
};

// Mock data for preview stories
const PREVIEW_STORIES = [
  {
    id: "1",
    title: "AFL Grand Final Race: Who Will Make September?",
    description: "An interactive journey through the top 8 ladder positions with live odds and expert predictions",
    coverImage: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=700&fit=crop&auto=format&q=80",
    duration: "2-3 min",
    slides: 8,
    sport: "AFL",
    status: "preview"
  },
  {
    id: "2",
    title: "Melbourne Cup: International Raiders Guide",
    description: "Meet the overseas horses set to challenge for Australia's greatest race",
    coverImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=700&fit=crop&auto=format&q=80",
    duration: "3-4 min", 
    slides: 12,
    sport: "Racing",
    status: "preview"
  },
  {
    id: "3",
    title: "NRL Finals Fever: Path to the Grand Final",
    description: "Breaking down each team's journey and key matchups in the NRL finals series",
    coverImage: "https://images.unsplash.com/photo-1570498839593-e565b39455fc?w=400&h=700&fit=crop&auto=format&q=80",
    duration: "2-3 min",
    slides: 10,
    sport: "NRL",
    status: "preview"
  },
  {
    id: "4",
    title: "Cricket World Cup Legends: Australia's Heroes",
    description: "Celebrating the greatest moments from Australia's cricket champions",
    coverImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=700&fit=crop&auto=format&q=80",
    duration: "4-5 min",
    slides: 15,
    sport: "Cricket",
    status: "preview"
  },
  {
    id: "5",
    title: "Tennis Grand Slam: Australian Open Preview",
    description: "Inside look at the players, courts, and drama of Australia's premier tennis event",
    coverImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=700&fit=crop&auto=format&q=80",
    duration: "3-4 min",
    slides: 12,
    sport: "Tennis",
    status: "preview"
  },
  {
    id: "6",
    title: "Basketball NBL Championship Chase",
    description: "Following the intense competition in Australia's National Basketball League",
    coverImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=700&fit=crop&auto=format&q=80",
    duration: "3-4 min",
    slides: 11,
    sport: "Basketball",
    status: "preview"
  }
];

const UPCOMING_FEATURES = [
  {
    icon: Play,
    title: "Interactive Stories",
    description: "Tap through engaging visual content with betting insights and analysis"
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Live odds and statistics embedded directly in story content"
  },
  {
    icon: Share2,
    title: "Social Sharing",
    description: "Share individual story frames or entire stories across social platforms"
  },
  {
    icon: Bookmark,
    title: "Save & Revisit",
    description: "Bookmark your favorite stories and continue where you left off"
  },
  {
    icon: Bell,
    title: "Story Notifications",
    description: "Get notified when new stories are published for your favorite sports"
  },
  {
    icon: Target,
    title: "Personalized Content",
    description: "Stories tailored to your betting interests and favorite teams"
  }
];

const STORY_CATEGORIES = [
  { name: "AFL Stories", count: "12+", color: "orange", icon: "🏈" },
  { name: "NRL Stories", count: "8+", color: "blue", icon: "🏈" },
  { name: "Racing Stories", count: "10+", color: "green", icon: "🏇" },
  { name: "Cricket Stories", count: "6+", color: "purple", icon: "🏏" },
  { name: "Multi-Sport", count: "5+", color: "red", icon: "🏆" }
];

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-purple-300/20 rounded-full animate-bounce"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <span className="text-sm font-medium">Launching Soon</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Web Stories
              <span className="block text-3xl lg:text-5xl text-yellow-300 mt-2">
                Interactive Betting Content
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get ready for an immersive new way to consume betting insights. 
              Interactive visual stories combining data, analysis, and entertainment.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-sm text-gray-300">Stories Ready</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">5</div>
                <div className="text-sm text-gray-300">Sport Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">Interactive</div>
                <div className="text-sm text-gray-300">Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">Mobile First</div>
                <div className="text-sm text-gray-300">Design</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="https://t.me/+K1GjvOY331JhNGM1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Bell className="w-5 h-5" />
                Get Launch Alerts
              </Link>
              <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border border-white/30 hover:bg-white/30 transition-all duration-300">
                <Eye className="w-5 h-5" />
                Preview Stories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Coming Soon Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-lg font-bold mb-2">
              <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
              <span>🚀 COMING SOON: Interactive Web Stories</span>
              <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
            </div>
            <p className="text-purple-100 text-sm max-w-2xl mx-auto">
              Revolutionary visual storytelling for sports betting analysis. Join our Telegram channel for exclusive early access!
            </p>
            <div className="mt-4">
              <Link
                href="https://t.me/+K1GjvOY331JhNGM1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm"
              >
                <Users className="w-4 h-4" />
                Join 10K+ Members for Early Access
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Story Previews */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Film className="w-6 h-6 text-purple-500" />
                Story Previews
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                  Coming Soon
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PREVIEW_STORIES.map((story) => (
                  <div
                    key={story.id}
                    className="relative group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    {/* Story Card */}
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl overflow-hidden aspect-[9/16] shadow-xl">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-70"
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                      
                      {/* Sport badge */}
                      <div className="absolute top-4 left-4">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold text-white",
                          story.sport === "AFL" ? "bg-orange-500" :
                          story.sport === "NRL" ? "bg-blue-500" :
                          story.sport === "Racing" ? "bg-green-500" : "bg-purple-500"
                        )}>
                          {story.sport}
                        </div>
                      </div>

                      {/* Coming Soon badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                          Preview
                        </div>
                      </div>

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>

                      {/* Story info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                          {story.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                          {story.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{story.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Film className="w-3 h-3" />
                              <span>{story.slides} slides</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Gift className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-sm font-medium">Preview Available Soon!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <Rocket className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-purple-900 mb-2">
                    Full Library Coming Soon!
                  </h3>
                  <p className="text-purple-700 text-sm mb-4">
                    We're crafting 50+ interactive stories covering every aspect of Australian sports betting.
                  </p>
                  <Link
                    href="https://t.me/+K1GjvOY331JhNGM1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    Get Notified First
                  </Link>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                What's Coming
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {UPCOMING_FEATURES.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-500" />
                Launch Timeline
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Week 1: Beta Testing</h4>
                    <p className="text-gray-600 text-sm">Selected users get early access to test core functionality</p>
                    <span className="text-xs text-emerald-600 font-medium">✓ Completed</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Week 2: Content Creation</h4>
                    <p className="text-gray-600 text-sm">Finalizing initial story library and interactive elements</p>
                    <span className="text-xs text-yellow-600 font-medium">🔄 In Progress</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Week 3: Public Launch</h4>
                    <p className="text-gray-600 text-sm">Full web stories feature goes live for all users</p>
                    <span className="text-xs text-purple-600 font-medium">🚀 Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Story Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-golden" />
                Story Categories
              </h3>
              
              <div className="space-y-4">
                {STORY_CATEGORIES.map((category, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-500">{category.count} stories planned</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Early Access */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6" />
                Early Access VIP
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-sm">First access to new stories</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-sm">Exclusive betting insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-sm">Beta feature previews</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span className="text-sm">Priority customer support</span>
                </div>
              </div>
              
              <Link
                href="https://t.me/+K1GjvOY331JhNGM1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full bg-white text-purple-600 px-4 py-3 rounded-lg font-semibold justify-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5" />
                Join VIP List
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                Development Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Stories Created</span>
                  <span className="font-bold text-xl text-purple-600">52</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Beta Testers</span>
                  <span className="font-bold text-xl text-emerald-600">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">VIP Signups</span>
                  <span className="font-bold text-xl text-golden">1,438</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-bold text-xl text-navy">94%</span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">🎯</div>
                  <div className="text-sm text-gray-600">Ready for launch!</div>
                </div>
              </div>
            </div>

            {/* Join Community */}
            <div className="bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl p-6 text-white text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Be Part of the Launch</h3>
              <p className="text-gray-200 mb-4 text-sm">
                Join our community and be the first to experience the future of sports betting content
              </p>
              <div className="space-y-3">
                <Link
                  href="https://t.me/+K1GjvOY331JhNGM1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full bg-white text-emerald-600 px-4 py-3 rounded-lg font-semibold justify-center hover:shadow-lg transition-all duration-300"
                >
                  <Users className="w-5 h-5" />
                  Join Telegram Channel
                </Link>
                <p className="text-xs text-gray-300">
                  Get instant updates • Share feedback • Connect with fellow punters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 