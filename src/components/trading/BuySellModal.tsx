import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

interface BuySellModalProps {
  open: boolean;
  onClose: () => void;
  stock: {
    symbol: string;
    name: string;
    price: number;
  };
}

export default function BuySellModal({ open, onClose, stock }: BuySellModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('buy');
  const { buyStock, sellStock, balance } = usePortfolioStore();
  const { user } = useAuthStore();

  const total = quantity * stock.price;

  const handleBuy = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    if (total > balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await buyStock(user.id, stock.symbol, quantity, stock.price);
      toast(`Bought ${quantity} shares of ${stock.symbol}`, {
        duration: 5000,
        style: {
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
      onClose();
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to buy stock');
    }
  };

  const handleSell = async () => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      await sellStock(user.id, stock.symbol, quantity, stock.price);
      toast.error(`Sold ${quantity} shares of ${stock.symbol}`, {
        duration: 5000,
        style: {
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
        }
      });
      onClose();
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sell stock');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{stock.symbol} - {stock.name}</DialogTitle>
          <p className="text-2xl font-bold">₹{stock.price.toFixed(2)}</p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Price per share:</span>
                <span className="font-medium">₹{stock.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Available balance:</span>
                <span>₹{balance.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handleBuy} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={total > balance}
            >
              Buy {quantity} shares
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sell-quantity">Quantity</Label>
              <Input
                id="sell-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Price per share:</span>
                <span className="font-medium">₹{stock.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              onClick={handleSell} 
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Sell {quantity} shares
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
