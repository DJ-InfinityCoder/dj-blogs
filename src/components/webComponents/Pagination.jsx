export default function Pagination({ currentPage, onPageChange }) {
    return (
      <div className="mt-6 flex justify-center items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
  
        <span>Page {currentPage}</span>
  
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>
    );
  }
  