import { categoryNames as defaultCategoryNames } from '../data/sample.js';
import { formatPrice, statusLabel } from '../utils/format.js';

export default function ProductRow({
  product,
  categoryNames = defaultCategoryNames,
  onEdit,
  onDelete,
}) {
  const stock = Number(product.stock);
  const categoryName = categoryNames[product.category] ?? product.category;

  return (
    <tr data-testid="product-row" className="product-row">
      <td data-label="Tên">{product.name}</td>
      <td data-label="SKU">{product.sku}</td>
      <td data-label="Danh mục">{categoryName}</td>
      <td data-label="Giá">{formatPrice(product.price)}</td>
      <td data-label="Tồn kho">
        {stock === 0 ? <span className="out-of-stock">Hết hàng</span> : stock}
      </td>
      <td data-label="Trạng thái">
        <span
          data-testid="product-status"
          className={`status status-${product.status}`}
        >
          {statusLabel[product.status] ?? product.status}
        </span>
      </td>
      <td data-label="Thao tác" className="actions">
        <button
          type="button"
          className="btn"
          data-testid="edit-button"
          onClick={onEdit ? () => onEdit(product) : undefined}
        >
          Sửa
        </button>
        <button
          type="button"
          className="btn btn-danger"
          data-testid="delete-button"
          onClick={onDelete ? () => onDelete(product) : undefined}
        >
          Xoá
        </button>
      </td>
    </tr>
  );
}
