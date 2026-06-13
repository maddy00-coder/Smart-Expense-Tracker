import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/expenses/dashboard');
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    loading,
    refreshDashboard: fetchDashboard,
    setData
  };
}
