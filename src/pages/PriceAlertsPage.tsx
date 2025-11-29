import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PriceAlertsPage = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, symbol: 'RELIANCE', price: 2500, type: 'above' },
    { id: 2, symbol: 'TCS', price: 3400, type: 'below' },
  ]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gradient-primary">Price Alerts</h1>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Alert
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                  <div>
                    <p className="font-semibold">{alert.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      Alert when price goes {alert.type} ₹{alert.price}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-danger" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PriceAlertsPage;
