import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 9
}) => {
  const [goToPage, setGoToPage] = useState('');

  if (totalPages <= 1) return null;

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(goToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setGoToPage('');
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Increased from 5 to show more pages
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 3);
      const endPage = Math.min(totalPages, currentPage + 3);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || 0);

  return (
    <div className="flex flex-col space-y-4 mt-8">
      {/* Results info */}
      {totalItems && (
        <div className="text-center sm:text-left">
          <div className="text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* First page button */}
          {currentPage > 3 && totalPages > 7 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors"
              >
                1
              </button>
              {currentPage > 4 && (
                <span className="px-2 py-2 text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )}
            </>
          )}

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 py-2 text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors min-w-[40px] ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Last page button */}
          {currentPage < totalPages - 2 && totalPages > 7 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2 py-2 text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Go to page input */}
        {totalPages > 3 && (
          <form onSubmit={handleGoToPage} className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              placeholder={`1-${totalPages}`}
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            >
              Go
            </button>
          </form>
        )}
      </div>

      {/* Page info for mobile */}
      <div className="sm:hidden text-center text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};
