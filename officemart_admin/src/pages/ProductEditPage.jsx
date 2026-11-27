import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient.js';
import useCategories from '../hooks/useCategories.js';
import { useToast } from '../context/ToastContext.jsx';
import ProductForm from '../components/ProductForm.jsx';
import { Loading } from '../components/States.jsx';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const { categories } = useCategories();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api
      .get(`/products/${id}`)
      .then((res) => {
        if (active) setProduct(res.data);
      })
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 404) setError('Không tìm thấy sản phẩm');
        else setError(err.response?.data?.message || err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(form) {
    try {
      await api.put(`/products/${id}`, {
        name: form.name.trim(),
        sku: form.sku,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        status: form.status,
      });
      showToast('Đã cập nhật sản phẩm');
      navigate('/products');
      return null;
    } catch (err) {
      const data = err.response?.data;
      const status = err.response?.status;
      if (status === 404) return { message: 'Không tìm thấy sản phẩm' };
      if ((status === 409 || status === 400) && data) {
        return { field: data.field, message: data.message };
      }
      return { message: data?.message || 'Không thể cập nhật sản phẩm' };
    }
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1>Sửa sản phẩm</h1>
      </div>
      {loading && <Loading />}
      {!loading && error && (
        <p className="form-error" data-testid="error-message" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && product && (
        <ProductForm
          initial={product}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
        />
      )}
    </main>
  );
}
