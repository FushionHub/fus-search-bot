import React, { useState, useEffect } from 'react';
import { BookOpen, Globe, ExternalLink, ArrowRight, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { SearchResult } from '../types';

interface SearchResultsProps {
  result: SearchResult;
  darkMode: boolean;
  onFollowUpClick: (question: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  result,
  darkMode,
  onFollowUpClick
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const text = result.answer;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [result.answer]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500';
    if (confidence >= 0.6) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High confidence';
    if (confidence >= 0.6) return 'Medium confidence';
    return 'Lower confidence';
  };

  return (
    <div className="space-y-6">
      {/* Answer Card */}
      <div className={`p-8 ${
        darkMode 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white/70 border-white'
      } backdrop-blur-xl rounded-2xl border border-opacity-20 shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className={`h-5 w-5 ${
              darkMode ? 'text-purple-400' : 'text-purple-600'
            } mr-2`} />
            <h2 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {result.query}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-1 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{(result.searchTime / 1000).toFixed(1)}s</span>
            </div>
            
            <div className={`flex items-center space-x-1 ${getConfidenceColor(result.confidence)}`}>
              <CheckCircle className="h-4 w-4" />
              <span>{getConfidenceText(result.confidence)}</span>
            </div>
          </div>
        </div>
        
        <div className={`prose prose-lg max-w-none ${
          darkMode 
            ? 'prose-invert prose-purple' 
            : 'prose-gray'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">
            {displayedText}
            {isTyping && (
              <span className="animate-pulse ml-1 text-purple-500">|</span>
            )}
          </p>
        </div>
      </div>

      {/* Sources */}
      <div className={`p-6 ${
        darkMode 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white/70 border-white'
      } backdrop-blur-xl rounded-2xl border border-opacity-20 shadow-xl`}>
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        } mb-4 flex items-center`}>
          <Globe className={`h-5 w-5 ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          } mr-2`} />
          Sources ({result.sources.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.sources.map((source, index) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-xl border transition-all duration-200 group ${
                darkMode 
                  ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' 
                  : 'bg-white/50 border-gray-200 hover:bg-white'
              } hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    #{index + 1}
                  </span>
                  {source.relevanceScore && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">
                        {Math.round(source.relevanceScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                <ExternalLink className={`h-4 w-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              
              <h4 className={`font-medium text-sm ${
                darkMode ? 'text-white' : 'text-gray-900'
              } group-hover:text-purple-600 transition-colors mb-2 line-clamp-2`}>
                {source.title}
              </h4>
              
              <p className={`text-xs ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-2 line-clamp-3`}>
                {source.snippet}
              </p>
              
              <div className="flex items-center justify-between">
                <p className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {source.domain}
                </p>
                {source.publishedDate && (
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {source.publishedDate}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Follow-up Questions */}
      <div className={`p-6 ${
        darkMode 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white/70 border-white'
      } backdrop-blur-xl rounded-2xl border border-opacity-20 shadow-xl`}>
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-900'
        } mb-4`}>
          Continue exploring
        </h3>
        <div className="space-y-2">
          {result.followUpQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => onFollowUpClick(question)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-300 hover:bg-slate-700/50 border border-slate-600/50' 
                  : 'text-gray-700 hover:bg-purple-50 border border-purple-100'
              } group hover:border-purple-300`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{question}</span>
                <ArrowRight className={`h-4 w-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                } opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;