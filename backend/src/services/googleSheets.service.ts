
import axios from 'axios';
import { config } from '../config/env';
import { Stock } from '../types';

// Configure axios to handle Google Sheets properly
axios.defaults.maxRedirects = 5;
axios.defaults.validateStatus = (status) => status >= 200 && status < 400;

class GoogleSheetsService {
  private stocksCache: Stock[] = [];
  private indicesCache: any[] = [];
  private lastStocksFetch = 0;
  private lastIndicesFetch = 0;
  private CACHE_DURATION = 30000; // 30 seconds

  async fetchStocks(): Promise<Stock[]> {
    const now = Date.now();
    if (this.stocksCache.length > 0 && (now - this.lastStocksFetch) < this.CACHE_DURATION) {
      return this.stocksCache;
    }

    try {
      console.log('📊 Fetching stocks from Google Sheets...');
      console.log('URL:', config.googleSheets.stocksUrl);
      
      const response = await axios.get(config.googleSheets.stocksUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/csv,text/plain,*/*'
        },
        timeout: 10000
      });
      
      console.log('Response status:', response.status);
      console.log('Response data type:', typeof response.data);
      console.log('Response data length:', response.data?.length || 0);
      
      if (typeof response.data === 'string' && response.data.includes('SYMBOL')) {
        const stocks = this.parseStocksCSV(response.data);
        this.stocksCache = stocks;
        this.lastStocksFetch = now;
        console.log(`✅ Fetched ${stocks.length} stocks`);
        return stocks;
      } else {
        console.error('❌ Invalid response format. Response preview:', response.data?.substring(0, 200));
        return this.stocksCache;
      }
    } catch (error: any) {
      console.error('❌ Error fetching stocks:', error.message);
      console.error('Error details:', error.code || error.response?.status || 'Unknown');
      return this.stocksCache;
    }
  }

  async fetchIndices(): Promise<any[]> {
    const now = Date.now();
    if (this.indicesCache.length > 0 && (now - this.lastIndicesFetch) < this.CACHE_DURATION) {
      return this.indicesCache;
    }

    try {
      console.log('📈 Fetching indices from Google Sheets...');
      console.log('URL:', config.googleSheets.indicesUrl);
      
      const response = await axios.get(config.googleSheets.indicesUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/csv,text/plain,*/*'
        },
        timeout: 10000
      });
      
      console.log('Response status:', response.status);
      console.log('Response data type:', typeof response.data);
      console.log('Response data length:', response.data?.length || 0);
      
      if (typeof response.data === 'string') {
        const indices = this.parseIndicesCSV(response.data);
        this.indicesCache = indices;
        this.lastIndicesFetch = now;
        console.log(`✅ Fetched ${indices.length} indices`);
        return indices;
      } else {
        console.error('❌ Invalid response format. Response preview:', response.data?.substring(0, 200));
        return this.indicesCache;
      }
    } catch (error: any) {
      console.error('❌ Error fetching indices:', error.message);
      console.error('Error details:', error.code || error.response?.status || 'Unknown');
      return this.indicesCache;
    }
  }

  private parseStocksCSV(csvText: string): Stock[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    // Parse CSV properly handling quoted values
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    const stocks: Stock[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length >= 2) {
        const stock: any = {};
        headers.forEach((header, index) => {
          stock[header] = cols[index] || '';
        });

        const symbol = stock.SYMBOL || stock.Symbol || stock.symbol || stock.TICKER || '';
        const name = stock['COMPANY NAME'] || stock.Name || stock.CompanyName || stock.name || '';
        const price = parseFloat(stock['CURRENT PRICE'] || stock.Price || stock.LTP || stock.price || '0');
        
        if (symbol && price > 0) {
          stocks.push({
            symbol: symbol,
            name: name,
            price: price,
            change: parseFloat(stock.CHANGE || stock.Change || stock.change || '0'),
            changePercent: parseFloat(stock['CHANGE %'] || stock.ChangePercent || stock['Change%'] || stock.changePercent || '0'),
            volume: parseInt(stock['VOLUME AVG'] || stock.Volume || stock.volume || '0'),
            sector: stock.Sector || stock.sector || 'General',
            marketCap: parseFloat(stock['MARKET CAP(CR)'] || stock.MarketCap || stock.marketCap || '0'),
            high: parseFloat(stock['52WHIGH'] || stock.High || stock.high || '0'),
            low: parseFloat(stock['52W-LOW'] || stock.Low || stock.low || '0'),
            open: parseFloat(stock.OPEN || stock.Open || stock.open || '0'),
            close: parseFloat(stock['CLOSE PRICE'] || stock.Close || stock.close || '0'),
          });
        }
      }
    }

    return stocks;
  }

  private parseIndicesCSV(csvText: string): any[] {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    // Parse CSV properly handling quoted values
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]);
    const indices: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length >= 2) {
        const index: any = {};
        headers.forEach((header, idx) => {
          index[header] = cols[idx] || '';
        });
        
        const symbol = index.INDEX || index['INDEX+SYMBOL'] || index.Symbol || index.symbol || '';
        const price = parseFloat(index['CURRENT PRICE'] || index.Price || index.LTP || index.price || '0');
        
        if (symbol && price > 0) {
          indices.push({
            Symbol: symbol,
            Price: price,
            Change: parseFloat(index.CHANGE || index.Change || index.change || '0'),
            Open: parseFloat(index.OPEN || index.Open || index.open || '0'),
            High: parseFloat(index.HIGH || index.High || index.high || '0'),
            Low: parseFloat(index.LOW || index.Low || index.low || '0'),
          });
        }
      }
    }

    return indices;
  }

  searchStocks(query: string): Stock[] {
    const q = query.toLowerCase();
    return this.stocksCache.filter(s => 
      s.symbol.toLowerCase().includes(q) || 
      s.name.toLowerCase().includes(q)
    );
  }

  getStockBySymbol(symbol: string): Stock | undefined {
    return this.stocksCache.find(s => s.symbol === symbol);
  }
}

export const googleSheetsService = new GoogleSheetsService();
