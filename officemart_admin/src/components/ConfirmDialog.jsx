export default function ConfirmDialog({
  open,
  message = 'Bạn chắc chắn muốn xoá sản phẩm này?',
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop">
      <div className="dialog" data-testid="confirm-dialog" role="dialog" aria-modal="true">
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" className="btn" data-testid="confirm-no" onClick={onCancel}>
            Huỷ
          </button>
          <button type="button" className="btn btn-danger" data-testid="confirm-yes" onClick={onConfirm}>
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  );
}
