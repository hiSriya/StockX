
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, IndianRupee, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: {
    id?: number;
    run_id?: string;
    store_id: string;
    product_id: string;
    product_name: string;
    stock: number;
    expiry_date: string;
    shelf_life_days?: number;
    avg_daily_sales?: number;
    MRP: number;
    days_to_expiry: number;
    remaining_ratio?: number;
    expected_sales?: number;
    predicted_demand?: number;
    discount?: number;
    final_price: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const MRP = parseFloat(product.MRP?.toString() || '0');
  const finalPrice = parseFloat(product.final_price?.toString() || '0');
  const stock = parseInt(product.stock?.toString() || '0');
  const discount = MRP - finalPrice;
  const discountPercentage = MRP > 0 ? ((discount / MRP) * 100).toFixed(1) : '0';
  
  const daysUntilExpiry = product.days_to_expiry || 0;
  const isExpiringSoon = daysUntilExpiry <= 7;
  const isLowStock = stock < 10;
  const hasDiscount = discount > 3;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
      <CardContent className="p-6">
        {/* Product Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{product.product_name}</h3>
          <div className="flex flex-col items-end space-y-1">
            {hasDiscount && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                {discountPercentage}% OFF
              </Badge>
            )}
            {isExpiringSoon && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Expiring
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-3">
          {/* Expiry Date */}
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span className={`${isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              Expiry: {formatDate(product.expiry_date)} ({daysUntilExpiry} days)
            </span>
          </div>

          {/* Stock */}
          <div className="flex items-center text-sm">
            <Package className="w-4 h-4 mr-2 text-gray-500" />
            <span className={`${isLowStock ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
              Stock: {stock} units
            </span>
            {isLowStock && (
              <AlertTriangle className="w-4 h-4 ml-2 text-orange-500" />
            )}
          </div>

          {/* Expected Sales */}
          {product.expected_sales && (
            <div className="text-sm text-gray-600">
              Expected Sales: {product.expected_sales}
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <IndianRupee className="w-4 h-4 mr-1" />
              <span>MRP: ₹{MRP.toFixed(2)}</span>
            </div>
            
            {hasDiscount ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-semibold text-green-800">Discounted Price</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-800">₹{finalPrice.toFixed(2)}</div>
                    <div className="text-sm text-green-600">Save ₹{discount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Price</span>
                  <span className="font-semibold text-gray-800">₹{finalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Product ID */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">ID: {product.product_id}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
