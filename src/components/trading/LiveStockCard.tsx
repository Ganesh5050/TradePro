import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LiveStockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  isLive?: boolean;
}

const LiveStockCard = ({ symbol, name, price, change, changePercent, isLive = true }: LiveStockCardProps) => {
  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">{symbol}</h3>
              <p className="text-sm text-muted-foreground truncate max-w-[150px]">{name}</p>
            </div>
            {isLive && (
              <div className="flex items-center gap-1 text-success">
                <Activity className="w-3 h-3 animate-pulse" />
                <span className="text-xs">LIVE</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold">
              ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-success' : 'text-danger'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isPositive ? '+' : ''}₹{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LiveStockCard;
