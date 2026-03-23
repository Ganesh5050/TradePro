import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
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

  const generateAnalysis = (symbol: string, price: number, changePct: number, sector: string, high: number, low: number, volume: number) => {
    
    let sentiment = 'NEUTRAL 🟡';
    let sentimentText = 'consolidating in a tight range.';
    let colorClass = 'text-yellow-400';
    let icon = <Minus className="w-4 h-4 text-yellow-500 inline mr-1" />;

    // Extremely simple but effective algorithmic logic for realistic fake "AI"
    if (changePct > 2) {
        sentiment = 'STRONG BUY 🟢';
        sentimentText = 'showing powerful bullish momentum with heavy institutional buying interest.';
        colorClass = 'text-green-400';
        icon = <TrendingUp className="w-4 h-4 text-green-500 inline mr-1" />;
    } else if (changePct > 0.5) {
        sentiment = 'BUY (ACCUMULATE) 🟢';
        sentimentText = 'demonstrating steady upward accumulation.';
        colorClass = 'text-green-400';
        icon = <TrendingUp className="w-4 h-4 text-green-500 inline mr-1" />;
    } else if (changePct < -2) {
        sentiment = 'STRONG SELL 🔴';
        sentimentText = 'facing severe distribution and technical breakdown.';
        colorClass = 'text-red-400';
        icon = <TrendingDown className="w-4 h-4 text-red-500 inline mr-1" />;
    } else if (changePct < -0.5) {
        sentiment = 'SELL (TRIM) 🔴';
        sentimentText = 'experiencing profit booking and mild selling pressure.';
        colorClass = 'text-red-400';
        icon = <TrendingDown className="w-4 h-4 text-red-500 inline mr-1" />;
    }

    // Checking if price is near 52w high (simulated as daily high for this metric as we only have live daily data easily accessible in this object)
    // Actually we have 52w high/low in the stocks object!
    let technicalNote = '';
    if (price >= high * 0.95) {
        technicalNote = `Prices are trading extremely close to the 52-week high of ₹${high.toFixed(2)}. Watch out for a potential breakout or double-top resistance. `;
    } else if (price <= low * 1.05) {
         technicalNote = `The asset is hovering near its 52-week low of ₹${low.toFixed(2)}. This could be a value accumulation zone if support holds. `;
    }

    return (
        <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                <span className="font-bold text-white max-w-[150px] truncate">{symbol}</span>
                <span className="font-mono text-white">₹{price.toFixed(2)}</span>
            </div>
            
            <p>Based on real-time market data, <strong>{symbol}</strong> is currently {sentimentText}</p>
            
            {(technicalNote || volume > 5000000) && (
                <div className="bg-blue-900/20 p-2 rounded border border-blue-800/50">
                    <p className="text-xs text-blue-300">
                        {technicalNote} 
                        {volume > 5000000 && ` Unusually high volume of ${(volume/1000000).toFixed(1)}M shares indicates smart money activity.`}
                    </p>
                </div>
            )}
            
            <div className="pt-2 border-t border-gray-700">
                <span className="text-gray-400 text-xs uppercase tracking-wider">AI Verdict:</span>
                <div className={`font-bold mt-1 flex items-center ${colorClass}`}>
                    {icon} {sentiment}
                </div>
            </div>
            
            <p className="text-[10px] text-gray-500 text-right italic">*Analysis driven by live Price Action</p>
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
