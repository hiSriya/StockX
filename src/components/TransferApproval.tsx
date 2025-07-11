
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, MapPin, Clock, AlertTriangle, Check, X, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Transfer {
  product_id: string;
  from_store: string;
  to_store: string;
  quantity: string;
  distance_km: string;
  days_to_expiry: string;
}

interface TransferApprovalProps {
  transfers: Transfer[];
}

const TransferApproval: React.FC<TransferApprovalProps> = ({ transfers }) => {
  const [approvedTransfers, setApprovedTransfers] = useState<Set<string>>(new Set());
  const [rejectedTransfers, setRejectedTransfers] = useState<Set<string>>(new Set());

  const handleApprove = (transferId: string) => {
    setApprovedTransfers(prev => new Set(prev).add(transferId));
    setRejectedTransfers(prev => {
      const newSet = new Set(prev);
      newSet.delete(transferId);
      return newSet;
    });
    toast.success('Transfer approved successfully!');
  };

  const handleReject = (transferId: string) => {
    setRejectedTransfers(prev => new Set(prev).add(transferId));
    setApprovedTransfers(prev => {
      const newSet = new Set(prev);
      newSet.delete(transferId);
      return newSet;
    });
    toast.error('Transfer rejected');
  };

  const handleBulkApprove = () => {
    const pendingTransfers = transfers.filter((_, index) => 
      !approvedTransfers.has(`${index}`) && !rejectedTransfers.has(`${index}`)
    );
    
    pendingTransfers.forEach((_, index) => {
      const transferId = transfers.indexOf(transfers[index]).toString();
      setApprovedTransfers(prev => new Set(prev).add(transferId));
    });
    
    toast.success(`${pendingTransfers.length} transfers approved!`);
  };

  const getTransferStatus = (index: number) => {
    const transferId = index.toString();
    if (approvedTransfers.has(transferId)) return 'approved';
    if (rejectedTransfers.has(transferId)) return 'rejected';
    return 'pending';
  };

  const pendingCount = transfers.filter((_, index) => getTransferStatus(index) === 'pending').length;
  const approvedCount = transfers.filter((_, index) => getTransferStatus(index) === 'approved').length;
  const rejectedCount = transfers.filter((_, index) => getTransferStatus(index) === 'rejected').length;

  if (transfers.length === 0) {
    return (
      <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-600" />
            Transfer Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No transfers pending approval</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <CardTitle className="flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-600" />
            Transfer Approvals
            <Badge className="ml-2 bg-blue-100 text-blue-800">{transfers.length}</Badge>
          </CardTitle>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-yellow-700 border-yellow-300">
              Pending: {pendingCount}
            </Badge>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Approved: {approvedCount}
            </Badge>
            <Badge variant="outline" className="text-red-700 border-red-300">
              Rejected: {rejectedCount}
            </Badge>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleBulkApprove}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve All Pending
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          {transfers.map((transfer, index) => {
            const daysToExpiry = parseInt(transfer.days_to_expiry);
            const isUrgent = daysToExpiry <= 3;
            const distance = parseFloat(transfer.distance_km);
            const status = getTransferStatus(index);
            
            return (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-all duration-300 ${
                  status === 'approved' 
                    ? 'bg-green-50 border-green-200' 
                    : status === 'rejected'
                    ? 'bg-red-50 border-red-200'
                    : isUrgent 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                    : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                      <Package className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="font-semibold text-gray-900">{transfer.product_id}</span>
                      
                      {status === 'approved' && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      )}
                      
                      {status === 'rejected' && (
                        <Badge variant="destructive" className="text-xs">
                          <X className="w-3 h-3 mr-1" />
                          Rejected
                        </Badge>
                      )}
                      
                      {status === 'pending' && isUrgent && (
                        <Badge variant="destructive" className="text-xs">
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
                  
                  {status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(index.toString())}
                        className="hover:bg-red-50 hover:border-red-300"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(index.toString())}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                  
                  {status !== 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferApproval;
