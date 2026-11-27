import { useEffect, useState } from 'react';
import api from '../api/axiosClient.js';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/categories')
      .then((res) => {
        if (active) setCategories(res.data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, error };
}
