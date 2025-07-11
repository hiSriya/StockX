
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';

interface FileUploaderProps {
  title: string;
  icon: React.ReactNode;
  onDataLoad: (data: any[]) => void;
  accept: string;
  description: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  title,
  icon,
  onDataLoad,
  accept,
  description
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
          toast.error('Error parsing CSV file');
          return;
        }
        onDataLoad(results.data);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast.error('Failed to parse CSV file');
      }
    });

    // Reset input
    event.target.value = '';
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-gray-700">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{description}</p>
        <Button 
          onClick={handleFileSelect}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default FileUploader;
