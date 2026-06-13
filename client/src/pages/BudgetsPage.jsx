import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '../components/PageShell';
import BudgetForm from '../components/BudgetForm';
import { api } from '../lib/api';

function BudgetsPage() {
  const [budget, setBudget] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [budgetApiAvailable, setBudgetApiAvailable] = useState(true);
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);

  const fetchData = async () => {
    try {
      const dashboardRes = await api.get('/api/expenses/dashboard');
      setDashboard(dashboardRes.data);
      if (budgetApiAvailable) {
        const budgetRes = await api.get('/api/budgets');
        setBudget(budgetRes.data.budget);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setBudgetApiAvailable(false);
        setBudget(null);
        return;
      }
      toast.error(error.response?.data?.message || 'Unable to load budgets');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (payload) => {
    if (!budgetApiAvailable) {
      return;
    }
    try {
      await api.post('/api/budgets', payload);
      toast.success('Budget saved');
      fetchData();
    } catch (error) {
      if (error.response?.status === 404) {
        setBudgetApiAvailable(false);
        return;
      }
      toast.error(error.response?.data?.message || 'Unable to save budget');
    }
  };

  const spent = dashboard?.metrics?.thisMonthExpenses || 0;
  const total = budget?.amount || 0;
  const utilization = total ? Math.min((spent / total) * 100, 100) : 0;

  return (
    <PageShell
      title="Budgets"
      subtitle="Define monthly limits and monitor category-level utilization."
    >
      <div className="content-grid">
        <div className="panel-card">
          <div className="panel-head">
            <h3>Monthly Budget Setup</h3>
          </div>
          {budgetApiAvailable ? (
            <BudgetForm currentMonth={currentMonth} onSubmit={onSubmit} />
          ) : (
            <p className="empty-text">
              Budget API is unavailable on this backend. You can still track spending in Dashboard and
              Transactions.
            </p>
          )}
          {!total ? <p className="empty-text">No monthly budget set yet. Add one to track progress.</p> : null}
        </div>
        <div className="panel-card">
          <h3>Budget Progress</h3>
          <p className="budget-copy">
            Spent {spent.toLocaleString()} of {total.toLocaleString()} this month
          </p>
          <div className="budget-bar">
            <div className="budget-progress safe" style={{ width: `${utilization}%` }} />
          </div>
          <strong>{utilization.toFixed(1)}% used</strong>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-head">
          <h3>Category Budget Cards</h3>
        </div>
        {dashboard?.categoryBreakdown?.length ? (
          <div className="budget-plan-grid">
            {dashboard.categoryBreakdown.map((item) => {
              const share = spent ? Math.round((item.value / spent) * 100) : 0;
              return (
                <article key={item.name} className="metric-card">
                  <h4>{item.name}</h4>
                  <p>{item.value.toLocaleString()}</p>
                  <div className="budget-bar">
                    <div className="budget-progress warning" style={{ width: `${Math.min(share, 100)}%` }} />
                  </div>
                  <small>{share}% of monthly spend</small>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="empty-text">Add expenses to generate category budget insights.</p>
        )}
      </div>
    </PageShell>
  );
}

export default BudgetsPage;
