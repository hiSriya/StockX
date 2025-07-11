
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Upload, BarChart3, Package, TrendingUp, AlertTriangle, RefreshCw, Home, Bell, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import TransferSuggestions from '@/components/TransferSuggestions';
import SalesChart from '@/components/SalesChart';
import NotificationCenter from '@/components/NotificationCenter';
import TransferApproval from '@/components/TransferApproval';
import InventoryAlerts from '@/components/InventoryAlerts';
import StoreComparison from '@/components/StoreComparison';
import { apiService } from '@/services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [inventoryData, setInventoryData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [inventory, transfers] = await Promise.all([
        apiService.getInventory(),
        apiService.getTransfers()
      ]);
      
      setInventoryData(inventory);
      setTransferData(transfers);
      
      // Extract unique stores from inventory data
      const uniqueStores = [...new Set(inventory.map(item => item.store_id))].sort();
      setStores(uniqueStores);
      
      // Set default store if not selected
      if (uniqueStores.length > 0 && !selectedStore) {
        setSelectedStore(uniqueStores[0]);
      }
      
      toast.success('Data loaded successfully!');
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  // Filter data based on selected store
  const filteredProducts = inventoryData.filter(product => product.store_id === selectedStore);
  const filteredTransfers = transferData.filter(transfer => transfer.from_store === selectedStore);

  // Calculate statistics
  const totalProducts = filteredProducts.length;
  const lowStockCount = filteredProducts.filter(p => p.stock < 10).length;
  const expiringCount = filteredProducts.filter(p => p.days_to_expiry <= 7).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'transfers', label: 'Transfers', icon: <Package className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'comparison', label: 'Compare', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-gray-100"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center space-x-2">
                <Package className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Inventory Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationCenter />
              <Button 
                onClick={refreshData} 
                variant="outline" 
                size="sm"
                disabled={loading}
                className="hover:bg-blue-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Store Selection */}
        {stores.length > 0 && (
          <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Store Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
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
                <Badge variant="outline" className="text-sm">
                  Selected: {selectedStore}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Transfers Pending</p>
                  <p className="text-3xl font-bold">{filteredTransfers.length}</p>
                </div>
                <Package className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {inventoryData.length > 0 && (
              <SalesChart data={inventoryData} className="mb-8" />
            )}

            {inventoryData.length > 0 && (
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
                      <p className="text-sm">Try selecting a different store</p>
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
          </>
        )}

        {activeTab === 'transfers' && (
          <>
            {transferData.length > 0 && (
              <TransferSuggestions 
                transfers={filteredTransfers} 
                storeName={selectedStore} 
              />
            )}
            {transferData.length > 0 && (
              <TransferApproval transfers={filteredTransfers} />
            )}
          </>
        )}

        {activeTab === 'alerts' && (
          <InventoryAlerts products={filteredProducts} />
        )}

        {activeTab === 'comparison' && (
          <StoreComparison data={inventoryData} stores={stores} />
        )}

        {inventoryData.length === 0 && transferData.length === 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
              <p className="text-gray-500 mb-6">Run optimization first to see your inventory data</p>
              <Button onClick={() => navigate('/run-optimization')} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Run Optimization
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
