import React, { useState } from 'react';
import { Search, Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
  error: string | null;
  darkMode: boolean;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  isSearching,
  error,
  darkMode
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "What are the latest breakthroughs in quantum computing?",
    "How does climate change affect marine ecosystems?",
    "What is the future of renewable energy technology?",
    "Explain the concept of artificial general intelligence",
    "What are the health benefits of intermittent fasting?",
    "How do neural networks learn from data?",
    "What are the implications of CRISPR gene editing?",
    "How is blockchain technology changing finance?",
    "What are the latest developments in space exploration?",
    "How does machine learning impact healthcare?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative group ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-white/70 border-white'
        } backdrop-blur-xl rounded-2xl border border-opacity-20 shadow-2xl transition-all duration-300 hover:shadow-3xl ${
          error ? 'ring-2 ring-red-500/50' : ''
        }`}>
          <div className="flex items-center p-6">
            <div className="relative mr-4">
              {isSearching ? (
                <Loader2 className={`h-6 w-6 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                } animate-spin`} />
              ) : (
                <Search className={`h-6 w-6 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              )}
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Ask anything... I'll search the web and think deeply about it"
              className={`flex-1 text-lg ${
                darkMode 
                  ? 'text-white placeholder-gray-400' 
                  : 'text-gray-900 placeholder-gray-500'
              } bg-transparent outline-none`}
              disabled={isSearching}
            />
            
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium transition-all duration-200 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="px-6 pb-4">
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && !isSearching && (
        <div className={`mt-4 p-6 ${
          darkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-white/70 border-white'
        } backdrop-blur-xl rounded-2xl border border-opacity-20 shadow-xl`}>
          <h3 className={`text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          } mb-4`}>Try asking about...</h3>
          <div className="grid gap-2 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`text-left p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-slate-700/50' 
                    : 'text-gray-700 hover:bg-purple-50'
                } group text-sm`}
              >
                <div className="flex items-center justify-between">
                  <span>{suggestion}</span>
                  <Sparkles className={`h-3 w-3 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  } opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;