import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, TrendingDown } from 'lucide-react';

interface TradingPanelProps {
  symbol: string;
  currentPrice: number;
}

const TradingPanel = ({ symbol, currentPrice }: TradingPanelProps) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label>Order Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={orderType === 'market' ? 'default' : 'secondary'}
                  onClick={() => setOrderType('market')}
                  className="flex-1"
                >
                  Market
                </Button>
                <Button
                  variant={orderType === 'limit' ? 'default' : 'secondary'}
                  onClick={() => setOrderType('limit')}
                  className="flex-1"
                >
                  Limit
                </Button>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="font-semibold">₹{currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">₹{(currentPrice * quantity).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full gap-2" size="lg">
              <ShoppingCart className="w-4 h-4" />
              Buy {symbol}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <Button variant="destructive" className="w-full gap-2" size="lg">
              <TrendingDown className="w-4 h-4" />
              Sell {symbol}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingPanel;
