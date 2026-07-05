/**
 * Market Events Service
 * Fetches real IPO, Splits, Rights Issue, Bonus, and FII/DII data
 * from freely available public sources (NSE India, Moneycontrol RSS, etc.)
 *
 * Strategy:
 *  1. NSE India public API  — corporate actions (splits, bonus, rights)
 *  2. NSE India public API  — upcoming IPOs
 *  3. NSE India public API  — FII/DII institutional activity
 *  4. RSS → JSON bridge     — real market headlines from Moneycontrol/ET
 *
 * All APIs are public and do NOT require an API key.
 * NSE has CORS headers but requires a referrer. We use a CORS proxy
 * that is also free and open-source (allorigins.win).
 */

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const NSE_BASE   = 'https://www.nseindia.com/api';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export interface IPOItem {
  company: string;
  symbol: string;
  openDate: string;
  closeDate: string;
  issuePrice: string;
  lotSize: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  type: 'IPO' | 'SME IPO';
}

export interface CorporateAction {
  symbol: string;
  company: string;
  purpose: string;   // "SPLIT", "BONUS", "RIGHTS", "DIVIDEND" etc.
  exDate: string;
  recordDate: string;
  details: string;
}

export interface FIIDIIData {
  date: string;
  fii: { bought: number; sold: number; net: number };
  dii: { bought: number; sold: number; net: number };
}

