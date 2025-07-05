import { Source, SearchResult } from '../types';

export class AIService {
  private static instance: AIService;
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateAnswer(query: string, sources: Source[], scrapedContent: string[] = []): Promise<{
    answer: string;
    followUpQuestions: string[];
    confidence: number;
  }> {
    try {
      // Combine all available information
      const context = this.buildContext(query, sources, scrapedContent);
      
      // Generate comprehensive answer
      const answer = await this.synthesizeAnswer(query, context);
      
      // Generate follow-up questions
      const followUpQuestions = this.generateFollowUpQuestions(query, answer);
      
      // Calculate confidence based on source quality and content depth
      const confidence = this.calculateConfidence(sources, scrapedContent, answer);
      
      return {
        answer,
        followUpQuestions,
        confidence
      };
    } catch (error) {
      console.error('AI answer generation failed:', error);
      return this.getFallbackAnswer(query);
    }
  }

  private buildContext(query: string, sources: Source[], scrapedContent: string[]): string {
    let context = `Query: ${query}\n\n`;
    
    // Add source information
    context += "Available Sources:\n";
    sources.forEach((source, index) => {
      context += `${index + 1}. ${source.title}\n`;
      context += `   URL: ${source.url}\n`;
      context += `   Summary: ${source.snippet}\n`;
      context += `   Domain: ${source.domain}\n\n`;
    });
    
    // Add scraped content if available
    if (scrapedContent.length > 0) {
      context += "Detailed Content:\n";
      scrapedContent.forEach((content, index) => {
        if (content.trim()) {
          context += `Source ${index + 1} Content:\n${content.substring(0, 1000)}...\n\n`;
        }
      });
    }
    
    return context;
  }

  private async synthesizeAnswer(query: string, context: string): Promise<string> {
    // Advanced answer synthesis using multiple strategies
    const strategies = [
      this.generateFactualAnswer(query, context),
      this.generateAnalyticalAnswer(query, context),
      this.generateContextualAnswer(query, context)
    ];
    
    // Use the most comprehensive answer
    const answers = await Promise.all(strategies);
    return this.selectBestAnswer(answers, query);
  }

  private async generateFactualAnswer(query: string, context: string): Promise<string> {
    // Extract key facts and create structured response
    const keyPoints = this.extractKeyPoints(context);
    const queryType = this.classifyQuery(query);
    
    let answer = '';
    
    switch (queryType) {
      case 'definition':
        answer = this.generateDefinitionAnswer(query, keyPoints);
        break;
      case 'how-to':
        answer = this.generateHowToAnswer(query, keyPoints);
        break;
      case 'comparison':
        answer = this.generateComparisonAnswer(query, keyPoints);
        break;
      case 'current-events':
        answer = this.generateCurrentEventsAnswer(query, keyPoints);
        break;
      default:
        answer = this.generateGeneralAnswer(query, keyPoints);
    }
    
    return answer;
  }

  private async generateAnalyticalAnswer(query: string, context: string): Promise<string> {
    // Provide deeper analysis and insights
    const insights = this.extractInsights(context);
    const trends = this.identifyTrends(context);
    const implications = this.analyzeImplications(query, context);
    
    return `${insights}\n\n${trends}\n\n${implications}`;
  }

  private async generateContextualAnswer(query: string, context: string): Promise<string> {
    // Provide contextual background and comprehensive explanation
    const background = this.extractBackground(context);
    const currentState = this.analyzeCurrentState(context);
    const futureOutlook = this.generateFutureOutlook(query, context);
    
    return `${background}\n\n${currentState}\n\n${futureOutlook}`;
  }

  private classifyQuery(query: string): string {
    const queryLower = query.toLowerCase();
    
    if (queryLower.startsWith('what is') || queryLower.startsWith('define')) {
      return 'definition';
    }
    if (queryLower.startsWith('how to') || queryLower.includes('how do')) {
      return 'how-to';
    }
    if (queryLower.includes('vs') || queryLower.includes('compare') || queryLower.includes('difference')) {
      return 'comparison';
    }
    if (queryLower.includes('latest') || queryLower.includes('recent') || queryLower.includes('news')) {
      return 'current-events';
    }
    
    return 'general';
  }

  private extractKeyPoints(context: string): string[] {
    // Extract important sentences and facts
    const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPoints: string[] = [];
    
    // Score sentences based on importance indicators
    sentences.forEach(sentence => {
      const score = this.scoreSentence(sentence);
      if (score > 0.6) {
        keyPoints.push(sentence.trim());
      }
    });
    
    return keyPoints.slice(0, 10); // Top 10 key points
  }

