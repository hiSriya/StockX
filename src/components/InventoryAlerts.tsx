
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package, Calendar, TrendingDown, Bell } from 'lucide-react';

interface Product {
  product_id: string;
  product_name: string;
  store_id: string;
  expiry_date: string;
  stock: string;
  MRP: string;
  final_price: string;
}

interface InventoryAlertsProps {
  products: Product[];
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ products }) => {
  const today = new Date();
  
  const expiringProducts = products.filter(product => {
    const expiryDate = new Date(product.expiry_date);
    const daysUntilExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  });

  const lowStockProducts = products.filter(product => parseInt(product.stock) < 10);
  
  const expiredProducts = products.filter(product => {
    const expiryDate = new Date(product.expiry_date);
    return expiryDate < today;
  });

  const alerts = [
    {
      title: 'Expired Products',
      count: expiredProducts.length,
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      color: 'bg-red-50 border-red-200',
      products: expiredProducts,
      severity: 'critical'
    },
    {
      title: 'Expiring This Week',
      count: expiringProducts.length,
      icon: <Calendar className="w-5 h-5 text-orange-500" />,
      color: 'bg-orange-50 border-orange-200',
      products: expiringProducts,
      severity: 'high'
    },
    {
      title: 'Low Stock Items',
      count: lowStockProducts.length,
      icon: <Package className="w-5 h-5 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200',
      products: lowStockProducts,
      severity: 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {alerts.map((alert, index) => (
          <Card key={index} className={`shadow-lg border-0 ${alert.color}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {alert.icon}
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{alert.count}</p>
                  <Badge 
                    className={`mt-2 ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-4xl opacity-20">
                  {alert.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Alerts */}
      {alerts.map((alert, alertIndex) => 
        alert.products.length > 0 && (
          <Card key={alertIndex} className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  {alert.icon}
                  <span className="ml-2">{alert.title}</span>
                  <Badge className="ml-2 bg-gray-100 text-gray-800">{alert.count}</Badge>
                </div>
                <Button size="sm" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Alert
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {alert.products.slice(0, 5).map((product, productIndex) => {
                  const expiryDate = new Date(product.expiry_date);
                  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  
                  return (
                    <div
                      key={productIndex}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.product_name}</h4>
                        <p className="text-sm text-gray-600">ID: {product.product_id}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </span>
                          <span className="text-sm text-gray-500">
                            Expiry: {product.expiry_date}
                          </span>
                          {alertIndex === 1 && (
                            <Badge 
                              variant={daysUntilExpiry <= 1 ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {daysUntilExpiry <= 0 ? 'Expired' : `${daysUntilExpiry} days left`}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {alertIndex === 0 && (
                          <Button size="sm" variant="destructive">
                            Remove
                          </Button>
                        )}
                        {alertIndex === 1 && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Transfer
                          </Button>
                        )}
                        {alertIndex === 2 && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Restock
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {alert.products.length > 5 && (
                  <div className="text-center pt-4 border-t">
                    <Button variant="outline">
                      View All {alert.products.length} Items
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      )}

      {products.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Alerts</h3>
            <p className="text-gray-500">Upload product data to see inventory alerts</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryAlerts;