export interface NewsHeadline {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

// ─────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────

async function fetchWithProxy<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(CORS_PROXY + encodeURIComponent(url), {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return JSON.parse(text) as T;
  } catch (e) {
    console.warn('[marketEvents] Fetch failed for', url, e);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────
// 1. Corporate Actions  (Splits, Bonus, Rights, Dividend)
// ─────────────────────────────────────────────────────────────────

export async function fetchCorporateActions(): Promise<CorporateAction[]> {
  // NSE corporate actions endpoint — returns upcoming ex-dates
  const url = `${NSE_BASE}/corporates-corporateActions?index=equities&from_date=&to_date=&symbol=&series=EQ&csv=false`;
  const data = await fetchWithProxy<{ data: any[] }>(url);

  if (!data?.data) return getFallbackCorporateActions();

  return data.data
    .slice(0, 30)
    .map((item: any) => ({
      symbol:     item.symbol        || '',
      company:    item.comp          || item.symbol || '',
      purpose:    (item.subject      || '').toUpperCase(),
      exDate:     item.exDate        || '',
      recordDate: item.recDate       || '',
      details:    item.subject       || '',
    }))
    .filter((a) => a.symbol && a.purpose);
}

// ─────────────────────────────────────────────────────────────────
// 2. Upcoming IPOs
// ─────────────────────────────────────────────────────────────────

export async function fetchIPOs(): Promise<IPOItem[]> {
  const url = `${NSE_BASE}/public-offer?type=ipo`;
  const data = await fetchWithProxy<{ data: any[] }>(url);

  if (!data?.data) return getFallbackIPOs();

  return data.data.slice(0, 15).map((item: any) => {
    const today = new Date();
    const open  = new Date(item.openDate  || item.bidOpenDate  || '');
    const close = new Date(item.closeDate || item.bidCloseDate || '');

    let status: IPOItem['status'] = 'upcoming';
    if (today >= open && today <= close) status = 'open';
    else if (today > close && !item.listingDate) status = 'closed';
    else if (item.listingDate) status = 'listed';

    return {
      company:    item.companyName   || item.issuerName || '',
      symbol:     item.symbol        || '',
      openDate:   item.openDate      || item.bidOpenDate  || '',
      closeDate:  item.closeDate     || item.bidCloseDate || '',
      issuePrice: item.issuePrice    || item.cutOffPrice  || '',
      lotSize:    item.lotSize       || '',
      status,
      type:       (item.series === 'SM' ? 'SME IPO' : 'IPO') as IPOItem['type'],
    };
  }).filter((i) => i.company);
}

// ─────────────────────────────────────────────────────────────────
// 3. FII / DII Data
// ─────────────────────────────────────────────────────────────────

export async function fetchFIIDII(): Promise<FIIDIIData[]> {
  const url = `${NSE_BASE}/fiidiiTradeReact`;
  const data = await fetchWithProxy<any[]>(url);

  if (!Array.isArray(data) || data.length === 0) return getFallbackFIIDII();

  return data.slice(0, 5).map((item: any) => ({
    date: item.date || '',
    fii: {
      bought: parseFloat(item.fiiBuyValue  || '0'),
      sold:   parseFloat(item.fiiSellValue || '0'),
      net:    parseFloat(item.fiiNetValue  || '0'),
    },
    dii: {
      bought: parseFloat(item.diiBuyValue  || '0'),
      sold:   parseFloat(item.diiSellValue || '0'),
      net:    parseFloat(item.diiNetValue  || '0'),
    },
  }));
}

// ─────────────────────────────────────────────────────────────────
// 4. News Headlines via RSS-to-JSON
//    We use rss2json.com free tier (no auth for public RSS feeds)
// ─────────────────────────────────────────────────────────────────

const RSS_FEEDS = [
  { url: 'https://www.moneycontrol.com/rss/latestnews.xml',  source: 'Moneycontrol' },
  { url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms', source: 'Economic Times' },
  { url: 'https://feeds.feedburner.com/ndtvprofit-latest',   source: 'NDTV Profit' },
];

const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

function guessSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const t = title.toLowerCase();
  const pos = ['gain', 'rise', 'rally', 'surge', 'profit', 'growth', 'up', 'high', 'record', 'bull', 'beat', 'wins'];
  const neg = ['fall', 'drop', 'loss', 'decline', 'down', 'crash', 'sell-off', 'slump', 'bear', 'miss', 'plunge'];
  if (pos.some((w) => t.includes(w))) return 'positive';
  if (neg.some((w) => t.includes(w))) return 'negative';
  return 'neutral';
}

export async function fetchMarketNews(): Promise<NewsHeadline[]> {
  const all: NewsHeadline[] = [];

  await Promise.all(
    RSS_FEEDS.map(async ({ url, source }) => {
      try {
        const res = await fetch(`${RSS2JSON}${encodeURIComponent(url)}`);
        const json = await res.json();
        if (json.status !== 'ok' || !json.items) return;

        json.items.slice(0, 5).forEach((item: any, i: number) => {
          all.push({
            id:          `${source}-${i}`,
            title:       item.title || '',
            summary:     (item.description || '').replace(/<[^>]+>/g, '').slice(0, 160).trim(),
            source,
            url:         item.link  || '#',
            publishedAt: item.pubDate || '',
            category:    source === 'Economic Times' ? 'Markets' : 'India',
            sentiment:   guessSentiment(item.title || ''),
          });
        });
      } catch {
        // silently skip failed feeds
      }
    })
  );

  // Sort by publishedAt desc
  all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return all.length > 0 ? all : getFallbackNews();
}

// ─────────────────────────────────────────────────────────────────
// Fallback Data (shown when APIs / CORS proxy are unavailable)
// These are LABELED as examples, not fake live data.
// ─────────────────────────────────────────────────────────────────

function getFallbackCorporateActions(): CorporateAction[] {
  return [
    { symbol: 'TATASTEEL', company: 'Tata Steel Ltd',         purpose: 'SPLIT',    exDate: '—', recordDate: '—', details: 'Stock split (example — live data loading)' },
    { symbol: 'HDFC',      company: 'HDFC Bank Ltd',          purpose: 'DIVIDEND',  exDate: '—', recordDate: '—', details: 'Interim dividend (example — live data loading)' },
    { symbol: 'INFY',      company: 'Infosys Ltd',            purpose: 'BONUS',     exDate: '—', recordDate: '—', details: 'Bonus 1:1 (example — live data loading)' },
    { symbol: 'WIPRO',     company: 'Wipro Ltd',              purpose: 'RIGHTS',    exDate: '—', recordDate: '—', details: 'Rights issue (example — live data loading)' },
  ];
}

function getFallbackIPOs(): IPOItem[] {
  return [
    { company: 'Live IPO data loading…', symbol: '—', openDate: '—', closeDate: '—', issuePrice: '—', lotSize: '—', status: 'upcoming', type: 'IPO' },
  ];
}

function getFallbackFIIDII(): FIIDIIData[] {
  return [
    { date: 'Loading…', fii: { bought: 0, sold: 0, net: 0 }, dii: { bought: 0, sold: 0, net: 0 } },
  ];
}

function getFallbackNews(): NewsHeadline[] {
  return [
    { id: '1', title: 'Live news loading…', summary: 'Market headlines are being fetched from live RSS feeds. Please wait.', source: 'System', url: '#', publishedAt: '', category: 'System', sentiment: 'neutral' },
  ];
}
