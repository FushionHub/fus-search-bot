import { useState, useCallback } from 'react';
import { SearchResult, SearchHistory, Source } from '../types';
import { WebSearchService } from '../services/webSearch';
import { AIService } from '../services/aiService';

export const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const webSearchService = WebSearchService.getInstance();
  const aiService = AIService.getInstance();

  const performSearch = useCallback(async (query: string): Promise<SearchResult | null> => {
    if (!query.trim()) return null;

    setIsSearching(true);
    setError(null);
    const startTime = Date.now();

    try {
      // Step 1: Search the web for relevant sources
      console.log('🔍 Searching the web...');
      const sources = await webSearchService.searchWeb(query, 8);
      
      if (sources.length === 0) {
        console.log('No sources found, but continuing with AI response...');
      }

      // Step 2: Scrape content from top sources (gracefully handle failures)
      console.log('📄 Scraping content from sources...');
      const scrapingPromises = sources.slice(0, 3).map(source => 
        webSearchService.scrapeContent(source.url).catch((error) => {
          console.log(`Failed to scrape ${source.url}:`, error.message);
          return '';
        })
      );
      const scrapedContent = await Promise.all(scrapingPromises);

      // Step 3: Generate AI-powered answer
      console.log('🤖 Generating AI response...');
      const aiResponse = await aiService.generateAnswer(query, sources, scrapedContent);

      const searchTime = Date.now() - startTime;

      const result: SearchResult = {
        id: Date.now().toString(),
        query,
        answer: aiResponse.answer,
        sources: sources.slice(0, 6), // Limit to top 6 sources
        followUpQuestions: aiResponse.followUpQuestions,
        timestamp: new Date(),
        searchTime,
        confidence: aiResponse.confidence
      };

      // Add to search history
      const historyEntry: SearchHistory = {
        id: Date.now().toString(),
        query,
        timestamp: new Date(),
        resultId: result.id
      };

      setSearchHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 searches
      setCurrentResult(result);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, [webSearchService, aiService]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const clearCurrentResult = useCallback(() => {
    setCurrentResult(null);
    setError(null);
  }, []);

  return {
    isSearching,
    currentResult,
    searchHistory,
    error,
    performSearch,
    clearHistory,
    clearCurrentResult
  };
};