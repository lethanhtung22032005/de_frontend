const SKU_RE = /^[A-Z]{3}-\d{4}$/;

export default function validateProduct(form, categories = []) {
  const errors = {};

  const name = typeof form.name === 'string' ? form.name.trim() : '';
  if (name.length < 3 || name.length > 100) {
    errors.name = 'Tên sản phẩm từ 3 đến 100 ký tự';
  }

  if (typeof form.sku !== 'string' || !SKU_RE.test(form.sku)) {
    errors.sku = 'SKU có dạng ABC-1234';
  }

  if (!form.category) {
    errors.category = 'Vui lòng chọn danh mục';
  } else if (categories.length > 0 && !categories.some((c) => c.id === form.category)) {
    errors.category = 'Danh mục không hợp lệ';
  }

  const price = Number(form.price);
  if (form.price === '' || form.price === null || form.price === undefined || !(price > 0)) {
    errors.price = 'Giá phải lớn hơn 0';
  }

  const stock = Number(form.stock);
  if (
    form.stock === '' ||
    form.stock === null ||
    form.stock === undefined ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    errors.stock = 'Tồn kho là số nguyên không âm';
  }

  return errors;
}
