import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import HeroSection from '@/components/ui/hero-section';
import SmoothScrollStack from '@/components/ui/SmoothScrollStack';
import CountUpAnimation from '@/components/CountUpAnimation';
import { ScrollRevealFooter } from '@/components/ui/ScrollRevealFooter';
import FooterContent from '@/components/layout/FooterContent';
import BigLogoSection from '@/components/ui/BigLogoSection';
import TradeProofSection from '@/components/ui/TradeProofSection';
import BentoGrid from '@/components/ui/BentoGrid';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Users, BookOpen, Trophy, BarChart3, Zap, Target, Award, CheckCircle, ArrowRight, LineChart, Wallet, Brain, X } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start 70%", "end 60%"]
  });

  const lineProgress = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  const opacity2 = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.5], [50, 0]);

  const opacity3 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.8], [50, 0]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <ScrollRevealFooter
      footer={
        <div className="flex flex-col w-full">
          <FooterContent />
          <BigLogoSection />
        </div>
      }
    >
      <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
        <HeroSection />

        {/* Stats Section */}
        <section className="py-16 px-4 bg-white border-y border-gray-200">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: 1000000, label: 'Virtual Money', icon: Wallet, prefix: '₹', suffix: 'L', formatAs: 'lakhs' as const },
                { number: 2000, label: 'Live Stocks', icon: LineChart, suffix: '+', formatAs: 'number' as const },
                { number: 100000, label: 'Active Traders', icon: Users, suffix: 'K+', formatAs: 'thousands' as const },
                { number: 45, label: 'Sectors', icon: Target, suffix: '+', formatAs: 'number' as const }
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
                  <div className="text-4xl font-bold text-black mb-2">
                    <CountUpAnimation
                      end={stat.number}
                      duration={3000}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      formatAs={stat.formatAs}
                    />
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid Section */}
        <BentoGrid />

        {/* Sticky Scroll "How It Works" Section */}
        <section ref={stepsRef} className="relative h-[300vh] bg-white">
          <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
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

              <div className="relative max-w-5xl mx-auto min-h-[400px] flex items-center justify-center">
                {/* Connecting Progress Line (Desktop) */}
                <div className="hidden md:block absolute top-[50%] left-8 right-8 h-1 bg-gray-100 -translate-y-1/2 -z-0 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black"
                    style={{ width: lineProgress }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                  {[
                    {
                      step: '01',
                      title: 'Create Account',
                      description: 'Sign up in seconds and get ₹10L virtual money',
                      icon: Users,
                      style: { opacity: opacity1, y: y1, scale: opacity1 }
                    },
                    {
                      step: '02',
                      title: 'Learn & Practice',
                      description: 'Access tutorials and analyze real-time market data',
                      icon: Brain,
                      style: { opacity: opacity2, y: y2, scale: opacity2 }
                    },
                    {
                      step: '03',
                      title: 'Track Progress',
                      description: 'Monitor your portfolio and compete on leaderboards',
                      icon: Trophy,
                      style: { opacity: opacity3, y: y3, scale: opacity3 }
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      style={item.style}
                      className="relative z-10"
                    >
                      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-black transition-all hover:shadow-xl h-full group flex flex-col items-center text-center">
                        <motion.div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-4 z-20"
                          style={{
                            backgroundColor: 'black',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                          }}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                        >
                          {item.step}
                        </motion.div>
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-gray-100 group-hover:bg-black transition-colors duration-300">
                          <item.icon className="w-8 h-8 text-black group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-black">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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

        {/* Trade Proof Section */}
        <TradeProofSection />
      </div>
    </ScrollRevealFooter >
  );
};

export default Index;
