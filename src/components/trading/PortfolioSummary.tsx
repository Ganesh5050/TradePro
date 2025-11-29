import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, PieChart, Activity } from 'lucide-react';

interface PortfolioSummaryProps {
  balance: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

export default function PortfolioSummary({
  balance,
  totalInvested,
  currentValue,
  profitLoss,
  profitLossPercent
}: PortfolioSummaryProps) {
  const isProfit = profitLoss >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Available Balance</CardTitle>
          <Wallet className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">₹{balance.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Cash available to trade</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total Investment</CardTitle>
          <PieChart className="h-5 w-5 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">₹{totalInvested.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Amount invested in stocks</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Current Value</CardTitle>
          <Activity className="h-5 w-5 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">₹{currentValue.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Current portfolio value</p>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">Total P&L</CardTitle>
          <TrendingUp className={`h-5 w-5 ${isProfit ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}₹{profitLoss.toFixed(2)}
          </div>
          <p className={`text-xs font-medium ${isProfit ? 'text-green-600' : 'text-red-600'} mt-1`}>
            {isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}% overall
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
