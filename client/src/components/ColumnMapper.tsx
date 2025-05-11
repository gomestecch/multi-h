import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { type FileWithPreview, performLookup } from '@/lib/file-utils';
import { PageWrapper } from '@/components/ui/page-wrapper';

interface ColumnMapperProps {
  sourceFile: FileWithPreview;
  lookupFile: FileWithPreview;
  sourceColumns: string[];
  lookupColumns: string[];
  onLookupComplete: (data: any) => void;
}

export default function ColumnMapper({
  sourceFile,
  lookupFile,
  sourceColumns,
  lookupColumns,
  onLookupComplete
}: ColumnMapperProps) {
  const { toast } = useToast();
  const [sourceKeyColumn, setSourceKeyColumn] = useState<string>('');
  const [lookupKeyColumn, setLookupKeyColumn] = useState<string>('');
  const [selectedSourceColumns, setSelectedSourceColumns] = useState<string[]>([]);
  const [selectedLookupColumns, setSelectedLookupColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSourceColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedSourceColumns(prev => [...prev, column]);
    } else {
      setSelectedSourceColumns(prev => prev.filter(col => col !== column));
    }
  };

  const handleLookupColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      setSelectedLookupColumns(prev => [...prev, column]);
    } else {
      setSelectedLookupColumns(prev => prev.filter(col => col !== column));
    }
  };

  const handleCompareFiles = async () => {
    if (!sourceKeyColumn) {
      toast({
        title: "Missing key column",
        description: "Please select a key column for the source file",
        variant: "destructive"
      });
      return;
    }

    if (!lookupKeyColumn) {
      toast({
        title: "Missing key column",
        description: "Please select a key column for the lookup file",
        variant: "destructive"
      });
      return;
    }

    if (selectedSourceColumns.length === 0) {
      toast({
        title: "No columns selected",
        description: "Please select at least one column from the source file",
        variant: "destructive"
      });
      return;
    }

    if (selectedLookupColumns.length === 0) {
      toast({
        title: "No columns selected",
        description: "Please select at least one column from the lookup file",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      const result = await performLookup(
        sourceFile.file,
        lookupFile.file,
        {
          sourceKeyColumn,
          lookupKeyColumn,
          sourceColumns: selectedSourceColumns,
          lookupColumns: selectedLookupColumns
        }
      );
      
      onLookupComplete(result);
      
      toast({
        title: "Comparison complete",
        description: `Found ${result.totalMatches} matches and ${result.totalNonMatches} non-matches`,
      });
    } catch (error) {
      toast({
        title: "Error performing comparison",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-3xl font-semibold mb-2">Map your columns</h2>
      <p className="text-[#86868b] mb-8">Select which columns to use for comparison and matching</p>
      
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* File 1 Column Selection */}
            <div>
              <h3 className="font-semibold mb-4">File 1 Columns</h3>
              <div className="space-y-4">
                {/* Key Column Selection */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Key Column (for lookup)</Label>
                  <Select
                    value={sourceKeyColumn}
                    onValueChange={setSourceKeyColumn}
                  >
                    <SelectTrigger className="w-full p-3 rounded-xl">
                      <SelectValue placeholder="Select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceColumns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Columns to Include */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Columns to Include</Label>
                  <div className="space-y-2 mt-2">
                    {sourceColumns.map(column => (
                      <div key={column} className="flex items-center">
                        <Checkbox
                          id={`source-col-${column}`}
                          checked={selectedSourceColumns.includes(column)}
                          onCheckedChange={(checked) => handleSourceColumnToggle(column, !!checked)}
                          className="h-5 w-5 rounded text-[#0071e3]"
                        />
                        <Label 
                          htmlFor={`source-col-${column}`}
                          className="ml-2 text-sm font-normal"
                        >
                          {column}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* File 2 Column Selection */}
            <div>
              <h3 className="font-semibold mb-4">File 2 Columns</h3>
              <div className="space-y-4">
                {/* Key Column Selection */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Key Column (for lookup)</Label>
                  <Select
                    value={lookupKeyColumn}
                    onValueChange={setLookupKeyColumn}
                  >
                    <SelectTrigger className="w-full p-3 rounded-xl">
                      <SelectValue placeholder="Select column..." />
                    </SelectTrigger>
                    <SelectContent>
                      {lookupColumns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Columns to Include */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Columns to Include</Label>
                  <div className="space-y-2 mt-2">
                    {lookupColumns.map(column => (
                      <div key={column} className="flex items-center">
                        <Checkbox
                          id={`lookup-col-${column}`}
                          checked={selectedLookupColumns.includes(column)}
                          onCheckedChange={(checked) => handleLookupColumnToggle(column, !!checked)}
                          className="h-5 w-5 rounded text-[#0071e3]"
                        />
                        <Label 
                          htmlFor={`lookup-col-${column}`}
                          className="ml-2 text-sm font-normal"
                        >
                          {column}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              onClick={handleCompareFiles}
              className="px-8 py-6 text-lg font-medium bg-[#0071e3] hover:bg-[#0077ED] rounded-full"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Compare Files"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
