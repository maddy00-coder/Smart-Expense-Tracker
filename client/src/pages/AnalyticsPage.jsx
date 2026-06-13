import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell';
import ChartCard from '../components/ChartCard';
import SkeletonCard from '../components/SkeletonCard';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/formatters';
import { useAuth } from '../context/AuthContext';

function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/expenses/analytics')
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell
      title="Analytics"
      subtitle="Visualize momentum, compare categories, and understand how your spending evolves month over month."
    >
      {loading ? (
        <div className="content-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : !(data?.monthlyTrend?.length || data?.incomeTrend?.length || data?.categoryDistribution?.length) ? (
        <div className="panel-card premium-empty-state">
          <h3>Add transactions to generate analytics.</h3>
          <p>Once transactions are added, trends and category charts will appear here.</p>
        </div>
      ) : (
        <>
          <div className="content-grid">
            <ChartCard title="Monthly spending trends" type="line" data={data?.monthlyTrend || []} />
            <ChartCard title="Category distribution" type="pie" data={data?.categoryDistribution || []} />
            <div className="panel-card">
              <h3>Income vs Expense</h3>
              <p className="empty-text">
                Balance: {formatCurrency(data?.totals?.balance || 0, user?.currency)}
              </p>
              <div className="legend-grid">
                <div className="legend-item">
                  <span className="legend-swatch" style={{ background: '#22c55e' }} />
                  <span>Income: {formatCurrency(data?.totals?.income || 0, user?.currency)}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-swatch" style={{ background: '#15803d' }} />
                  <span>Expense Total: {formatCurrency(data?.totals?.expenses || 0, user?.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}

export default AnalyticsPage;
