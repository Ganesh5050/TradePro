export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: 'market' | 'stock' | 'trending' | 'events';
  imageUrl?: string;
}

class NewsService {
  private mockNews: NewsArticle[] = [
    {
      id: '1',
      title: 'NIFTY 50 Reaches New All-Time High',
      description: 'Indian benchmark index NIFTY 50 crossed 20,000 mark for the first time.',
      url: '#',
      source: 'Economic Times',
      publishedAt: new Date().toISOString(),
      category: 'market'
    },
    {
      id: '2',
      title: 'Tech Stocks Rally on Strong Q4 Results',
      description: 'Major IT companies report better-than-expected earnings.',
      url: '#',
      source: 'Business Standard',
      publishedAt: new Date().toISOString(),
      category: 'stock'
    },
    {
      id: '3',
      title: 'RBI Maintains Repo Rate at 6.5%',
      description: 'Reserve Bank of India keeps key interest rates unchanged.',
      url: '#',
      source: 'Mint',
      publishedAt: new Date().toISOString(),
      category: 'events'
    }
  ];
  
  async getNews(category?: string): Promise<NewsArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (category) {
      return this.mockNews.filter(news => news.category === category);
    }
    
    return this.mockNews;
  }
  
  async getNewsById(id: string): Promise<NewsArticle | null> {
    return this.mockNews.find(news => news.id === id) || null;
  }
}

export const newsService = new NewsService();
