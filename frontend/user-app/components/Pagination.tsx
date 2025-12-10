interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page and neighbors, last page
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, -1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === -1 || page === -2) {
        return (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 rounded-sm ${
            page === currentPage ? 'bg-purple-300 font-semibold' : 'hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-700">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
      >
        Prev
      </button>

      <div className="flex items-center gap-2 text-sm">
        {totalPages > 0 ? renderPageNumbers() : <span className="px-2">1</span>}
      </div>

      <button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => onPageChange(currentPage + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
