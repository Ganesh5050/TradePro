import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Target, ArrowRight } from 'lucide-react';

const TradeProofSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="relative px-4 py-20 mx-4 mb-8 rounded-3xl"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
        }}
      >
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Start trading
              <br />
              <span className="text-white/90">real profits today</span>
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join 100K+ traders • Practice with ₹10L virtual money
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Button 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <TrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Start Trading Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mb-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">₹10L</div>
              <div className="text-white/70 text-sm">Virtual Money</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">2000+</div>
              <div className="text-white/70 text-sm">Live Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100K+</div>
              <div className="text-white/70 text-sm">Active Traders</div>
            </div>
          </motion.div>

          <div className="absolute top-10 left-10 opacity-20">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <TrendingUp className="w-16 h-16 text-white" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-8 right-8"
          >
            <motion.div
              animate={{ 
                y: [-5, 5, -5],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-20 h-24 bg-white rounded-t-full relative"
            >
              <div className="absolute top-6 left-4 w-3 h-4 bg-black rounded-full"></div>
              <div className="absolute top-6 right-4 w-3 h-4 bg-black rounded-full"></div>
              
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-white">
                <svg viewBox="0 0 80 16" className="w-full h-full">
                  <path 
                    d="M0,16 L0,8 Q10,0 20,8 Q30,16 40,8 Q50,0 60,8 Q70,16 80,8 L80,16 Z" 
                    fill="white"
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white font-bold text-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  y: [-10, 10, -10],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                {['₹', '↗', '📈', '💰', '🚀'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeProofSection;