import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, TrendingUp, Search, ExternalLink } from 'lucide-react';

const News = () => {
  const marketNews = [
    {
      id: 1,
      title: "Sensex closes 200 points higher amid positive global cues",
      summary: "Indian benchmark indices ended in green today following positive signals from global markets and strong FII inflows.",
      category: "Market",
      time: "2 hours ago",
      source: "MoneyControl",
      impact: "positive"
    },
    {
      id: 2,
      title: "RBI maintains repo rate at 6.50%, signals cautious approach",
      summary: "Reserve Bank of India keeps key lending rate unchanged, citing inflation concerns and economic growth balance.",
      category: "Policy",
      time: "4 hours ago",
      source: "Economic Times",
      impact: "neutral"
    },
    {
      id: 3,
      title: "Tech stocks rally as IT earnings show strong growth",
      summary: "Major IT companies report better-than-expected quarterly results, driving sector-wide optimism.",
      category: "Sector",
      time: "6 hours ago",
      source: "BSE",
      impact: "positive"
    }
  ];

  const stockNews = [
    {
      id: 1,
      title: "Reliance Industries announces major green energy investment",
      summary: "RIL commits ₹75,000 crores for renewable energy projects over next 3 years.",
      stock: "RELIANCE",
      time: "1 hour ago",
      source: "NSE",
      impact: "positive"
    },
    {
      id: 2,
      title: "TCS wins major cloud transformation deal worth $2.25 billion",
      summary: "Tata Consultancy Services secures multi-year contract with European financial services firm.",
      stock: "TCS",
      time: "3 hours ago",
      source: "Trendlyne",
      impact: "positive"
    },
    {
      id: 3,
      title: "HDFC Bank reports 18% growth in Q3 net profit",
      summary: "Private sector lender beats estimates with strong loan growth and improved asset quality.",
      stock: "HDFCBANK",
      time: "5 hours ago",
      source: "Screener",
      impact: "positive"
    }
  ];

  const fiiDiiData = [
    {
      date: "Today",
      fii: { bought: 2340, sold: 1890, net: 450 },
      dii: { bought: 1560, sold: 1780, net: -220 }
    },
    {
      date: "Yesterday",
      fii: { bought: 1980, sold: 2230, net: -250 },
      dii: { bought: 1890, sold: 1650, net: 240 }
    },
    {
      date: "Day Before",
      fii: { bought: 2100, sold: 1850, net: 250 },
      dii: { bought: 1720, sold: 1920, net: -200 }
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-success border-success/30 bg-success/10';
      case 'negative':
        return 'text-danger border-danger/30 bg-danger/10';
      default:
        return 'text-neutral border-neutral/30 bg-neutral/10';
    }
  };

  return (
    <div className="min-h-screen px-4" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Market <span className="text-gradient-primary">News</span>
          </h1>
          <p className="text-muted-foreground">Stay updated with latest market developments</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search news..."
              className="pl-10 glass-card"
            />
          </div>
        </motion.div>

        {/* News Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="market">Market News</TabsTrigger>
              <TabsTrigger value="stocks">Stock News</TabsTrigger>
              <TabsTrigger value="fiidii">FII/DII Activity</TabsTrigger>
            </TabsList>

            {/* Market News */}
            <TabsContent value="market" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {marketNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="trading-card hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(news.impact)}`}>
                        {news.category}
                      </span>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{news.time}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {news.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Source: {news.source}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Stock News */}
            <TabsContent value="stocks" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stockNews.map((news, index) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="trading-card hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium">
                        {news.stock}
                      </span>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{news.time}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {news.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Source: {news.source}</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* FII/DII Activity */}
            <TabsContent value="fiidii" className="space-y-6">
              <div className="trading-card">
                <h3 className="text-xl font-semibold mb-6">Foreign & Domestic Institutional Activity</h3>
                
                <div className="space-y-4">
                  {fiiDiiData.map((data, index) => (
                    <motion.div
                      key={data.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glass-card p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">{data.date}</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* FII */}
                        <div>
                          <h5 className="font-medium mb-3 flex items-center">
                            Foreign Institutional Investors (FII)
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bought:</span>
                              <span>₹{data.fii.bought} Cr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sold:</span>
                              <span>₹{data.fii.sold} Cr</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Net:</span>
                              <span className={data.fii.net > 0 ? 'text-success' : 'text-danger'}>
                                {data.fii.net > 0 ? '+' : ''}₹{data.fii.net} Cr
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* DII */}
                        <div>
                          <h5 className="font-medium mb-3 flex items-center">
                            Domestic Institutional Investors (DII)
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bought:</span>
                              <span>₹{data.dii.bought} Cr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sold:</span>
                              <span>₹{data.dii.sold} Cr</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Net:</span>
                              <span className={data.dii.net > 0 ? 'text-success' : 'text-danger'}>
                                {data.dii.net > 0 ? '+' : ''}₹{data.dii.net} Cr
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default News;