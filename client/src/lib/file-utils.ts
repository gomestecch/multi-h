import * as XLSX from 'xlsx';

export type ColumnData = {
  filename: string;
  columns: string[];
};

export type FileWithPreview = {
  file: File;
  name: string;
  size: number;
  type: string;
};

export const readFileColumns = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet);
        
        if (jsonData.length === 0) {
          reject(new Error('File is empty or contains no valid data'));
          return;
        }
        
        const columns = Object.keys(jsonData[0]);
        resolve(columns);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const uploadFile = async (file: File): Promise<ColumnData> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/files/columns', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload file');
  }
  
  return response.json();
};

export const performLookup = async (
  sourceFile: File,
  lookupFile: File,
  options: {
    sourceKeyColumn: string;
    lookupKeyColumn: string;
    sourceColumns: string[];
    lookupColumns: string[];
  }
) => {
  const formData = new FormData();
  formData.append('sourceFile', sourceFile);
  formData.append('lookupFile', lookupFile);
  formData.append('options', JSON.stringify(options));
  
  const response = await fetch('/api/lookup', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to perform lookup');
  }
  
  return response.json();
};

export const exportResults = (jobId: number) => {
  window.open(`/api/export/${jobId}`, '_blank');
};
