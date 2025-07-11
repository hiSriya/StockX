
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface Product {
  product_id: string;
  product_name: string;
  store_id: string;
  expiry_date: string;
  stock: string;
  MRP: string;
  final_price: string;
  remaining_expected_sales?: string;
}

interface SalesChartProps {
  data: Product[];
  className?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, className = '' }) => {
  const chartData = useMemo(() => {
    const salesMap: { [key: string]: number } = {};
    
    data.forEach(product => {
      const store = product.store_id;
      const sales = parseFloat(product.remaining_expected_sales || '0');
      salesMap[store] = (salesMap[store] || 0) + sales;
    });

    return Object.entries(salesMap)
      .map(([store, sales]) => ({ store, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 15); // Show top 15 stores
  }, [data]);

  const maxSales = Math.max(...chartData.map(d => d.sales));

  // Generate colors based on performance
  const getColor = (sales: number) => {
    const ratio = sales / maxSales;
    if (ratio > 0.8) return '#10b981'; // Green for high performance
    if (ratio > 0.5) return '#f59e0b'; // Amber for medium performance
    return '#ef4444'; // Red for low performance
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`Store: ${label}`}</p>
          <p className="text-blue-600">
            {`Expected Sales: ₹${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <Card className={`shadow-lg border-0 bg-white/80 backdrop-blur ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Expected Sales by Store
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No sales data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg border-0 bg-white/80 backdrop-blur ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Expected Sales by Store
          </div>
          <div className="text-sm text-gray-500">
            Top {chartData.length} performing stores
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="store" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="sales" 
                radius={[4, 4, 0, 0]}
                stroke="white"
                strokeWidth={1}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.sales)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-gray-600">High Performance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded mr-2"></div>
            <span className="text-gray-600">Medium Performance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-gray-600">Low Performance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
