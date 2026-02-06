import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SectorAllocationChartProps {
    holdings: Array<{
        symbol: string;
        currentValue: number;
        sector?: string;
    }>;
    stocks: Array<{
        symbol: string;
        sector: string;
    }>;
}

// Vibrant color palette for sectors
const SECTOR_COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16', // Lime
    '#f97316', // Orange
    '#6366f1', // Indigo
    '#14b8a6', // Teal
    '#a855f7', // Violet
    '#22d3ee', // Sky
    '#facc15', // Yellow
    '#fb923c', // Orange-400
];

export default function SectorAllocationChart({ holdings, stocks }: SectorAllocationChartProps) {
    // Calculate sector-wise allocation
    const sectorData = holdings.reduce((acc, holding) => {
        const stock = stocks.find(s => s.symbol === holding.symbol);
        const sector = stock?.sector || 'Others';

        if (!acc[sector]) {
            acc[sector] = 0;
        }
        acc[sector] += holding.currentValue;

        return acc;
    }, {} as Record<string, number>);

    // Convert to array format for Recharts
    const chartData = Object.entries(sectorData)
        .map(([name, value]) => ({
            name,
            value,
            percentage: 0, // Will be calculated below
        }))
        .sort((a, b) => b.value - a.value); // Sort by value descending

    // Calculate percentages
    const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
    chartData.forEach(item => {
        item.percentage = (item.value / totalValue) * 100;
    });

    // Custom label renderer
    const renderCustomLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Only show label if percentage is > 5%
        if (percent * 100 < 5) return null;

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-semibold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                        ₹{data.value.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                        {data.percentage.toFixed(2)}% of portfolio
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom legend
    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-gray-700 truncate">
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                No sector data available
            </div>
        );
    }

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegend} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
