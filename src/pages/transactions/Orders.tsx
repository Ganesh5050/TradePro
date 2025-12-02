import { useEffect } from 'react';
// import { useAuthStore } from '@/stores/useAuthStore'; // Temporarily disabled
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export default function Orders() {
  // Mock values to replace useAuthStore while it's broken
  const user = { id: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
  const isAuthenticated = true;
  // const { user, isAuthenticated } = useAuthStore(); // Temporarily disabled
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  // For now, orders are empty since we execute immediately
  // In future, this will show pending orders
  const orders: any[] = [];

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">View your pending orders</p>
        </div>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No pending orders</p>
                  <p className="text-sm text-gray-500 mt-1">All your orders are executed immediately</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Orders will be displayed here when implemented */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
