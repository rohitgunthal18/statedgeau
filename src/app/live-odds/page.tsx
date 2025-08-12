import { Metadata } from "next";
import { 
  Activity
} from "lucide-react";
import { LiveOddsContent } from "@/components/live-odds/LiveOddsContent";

export const metadata: Metadata = {
  title: "Live Betting Odds & Real-Time Markets | Aussie Insights",
  description: "Live betting odds comparison across AFL, NRL, horse racing and cricket. Real-time market movements and best value betting opportunities.",
  keywords: ["live odds", "betting odds", "odds comparison", "real-time betting", "AFL odds", "NRL odds", "racing odds"],
};

export default function LiveOddsPage() {
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
                  <Activity className="w-5 h-5 text-golden animate-pulse" />
                  <span className="text-sm font-medium">Live Market Updates</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Live Betting Odds
              <span className="block text-3xl lg:text-5xl text-golden mt-2">
                Real-Time Market Intelligence
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Track live odds movements, compare bookmaker prices, and discover value opportunities 
              across AFL, NRL, horse racing and cricket markets.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">Live</div>
                <div className="text-sm text-gray-300">Real-Time Data</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">15+</div>
                <div className="text-sm text-gray-300">Bookmakers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">24/7</div>
                <div className="text-sm text-gray-300">Live Updates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-golden">30sec</div>
                <div className="text-sm text-gray-300">Refresh Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Odds Content - Client Component */}
      <LiveOddsContent />
    </div>
  );
} 