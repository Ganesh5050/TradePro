import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
// import { useAuthStore } from '@/stores/useAuthStore'; // Temporarily disabled

interface SellModalProps {
  symbol: string;
  stockName: string;
  availableQuantity: number;
  currentPrice: number;
  onClose: () => void;
}

export default function SellModal({ 
  symbol, 
  stockName, 
  availableQuantity, 
  currentPrice, 
  onClose 
}: SellModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { sellStock } = usePortfolioStore();
  // Mock user to replace useAuthStore while it's broken
  const user = { id: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
  // const { user } = useAuthStore(); // Temporarily disabled

  const totalAmount = quantity * currentPrice;

  const handleSell = async () => {
    if (!user) {
      toast.error('Please login to trade');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    if (quantity > availableQuantity) {
      toast.error(`Not enough quantity to sell! You only have ${availableQuantity} shares`);
      return;
    }

    setIsProcessing(true);
    try {
      await sellStock(user.id, symbol, stockName, quantity, currentPrice);
      toast.success(`Successfully sold ${quantity} shares of ${symbol} at ₹${currentPrice.toFixed(2)}`);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to sell stock');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{symbol}</h2>
            <p className="text-sm text-gray-600">{stockName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Price */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Current Price</p>
            <p className="text-3xl font-bold text-gray-900">₹{currentPrice.toFixed(2)}</p>
          </div>

          {/* Available Quantity */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              Available: {availableQuantity} {availableQuantity === 1 ? 'share' : 'shares'}
            </p>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Shares)
            </label>
            <input
              type="number"
              min="1"
              max={availableQuantity}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.min(val, availableQuantity));
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {availableQuantity} shares
            </p>
          </div>

          {/* Total Amount */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Sell Button */}
          <button
            onClick={handleSell}
            disabled={isProcessing || quantity > availableQuantity}
            className="w-full py-4 px-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'rgb(220, 38, 38)',
              boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)'
            }}
          >
            {isProcessing ? 'Processing...' : `Sell ${quantity} ${quantity === 1 ? 'Share' : 'Shares'}`}
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
