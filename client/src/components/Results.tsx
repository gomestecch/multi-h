import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { exportResults } from '@/lib/file-utils';

interface ResultsProps {
  resultData: {
    jobId: number;
    results: Record<string, any>[];
    totalMatches: number;
    totalNonMatches: number;
  };
}

type ResultsView = 'all' | 'matches' | 'non-matches';

export default function Results({ resultData }: ResultsProps) {
  const [resultsView, setResultsView] = useState<ResultsView>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Get all unique column names from the results
  const allColumns = useMemo(() => {
    if (!resultData.results.length) return [];
    const columns = new Set<string>();
    resultData.results.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key !== '_hasMatch') {
          columns.add(key);
        }
      });
    });
    return Array.from(columns);
  }, [resultData.results]);
  
  // Filter results based on view and search term
  const filteredResults = useMemo(() => {
    let filtered = [...resultData.results];
    
    // Filter by view type
    if (resultsView === 'matches') {
      filtered = filtered.filter(row => row._hasMatch === true);
    } else if (resultsView === 'non-matches') {
      filtered = filtered.filter(row => row._hasMatch === false);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row => {
        return Object.entries(row).some(([key, value]) => {
          if (key === '_hasMatch') return false;
          return String(value).toLowerCase().includes(term);
        });
      });
    }
    
    // Sort results
    if (sortBy) {
      filtered.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        
        if (valueA === null || valueA === undefined) return 1;
        if (valueB === null || valueB === undefined) return -1;
        
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return valueA - valueB;
        }
        
        return String(valueA).localeCompare(String(valueB));
      });
    }
    
    return filtered;
  }, [resultData.results, resultsView, searchTerm, sortBy]);
  
  // Paginate results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredResults.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredResults, currentPage]);
  
  const totalPages = Math.ceil(filteredResults.length / rowsPerPage);
  
  const handleExport = () => {
    exportResults(resultData.jobId);
  };
  
  return (
    <PageWrapper>
      <h2 className="text-3xl font-semibold mb-2">Results</h2>
      <p className="text-[#86868b] mb-8">
        Found {resultData.totalMatches} matching records and {resultData.totalNonMatches} non-matching records
      </p>
      
      <Card className="overflow-hidden shadow-sm">
        {/* Results Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-6 py-4 font-medium ${resultsView === 'all' ? 'text-[#0071e3] border-b-2 border-[#0071e3]' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            onClick={() => setResultsView('all')}
          >
            All Results ({resultData.results.length})
          </button>
          <button 
            className={`px-6 py-4 font-medium ${resultsView === 'matches' ? 'text-[#0071e3] border-b-2 border-[#0071e3]' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            onClick={() => setResultsView('matches')}
          >
            Matches ({resultData.totalMatches})
          </button>
          <button 
            className={`px-6 py-4 font-medium ${resultsView === 'non-matches' ? 'text-[#0071e3] border-b-2 border-[#0071e3]' : 'text-[#86868b] hover:text-[#1d1d1f]'}`}
            onClick={() => setResultsView('non-matches')}
          >
            Non-Matches ({resultData.totalNonMatches})
          </button>
        </div>
        
        {/* Results Controls */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200 bg-[#f5f5f7]">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search results..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl"
              />
              <span className="material-icons text-[#86868b] absolute left-3 top-1/2 transform -translate-y-1/2">search</span>
            </div>
            <div className="relative">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="px-4 py-2 rounded-xl">
                  <SelectValue placeholder="Sort by column" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map(column => (
                    <SelectItem key={column} value={column}>Sort by: {column}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Button 
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium bg-[#0071e3] hover:bg-[#0077ED] rounded-full"
            >
              <span className="material-icons text-sm align-text-bottom mr-1">file_download</span>
              Export Results
            </Button>
          </div>
        </div>
        
        {/* Results Table */}
        <div className="overflow-x-auto">
          <DataTable
            data={paginatedResults}
            columns={allColumns}
            showMatch
          />
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-[#86868b]">
                Showing <span className="font-medium">{Math.min(filteredResults.length, 1 + (currentPage - 1) * rowsPerPage)}</span> to <span className="font-medium">{Math.min(filteredResults.length, currentPage * rowsPerPage)}</span> of <span className="font-medium">{filteredResults.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-[#86868b] hover:bg-[#f5f5f7] disabled:opacity-50"
                >
                  <span className="material-icons text-sm">chevron_left</span>
                </button>
                
                {/* Generate page buttons */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  
                  // Logic to show current page in the middle when possible
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === pageNum
                          ? 'text-[#0071e3]'
                          : 'text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-[#86868b]">
                      ...
                    </span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-[#86868b] hover:bg-[#f5f5f7] disabled:opacity-50"
                >
                  <span className="material-icons text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </Card>
    </PageWrapper>
  );
}
