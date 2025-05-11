import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps {
  data: Record<string, any>[];
  columns: string[];
  showMatch?: boolean;
}

export function DataTable({ data, columns, showMatch = false }: DataTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#86868b]">Nenhum resultado encontrado</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-[#f5f5f7]">
        <TableRow>
          {columns.map(column => (
            <TableHead key={column} className="px-6 py-3 text-left text-xs font-medium text-[#86868b] uppercase tracking-wider">
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => {
          const hasMatch = showMatch && row._hasMatch === false;
          
          return (
            <TableRow 
              key={rowIndex}
              className={
                hasMatch 
                ? "bg-red-50 hover:bg-red-100 cursor-pointer" 
                : "hover:bg-[#f5f5f7] cursor-pointer"
              }
            >
              {columns.map(column => {
                const value = row[column];
                const isNonMatch = hasMatch && !columns.some(col => col === column && data[0]?.[column] != null);
                
                return (
                  <TableCell key={column} className="px-6 py-4 whitespace-nowrap text-sm">
                    {isNonMatch ? (
                      <span className="text-red-500">-- Correspondência não encontrada --</span>
                    ) : value === null || value === undefined ? (
                      <span className="text-red-500">-- Correspondência não encontrada --</span>
                    ) : column === 'status' || column === 'Status' || column.includes('status') || column.includes('Status') ? (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        String(value).toLowerCase().includes('active') || String(value).toLowerCase().includes('ativo') ? 'bg-green-100 text-green-800' :
                        String(value).toLowerCase().includes('pending') || String(value).toLowerCase().includes('pendente') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {value}
                      </span>
                    ) : (
                      value
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
