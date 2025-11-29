import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockCardProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    sector: string;
  };
}

export default function StockCard({ stock }: StockCardProps) {
  const navigate = useNavigate();
  const isPositive = stock.changePercent >= 0;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/stock/${stock.symbol}`)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{stock.symbol}</span>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">₹{stock.price ? stock.price.toFixed(2) : '0.00'}</span>
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{stock.changePercent ? stock.changePercent.toFixed(2) : '0.00'}%
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Vol: {stock.volume ? (stock.volume / 1000).toFixed(1) : '0'}K</span>
            <span className="truncate ml-2">{stock.sector || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
