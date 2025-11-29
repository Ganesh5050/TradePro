import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, BarChart3, Briefcase, Settings } from 'lucide-react';

export default function UserManual() {
  const sections = [
    {
      title: 'Getting Started',
      icon: BookOpen,
      content: [
        {
          subtitle: 'Creating an Account',
          text: 'Sign up with your email to create a free account. You will receive ₹1,00,000 virtual money to start trading.'
        },
        {
          subtitle: 'Dashboard Overview',
          text: 'The dashboard shows market indices, all available stocks, and your portfolio summary. Use the search bar to find specific stocks.'
        },
        {
          subtitle: 'Navigation',
          text: 'Use the top navigation bar to access Dashboard, Portfolio, Advanced tools, Learn resources, Leaderboard, and News.'
        }
      ]
    },
    {
      title: 'Trading Stocks',
      icon: TrendingUp,
      content: [
        {
          subtitle: 'Viewing Stock Details',
          text: 'Click on any stock card to view detailed information including current price, charts, and trading panel.'
        },
        {
          subtitle: 'Placing Orders',
          text: 'On the stock detail page, select Buy or Sell, enter quantity, and confirm. Orders execute at current market price.'
        },
        {
          subtitle: 'Market Hours',
          text: 'Trading is available Monday to Friday, 9:15 AM to 3:30 PM IST. Prices update every 3.5 seconds during market hours.'
        }
      ]
    },
    {
      title: 'Portfolio Management',
      icon: Briefcase,
      content: [
        {
          subtitle: 'Holdings',
          text: 'View all your stock holdings with purchase price, current value, profit/loss, and performance metrics.'
        },
        {
          subtitle: 'Performance Chart',
          text: 'Track your portfolio performance over time with the interactive chart showing growth from initial investment.'
        },
        {
          subtitle: 'Portfolio Allocation',
          text: 'See how your investments are distributed across different stocks with the colorful allocation bar chart.'
        }
      ]
    },
    {
      title: 'Advanced Features',
      icon: BarChart3,
      content: [
        {
          subtitle: 'Heat Maps',
          text: 'Visual representation of market performance by sector and market cap. Green indicates gains, red indicates losses.'
        },
        {
          subtitle: 'Sector Analysis',
          text: 'Browse stocks by sector (IT, Banking, Pharma, etc.) and analyze sector-wise performance with gainers/losers count.'
        },
        {
          subtitle: 'Market Indices',
          text: 'Track major indices like NIFTY 50, SENSEX, NIFTY BANK with real-time data and performance metrics.'
        }
      ]
    },
    {
      title: 'Learning Resources',
      icon: BookOpen,
      content: [
        {
          subtitle: 'Candlestick Patterns',
          text: 'Learn to identify bullish and bearish candlestick patterns like Doji, Hammer, Engulfing, Morning Star, etc.'
        },
        {
          subtitle: 'Chart Patterns',
          text: 'Understand movement patterns like Head & Shoulders, Double Top/Bottom, Triangles, Wedges, and Cup & Handle.'
        },
        {
          subtitle: 'Recommendations',
          text: 'Get expert stock recommendations and analysis (coming soon).'
        }
      ]
    },
    {
      title: 'Settings & Account',
      icon: Settings,
      content: [
        {
          subtitle: 'Profile Settings',
          text: 'Update your profile information, change password, and manage account preferences.'
        },
        {
          subtitle: 'Notifications',
          text: 'Configure price alerts, portfolio updates, and news notifications according to your preferences.'
        },
        {
          subtitle: 'Reset Portfolio',
          text: 'Reset your portfolio to start fresh with ₹1,00,000 virtual money (available in settings).'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Manual</h1>
          <p className="text-gray-600 mt-2">Complete guide to using TradePro Elite platform</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title} className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {section.content.map((item, index) => (
                      <div key={index}>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.subtitle}</h3>
                        <p className="text-sm text-gray-600">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-blue-900">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Start with small trades to understand the platform</li>
              <li>• Use the search bar to quickly find stocks</li>
              <li>• Check the Leaderboard to see top performers</li>
              <li>• Learn patterns before making trading decisions</li>
              <li>• Monitor your portfolio regularly</li>
              <li>• Practice different trading strategies risk-free</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
