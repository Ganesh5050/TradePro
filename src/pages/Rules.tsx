import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';

export default function Rules() {
  const rules = [
    {
      category: 'Trading Rules',
      items: [
        'All trades are executed in a simulated environment with virtual money',
        'Starting virtual balance: ₹1,00,000',
        'Market hours: Monday to Friday, 9:15 AM to 3:30 PM IST',
        'Orders are executed at real-time market prices from live data',
        'No actual money is involved - this is a paper trading platform',
      ]
    },
    {
      category: 'Order Types',
      items: [
        'Market Orders: Executed immediately at current market price',
        'Limit Orders: Executed only when price reaches your specified limit',
        'Stop Loss Orders: Automatically sell when price falls below specified level',
        'All orders follow standard NSE/BSE trading rules',
      ]
    },
    {
      category: 'Position Limits',
      items: [
        'Maximum position size: 100% of available balance',
        'No margin trading or leverage in paper trading mode',
        'Short selling is not available in paper trading',
        'Maximum 50 open positions at a time',
      ]
    },
    {
      category: 'Brokerage & Charges',
      items: [
        'Zero brokerage charges for paper trading',
        'No transaction fees, STT, or GST charges',
        'All profits and losses are virtual',
        'Real trading would include: Brokerage (0.03% - 0.05%), STT, Exchange fees, GST',
      ]
    },
    {
      category: 'Account Rules',
      items: [
        'One account per user',
        'Account data is saved and synced across devices',
        'Portfolio and transaction history maintained indefinitely',
        'Reset portfolio option available in settings',
      ]
    },
    {
      category: 'Fair Usage Policy',
      items: [
        'Use the platform for learning and practice purposes',
        'Do not attempt to manipulate or exploit the system',
        'Respect other users in leaderboard and community features',
        'Accounts violating terms may be suspended',
      ]
    },
    {
      category: 'Data & Privacy',
      items: [
        'Live stock prices sourced from Google Sheets integration',
        'Prices update every 3.5 seconds during market hours',
        'Your trading data is private and not shared with others',
        'Leaderboard shows only username and portfolio value',
      ]
    },
  ];

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Trading Rules & Regulations</h1>
          <p className="text-gray-600 mt-2">Important rules and guidelines for using TradePro Elite</p>
        </div>

        {/* Important Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Paper Trading Platform</h3>
                <p className="text-sm text-blue-800">
                  TradePro Elite is a paper trading platform for learning and practice. All trades use virtual money. 
                  No real money is involved, and no actual stocks are bought or sold.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rules Sections */}
        <div className="space-y-4">
          {rules.map((section) => (
            <Card key={section.category} className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Disclaimer</h3>
                <p className="text-sm text-yellow-800">
                  Past performance in paper trading does not guarantee future results in real trading. 
                  Real trading involves actual financial risk. Always consult with a financial advisor before 
                  investing real money in the stock market.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
