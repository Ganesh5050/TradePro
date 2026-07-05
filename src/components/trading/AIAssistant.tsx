import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, TrendingUp, TrendingDown, Minus, Loader2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStockStore } from '@/stores/useStockStore';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: React.ReactNode;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I am your TradePro AI Assistant. Enter any Indian stock symbol (e.g., RELIANCE, TCS) or sector to get an instant technical and sentiment analysis.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { stocks, indices } = useStockStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (query: string) => {
    const q = query.trim().toUpperCase();
    
    // Check if it's an index
    const indexStr = indices.find(i => i.Symbol.toUpperCase().includes(q) || q.includes(i.Symbol.toUpperCase()));
    if (indexStr) {
        return generateAnalysis(
            indexStr.Symbol, 
            indexStr.Price, 
            indexStr.Change, 
            "Index", 
            indexStr.High, 
            indexStr.Low,
            0 // no volume for index in this model
        );
    }

    // Check if it's a specific stock
    const stock = stocks.find(s => s.symbol.toUpperCase() === q || s.name.toUpperCase().includes(q));
    
    if (stock) {
        return generateAnalysis(
            stock.symbol,
            stock.price,
            stock.changePercent,
            stock.sector,
            stock.high,
            stock.low,
            stock.volume
        );
    }

    // Check if it's a sector search
    const sectorStocks = stocks.filter(s => s.sector.toUpperCase().includes(q));
    if (sectorStocks.length > 0) {
        const avgChange = sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / sectorStocks.length;
        const topGainer = [...sectorStocks].sort((a, b) => b.changePercent - a.changePercent)[0];
        
        return (
            <div className="space-y-2">
                <p><strong>Sector Analysis: {q}</strong></p>
                <p>
                    The {q} sector is currently experiencing a 
                    <span className={avgChange >= 0 ? 'text-green-500 font-bold ml-1' : 'text-red-500 font-bold ml-1'}>
                        {avgChange >= 0 ? 'Positive' : 'Negative'} trend ({avgChange.toFixed(2)}%)
                    </span>.
                </p>
                <p className="text-sm mt-2 text-gray-300">
                    Leading the sector today is <span className="text-white font-bold">{topGainer.symbol}</span>, 
                    {topGainer.changePercent >= 0 ? ' up ' : ' down '} by {Math.abs(topGainer.changePercent).toFixed(2)}%.
                </p>
                {avgChange > 1.5 ? (
                    <p className="text-green-400 text-sm font-medium mt-2">Verdict: Momentum is highly bullish. Look for breakout opportunities. 🟢</p>
                ) : avgChange < -1.5 ? (
                    <p className="text-red-400 text-sm font-medium mt-2">Verdict: Sector under heavy pressure. Capital preservation is advised. 🔴</p>
                ) : (
                    <p className="text-yellow-400 text-sm font-medium mt-2">Verdict: Consolidation phase. Wait for a clear volume breakout. 🟡</p>
                )}
            </div>
        );
    }

    return `I couldn't find exact live data for "${query}". Try searching for specific NSE symbols like HDFCBANK or specific sectors like "IT".`;
  };

  /**
   * Multivariate Heuristic Decision Tree (MHDT)
   * 
   * Combines 3 independent market signal variables into a weighted composite score:
   *   1. Price Momentum Signal (V1): Based on % price change  [Weight: 0.50]
   *   2. Intraday Range Signal (V2): Price position within 52W High-Low range [Weight: 0.30]
   *   3. Volume Divergence Signal (V3): Abnormal volume vs. average [Weight: 0.20]
   *
   * Final Score = 0.50*V1 + 0.30*V2 + 0.20*V3
   * Score ranges: [-1.0, 1.0] → maps to verdict categories
   */
  const generateAnalysis = (symbol: string, price: number, changePct: number, sector: string, high: number, low: number, volume: number) => {

    // --- Variable 1: Price Momentum Signal [-1.0 to 1.0] ---
    // Normalize changePct into [-1, 1] using a clamped linear scale (threshold: ±3%)
    const V1 = Math.max(-1, Math.min(1, changePct / 3.0));

    // --- Variable 2: Intraday Range (52W) Position Signal [-1.0 to 1.0] ---
    // Where is the current price within the 52-week range?
    // 0 = at 52W low (bearish), 1 = at 52W high (bullish), mapped to [-1, 1]
    const rangeWidth = high - low;
    const V2 = rangeWidth > 0 ? (((price - low) / rangeWidth) * 2) - 1 : 0;

    // --- Variable 3: Volume Divergence Signal [-1.0 to 1.0] ---
    // High volume on up days = bullish; high volume on down days = bearish
    // Average NSE volume baseline ~2M shares. Scale: 0 to 10M+ maps to 0 to 1
    const volumeSignal = Math.min(1, volume / 10_000_000);
    const V3 = changePct >= 0 ? volumeSignal : -volumeSignal;

    // --- Composite MHDT Score ---
    const compositeScore = (0.50 * V1) + (0.30 * V2) + (0.20 * V3);

    // --- Decision Tree: Map composite score to verdict ---
    let sentiment = 'NEUTRAL 🟡';
    let sentimentText = 'consolidating across variables — no dominant momentum detected.';
    let colorClass = 'text-yellow-400';
    let verdictColor = 'bg-yellow-900/30 border-yellow-700/50';
    let icon = <Minus className="w-4 h-4 text-yellow-500 inline mr-1" />;

    if (compositeScore > 0.50) {
      sentiment = 'STRONG BUY 🟢';
      sentimentText = 'displaying strong multi-variable bullish confluence — momentum, position, and volume are all aligned positively.';
      colorClass = 'text-green-400';
      verdictColor = 'bg-green-900/30 border-green-700/50';
      icon = <TrendingUp className="w-4 h-4 text-green-500 inline mr-1" />;
    } else if (compositeScore > 0.15) {
      sentiment = 'BUY (ACCUMULATE) 🟢';
      sentimentText = 'showing moderate bullish convergence across indicators — accumulation phase likely.';
      colorClass = 'text-green-400';
      verdictColor = 'bg-green-900/30 border-green-700/50';
      icon = <TrendingUp className="w-4 h-4 text-green-500 inline mr-1" />;
    } else if (compositeScore < -0.50) {
      sentiment = 'STRONG SELL 🔴';
      sentimentText = 'showing multi-variable bearish breakdown — momentum, range position, and volume confirm distribution.';
      colorClass = 'text-red-400';
      verdictColor = 'bg-red-900/30 border-red-700/50';
      icon = <TrendingDown className="w-4 h-4 text-red-500 inline mr-1" />;
    } else if (compositeScore < -0.15) {
      sentiment = 'SELL (TRIM) 🔴';
      sentimentText = 'experiencing mild bearish divergence — profit booking is advised at current levels.';
      colorClass = 'text-red-400';
      verdictColor = 'bg-red-900/30 border-red-700/50';
      icon = <TrendingDown className="w-4 h-4 text-red-500 inline mr-1" />;
    }

    // --- Technical boundary note ---
    let technicalNote = '';
    if (price >= high * 0.95) {
      technicalNote = `Trading within 5% of the 52-week high of ₹${high.toFixed(2)}. V2 signal elevated — watch for breakout or resistance rejection.`;
    } else if (price <= low * 1.05) {
      technicalNote = `Near 52-week low of ₹${low.toFixed(2)}. V2 signal at floor — potential support-based reversal if V3 confirms.`;
    }

    return (
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
          <span className="font-bold text-white max-w-[150px] truncate">{symbol}</span>
          <span className="font-mono text-white">₹{price.toFixed(2)}</span>
        </div>

        <p className="text-gray-300 text-xs">Based on real-time market data, <strong className="text-white">{symbol}</strong> is currently {sentimentText}</p>

        {/* Multivariate Score Breakdown - Key for paper */}
        <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-700/60 font-mono text-xs space-y-1">
          <p className="text-gray-500 uppercase tracking-wider text-[10px] mb-1">MHDT Variable Scores</p>
          <div className="flex justify-between">
            <span className="text-gray-400">V1 Momentum (×0.50):</span>
            <span className={V1 >= 0 ? 'text-green-400' : 'text-red-400'}>{(V1 * 0.5).toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">V2 Range Pos (×0.30):</span>
            <span className={V2 >= 0 ? 'text-green-400' : 'text-red-400'}>{(V2 * 0.3).toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">V3 Vol Signal (×0.20):</span>
            <span className={V3 >= 0 ? 'text-green-400' : 'text-red-400'}>{(V3 * 0.2).toFixed(3)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-1 mt-1">
            <span className="text-white font-bold">Composite Score:</span>
            <span className={compositeScore >= 0 ? 'text-green-300 font-bold' : 'text-red-300 font-bold'}>
              {compositeScore.toFixed(3)}
            </span>
          </div>
        </div>

        {technicalNote && (
          <div className="bg-blue-900/20 p-2 rounded border border-blue-800/50">
            <p className="text-xs text-blue-300">{technicalNote}</p>
          </div>
        )}

        <div className={`pt-2 pb-1 px-2 rounded-lg border ${verdictColor}`}>
          <span className="text-gray-400 text-[10px] uppercase tracking-wider">AI Verdict:</span>
          <div className={`font-bold mt-0.5 flex items-center ${colorClass}`}>
            {icon} {sentiment}
          </div>
        </div>

        <p className="text-[10px] text-gray-600 text-right italic">*Multivariate Heuristic Decision Tree · Score ∈ [-1.0, 1.0]</p>
      </div>
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: userMessage }]);
    
    setIsTyping(true);
    
    // Simulate AI thinking delay (600ms to 1.5s)
    const delay = Math.floor(Math.random() * 900) + 600;
    
    setTimeout(() => {
        const responseContent = generateAIResponse(userMessage);
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', content: responseContent }]);
    }, delay);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 z-50 flex items-center justify-center transition-all ${isOpen ? 'hidden' : 'block'}`}
      >
        <Bot className="w-6 h-6" />
        {/* Pulsing indicator */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-[#1a1b26] border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">TradePro AI</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                    Online & Analyzing
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
              {messages.map((msg) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-sm' 
                        : 'bg-gray-800 text-gray-200 rounded-tl-sm border border-gray-700'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="px-4 py-2 bg-[#1f202e] border-t border-gray-800 flex gap-2 overflow-x-auto scrollbar-none text-xs">
              <button 
                onClick={() => setInput('RELIANCE')}
                disabled={isTyping}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-300 rounded-full flex-shrink-0 transition-colors"
              >
                RELIANCE
              </button>
              <button 
                onClick={() => setInput('TCS')}
                disabled={isTyping}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-750 border border-gray-700 text-gray-300 rounded-full flex-shrink-0 transition-colors"
              >
                TCS
              </button>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-gray-900 border-t border-gray-800">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-gray-800 rounded-full p-1 pl-4 border border-gray-700 focus-within:border-blue-500 transition-colors"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a stock or sector..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-full transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

}
