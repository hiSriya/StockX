
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, MapPin, Clock, AlertTriangle } from 'lucide-react';

interface Transfer {
  product_id: string;
  from_store: string;
  to_store: string;
  quantity: string;
  distance_km: string;
  days_to_expiry: string;
}

interface TransferSuggestionsProps {
  transfers: Transfer[];
  storeName: string;
}

const TransferSuggestions: React.FC<TransferSuggestionsProps> = ({ transfers, storeName }) => {
  if (transfers.length === 0) {
    return (
      <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
            Transfer Suggestions for {storeName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No transfer suggestions available for this store</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
          Transfer Suggestions for {storeName}
          <Badge className="ml-2 bg-blue-100 text-blue-800">{transfers.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {transfers.map((transfer, index) => {
            const daysToExpiry = parseInt(transfer.days_to_expiry);
            const isUrgent = daysToExpiry <= 3;
            const distance = parseFloat(transfer.distance_km);
            
            return (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
                  isUrgent 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                    : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Package className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="font-semibold text-gray-900">{transfer.product_id}</span>
                      {isUrgent && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      <span className="font-medium">{transfer.from_store}</span>
                      <ArrowRight className="w-4 h-4 mx-2" />
                      <span className="font-medium">{transfer.to_store}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
                      <Package className="w-3 h-3 mr-1 text-blue-500" />
                      <span className="font-medium">{transfer.quantity}</span>
                    </div>
                    
                    <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
                      <MapPin className="w-3 h-3 mr-1 text-green-500" />
                      <span>{distance.toFixed(1)} km</span>
                    </div>
                    
                    <div className={`flex items-center rounded-full px-3 py-1 shadow-sm ${
                      isUrgent ? 'bg-red-100 text-red-700' : 'bg-white'
                    }`}>
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="font-medium">{transfer.days_to_expiry} days</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferSuggestions;
