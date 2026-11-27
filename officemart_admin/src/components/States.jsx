export function Loading() {
  return (
    <p data-testid="loading" className="state">
      Đang tải…
    </p>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state state-error">
      <p data-testid="error-message">{message}</p>
      {onRetry && (
        <button type="button" className="btn" data-testid="retry-button" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}

export function EmptyState() {
  return (
    <p data-testid="empty-state" className="state">
      Không có sản phẩm nào
    </p>
  );
}