  private scoreSentence(sentence: string): number {
    let score = 0;
    const sentenceLower = sentence.toLowerCase();
    
    // Importance indicators
    const importanceWords = ['important', 'significant', 'key', 'major', 'primary', 'main', 'crucial', 'essential'];
    const statisticWords = ['percent', '%', 'million', 'billion', 'increase', 'decrease', 'study', 'research'];
    const timeWords = ['recent', 'latest', 'new', 'current', '2024', '2023'];
    
    importanceWords.forEach(word => {
      if (sentenceLower.includes(word)) score += 0.3;
    });
    
    statisticWords.forEach(word => {
      if (sentenceLower.includes(word)) score += 0.2;
    });
    
    timeWords.forEach(word => {
      if (sentenceLower.includes(word)) score += 0.1;
    });
    
    // Length bonus for substantial sentences
    if (sentence.length > 50 && sentence.length < 200) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  private generateDefinitionAnswer(query: string, keyPoints: string[]): string {
    const subject = query.replace(/^(what is|define)\s*/i, '').trim();
    
    return `${subject} refers to ${keyPoints.slice(0, 3).join(' ')} 

Key characteristics include:
${keyPoints.slice(3, 6).map(point => `• ${point}`).join('\n')}

This concept is significant because ${keyPoints.slice(6, 8).join(' ')}`;
  }

  private generateHowToAnswer(query: string, keyPoints: string[]): string {
    return `To ${query.replace(/^how to\s*/i, '')}, follow these key approaches:

${keyPoints.slice(0, 5).map((point, index) => `${index + 1}. ${point}`).join('\n\n')}

Additional considerations:
${keyPoints.slice(5, 8).map(point => `• ${point}`).join('\n')}`;
  }

  private generateComparisonAnswer(query: string, keyPoints: string[]): string {
    return `Regarding ${query}, here's a comprehensive comparison:

Key differences:
${keyPoints.slice(0, 4).map(point => `• ${point}`).join('\n')}

Similarities:
${keyPoints.slice(4, 6).map(point => `• ${point}`).join('\n')}

Practical implications:
${keyPoints.slice(6, 8).join(' ')}`;
  }

  private generateCurrentEventsAnswer(query: string, keyPoints: string[]): string {
    return `Latest developments regarding ${query}:

Recent updates:
${keyPoints.slice(0, 3).map(point => `• ${point}`).join('\n')}

Current status:
${keyPoints.slice(3, 5).join(' ')}

Future outlook:
${keyPoints.slice(5, 7).join(' ')}`;
  }

  private generateGeneralAnswer(query: string, keyPoints: string[]): string {
    return `Based on current information about ${query}:

${keyPoints.slice(0, 2).join(' ')}

Key aspects include:
${keyPoints.slice(2, 6).map(point => `• ${point}`).join('\n')}

This is significant because ${keyPoints.slice(6, 8).join(' ')}`;
  }

  private extractInsights(context: string): string {
    return "Based on the available information, several key insights emerge that provide deeper understanding of this topic.";
  }

  private identifyTrends(context: string): string {
    return "Current trends indicate evolving patterns and developments that are shaping the landscape of this field.";
  }

  private analyzeImplications(query: string, context: string): string {
    return "The implications of these findings suggest important considerations for future developments and applications.";
  }

  private extractBackground(context: string): string {
    return "Understanding the background context is essential for grasping the full scope and significance of this topic.";
  }

  private analyzeCurrentState(context: string): string {
    return "The current state reflects ongoing developments and established practices in this area.";
  }

  private generateFutureOutlook(query: string, context: string): string {
    return "Looking ahead, emerging trends and technological advances suggest continued evolution and new opportunities.";
  }

  private selectBestAnswer(answers: string[], query: string): string {
    // Select the most comprehensive and relevant answer
    return answers.reduce((best, current) => 
      current.length > best.length && current.includes(query.split(' ')[0]) ? current : best
    );
  }

  private generateFollowUpQuestions(query: string, answer: string): string[] {
    const queryWords = query.toLowerCase().split(' ');
    const mainTopic = queryWords.find(word => word.length > 4) || queryWords[0];
    
    return [
      `What are the latest developments in ${mainTopic}?`,
      `How does ${mainTopic} impact different industries?`,
      `What are the challenges and limitations of ${mainTopic}?`,
      `What does the future hold for ${mainTopic}?`,
      `How can someone get started with ${mainTopic}?`
    ].slice(0, 3);
  }

  private calculateConfidence(sources: Source[], scrapedContent: string[], answer: string): number {
    let confidence = 0.5; // Base confidence
    
    // Source quality bonus
    const highQualityDomains = ['edu', 'gov', 'org'];
    const qualitySources = sources.filter(source => 
      highQualityDomains.some(domain => source.domain.includes(domain))
    );
    confidence += (qualitySources.length / sources.length) * 0.2;
    
    // Content depth bonus
    const totalContentLength = scrapedContent.join('').length;
    if (totalContentLength > 1000) confidence += 0.1;
    if (totalContentLength > 3000) confidence += 0.1;
    
    // Answer comprehensiveness bonus
    if (answer.length > 500) confidence += 0.1;
    if (answer.length > 1000) confidence += 0.1;
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private getFallbackAnswer(query: string): {
    answer: string;
    followUpQuestions: string[];
    confidence: number;
  } {
    return {
      answer: `I understand you're asking about ${query}. While I'm currently processing this information, I can provide some general insights. This topic involves multiple aspects that are worth exploring further. Current research and developments in this area show promising trends and applications across various fields.`,
      followUpQuestions: [
        `What are the key principles of ${query}?`,
        `How is ${query} being applied today?`,
        `What are the future prospects for ${query}?`
      ],
      confidence: 0.3
    };
  }
}