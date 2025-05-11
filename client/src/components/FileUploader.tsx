import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { readFileColumns, uploadFile, type FileWithPreview } from '@/lib/file-utils';
import { formatFileSize } from '@/lib/utils';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  title: string;
  file: FileWithPreview | null;
  onUpload: (file: FileWithPreview, columns: string[]) => void;
  onRemove: () => void;
}

export default function FileUploader({ title, file, onUpload, onRemove }: FileUploaderProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const processFile = useCallback(async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Get file columns from backend
      const columnData = await uploadFile(file);
      
      const fileWithPreview: FileWithPreview = {
        file,
        name: file.name,
        size: file.size,
        type: file.type
      };
      
      onUpload(fileWithPreview, columnData.columns);
      toast({
        title: "File uploaded successfully",
        description: `Found ${columnData.columns.length} columns in ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, toast]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    disabled: isUploading || !!file
  });
  
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">{title}</h3>
        
        {!file ? (
          <div 
            {...getRootProps()} 
            className={`rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors border-2 border-dashed ${
              isDragActive ? 'border-[#0071e3] bg-[rgba(0,113,227,0.05)]' : 'border-gray-200 hover:border-[#0071e3] hover:bg-[rgba(0,113,227,0.05)]'
            }`}
          >
            {isUploading ? (
              <>
                <span className="material-icons text-[#86868b] text-5xl mb-4">hourglass_empty</span>
                <p className="mb-2">Uploading file...</p>
              </>
            ) : (
              <>
                <span className="material-icons text-[#86868b] text-5xl mb-4">cloud_upload</span>
                <p className="mb-2">Drag & drop your file here</p>
                <p className="text-[#86868b] text-sm mb-4">or</p>
                <Button 
                  type="button"
                  className="bg-[#0071e3] hover:bg-[#0077ED] text-white rounded-full px-6 py-2"
                >
                  Browse Files
                  <input {...getInputProps()} />
                </Button>
                <p className="mt-4 text-sm text-[#86868b]">Supports .csv, .xlsx, .xls</p>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4 p-4 bg-[#f5f5f7] rounded-xl">
            <div className="flex items-center">
              <span className="material-icons text-[#86868b] mr-2">description</span>
              <span className="font-medium text-sm">{file.name}</span>
              <span className="ml-auto text-xs text-[#86868b]">{formatFileSize(file.size)}</span>
              <button 
                className="ml-2 text-[#86868b] hover:text-[#0071e3] transition-colors"
                onClick={onRemove}
              >
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
