
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/api';

const RunOptimization = () => {
  const [inventoryFile, setInventoryFile] = useState(null);
  const [storesFile, setStoresFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleInventoryFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setInventoryFile(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleStoresFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setStoresFile(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inventoryFile || !storesFile) {
      toast.error('Please select both CSV files');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.runOptimization(inventoryFile, storesFile);
      setResults(response);
      toast.success('Optimization completed successfully!');
    } catch (error) {
      console.error('Error running optimization:', error);
      toast.error('Failed to run optimization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Run Optimization</h1>
          <p className="text-gray-600">Upload inventory and stores data to generate optimization results</p>
        </div>

        {/* Upload Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload CSV Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inventory-file">Inventory CSV File</Label>
                  <Input
                    id="inventory-file"
                    type="file"
                    accept=".csv"
                    onChange={handleInventoryFileChange}
                    className="cursor-pointer"
                  />
                  {inventoryFile && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {inventoryFile.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stores-file">Stores CSV File</Label>
                  <Input
                    id="stores-file"
                    type="file"
                    accept=".csv"
                    onChange={handleStoresFileChange}
                    className="cursor-pointer"
                  />
                  {storesFile && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {storesFile.name}
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !inventoryFile || !storesFile}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Optimization...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Run Optimization
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <div className="space-y-8">
            {/* Inventory Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Inventory Results ({results.inventory?.length || 0} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {results.inventory?.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.product_name}</h3>
                        <span className="text-sm text-gray-500">{item.store_id}</span>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Stock:</span> {item.stock}
                        </div>
                        <div>
                          <span className="text-gray-600">Expiry:</span> {formatDate(item.expiry_date)}
                        </div>
                        <div>
                          <span className="text-gray-600">MRP:</span> ₹{item.MRP}
                        </div>
                        <div>
                          <span className="text-gray-600">Final Price:</span> ₹{item.final_price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transfer Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Transfer Suggestions ({results.transfers?.length || 0} transfers)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {results.transfers?.map((transfer, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-amber-50 border-amber-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">Product: {transfer.product_id}</h3>
                        <span className="text-sm bg-amber-100 px-2 py-1 rounded">
                          {transfer.days_to_expiry} days to expiry
                        </span>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">From:</span> {transfer.from_store}
                        </div>
                        <div>
                          <span className="text-gray-600">To:</span> {transfer.to_store}
                        </div>
                        <div>
                          <span className="text-gray-600">Quantity:</span> {transfer.quantity}
                        </div>
                        <div>
                          <span className="text-gray-600">Distance:</span> {transfer.distance_km} km
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunOptimization;
