
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Upload, BarChart3, Package, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import FileUploader from '@/components/FileUploader';
import ProductCard from '@/components/ProductCard';
import TransferSuggestions from '@/components/TransferSuggestions';
import SalesChart from '@/components/SalesChart';

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

interface Transfer {
  product_id: string;
  from_store: string;
  to_store: string;
  quantity: string;
  distance_km: string;
  days_to_expiry: string;
}

const Index = () => {
  const [stores] = useState(() => 
    Array.from({ length: 30 }, (_, i) => `S${(i + 1).toString().padStart(3, '0')}`)
  );
  const [selectedStore, setSelectedStore] = useState('S001');
  const [priceData, setPriceData] = useState<Product[]>([]);
  const [transferData, setTransferData] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredProducts = priceData.filter(product => product.store_id === selectedStore);
  const filteredTransfers = transferData.filter(transfer => transfer.from_store === selectedStore);

  const totalProducts = filteredProducts.length;
  const lowStockCount = filteredProducts.filter(p => parseInt(p.stock) < 10).length;
  const expiringCount = filteredProducts.filter(p => {
    const expiryDate = new Date(p.expiry_date);
    const today = new Date();
    const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntilExpiry <= 7;
  }).length;

  const handlePriceDataUpload = (data: Product[]) => {
    setPriceData(data);
    toast.success('Price data uploaded successfully!');
  };

  const handleTransferDataUpload = (data: Transfer[]) => {
    setTransferData(data);
    toast.success('Transfer data uploaded successfully!');
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Data refreshed!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Inventory Dashboard</h1>
            <p className="text-gray-600">Manage your inventory with precision and insight</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={refreshData} 
              variant="outline" 
              disabled={loading}
              className="hover:bg-blue-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Store Selection */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Store Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-full md:w-64 border-2 focus:border-blue-500">
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store} value={store}>
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* File Upload Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <FileUploader
            title="Price Drop Data"
            icon={<TrendingUp className="w-5 h-5" />}
            onDataLoad={handlePriceDataUpload}
            accept=".csv"
            description="Upload CSV with product pricing information"
          />
          <FileUploader
            title="Transfer Data"
            icon={<BarChart3 className="w-5 h-5" />}
            onDataLoad={handleTransferDataUpload}
            accept=".csv"
            description="Upload CSV with transfer suggestions"
          />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Products</p>
                  <p className="text-3xl font-bold">{totalProducts}</p>
                </div>
                <Package className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Low Stock Items</p>
                  <p className="text-3xl font-bold">{lowStockCount}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Expiring Soon</p>
                  <p className="text-3xl font-bold">{expiringCount}</p>
                </div>
                <AlertTriangle className="w-10 h-10 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer Suggestions */}
        {transferData.length > 0 && (
          <TransferSuggestions 
            transfers={filteredTransfers} 
            storeName={selectedStore} 
          />
        )}

        {/* Sales Chart */}
        {priceData.length > 0 && (
          <SalesChart data={priceData} className="mb-8" />
        )}

        {/* Products Grid */}
        {priceData.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                Products in {selectedStore}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No products found for this store</p>
                  <p className="text-sm">Try selecting a different store or upload data</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={`${product.product_id}-${index}`} 
                      product={product} 
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {priceData.length === 0 && transferData.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Your Inventory Dashboard</h3>
              <p className="text-gray-500 mb-6">Get started by uploading your CSV files to see your inventory data</p>
              <div className="text-sm text-gray-400">
                Upload price drop data and transfer suggestions to begin managing your inventory
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
