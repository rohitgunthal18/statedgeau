'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, Tag } from 'lucide-react';
import { searchService } from '@/lib/search';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showSuggestions?: boolean;
  onSelect?: (result: { type: 'post' | 'category'; id: string; url: string }) => void;
}

export default function SearchBar({ 
  className = '', 
  placeholder = 'Search analysis, previews and insights...',
  showSuggestions = true 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<Array<{ query: string; count: number }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Load trending searches
  useEffect(() => {
    const loadTrendingSearches = async () => {
      try {
        const trending = await searchService.getTrendingSearches(5);
        setTrendingSearches(trending);
      } catch (error) {
        console.error('Error loading trending searches:', error);
      }
    };

    loadTrendingSearches();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const autocomplete = await searchService.getAutocomplete(query.trim(), 5);
          setSuggestions(autocomplete);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error getting autocomplete:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to search history
    const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Navigate to search results
    const params = new URLSearchParams(searchParams);
    params.set('q', searchQuery);
    router.push(`/search?${params.toString()}`);
    
    setShowDropdown(false);
    setQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => {
            if (query.trim().length >= 2 || searchHistory.length > 0 || trendingSearches.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {showDropdown && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          )}

          {/* Search Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-150 flex items-center gap-2"
                >
                  <Search size={16} className="text-gray-400" />
                  <span className="text-gray-700">{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search History */}
          {!isLoading && searchHistory.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2 flex items-center gap-1">
                <Clock size={12} />
                Recent Searches
              </div>
              {searchHistory.slice(0, 5).map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-150 flex items-center gap-2"
                >
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-700">{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {!isLoading && trendingSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2 flex items-center gap-1">
                <TrendingUp size={12} />
                Trending
              </div>
              {trendingSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(item.query)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-150 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-gray-700">{item.query}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.count} searches</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Categories */}
          {!isLoading && suggestions.length === 0 && searchHistory.length === 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2">
                Popular Categories
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'AFL Analysis', slug: 'afl' },
                  { name: 'NRL Analysis', slug: 'nrl' },
                  { name: 'Racing Insights', slug: 'racing' },
                  { name: 'Cricket', slug: 'cricket' },
                ].map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => router.push(`/${category.slug}/`)}
                    className="px-3 py-2 text-sm text-left hover:bg-gray-50 rounded-md transition-colors duration-150"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && suggestions.length === 0 && searchHistory.length === 0 && trendingSearches.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <Search size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Start typing to search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 