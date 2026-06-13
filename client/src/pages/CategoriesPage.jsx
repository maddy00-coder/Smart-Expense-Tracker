import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PageShell from '../components/PageShell';
import { expenseCategories } from '../lib/constants';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/formatters';
import { useAuth } from '../context/AuthContext';

const baseCategories = [
  'Food',
  'Travel',
  'Shopping',
  'Bills',
  'Health',
  'Education',
  'Entertainment',
  'Groceries',
  'Investments',
  'Other'
];

const categoryColors = {
  Food: '#22c55e',
  Travel: '#0ea5e9',
  Shopping: '#f97316',
  Bills: '#6366f1',
  Health: '#ef4444',
  Education: '#14b8a6',
  Entertainment: '#a855f7',
  Groceries: '#84cc16',
  Investments: '#f59e0b',
  Other: '#94a3b8'
};

const previewPercentages = {
  Food: 26,
  Travel: 12,
  Shopping: 15,
  Bills: 18,
  Health: 7,
  Education: 8,
  Entertainment: 5,
  Groceries: 6,
  Investments: 2,
  Other: 1
};

function CategoriesPage() {
  const { user } = useAuth();
  const [customCategory, setCustomCategory] = useState('');
  const [realExpenses, setRealExpenses] = useState([]);
  const [localCategories, setLocalCategories] = useState(
    [...new Set([...baseCategories, ...expenseCategories])].slice(0, 10)
  );

  useEffect(() => {
    api
      .get('/api/expenses', { params: { type: 'Expense', page: 1, limit: 200 } })
      .then((response) => setRealExpenses(response.data?.expenses || []))
      .catch(() => setRealExpenses([]));
  }, []);

  const addCategory = (event) => {
    event.preventDefault();
    const normalized = customCategory.trim();
    if (!normalized) {
      return;
    }
    if (localCategories.includes(normalized)) {
      return;
    }
    setLocalCategories((current) => [...current, normalized]);
    setCustomCategory('');
  };

  const chartData = useMemo(() => {
    if (!realExpenses.length) {
      return baseCategories.map((name) => ({
        name,
        value: previewPercentages[name],
        isPreview: true
      }));
    }

    const sums = realExpenses.reduce((acc, item) => {
      const key = baseCategories.includes(item.category) ? item.category : 'Other';
      acc[key] = (acc[key] || 0) + item.amount;
      return acc;
    }, {});

    return baseCategories
      .map((name) => ({ name, value: sums[name] || 0, isPreview: false }))
      .filter((item) => item.value > 0);
  }, [realExpenses]);

  const totalValue = useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData]);
  const topCategories = useMemo(
    () => [...chartData].sort((a, b) => b.value - a.value).slice(0, 5),
    [chartData]
  );
  const trackedCategoryCount = useMemo(() => localCategories.filter((category) => categoryColors[category]).length, [localCategories]);
  const customCategoryCount = localCategories.length - trackedCategoryCount;
  const activeSegments = chartData.length;
  const leadCategory = topCategories[0];

  return (
    <PageShell
      title="Categories"
      subtitle="Colorful category intelligence to spot where money moves every month."
    >
      <div className="content-grid categories-overview-grid">
        <div className="panel-card categories-chart-card">
          <div className="panel-head">
            <h3>Category Spending Overview</h3>
          </div>
          <div className="categories-donut-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={74} outerRadius={108}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={categoryColors[entry.name] || categoryColors.Other} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, user?.currency)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="categories-donut-center">
              <small>{realExpenses.length ? 'Total' : 'Preview'}</small>
              <strong>{realExpenses.length ? formatCurrency(totalValue, user?.currency) : '100%'}</strong>
            </div>
          </div>
          {!realExpenses.length ? (
            <p className="empty-text">Preview shown. Add expenses to see real category distribution.</p>
          ) : null}
        </div>

        <div className="panel-card">
          <div className="panel-head">
            <h3>Top Categories</h3>
          </div>
          <div className="top-category-list">
            {topCategories.map((item) => {
              const percentage = totalValue ? Math.round((item.value / totalValue) * 100) : 0;
              return (
                <article key={item.name} className="top-category-row">
                  <div className="top-category-label">
                    <span className="dot" style={{ background: categoryColors[item.name] || categoryColors.Other }} />
                    <strong>{item.name}</strong>
                    <small>{realExpenses.length ? formatCurrency(item.value, user?.currency) : `${item.value}%`}</small>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.max(percentage || item.value, 3)}%`,
                        background: categoryColors[item.name] || categoryColors.Other
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <section className="categories-focus-wrap">
        <div className="categories-stats-row">
          <article className="panel-card categories-stat-tile">
            <small>Saved Categories</small>
            <strong>{localCategories.length}</strong>
            <span>{trackedCategoryCount} tracked templates in use</span>
          </article>
          <article className="panel-card categories-stat-tile">
            <small>Custom Added</small>
            <strong>{customCategoryCount}</strong>
            <span>{customCategoryCount ? 'Personal labels ready to use' : 'No custom labels yet'}</span>
          </article>
          <article className="panel-card categories-stat-tile">
            <small>Live Segments</small>
            <strong>{activeSegments}</strong>
            <span>{leadCategory ? `${leadCategory.name} leads the current mix` : 'Waiting for category activity'}</span>
          </article>
        </div>

        <div className="panel-card categories-add-panel categories-add-panel-centered">
          <div className="categories-add-ornament" aria-hidden="true" />
          <div className="categories-add-head">
            <span className="eyebrow">Workspace Tool</span>
            <h3>Add Category</h3>
            <p className="empty-text">Create a custom label for future transactions while keeping the rest of the page clean and focused.</p>
          </div>
          <form className="expense-form" onSubmit={addCategory}>
            <input
              type="text"
              className="categories-add-input"
              value={customCategory}
              onChange={(event) => setCustomCategory(event.target.value)}
              placeholder="New category name"
            />
            <button type="submit" className="primary-button categories-add-button">
              Add Category
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

export default CategoriesPage;
