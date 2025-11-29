import { motion } from 'framer-motion';
import { TrendingUp, Shield, Users, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: '120px' }}>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            About TradePro Elite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering traders with risk-free learning and real market experience
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-black">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To democratize stock market education and provide every aspiring trader 
                with the tools, knowledge, and confidence needed to succeed in the Indian 
                stock market.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that everyone deserves access to quality financial education 
                without risking their hard-earned money. That's why we created TradePro Elite - 
                a comprehensive paper trading platform that mirrors real market conditions.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-black mb-2">₹10L</div>
                  <div className="text-sm text-gray-600">Virtual Capital</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-black mb-2">2000+</div>
                  <div className="text-sm text-gray-600">Live Stocks</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-black mb-2">45+</div>
                  <div className="text-sm text-gray-600">Sectors</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-black mb-2">100%</div>
                  <div className="text-sm text-gray-600">Risk-Free</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-black">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Risk-Free Learning",
                description: "Practice trading without any financial risk using virtual money"
              },
              {
                icon: TrendingUp,
                title: "Real Market Data",
                description: "Experience live NSE/BSE prices and authentic market conditions"
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Learn from fellow traders and compete on global leaderboards"
              }
            ].map((value) => (
              <div key={value.title} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition-all hover:shadow-xl">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-black">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold mb-12 text-center text-black">What We Offer</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              "Real-time NSE/BSE stock prices updated every 3.5 seconds",
              "₹10,00,000 virtual money for risk-free trading",
              "Comprehensive portfolio management and analytics",
              "Advanced learning resources and trading patterns",
              "Sector analysis and market heat maps",
              "Transaction history and performance tracking",
              "Leaderboards and achievement system",
              "Mobile-responsive design for trading on-the-go"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-black flex-shrink-0 mt-1" />
                <span className="text-lg text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6 text-black">Built for Traders, by Traders</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Our team consists of experienced traders, developers, and financial experts 
            who understand the challenges of learning to trade in the Indian market.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-12 border border-gray-200">
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-black mb-2">2024</div>
                <div className="text-gray-600">Founded</div>
              </div>
              <div className="w-px h-16 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-5xl font-bold text-black mb-2">100K+</div>
                <div className="text-gray-600">Traders</div>
              </div>
              <div className="w-px h-16 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-5xl font-bold text-black mb-2">4.8★</div>
                <div className="text-gray-600">Rating</div>
              </div>
            </div>
            <p className="text-lg text-gray-700">
              Join thousands of traders who have already started their journey with TradePro Elite
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
