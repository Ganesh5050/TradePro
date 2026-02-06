
import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, Time, CandlestickSeries } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface StockChartProps {
    symbol: string;
    className?: string;
}

const RANGES = [
    { label: '1D', value: '1d', interval: '5m' }, // 5m candles for 1D
    { label: '5D', value: '5d', interval: '15m' },
    { label: '1M', value: '1mo', interval: '1d' },
    { label: '6M', value: '6mo', interval: '1d' },
    { label: '1Y', value: '1y', interval: '1wk' },
    { label: '5Y', value: '5y', interval: '1mo' },
];

export default function StockChart({ symbol, className }: StockChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<any>(null);
    const [range, setRange] = useState('1mo');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);

    // Robust API URL determination
    const getApiBase = () => {
        // Force localhost:3001 in development if strictly needed, 
        // or rely on Vite's import.meta.env.DEV
        if (import.meta.env.DEV) return 'http://localhost:3001';
        return '';
    };

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!symbol) return;

            setIsLoading(true);
            setError(null);

            try {
                const selectedRange = RANGES.find(r => r.value === range) || RANGES[2];
                const API_BASE = getApiBase();
                const url = `${API_BASE}/api/stocks/history/${symbol}?range=${range}&interval=${selectedRange.interval}`;

                console.log(`fetching chart: ${url}`);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Failed to fetch (${response.status})`);
                }

                // Validate content type
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    console.error('Invalid content type:', contentType);
                    throw new Error('Server returned invalid format');
                }

                const json = await response.json();

                if (json.success && Array.isArray(json.data)) {
                    // Format data for lightweight-charts
                    const formattedData = json.data
                        .map((d: any) => ({
                            time: d.date ? d.date.split('T')[0] : null, // Use YYYY-MM-DD
                            open: d.open,
                            high: d.high,
                            low: d.low,
                            close: d.close,
                        }))
                        .filter((d: any) => d.time && d.open != null && d.close != null)
                        .sort((a: any, b: any) => (new Date(a.time).getTime() - new Date(b.time).getTime()));

                    // Deduplicate based on time to avoid LWCharts errors
                    const uniqueData = [];
                    const seenTimes = new Set();
                    for (const item of formattedData) {
                        if (!seenTimes.has(item.time)) {
                            seenTimes.add(item.time);
                            uniqueData.push(item);
                        }
                    }

                    if (uniqueData.length === 0) {
                        setError('No data available for this range');
                    } else {
                        setChartData(uniqueData);
                    }
                } else {
                    setError(json.error || 'Failed to load chart data');
                }
            } catch (err: any) {
                console.error('Chart fetch error:', err);
                setError('Chart data unavailable');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [symbol, range]);

    // Initialize/Update Chart
    useEffect(() => {
        if (!chartContainerRef.current || chartData.length === 0) return;

        // Create Chart ONLY if it doesn't exist (or cleanup and recreate)
        // We'll cleanup and recreate to handle resize/theme changes simply
        if (chartRef.current) {
            chartRef.current.remove();
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'white' },
                textColor: '#333',
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            rightPriceScale: {
                borderColor: '#dfdfdf',
            },
            timeScale: {
                borderColor: '#dfdfdf',
                timeVisible: true,
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#137333', // Google Green
            downColor: '#a50e0e', // Google Red
            borderUpColor: '#137333',
            borderDownColor: '#a50e0e',
            wickUpColor: '#137333',
            wickDownColor: '#a50e0e',
        });

        candlestickSeries.setData(chartData);
        chart.timeScale().fitContent();

        chartRef.current = chart;
        candlestickSeriesRef.current = candlestickSeries;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [chartData]); // Re-run when data changes

    return (
        <Card className={`bg-white border-gray-200 ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Price Chart</CardTitle>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
                    {RANGES.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setRange(r.value)}
                            className={`px-3 py-1 text-xs rounded-md transition-all whitespace-nowrap ${range === r.value
                                ? 'bg-white shadow-sm text-black font-medium'
                                : 'text-gray-500 hover:text-black'
                                }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="h-[400px] flex items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                )}

                {error && !isLoading && (
                    <div className="h-[400px] flex items-center justify-center text-red-400">
                        {error}
                    </div>
                )}

                <div
                    ref={chartContainerRef}
                    className={`w-full h-[400px] transition-opacity duration-300 ${isLoading || error ? 'opacity-0 absolute' : 'opacity-100'
                        }`}
                />
            </CardContent>
        </Card>
    );
}
