import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TechnicalAnalysis = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold text-gradient-primary">Technical Analysis</h1>

          <Tabs defaultValue="indicators" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="indicators">Indicators</TabsTrigger>
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="signals">Signals</TabsTrigger>
            </TabsList>

            <TabsContent value="indicators" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      RSI
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">64.5</div>
                    <p className="text-sm text-muted-foreground">Relative Strength Index</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      MACD
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-success">+12.3</div>
                    <p className="text-sm text-muted-foreground">Bullish Signal</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Volume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2.5M</div>
                    <p className="text-sm text-muted-foreground">Above Average</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="patterns">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Pattern recognition analysis will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signals">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">Trading signals will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
