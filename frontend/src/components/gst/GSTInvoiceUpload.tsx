
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUp, Upload, FileCheck, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const GSTInvoiceUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [returnType, setReturnType] = useState('');
  const [period, setPeriod] = useState('');
  const [uploading, setUploading] = useState(false);
  const [recentUploads, setRecentUploads] = useState([
    {
      id: '1',
      filename: 'invoice-apr-2023.json',
      returnType: 'GSTR-1',
      period: 'Apr 2023',
      status: 'Processed',
      records: 124,
      timestamp: '2023-04-28 14:30'
    },
    {
      id: '2',
      filename: 'invoice-may-2023.json',
      returnType: 'GSTR-1',
      period: 'May 2023',
      status: 'Error',
      records: 118,
      timestamp: '2023-05-27 16:15'
    },
    {
      id: '3',
      filename: 'invoice-jun-2023.xlsx',
      returnType: 'GSTR-3B',
      period: 'Jun 2023',
      status: 'Processing',
      records: 156,
      timestamp: '2023-06-26 11:45'
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !returnType || !period) {
      toast({
        title: "Missing Information",
        description: "Please select a file, return type, and period.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    let progress = 0;
    
    // Simulate upload progress
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setUploadProgress(0);
        
        // Add to recent uploads
        const newUpload = {
          id: Math.random().toString(36).substring(7),
          filename: selectedFile.name,
          returnType,
          period,
          status: 'Processing',
          records: Math.floor(Math.random() * 150) + 50,
          timestamp: new Date().toLocaleString('en-IN')
        };
        
        setRecentUploads([newUpload, ...recentUploads]);
        
        // Reset form
        setSelectedFile(null);
        setReturnType('');
        setPeriod('');
        
        toast({
          title: "Upload Successful",
          description: "Your invoice data is now being processed.",
        });
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-medium">Upload Invoice Data</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="return-type">GST Return Type</Label>
              <Select value={returnType} onValueChange={setReturnType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select return type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GSTR-1">GSTR-1 (Outward Supplies)</SelectItem>
                  <SelectItem value="GSTR-2A">GSTR-2A (Inward Supplies)</SelectItem>
                  <SelectItem value="GSTR-3B">GSTR-3B (Summary Return)</SelectItem>
                  <SelectItem value="GSTR-9">GSTR-9 (Annual Return)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Filing Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apr-2023">April 2023</SelectItem>
                  <SelectItem value="May-2023">May 2023</SelectItem>
                  <SelectItem value="Jun-2023">June 2023</SelectItem>
                  <SelectItem value="Jul-2023">July 2023</SelectItem>
                  <SelectItem value="Aug-2023">August 2023</SelectItem>
                  <SelectItem value="Sep-2023">September 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload File (JSON, Excel, or CSV)</Label>
              <div className="flex items-center space-x-4">
                <Input 
                  id="file-upload" 
                  type="file" 
                  accept=".json,.xlsx,.csv"
                  onChange={handleFileChange}
                  className="flex-1" 
                />
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>
            
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || !returnType || !period || uploading}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Invoice Data
            </Button>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Upload Guidelines</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <FileUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Supported Formats</h4>
                <p className="text-sm text-muted-foreground">
                  JSON, Excel (.xlsx), and CSV formats are supported
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <FileCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">File Structure</h4>
                <p className="text-sm text-muted-foreground">
                  Files must follow the standard GST template structure with required fields such as GSTIN, invoice number, date, etc.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Important Notes</h4>
                <ul className="text-sm text-muted-foreground list-disc ml-4">
                  <li>Upload before filing deadline to avoid late fees</li>
                  <li>Ensure data accuracy before upload</li>
                  <li>Maximum file size: 5 MB</li>
                </ul>
              </div>
            </div>
            
            <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
              Download Template Files
            </Button>
          </div>
        </Card>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Recent Uploads</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Return Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUploads.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell>{upload.filename}</TableCell>
                  <TableCell>{upload.returnType}</TableCell>
                  <TableCell>{upload.period}</TableCell>
                  <TableCell>{upload.records}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        upload.status === 'Processed' ? 'bg-green-500' : 
                        upload.status === 'Error' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`}></span>
                      {upload.status}
                    </div>
                  </TableCell>
                  <TableCell>{upload.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default GSTInvoiceUpload;
