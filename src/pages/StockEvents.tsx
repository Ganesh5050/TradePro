import { motion } from 'framer-motion';
import { Calendar, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StockEvents = () => {
  const events = [
    { id: 1, type: 'earnings', company: 'Reliance Industries', date: '2024-01-15', impact: 'high' },
    { id: 2, type: 'dividend', company: 'TCS', date: '2024-01-20', impact: 'medium' },
    { id: 3, type: 'split', company: 'HDFC Bank', date: '2024-01-25', impact: 'high' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'earnings': return <FileText className="w-5 h-5" />;
      case 'dividend': return <DollarSign className="w-5 h-5" />;
      case 'split': return <TrendingUp className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-gradient-primary">Market Events</h1>

          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getIcon(event.type)}
                      <span>{event.company}</span>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      event.impact === 'high' ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'
                    }`}>
                      {event.impact.toUpperCase()} IMPACT
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockEvents;
