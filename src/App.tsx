import React, { useState } from 'react';
import { Sparkles, Moon, Sun, Zap, Globe, Brain } from 'lucide-react';
import { useSearch } from './hooks/useSearch';
import SearchInterface from './components/SearchInterface';
import SearchResults from './components/SearchResults';
import SearchHistory from './components/SearchHistory';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const {
    isSearching,
    currentResult,
    searchHistory,
    error,
    performSearch,
    clearHistory,
    clearCurrentResult
  } = useSearch();

  const handleSearch = async (query: string) => {
    await performSearch(query);
  };

  const handleFollowUpClick = (question: string) => {
    performSearch(question);
  };

  const handleHistoryClick = (query: string) => {
    performSearch(query);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${
                  darkMode ? 'from-purple-400 to-pink-400' : ''
                }`}>
                  Fus-Search Bot
                </h1>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Real-time web intelligence
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Status indicators */}
              <div className="hidden md:flex items-center space-x-4 text-xs">
                <div className={`flex items-center space-x-1 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  <Globe className="h-3 w-3" />
                  <span>Web Search</span>
                </div>
                <div className={`flex items-center space-x-1 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  <Zap className="h-3 w-3" />
                  <span>Real-time</span>
                </div>
                <div className={`flex items-center space-x-1 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  <Brain className="h-3 w-3" />
                  <span>AI Analysis</span>
                </div>
              </div>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                    : 'bg-purple-500/20 text-purple-700 hover:bg-purple-500/30'
                }`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!currentResult && (
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-4">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  Powered by Advanced AI
                </span>
              </div>
              <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Ask anything.
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Get intelligent answers.
                </span>
              </h1>
              <p className={`text-xl ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl mx-auto`}>
                I search the web in real-time, analyze multiple sources, and provide comprehensive answers with citations.
              </p>
            </div>
          </div>
        )}

        {/* Search Interface */}
        <SearchInterface
          onSearch={handleSearch}
          isSearching={isSearching}
          error={error}
          darkMode={darkMode}
        />

        {/* Search Results */}
        {currentResult && (
          <SearchResults
            result={currentResult}
            darkMode={darkMode}
            onFollowUpClick={handleFollowUpClick}
          />
        )}

        {/* Search History */}
        <SearchHistory
          history={searchHistory}
          darkMode={darkMode}
          onHistoryClick={handleHistoryClick}
          onClearHistory={clearHistory}
        />

        {/* Footer */}
        <footer className={`mt-16 text-center text-sm ${
          darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p>
            Fus-Search Bot combines real-time web search with advanced AI analysis to provide accurate, up-to-date information.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;