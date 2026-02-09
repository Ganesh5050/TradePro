import { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useStockStore } from '@/stores/useStockStore';

interface StockChartProps {
    symbol: string;
    className?: string;
}

const RANGES = [
    { label: '1D', value: '1d', days: 1 },
    { label: '5D', value: '5d', days: 5 },
    { label: '1M', value: '1mo', days: 30 },
    { label: '6M', value: '6mo', days: 180 },
    { label: '1Y', value: '1y', days: 365 },
    { label: '5Y', value: '5y', days: 1825 },
];

export default function StockChart({ symbol, className }: StockChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const [range, setRange] = useState('1mo');
    const [isLoading, setIsLoading] = useState(false);

    // Get current stock price from store to make chart realistic
    const { stocks } = useStockStore();
    const currentStock = useMemo(() => stocks.find(s => s.symbol === symbol), [stocks, symbol]);
    const basePrice = currentStock?.price || 100;

    // Generate simulated realistic chart data
    const chartData = useMemo(() => {
        const data = [];
        const endDate = new Date();
        const days = RANGES.find(r => r.value === range)?.days || 30;
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        let currentPrice = basePrice * (0.8 + Math.random() * 0.4); // Start somewhat random
        const volatility = 0.02; // 2% daily volatility

        // Create a new date object for iteration to avoid mutation issues
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            // Skip weekends (0 is Sunday, 6 is Saturday)
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                const open = currentPrice;
                const change = currentPrice * (Math.random() - 0.5) * volatility;
                let close = open + change;

                const high = Math.max(open, close) + Math.random() * (currentPrice * 0.01);
                const low = Math.min(open, close) - Math.random() * (currentPrice * 0.01);

                data.push({
                    time: currentDate.toISOString().split('T')[0],
                    open: parseFloat(open.toFixed(2)),
                    high: parseFloat(high.toFixed(2)),
                    low: parseFloat(low.toFixed(2)),
                    close: parseFloat(close.toFixed(2)),
                });

                currentPrice = close;
            }
            // Move to next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Force the LAST candle to close exactly at the current live price
        if (data.length > 0) {
            const lastCandle = data[data.length - 1];
            lastCandle.close = basePrice;
            // Adjust high/low to encompass the new close
            lastCandle.high = Math.max(lastCandle.high, basePrice);
            lastCandle.low = Math.min(lastCandle.low, basePrice);
        }

        return data;
    }, [symbol, range, basePrice]);

    // Cleanup and re-create chart on data/range change
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Cleanup
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
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
            upColor: '#137333',
            downColor: '#a50e0e',
            borderUpColor: '#137333',
            borderDownColor: '#a50e0e',
            wickUpColor: '#137333',
            wickDownColor: '#a50e0e',
        });

        // @ts-ignore - Lightweight charts types are strict about Time but string works
        candlestickSeries.setData(chartData);
        chart.timeScale().fitContent();

        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [chartData]);

    return (
        <Card className={`bg-white border-gray-200 ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Price Chart ({symbol})</CardTitle>
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
                <div ref={chartContainerRef} className="w-full h-[400px]" />
            </CardContent>
        </Card>
    );
}
