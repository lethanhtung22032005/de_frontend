import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axiosClient.js';
import useCategories from '../hooks/useCategories.js';
import useDebounce from '../hooks/useDebounce.js';
import useProductSearch from '../hooks/useProductSearch.js';
import { useToast } from '../context/ToastContext.jsx';
import ProductTable from '../components/ProductTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import Pagination from '../components/Pagination.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { Loading, ErrorMessage, EmptyState } from '../components/States.jsx';

const LIMIT = 10;

export default function ProductListPage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const status = searchParams.get('status') ?? '';
  const rawPage = Number(searchParams.get('page'));
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const applyParams = useCallback(
    (changes, options) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        Object.entries(changes).forEach(([key, value]) => {
          if (value === '' || value === null || value === undefined) params.delete(key);
          else params.set(key, value);
        });
        return params;
      }, options);
    },
    [setSearchParams],
  );

  const [searchText, setSearchText] = useState(q);
  useEffect(() => {
    setSearchText(q);
  }, [q]);

  const debouncedSearch = useDebounce(searchText, 400);
  useEffect(() => {
    const keyword = debouncedSearch.trim();
    if (keyword === q) return;
    applyParams({ q: keyword, page: '1' }, { replace: true });
  }, [debouncedSearch, q, applyParams]);

  const { data, total, loading, error, reload } = useProductSearch({ q, category, status, page });
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  useEffect(() => {
    if (loading || total === 0) return;
    if (page > totalPages) {
      applyParams({ page: String(totalPages) }, { replace: true });
    }
  }, [loading, total, page, totalPages, applyParams]);

  const [toDelete, setToDelete] = useState(null);
  const [actionError, setActionError] = useState(null);

  function handleSearchChange(value) {
    setSearchText(value);
  }

  function handleCategoryChange(e) {
    applyParams({ category: e.target.value, page: '1' });
  }

  function handleStatusChange(e) {
    applyParams({ status: e.target.value, page: '1' });
  }

  function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) return;
    applyParams({ page: String(nextPage) });
  }

  async function confirmDelete() {
    const target = toDelete;
    setToDelete(null);
    setActionError(null);
    try {
      await api.delete(`/products/${target.id}`);
      showToast('Đã xoá sản phẩm');
      if (data.length === 1 && page > 1) goToPage(page - 1);
      else reload();
    } catch (err) {
      setActionError(err.response?.data?.message || err.message);
    }
  }

  const categoryNames = categories.reduce((acc, item) => {
    acc[item.id] = item.name;
    return acc;
  }, {});

  const hasProducts = !loading && !error && data.length > 0;

  return (
    <main className="page">
      <div className="page-header">
        <h1>Sản phẩm</h1>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="add-button"
          onClick={() => navigate('/products/new')}
        >
          Thêm sản phẩm
        </button>
      </div>

      <FilterBar
        search={searchText}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        status={status}
        onStatusChange={handleStatusChange}
        categories={categories}
      />

      {actionError && (
        <p className="form-error" role="alert">
          {actionError}
        </p>
      )}

      {loading && <Loading />}
      {!loading && error && <ErrorMessage message={error} onRetry={reload} />}
      {!loading && !error && total === 0 && <EmptyState />}
      {hasProducts && (
        <ProductTable
          products={data}
          categoryNames={categories.length > 0 ? categoryNames : undefined}
          onEdit={(product) => navigate(`/products/${product.id}/edit`)}
          onDelete={(product) => setToDelete(product)}
        />
      )}

      {!loading && !error && total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => goToPage(page - 1)}
          onNext={() => goToPage(page + 1)}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        message={toDelete ? `Xoá sản phẩm "${toDelete.name}"?` : ''}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </main>
  );
}
