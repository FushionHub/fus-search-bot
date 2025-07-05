export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  favicon?: string;
  publishedDate?: string;
  relevanceScore?: number;
}

export interface SearchResult {
  id: string;
  query: string;
  answer: string;
  sources: Source[];
  followUpQuestions: string[];
  timestamp: Date;
  searchTime: number;
  confidence: number;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  resultId?: string;
}

export interface WebSearchResponse {
  organic_results: Array<{
    title: string;
    link: string;
    snippet: string;
    displayed_link: string;
    date?: string;
  }>;
  search_metadata: {
    total_time_taken: number;
  };
}

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  publishedDate?: string;
  author?: string;
}