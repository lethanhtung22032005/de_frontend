import ProductRow from './ProductRow.jsx';
import { categoryNames as defaultCategoryNames } from '../data/sample.js';

export default function ProductTable({
  products = [],
  categoryNames = defaultCategoryNames,
  onEdit,
  onDelete,
}) {
  return (
    <table data-testid="product-table" className="product-table">
      <thead>
        <tr>
          <th>Tên</th>
          <th>SKU</th>
          <th>Danh mục</th>
          <th>Giá</th>
          <th>Tồn kho</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            categoryNames={categoryNames}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
