
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertTriangle, IndianRupee } from 'lucide-react';

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

interface StoreComparisonProps {
  data: Product[];
  stores: string[];
}

const StoreComparison: React.FC<StoreComparisonProps> = ({ data, stores }) => {
  const [selectedStores, setSelectedStores] = useState<string[]>(['S001', 'S002', 'S003']);
  
  const getStoreMetrics = (storeId: string) => {
    const storeProducts = data.filter(product => product.store_id === storeId);
    const totalProducts = storeProducts.length;
    const totalStock = storeProducts.reduce((sum, product) => sum + parseInt(product.stock), 0);
    const lowStock = storeProducts.filter(product => parseInt(product.stock) < 10).length;
    const expiring = storeProducts.filter(product => {
      const expiryDate = new Date(product.expiry_date);
      const today = new Date();
      const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      return daysUntilExpiry <= 7;
    }).length;
    const totalValue = storeProducts.reduce((sum, product) => 
      sum + (parseFloat(product.final_price) * parseInt(product.stock)), 0
    );
    const expectedSales = storeProducts.reduce((sum, product) => 
      sum + parseFloat(product.remaining_expected_sales || '0'), 0
    );
    
    return {
      storeId,
      totalProducts,
      totalStock,
      lowStock,
      expiring,
      totalValue,
      expectedSales,
      efficiency: totalProducts > 0 ? ((totalStock - lowStock) / totalStock * 100) : 0
    };
  };

  const comparisonData = selectedStores.map(getStoreMetrics);
  
  const chartData = comparisonData.map(store => ({
    store: store.storeId,
    products: store.totalProducts,
    stock: store.totalStock,
    lowStock: store.lowStock,
    expiring: store.expiring,
    value: store.totalValue,
    efficiency: store.efficiency
  }));

  const pieData = comparisonData.map(store => ({
    name: store.storeId,
    value: store.totalValue
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const handleStoreToggle = (storeId: string) => {
    setSelectedStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId].slice(0, 6) // Limit to 6 stores
    );
  };

  return (
    <div className="space-y-6">
      {/* Store Selection */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Store Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {stores.slice(0, 15).map(storeId => (
              <Badge
                key={storeId}
                variant={selectedStores.includes(storeId) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => handleStoreToggle(storeId)}
              >
                {storeId}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Selected: {selectedStores.length}/6 stores (Click to toggle)
          </p>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {comparisonData.map((store, index) => (
          <Card key={store.storeId} className="shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{store.storeId}</h3>
                <Badge 
                  className={`${
                    store.efficiency > 80 ? 'bg-green-100 text-green-800' :
                    store.efficiency > 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {store.efficiency.toFixed(0)}% Efficiency
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Products</span>
                  <span className="font-semibold">{store.totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Stock</span>
                  <span className="font-semibold">{store.totalStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Low Stock</span>
                  <span className="font-semibold text-red-600">{store.lowStock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Expiring</span>
                  <span className="font-semibold text-orange-600">{store.expiring}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Value</span>
                  <span className="font-semibold">₹{store.totalValue.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="store" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="products" fill="#3B82F6" name="Total Products" />
                <Bar dataKey="lowStock" fill="#EF4444" name="Low Stock" />
                <Bar dataKey="expiring" fill="#F59E0B" name="Expiring" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Inventory Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Rankings */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Performance Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Best Performers */}
            <div>
              <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Top Performers
              </h4>
              {comparisonData
                .sort((a, b) => b.efficiency - a.efficiency)
                .slice(0, 3)
                .map((store, index) => (
                  <div key={store.storeId} className="flex items-center justify-between py-2">
                    <span className="font-medium">{store.storeId}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {store.efficiency.toFixed(0)}%
                    </Badge>
                  </div>
                ))}
            </div>

            {/* Needs Attention */}
            <div>
              <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Needs Attention
              </h4>
              {comparisonData
                .sort((a, b) => (b.lowStock + b.expiring) - (a.lowStock + a.expiring))
                .slice(0, 3)
                .map((store, index) => (
                  <div key={store.storeId} className="flex items-center justify-between py-2">
                    <span className="font-medium">{store.storeId}</span>
                    <Badge variant="destructive">
                      {store.lowStock + store.expiring} issues
                    </Badge>
                  </div>
                ))}
            </div>

            {/* Highest Value */}
            <div>
              <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                <IndianRupee className="w-4 h-4 mr-2" />
                Highest Value
              </h4>
              {comparisonData
                .sort((a, b) => b.totalValue - a.totalValue)
                .slice(0, 3)
                .map((store, index) => (
                  <div key={store.storeId} className="flex items-center justify-between py-2">
                    <span className="font-medium">{store.storeId}</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      ₹{(store.totalValue / 1000).toFixed(0)}K
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreComparison;
