import { useState, useEffect } from 'react';
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

  // Inicializar todas as colunas como selecionadas por padrão
  useEffect(() => {
    setSelectedSourceColumns([...sourceColumns]);
    setSelectedLookupColumns([...lookupColumns]);
  }, [sourceColumns, lookupColumns]);

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
        title: "Coluna chave não selecionada",
        description: "Por favor, selecione uma coluna chave para o arquivo de origem",
        variant: "destructive"
      });
      return;
    }

    if (!lookupKeyColumn) {
      toast({
        title: "Coluna chave não selecionada",
        description: "Por favor, selecione uma coluna chave para o arquivo de pesquisa",
        variant: "destructive"
      });
      return;
    }

    if (selectedSourceColumns.length === 0) {
      toast({
        title: "Nenhuma coluna selecionada",
        description: "Por favor, selecione pelo menos uma coluna do arquivo de origem",
        variant: "destructive"
      });
      return;
    }

    if (selectedLookupColumns.length === 0) {
      toast({
        title: "Nenhuma coluna selecionada",
        description: "Por favor, selecione pelo menos uma coluna do arquivo de pesquisa",
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
        title: "Comparação concluída",
        description: `Encontrados ${result.totalMatches} correspondências e ${result.totalNonMatches} não correspondências`,
      });
    } catch (error) {
      toast({
        title: "Erro ao realizar a comparação",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-3xl font-semibold mb-2">Mapeamento de colunas</h2>
      <p className="text-[#86868b] mb-8">Selecione quais colunas usar para comparação e correspondência</p>
      
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Seleção de Colunas do Arquivo 1 */}
            <div>
              <h3 className="font-semibold mb-4">Colunas do Arquivo 1</h3>
              <div className="space-y-4">
                {/* Seleção de Coluna Chave */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Coluna Chave (para procura)</Label>
                  <Select
                    value={sourceKeyColumn}
                    onValueChange={setSourceKeyColumn}
                  >
                    <SelectTrigger className="w-full p-3 rounded-xl">
                      <SelectValue placeholder="Selecione a coluna..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceColumns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Colunas a Incluir */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Colunas a Incluir</Label>
                  <div className="space-y-2 mt-2">
                    {sourceColumns.map(column => (
                      <div key={column} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`source-col-${column}`}
                          checked={selectedSourceColumns.includes(column)}
                          onChange={(e) => handleSourceColumnToggle(column, e.target.checked)}
                          className="h-5 w-5 rounded text-[#0071e3] accent-[#0071e3]"
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
            
            {/* Seleção de Colunas do Arquivo 2 */}
            <div>
              <h3 className="font-semibold mb-4">Colunas do Arquivo 2</h3>
              <div className="space-y-4">
                {/* Seleção de Coluna Chave */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Coluna Chave (para procura)</Label>
                  <Select
                    value={lookupKeyColumn}
                    onValueChange={setLookupKeyColumn}
                  >
                    <SelectTrigger className="w-full p-3 rounded-xl">
                      <SelectValue placeholder="Selecione a coluna..." />
                    </SelectTrigger>
                    <SelectContent>
                      {lookupColumns.map(column => (
                        <SelectItem key={column} value={column}>{column}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Colunas a Incluir */}
                <div>
                  <Label className="block text-sm text-[#86868b] mb-1">Colunas a Incluir</Label>
                  <div className="space-y-2 mt-2">
                    {lookupColumns.map(column => (
                      <div key={column} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`lookup-col-${column}`}
                          checked={selectedLookupColumns.includes(column)}
                          onChange={(e) => handleLookupColumnToggle(column, e.target.checked)}
                          className="h-5 w-5 rounded text-[#0071e3] accent-[#0071e3]"
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
              {isProcessing ? "Processando..." : "Comparar Arquivos"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
