import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PortfolioPerformanceChartProps {
  totalInvested: number;
  currentValue: number;
}

export default function PortfolioPerformanceChart({ totalInvested, currentValue }: PortfolioPerformanceChartProps) {
  // Generate sample data showing portfolio growth over time
  // This creates a realistic growth pattern from invested amount to current value
  const generatePortfolioData = () => {
    const dataPoints = 30; // 30 days of data
    const data = [];
    const growth = currentValue - totalInvested;
    const growthRate = growth / totalInvested;
    
    for (let i = 0; i <= dataPoints; i++) {
      const progress = i / dataPoints;
      // Add some realistic volatility
      const volatility = Math.sin(i * 0.5) * (totalInvested * 0.02);
      // Calculate value with growth trend + volatility
      const value = totalInvested + (growth * progress) + volatility;
      
      data.push({
        day: i === 0 ? 'Start' : i === dataPoints ? 'Now' : `Day ${i}`,
        value: Math.max(value, totalInvested * 0.95), // Don't go below 95% of invested
        invested: totalInvested,
      });
    }
    
    return data;
  };

  const data = generatePortfolioData();
  const isProfit = currentValue >= totalInvested;

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={isProfit ? "#10b981" : "#ef4444"} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6b7280" stopOpacity={0.05}/>
            </linearGradient>
            {/* 3D Shadow effect */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
              <feOffset dx="2" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Portfolio Value']}
            labelStyle={{ color: '#374151', fontWeight: 600 }}
          />
          {/* Invested baseline */}
          <Area
            type="monotone"
            dataKey="invested"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#colorInvested)"
            fillOpacity={0.3}
          />
          {/* Current portfolio value with 3D effect */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={isProfit ? "#10b981" : "#ef4444"}
            strokeWidth={3}
            fill="url(#colorValue)"
            fillOpacity={1}
            filter="url(#shadow)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
