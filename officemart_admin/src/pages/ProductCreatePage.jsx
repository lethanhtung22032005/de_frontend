import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient.js';
import useCategories from '../hooks/useCategories.js';
import { useToast } from '../context/ToastContext.jsx';
import ProductForm from '../components/ProductForm.jsx';

const emptyInitial = {
  name: '',
  sku: '',
  category: '',
  price: '',
  stock: '',
  status: 'active',
};

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { categories, error: categoriesError } = useCategories();

  async function handleSubmit(form) {
    try {
      await api.post('/products', {
        name: form.name.trim(),
        sku: form.sku,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        status: form.status,
      });
      showToast('Đã thêm sản phẩm');
      navigate('/products');
      return null;
    } catch (err) {
      const data = err.response?.data;
      const status = err.response?.status;
      if ((status === 409 || status === 400) && data) {
        return { field: data.field, message: data.message };
      }
      return { message: data?.message || 'Không thể thêm sản phẩm' };
    }
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1>Thêm sản phẩm</h1>
      </div>
      {categoriesError && (
        <p className="form-error" role="alert">
          {categoriesError}
        </p>
      )}
      <ProductForm
        initial={emptyInitial}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/products')}
      />
    </main>
  );
}
