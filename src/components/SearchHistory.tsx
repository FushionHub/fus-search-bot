import React from 'react';
import { Clock, Search } from 'lucide-react';
import { SearchHistory as SearchHistoryType } from '../types';

interface SearchHistoryProps {
  history: SearchHistoryType[];
  darkMode: boolean;
  onHistoryClick: (query: string) => void;
  onClearHistory: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  darkMode,
  onHistoryClick,
  onClearHistory
}) => {
  if (history.length === 0) return null;

  return (
    <div className={`mt-8 p-6 ${
      darkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white/70 border-white'
    } backdrop-blur-xl rounded-2xl border border-opacity-20 shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        } flex items-center`}>
          <Clock className={`h-5 w-5 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          } mr-2`} />
          Recent searches
        </h3>
        <button
          onClick={onClearHistory}
          className={`text-sm ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          } transition-colors`}
        >
          Clear all
        </button>
      </div>
      
      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onHistoryClick(item.query)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
              darkMode 
                ? 'text-gray-300 hover:bg-slate-700/50' 
                : 'text-gray-700 hover:bg-purple-50'
            } group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Search className={`h-4 w-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <span className="text-sm">{item.query}</span>
              </div>
              <span className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {item.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;