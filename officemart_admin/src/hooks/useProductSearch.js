import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axiosClient.js';

export default function useProductSearch({ q = '', category = '', status = '', page = 1 } = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: 10 };
        if (q) params.q = q;
        if (category) params.category = category;
        if (status) params.status = status;

        const res = await api.get('/products', { params, signal: controller.signal });
        if (controller.signal.aborted) return;
        setData(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted || err.code === 'ERR_CANCELED') return;
        setError(err.response?.data?.message || err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [q, category, status, page, nonce]);

  const reload = useCallback(() => {
    setNonce((value) => value + 1);
  }, []);

  return { data, total, loading, error, reload };
}
