
import axios from 'axios';

// Directly use the Google Sheets URLs
const STOCKS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTe_jvQxbvO9CPQfHWKWJNujBlPfojS8bVcCoVYCq7TGL5ovst6prSgGwt-cEdzFUoDZlBfCDkfAec9/pub?output=csv';
const INDICES_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmu-1ua2OhETfc4MIcuPCs7ZDH-SMRTh2QIr3IbD35OUB1NxDfIKkLL2osGMZ76kKlU5opx722TiBz/pub?output=csv&gid=0';

export interface Stock {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    sector: string;
    marketCap: number;
    high: number;
    low: number;
    open: number;
    close: number;
}

export interface Index {
    Symbol: string;
    Price: number;
    Change: number;
    Open: number;
    High: number;
    Low: number;
}

/**
 * Pipeline Reliability Tracker
 * Tracks every API call to calculate the actual success/failure rate.
 * This data can be used directly in the research paper as evidence.
 */
export interface PipelineStats {
    totalCycles: number;
    successCycles: number;
    failureCycles: number;
    cacheFallbacks: number;
    successRatePercent: number;
}

class GoogleSheetsService {
    // In-memory cache for DFA State Reconciliation fallback
    private cachedStocks: Stock[] = [];
    private cachedIndices: Index[] = [];

    // Reliability tracking for paper validation
    private stats: PipelineStats = {
        totalCycles: 0,
        successCycles: 0,
        failureCycles: 0,
        cacheFallbacks: 0,
        successRatePercent: 100,
    };

    /** Returns current pipeline reliability statistics */
    getStats(): PipelineStats {
        return { ...this.stats };
    }

    /** Parse CSV properly handling quoted values (DFA String Parser) */
    private parseCSVLine(line: string): string[] {
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
    }

    private parseStocksCSV(csvText: string): Stock[] {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = this.parseCSVLine(lines[0]);
        const stocks: Stock[] = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = this.parseCSVLine(lines[i]);
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

    private parseIndicesCSV(csvText: string): Index[] {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = this.parseCSVLine(lines[0]);
        const indices: Index[] = [];

        for (let i = 1; i < lines.length; i++) {
            const cols = this.parseCSVLine(lines[i]);
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

    async fetchStocks(): Promise<Stock[]> {
        this.stats.totalCycles++;
        try {
            console.log('📊 Fetching stocks directly from Google Sheets...');
            const response = await axios.get(STOCKS_URL, { timeout: 8000 });

            if (typeof response.data === 'string') {
                const stocks = this.parseStocksCSV(response.data);
                if (stocks.length > 0) {
                    // ✅ Success: update in-memory cache and record stats
                    this.cachedStocks = stocks;
                    this.stats.successCycles++;
                    console.log(`✅ Fetched ${stocks.length} stocks from Google Sheets`);
                    this.stats.successRatePercent = parseFloat(
                        ((this.stats.successCycles / this.stats.totalCycles) * 100).toFixed(2)
                    );
                    return stocks;
                }
            }
            throw new Error('Empty or invalid CSV response');
        } catch (error) {
            // ⚠️ Failure: serve from in-memory cache — zero perceived downtime for user
            this.stats.failureCycles++;
            this.stats.cacheFallbacks++;
            this.stats.successRatePercent = parseFloat(
                ((this.stats.successCycles / this.stats.totalCycles) * 100).toFixed(2)
            );
            console.warn(
                `⚠️ Google Sheets API failed (cycle #${this.stats.totalCycles}). Serving ${this.cachedStocks.length} stocks from DFA cache. Error:`,
                error
            );
            return this.cachedStocks;
        }
    }

    async fetchIndices(): Promise<Index[]> {
        try {
            console.log('📈 Fetching indices directly from Google Sheets...');
            const response = await axios.get(INDICES_URL, { timeout: 8000 });

            if (typeof response.data === 'string') {
                const indices = this.parseIndicesCSV(response.data);
                if (indices.length > 0) {
                    this.cachedIndices = indices;
                    console.log(`✅ Fetched ${indices.length} indices from Google Sheets`);
                    return indices;
                }
            }
            throw new Error('Empty or invalid CSV response');
        } catch (error) {
            console.warn('⚠️ Indices fetch failed. Serving from DFA cache.', error);
            return this.cachedIndices;
        }
    }
}

export const googleSheetsService = new GoogleSheetsService();
