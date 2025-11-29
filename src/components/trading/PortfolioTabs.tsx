import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, History, Target } from 'lucide-react';

const PortfolioTabs = () => {
  return (
    <Tabs defaultValue="holdings" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="holdings" className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Holdings
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-2">
          <History className="w-4 h-4" />
          History
        </TabsTrigger>
        <TabsTrigger value="performance" className="gap-2">
          <Target className="w-4 h-4" />
          Performance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="holdings">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Your current holdings will be displayed here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Transaction history will be displayed here</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Portfolio performance metrics will be displayed here</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default PortfolioTabs;
