export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="pagination" data-testid="pagination">
      <button
        type="button"
        className="btn"
        data-testid="page-prev"
        onClick={onPrev}
        disabled={page <= 1}
      >
        Trước
      </button>
      <span className="page-current" data-testid="page-current">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        className="btn"
        data-testid="page-next"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        Sau
      </button>
    </div>
  );
}
