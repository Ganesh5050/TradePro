import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const candlestickPatterns = [
  {
    name: 'Doji',
    type: 'Reversal',
    signal: 'Neutral/Reversal',
    description: 'A candle with almost equal open and close prices, indicating indecision in the market.',
    bullish: false,
    bearish: false,
    neutral: true,
  },
  {
    name: 'Hammer',
    type: 'Bullish Reversal',
    signal: 'Bullish',
    description: 'Small body at the top with a long lower shadow. Appears at the bottom of a downtrend, signaling potential reversal.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Shooting Star',
    type: 'Bearish Reversal',
    signal: 'Bearish',
    description: 'Small body at the bottom with a long upper shadow. Appears at the top of an uptrend, signaling potential reversal.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Bullish Engulfing',
    type: 'Bullish Reversal',
    signal: 'Bullish',
    description: 'A large green candle completely engulfs the previous red candle, indicating strong buying pressure.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Bearish Engulfing',
    type: 'Bearish Reversal',
    signal: 'Bearish',
    description: 'A large red candle completely engulfs the previous green candle, indicating strong selling pressure.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Morning Star',
    type: 'Bullish Reversal',
    signal: 'Bullish',
    description: 'Three-candle pattern: large red candle, small-bodied candle, then large green candle. Strong bullish reversal signal.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Evening Star',
    type: 'Bearish Reversal',
    signal: 'Bearish',
    description: 'Three-candle pattern: large green candle, small-bodied candle, then large red candle. Strong bearish reversal signal.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Three White Soldiers',
    type: 'Bullish Continuation',
    signal: 'Bullish',
    description: 'Three consecutive long green candles with higher closes. Strong bullish continuation pattern.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Three Black Crows',
    type: 'Bearish Continuation',
    signal: 'Bearish',
    description: 'Three consecutive long red candles with lower closes. Strong bearish continuation pattern.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Harami',
    type: 'Reversal',
    signal: 'Reversal',
    description: 'Small candle contained within the previous large candle. Indicates potential trend reversal.',
    bullish: false,
    bearish: false,
    neutral: true,
  },
];

const chartPatterns = [
  {
    name: 'Head and Shoulders',
    type: 'Bearish Reversal',
    signal: 'Bearish',
    description: 'Three peaks with the middle peak (head) higher than the other two (shoulders). Indicates trend reversal from bullish to bearish.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Inverse Head and Shoulders',
    type: 'Bullish Reversal',
    signal: 'Bullish',
    description: 'Three troughs with the middle trough (head) lower than the other two (shoulders). Indicates trend reversal from bearish to bullish.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Rising Wedge',
    type: 'Bearish Reversal',
    signal: 'Bearish',
    description: 'Price consolidates between two upward sloping trendlines that converge. Usually breaks downward.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Falling Wedge',
    type: 'Bullish Reversal',
    signal: 'Bullish',
    description: 'Price consolidates between two downward sloping trendlines that converge. Usually breaks upward.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Double Top',
    type: 'Bearish Reversal',
    signal: 'Bearish',
    description: 'Two peaks at approximately the same level. Indicates strong resistance and potential trend reversal.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Double Bottom',
    type: 'Bullish Reversal',
    signal: 'Bullish',
    description: 'Two troughs at approximately the same level. Indicates strong support and potential trend reversal.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Triple Top',
    type: 'Bearish Reversal',
    signal: 'Bearish',
    description: 'Three peaks at approximately the same level. Strong bearish reversal pattern.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Triple Bottom',
    type: 'Bullish Reversal',
    signal: 'Bullish',
    description: 'Three troughs at approximately the same level. Strong bullish reversal pattern.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Ascending Triangle',
    type: 'Bullish Continuation',
    signal: 'Bullish',
    description: 'Flat top with rising lows. Bullish continuation pattern indicating accumulation.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Descending Triangle',
    type: 'Bearish Continuation',
    signal: 'Bearish',
    description: 'Flat bottom with declining highs. Bearish continuation pattern indicating distribution.',
    bullish: false,
    bearish: true,
  },
  {
    name: 'Symmetrical Triangle',
    type: 'Continuation',
    signal: 'Neutral',
    description: 'Converging trendlines with lower highs and higher lows. Breakout direction determines trend.',
    bullish: false,
    bearish: false,
    neutral: true,
  },
  {
    name: 'Cup and Handle',
    type: 'Bullish Continuation',
    signal: 'Bullish',
    description: 'U-shaped cup followed by a small downward drift (handle). Strong bullish continuation pattern.',
    bullish: true,
    bearish: false,
  },
  {
    name: 'Flag Pattern',
    type: 'Continuation',
    signal: 'Continuation',
    description: 'Sharp price movement followed by consolidation in a rectangular pattern. Continues in the direction of the initial move.',
    bullish: false,
    bearish: false,
    neutral: true,
  },
  {
    name: 'Pennant Pattern',
    type: 'Continuation',
    signal: 'Continuation',
    description: 'Sharp price movement followed by consolidation in a small symmetrical triangle. Continues in the direction of the initial move.',
    bullish: false,
    bearish: false,
    neutral: true,
  },
];

export default function Patterns() {
  const [activeTab, setActiveTab] = useState<'candles' | 'movement'>('candles');

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Trading Patterns</h1>
          <p className="text-gray-600 mt-2">Learn to identify and trade using popular patterns</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('candles')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'candles'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Candles
          </button>
          <button
            onClick={() => setActiveTab('movement')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'movement'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Movement
          </button>
        </div>

        {/* Candlestick Patterns */}
        {activeTab === 'candles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candlestickPatterns.map((pattern) => (
              <Card key={pattern.name} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900">{pattern.name}</CardTitle>
                    {pattern.bullish && <TrendingUp className="w-5 h-5 text-green-600" />}
                    {pattern.bearish && <TrendingDown className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pattern.bullish ? 'bg-green-100 text-green-700' :
                      pattern.bearish ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {pattern.signal}
                    </span>
                    <span className="text-xs text-gray-500">{pattern.type}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="text-gray-400 text-sm">Pattern Illustration</span>
                  </div>
                  <p className="text-sm text-gray-600">{pattern.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Chart Movement Patterns */}
        {activeTab === 'movement' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chartPatterns.map((pattern) => (
              <Card key={pattern.name} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900">{pattern.name}</CardTitle>
                    {pattern.bullish && <TrendingUp className="w-5 h-5 text-green-600" />}
                    {pattern.bearish && <TrendingDown className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pattern.bullish ? 'bg-green-100 text-green-700' :
                      pattern.bearish ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {pattern.signal}
                    </span>
                    <span className="text-xs text-gray-500">{pattern.type}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                    <span className="text-gray-400 text-sm">Pattern Illustration</span>
                  </div>
                  <p className="text-sm text-gray-600">{pattern.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
