import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, AlertCircle, RefreshCw, TrendingUp, TrendingDown, Minus, CalendarDays, Layers, SplitSquareHorizontal, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  fetchMarketNews,
  fetchIPOs,
  fetchCorporateActions,
  fetchFIIDII,
  type NewsHeadline,
  type IPOItem,
  type CorporateAction,
  type FIIDIIData,
} from '@/services/marketEvents';

// ── Sentiment badge ──────────────────────────────────────────────
const SentimentBadge = ({ sentiment }: { sentiment: 'positive' | 'negative' | 'neutral' }) => {
  const map = {
    positive: { cls: 'bg-green-50 text-green-700 border-green-200', icon: <TrendingUp className="w-3 h-3" /> },
    negative: { cls: 'bg-red-50 text-red-700 border-red-200',       icon: <TrendingDown className="w-3 h-3" /> },
    neutral:  { cls: 'bg-gray-50 text-gray-600 border-gray-200',     icon: <Minus className="w-3 h-3" /> },
  };
  const { cls, icon } = map[sentiment];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cls}`}>
      {icon} {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
};

// ── IPO status badge ─────────────────────────────────────────────
const StatusBadge = ({ status }: { status: IPOItem['status'] }) => {
  const map = {
    open:     'bg-green-100 text-green-800 border-green-200',
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    closed:   'bg-gray-100 text-gray-700 border-gray-200',
    listed:   'bg-purple-100 text-purple-800 border-purple-200',
  };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ── Corporate action badge ───────────────────────────────────────
const ActionBadge = ({ purpose }: { purpose: string }) => {
  const p = purpose.toUpperCase();
  if (p.includes('SPLIT'))    return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">SPLIT</span>;
  if (p.includes('BONUS'))    return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-700 border border-purple-200">BONUS</span>;
  if (p.includes('RIGHTS'))   return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-teal-100 text-teal-700 border border-teal-200">RIGHTS</span>;
  if (p.includes('DIVIDEND')) return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">DIVIDEND</span>;
  return <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gray-100 text-gray-700 border border-gray-200">{purpose.slice(0, 12)}</span>;
};

// ── Loading skeleton ─────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />
);

// ── Main News Page ───────────────────────────────────────────────
const News = () => {
  const [headlines, setHeadlines]   = useState<NewsHeadline[]>([]);
  const [ipos, setIpos]             = useState<IPOItem[]>([]);
  const [actions, setActions]       = useState<CorporateAction[]>([]);
  const [fiiDii, setFiiDii]         = useState<FIIDIIData[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [h, i, a, f] = await Promise.all([
        fetchMarketNews(),
        fetchIPOs(),
        fetchCorporateActions(),
        fetchFIIDII(),
      ]);
      setHeadlines(h);
      setIpos(i);
      setActions(a);
      setFiiDii(f);
      setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    } catch (e) {
      setError('Failed to load live data. Showing cached / example data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: '100px' }}>
      <div className="max-w-6xl mx-auto px-4 pb-20">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                Market <span className="text-blue-600">Events & News</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Live data from NSE India &amp; major financial RSS feeds.
                {lastUpdated && <span className="ml-2 text-gray-400">Last updated: {lastUpdated}</span>}
              </p>
            </div>
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </motion.div>

        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="news"    className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> News</TabsTrigger>
            <TabsTrigger value="ipo"     className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> IPOs</TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2"><SplitSquareHorizontal className="w-4 h-4" /> Corporate Events</TabsTrigger>
            <TabsTrigger value="fiidii"  className="flex items-center gap-2"><Layers className="w-4 h-4" /> FII / DII</TabsTrigger>
          </TabsList>

          {/* ── News Headlines ── */}
          <TabsContent value="news">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-5 rounded-xl border border-gray-200">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5 mb-4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {headlines.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <SentimentBadge sentiment={n.sentiment} />
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {n.publishedAt ? new Date(n.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{n.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{n.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Source: <strong>{n.source}</strong></span>
                      {n.url !== '#' && (
                        <a href={n.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          Read more <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── IPOs ── */}
          <TabsContent value="ipo">
            <div className="mb-4 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <CalendarDays className="w-4 h-4" /> IPO data sourced live from NSE India public API.
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {ipos.map((ipo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{ipo.company}</h3>
                          <StatusBadge status={ipo.status} />
                          <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">{ipo.type}</span>
                        </div>
                        {ipo.symbol && ipo.symbol !== '—' && (
                          <p className="text-xs text-gray-500">NSE Symbol: <strong>{ipo.symbol}</strong></p>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        {ipo.issuePrice && ipo.issuePrice !== '—' && (
                          <p className="font-bold text-gray-900">₹{ipo.issuePrice}</p>
                        )}
                        {ipo.lotSize && ipo.lotSize !== '—' && (
                          <p className="text-xs text-gray-500">Lot: {ipo.lotSize} shares</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600">
                      <div><span className="text-gray-400">Open: </span>{ipo.openDate  || '—'}</div>
                      <div><span className="text-gray-400">Close: </span>{ipo.closeDate || '—'}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Corporate Events (Splits, Bonus, Rights) ── */}
          <TabsContent value="actions">
            <div className="mb-4 flex items-center gap-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
              <SplitSquareHorizontal className="w-4 h-4" /> Corporate actions (splits, bonus, rights, dividends) sourced from NSE India.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                [...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : (
                actions.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ActionBadge purpose={action.purpose} />
                      <span className="font-bold text-gray-800">{action.symbol}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{action.company}</p>
                    <p className="text-xs text-gray-500 italic mb-3">{action.details}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div><span className="text-gray-400">Ex-Date: </span>{action.exDate || '—'}</div>
                      <div><span className="text-gray-400">Record: </span>{action.recordDate || '—'}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* ── FII / DII ── */}
          <TabsContent value="fiidii">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <Layers className="w-4 h-4" /> Live institutional activity from NSE India.
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
              ) : (
                fiiDii.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-5 rounded-xl border border-gray-200"
                  >
                    <h4 className="font-semibold text-gray-800 mb-4">{row.date}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* FII */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Foreign Institutional Investors (FII)</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Bought</span><span>₹{row.fii.bought.toLocaleString('en-IN')} Cr</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Sold</span><span>₹{row.fii.sold.toLocaleString('en-IN')} Cr</span></div>
                          <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
                            <span>Net</span>
                            <span className={row.fii.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {row.fii.net >= 0 ? '+' : ''}₹{row.fii.net.toLocaleString('en-IN')} Cr
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* DII */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Domestic Institutional Investors (DII)</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Bought</span><span>₹{row.dii.bought.toLocaleString('en-IN')} Cr</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Sold</span><span>₹{row.dii.sold.toLocaleString('en-IN')} Cr</span></div>
                          <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
                            <span>Net</span>
                            <span className={row.dii.net >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {row.dii.net >= 0 ? '+' : ''}₹{row.dii.net.toLocaleString('en-IN')} Cr
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default News;