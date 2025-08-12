"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Menu, 
  X, 
  TrendingUp, 
  ExternalLink,
  Shield,
  Star,
  Users,
  ChevronDown,
  Zap,
  Trophy,
  Heart,
  Bookmark,
  Film
} from "lucide-react";
import { NAVIGATION_ITEMS, POPULAR_SEARCHES } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  type: "post" | "category";
  url: string;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update liked and saved counts
  useEffect(() => {
    const updateCounts = () => {
      const liked = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      const saved = JSON.parse(localStorage.getItem('savedPosts') || '[]');
      setLikedCount(liked.length);
      setSavedCount(saved.length);
    };

    updateCounts();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCounts);
    
    // Custom event for same-page updates
    window.addEventListener('localStorageChange', updateCounts);
    
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('localStorageChange', updateCounts);
    };
  }, []);

  // Enhanced search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Quick search results - redirect to full search page for comprehensive results
    const mockResults: SearchResult[] = [
      { id: "1", title: `Search for "${query}" in AFL Analysis`, type: "category", url: `/search?q=${encodeURIComponent(query)}&category=afl-analysis` },
      { id: "2", title: `Search for "${query}" in NRL Analysis`, type: "category", url: `/search?q=${encodeURIComponent(query)}&category=nrl-analysis` },
      { id: "3", title: `Search for "${query}" in Horse Racing`, type: "category", url: `/search?q=${encodeURIComponent(query)}&category=horse-racing` },
      { id: "4", title: `View all results for "${query}"`, type: "post", url: `/search?q=${encodeURIComponent(query)}` }
    ];

    setSearchResults(mockResults);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/96 backdrop-blur-xl shadow-xl border-b border-gray-200/80"
          : "bg-white border-b border-gray-100"
      )}
    >
      {/* Trust Bar with Enhanced Design */}
      <div className="bg-gradient-to-r from-navy via-navy to-emerald text-white py-2 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center md:justify-between text-xs md:text-sm overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3 md:gap-6 flex-nowrap min-w-max">
              <div className="flex items-center gap-1 md:gap-2">
                <Shield className="w-3 h-3 md:w-4 md:h-4 text-golden flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">Independent & Unbiased</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-golden flex-shrink-0" />
                <span className="whitespace-nowrap">Trusted Platform</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <Trophy className="w-3 h-3 md:w-4 md:h-4 text-golden flex-shrink-0" />
                <span className="whitespace-nowrap">Data-Driven Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-navy via-emerald to-golden rounded-xl group-hover:scale-105 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-xl">SE</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-coral rounded-full flex items-center justify-center">
                <Zap className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-navy to-emerald bg-clip-text text-transparent">
                StatEdge AU
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-600 hidden sm:block">
                  Expert AFL, NRL & Racing Analysis
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-golden fill-current" />
                  <span className="text-xs font-medium text-golden">4.8</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <div key={item.href} className="relative group">
                {item.children ? (
                  <>
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-navy font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50">
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                    {/* Enhanced Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-3">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          {item.label}
                        </div>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-navy rounded-lg transition-colors group/item"
                          >
                            <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                              {child.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-1 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50",
                      item.isExternal
                        ? "text-emerald hover:text-emerald/80"
                        : "text-gray-700 hover:text-navy"
                    )}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                  >
                    <span>{item.label}</span>
                    {item.isExternal && <ExternalLink className="w-4 h-4" />}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Enhanced Search and Actions */}
          <div className="flex items-center space-x-2">
            {/* User Actions - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/liked-posts"
                className="relative p-2 text-gray-600 hover:text-coral transition-colors hover:bg-gray-50 rounded-lg"
                title="Liked Posts"
              >
                <Heart className="w-5 h-5" />
                {likedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {likedCount > 9 ? '9+' : likedCount}
                  </span>
                )}
              </Link>

              <Link
                href="/saved-posts"
                className="relative p-2 text-gray-600 hover:text-navy transition-colors hover:bg-gray-50 rounded-lg"
                title="Saved Posts"
              >
                <Bookmark className="w-5 h-5" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-navy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {savedCount > 9 ? '9+' : savedCount}
                  </span>
                )}
              </Link>

              <Link
                href="/stories"
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors hover:bg-gray-50 rounded-lg"
                title="Web Stories"
              >
                <Film className="w-5 h-5" />
              </Link>
            </div>

            {/* Enhanced Search Button */}
            <button
              onClick={toggleSearch}
              className="relative p-3 text-gray-600 hover:text-navy transition-colors hover:bg-gray-50 rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
              {isScrolled && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-coral rounded-full"></div>
              )}
            </button>

            {/* Enhanced Telegram CTA - Desktop */}
            <Link
              href="https://t.me/+K1GjvOY331JhNGM1"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium group"
            >
              <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Join 10K+ Users</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </Link>

            {/* Enhanced Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-3 text-gray-600 hover:text-navy transition-colors hover:bg-gray-50 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        {isSearchOpen && (
          <div className="py-6 border-t border-gray-100">
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search AFL tips, NRL analysis, horse racing..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all duration-300 bg-gray-50 focus:bg-white"
                  autoFocus
                />
                <Search className="absolute right-4 top-4.5 w-6 h-6 text-gray-400" />
              </div>

              {/* Enhanced Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Search Results
                    </div>
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={result.url}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 rounded-xl transition-colors group"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <div>
                          <span className="font-medium group-hover:text-navy transition-colors">
                            {result.title}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              result.type === "post" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-emerald-100 text-emerald-700"
                            )}>
                              {result.type === "post" ? "Article" : "Category"}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Popular Searches */}
              {searchQuery === "" && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-coral" />
                      Trending Searches
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {POPULAR_SEARCHES.slice(0, 5).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search.query)}
                          className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <span className="group-hover:text-navy transition-colors">
                            {search.query}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              {search.count.toLocaleString()}
                            </span>
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              search.trend === 'up' ? 'bg-emerald' : 
                              search.trend === 'down' ? 'bg-coral' : 'bg-gray-400'
                            )} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Mobile Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-navy">50K+</div>
                <div className="text-xs text-gray-600">Trusted Users</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-emerald">85%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {NAVIGATION_ITEMS.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <div>
                    <div className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span>{item.label}</span>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                    <div className="pl-4 space-y-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block text-gray-600 hover:text-navy transition-colors py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block font-medium transition-colors py-2",
                      item.isExternal
                        ? "text-emerald hover:text-emerald/80"
                        : "text-gray-700 hover:text-navy"
                    )}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.isExternal && <ExternalLink className="w-4 h-4" />}
                    </span>
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-3">Your Activity</div>
              <div className="grid grid-cols-3 gap-3">
                <Link
                  href="/liked-posts"
                  className="flex flex-col items-center gap-2 p-3 bg-coral/10 text-coral rounded-lg hover:bg-coral/20 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="relative">
                    <Heart className="w-6 h-6" />
                    {likedCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-coral text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {likedCount > 9 ? '9+' : likedCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">Liked</span>
                </Link>

                <Link
                  href="/saved-posts"
                  className="flex flex-col items-center gap-2 p-3 bg-navy/10 text-navy rounded-lg hover:bg-navy/20 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="relative">
                    <Bookmark className="w-6 h-6" />
                    {savedCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-navy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {savedCount > 9 ? '9+' : savedCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">Saved</span>
                </Link>

                <Link
                  href="/stories"
                  className="flex flex-col items-center gap-2 p-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Film className="w-6 h-6" />
                  <span className="text-xs font-medium">Stories</span>
                </Link>
              </div>
            </div>

            {/* Enhanced Mobile Telegram CTA */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="https://t.me/+K1GjvOY331JhNGM1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                <span>Join Free Channel - 10K+ Users</span>
                <ExternalLink className="w-4 h-4 opacity-75" />
              </Link>
              <p className="text-xs text-gray-500 text-center mt-2">
                🔥 Live tips • 📊 Expert analysis • 🏆 Proven results
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 