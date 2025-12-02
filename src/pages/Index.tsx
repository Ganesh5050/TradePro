import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '@/stores/useAuthStore'; // Temporarily disabled
import HeroSection from '@/components/ui/hero-section';
import SmoothScrollStack from '@/components/ui/SmoothScrollStack';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users, BookOpen, Trophy, BarChart3, Zap, Target, Award, CheckCircle, ArrowRight, LineChart, Wallet, Brain, X } from 'lucide-react';

const Index = () => {
  // Mock value to replace useAuthStore while it's broken
  const isAuthenticated = false;
  // const { isAuthenticated } = useAuthStore(); // Temporarily disabled
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-16 px-4 bg-white border-y border-gray-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '₹10L', label: 'Virtual Money', icon: Wallet },
              { number: '2000+', label: 'Live Stocks', icon: LineChart },
              { number: '100K+', label: 'Active Traders', icon: Users },
              { number: '45+', label: 'Sectors', icon: Target }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
              Start Trading in <span className="text-black">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with paper trading in minutes - no credit card required
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Create Free Account',
                description: 'Sign up in seconds and get ₹10,00,000 virtual money to start trading',
                icon: Users
              },
              {
                step: '02',
                title: 'Learn & Practice',
                description: 'Access tutorials, analyze real-time market data, and practice strategies',
                icon: Brain
              },
              {
                step: '03',
                title: 'Track Progress',
                description: 'Monitor your portfolio, compete on leaderboards, and earn achievements',
                icon: Trophy
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black transition-all hover:shadow-xl">
                  <div 
                    className="absolute -top-6 left-8 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{
                      backgroundColor: 'black',
                      boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px'
                    }}
                  >
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 mt-4 bg-gray-100">
                    <item.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-black">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
              Everything You Need to <span className="text-black">Master Trading</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional-grade tools and features designed for Indian stock market
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Real-Time Market Data",
                description: "Live NSE/BSE prices updated every 3.5 seconds with 2000+ stocks"
              },
              {
                icon: Shield,
                title: "100% Risk-Free",
                description: "Practice with ₹10 lakh virtual money - no real money at risk"
              },
              {
                icon: BookOpen,
                title: "Learning Resources",
                description: "Candlestick patterns, chart analysis, and trading strategies"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Technical indicators, heat maps, and sector analysis"
              },
              {
                icon: Users,
                title: "Leaderboards",
                description: "Compete with traders and learn from top performers"
              },
              {
                icon: Trophy,
                title: "Achievements",
                description: "Unlock badges and track your trading milestones"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all group hover:border-black"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-black">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ScrollStack Section - Paper Trading Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
              Powerful Features for Traders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Scroll to explore our comprehensive trading platform
            </p>
          </motion.div>

          <SmoothScrollStack
            cards={[
              {
                title: "Video Demo",
                content: (
                  <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-12">
                      <button
                        onClick={() => setIsVideoModalOpen(true)}
                        className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform cursor-pointer"
                        style={{
                          boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px'
                        }}
                      >
                        <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                      <h3 className="text-4xl font-bold mb-4 text-black">See TradePro in Action</h3>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Watch how easy it is to start trading with our platform
                      </p>
                      <p className="text-sm text-gray-500 mt-4">Click to watch demo</p>
                    </div>
                  </div>
                )
              },
              {
                title: "Live Dashboard",
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full p-12">
                    <div>
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl font-bold mb-4 text-black">Live Dashboard</h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Monitor real-time market data, track your portfolio performance, and access 2000+ stocks 
                        with live NSE/BSE prices updated every 3.5 seconds.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Real-time stock prices</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Market indices tracking</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Portfolio analytics</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center border-2 border-gray-200">
                      <div className="text-center">
                        <BarChart3 className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Dashboard Screenshot</p>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                title: "Easy Buy & Sell",
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full p-12">
                    <div className="bg-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center border-2 border-gray-200">
                      <div className="text-center">
                        <TrendingUp className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Trading Interface</p>
                      </div>
                    </div>
                    <div>
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl font-bold mb-4 text-black">Easy Buy & Sell</h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Execute trades instantly with our intuitive interface. Buy and sell stocks with just 
                        a few clicks, just like real trading platforms.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>One-click trading</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Real-time order execution</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Transaction history</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )
              },
              {
                title: "Learn Patterns",
                content: (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full p-12">
                    <div>
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl font-bold mb-4 text-black">Learn Patterns</h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Master candlestick patterns and chart movements with our comprehensive learning resources. 
                        Understand market psychology and technical analysis.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Candlestick patterns</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Chart movement analysis</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-black flex-shrink-0" />
                          <span>Interactive tutorials</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-8 h-80 flex items-center justify-center border-2 border-gray-200">
                      <div className="text-center">
                        <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Pattern Learning</p>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                title: "Coming Soon",
                content: (
                  <div className="relative w-full h-full flex items-center justify-center p-12">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                        <span className="text-6xl">🚀</span>
                      </div>
                      <h3 className="text-5xl font-bold text-gray-900 mb-6">More Features Coming Soon</h3>
                      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        We're constantly working on new features to enhance your trading experience
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center">
                        <div className="px-6 py-3 bg-gray-100 rounded-full">
                          <span className="text-gray-700 font-medium">Advanced Analytics</span>
                        </div>
                        <div className="px-6 py-3 bg-gray-100 rounded-full">
                          <span className="text-gray-700 font-medium">AI Insights</span>
                        </div>
                        <div className="px-6 py-3 bg-gray-100 rounded-full">
                          <span className="text-gray-700 font-medium">Social Trading</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </div>
      </section>

      {/* Why Paper Trading Section */}
      <section className="py-12 px-4 bg-gray-50" style={{ marginTop: '-100vh' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black">
                Why <span className="text-black">Paper Trading</span>?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Master the art of trading without risking your hard-earned money. Build confidence, test strategies, and learn from mistakes in a safe environment.
              </p>
              <div className="space-y-4">
                {[
                  'Practice with real market conditions',
                  'Test trading strategies risk-free',
                  'Learn from mistakes without losses',
                  'Build confidence before real trading',
                  'Track and analyze your performance'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-black flex-shrink-0" />
                    <span className="text-lg text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 font-medium">Portfolio Value</span>
                    <TrendingUp className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">₹12,45,890</div>
                  <div className="text-black font-semibold">+24.59% ↑</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Invested</div>
                    <div className="text-xl font-bold text-black">₹10,00,000</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Profit</div>
                    <div className="text-xl font-bold text-black">+₹2,45,890</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <X className="w-6 h-6 text-black" />
            </button>
            
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="TradePro Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Modern Footer */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 flex items-center justify-center transition-transform"
                  style={{
                    borderRadius: '50px',
                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)',
                    backgroundColor: 'rgb(236, 237, 241)'
                  }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: 'black' }} />
                </div>
                <span className="text-2xl font-bold">TradePro Elite</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Master Indian stock trading with our advanced paper trading platform. 
                Practice risk-free with ₹10 lakh virtual money.
              </p>
              <div className="flex gap-3">
                {/* Twitter/X */}
                <a 
                  href="https://x.com/" 
                  target="_blank" 
                  rel="noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgb(236, 237, 241)',
                    borderRadius: '50px',
                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                    <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com/" 
                  target="_blank" 
                  rel="noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgb(236, 237, 241)',
                    borderRadius: '50px',
                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                    <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24ZM96,176a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0ZM88,92a12,12,0,1,1,12-12A12,12,0,0,1,88,92Zm96,84a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140Z"></path>
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com/" 
                  target="_blank" 
                  rel="noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgb(236, 237, 241)',
                    borderRadius: '50px',
                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                    <path d="M234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-73.74,65-40,28A8,8,0,0,1,108,156V100a8,8,0,0,1,12.59-6.55l40,28a8,8,0,0,1,0,13.1Z"></path>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com/" 
                  target="_blank" 
                  rel="noopener"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgb(236, 237, 241)',
                    borderRadius: '50px',
                    boxShadow: '-2px -2px 4px 0px rgb(250, 251, 255), 2px 2px 4px 0px rgba(0, 125, 252, 0.15)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: '20px', height: '20px', fill: 'black' }}>
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="/learn" className="text-gray-400 hover:text-white transition-colors">Learn</a></li>
                <li><a href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">Leaderboard</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 TradePro Elite. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with ❤️ for Indian traders
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
