import { useState } from 'react';
import validateProduct from '../utils/validate.js';

export default function ProductForm({
  initial,
  categories = [],
  onSubmit,
  onCancel,
  submitLabel = 'Lưu',
}) {
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? '',
    sku: initial?.sku ?? '',
    category: initial?.category ?? '',
    price: initial?.price !== undefined && initial?.price !== null ? String(initial.price) : '',
    stock: initial?.stock !== undefined && initial?.stock !== null ? String(initial.stock) : '',
    status: initial?.status ?? 'active',
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    const nextErrors = validateProduct(form, categories);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormError(null);
      return;
    }

    setErrors({});
    setFormError(null);
    setSaving(true);

    try {
      const result = await onSubmit(form);
      if (result && result.message) {
        if (result.field) setErrors({ [result.field]: result.message });
        else setFormError(result.message);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" data-testid="product-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <p className="form-error" role="alert">
          {formError}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="name">Tên sản phẩm</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} />
        {errors.name && (
          <p className="field-error" data-testid="field-error-name">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="sku">SKU</label>
        <input id="sku" name="sku" value={form.sku} onChange={handleChange} placeholder="ABC-1234" />
        {errors.sku && (
          <p className="field-error" data-testid="field-error-sku">
            {errors.sku}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="category">Danh mục</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          <option value="">Chọn danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="field-error" data-testid="field-error-category">
            {errors.category}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="price">Giá</label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          value={form.price}
          onChange={handleChange}
        />
        {errors.price && (
          <p className="field-error" data-testid="field-error-price">
            {errors.price}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="stock">Tồn kho</label>
        <input
          id="stock"
          name="stock"
          type="number"
          step="1"
          min="0"
          value={form.stock}
          onChange={handleChange}
        />
        {errors.stock && (
          <p className="field-error" data-testid="field-error-stock">
            {errors.stock}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="status">Trạng thái</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
        {errors.status && (
          <p className="field-error" data-testid="field-error-status">
            {errors.status}
          </p>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" data-testid="submit-button" disabled={saving}>
          {saving ? 'Đang lưu…' : submitLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Huỷ
        </button>
      </div>
    </form>
  );
}
