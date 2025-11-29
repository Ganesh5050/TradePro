import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Receipt, Clock } from 'lucide-react';

export default function Transactions() {
  const { user, isAuthenticated } = useAuthStore();
  const { transactions, fetchTransactions } = usePortfolioStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'transactions'>('transactions');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchTransactions(user.id);
    }
  }, [isAuthenticated, user]);

  // Auto-refresh transactions every 2 seconds
  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchTransactions(user.id);
    }, 2000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const orders: any[] = []; // Pending orders (empty for now since orders execute immediately)

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">View your orders and transaction history</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'transactions'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No pending orders</p>
                    <p className="text-sm text-gray-500 mt-1">All your orders are executed immediately at market price</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-700 font-semibold">Order Time</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Stock</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Quantity</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Price</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Orders will be displayed here when implemented */}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Transaction History ({transactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No transactions yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start trading to see your transaction history</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-gray-700 font-semibold">Date & Time</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Stock</TableHead>
                        <TableHead className="text-gray-700 font-semibold">Type</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Quantity</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Price</TableHead>
                        <TableHead className="text-right text-gray-700 font-semibold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-gray-200 hover:bg-gray-50">
                          <TableCell className="text-sm text-gray-600">
                            {formatDate(transaction.created_at)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-semibold text-gray-900">{transaction.symbol}</p>
                              <p className="text-xs text-gray-500">{transaction.stock_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {transaction.type === 'BUY' ? (
                                <>
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                  <span className="font-medium text-green-600">BUY</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                  <span className="font-medium text-red-600">SELL</span>
                                </>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-gray-900">{transaction.quantity}</TableCell>
                          <TableCell className="text-right text-gray-900">₹{transaction.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold text-gray-900">
                            ₹{transaction.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
