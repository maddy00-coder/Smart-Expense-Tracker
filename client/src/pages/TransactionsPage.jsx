import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '../components/PageShell';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseTable from '../components/ExpenseTable';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

function TransactionsPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    startDate: '',
    endDate: ''
  });
  const [rows, setRows] = useState([]);

  const fetchExpenses = async () => {
    const params = {};
    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.category && filters.category !== 'All') {
      params.category = filters.category;
    }
    if (filters.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters.endDate) {
      params.endDate = filters.endDate;
    }
    if (filters.type && filters.type !== 'All') {
      params.type = filters.type;
    }

    try {
      const response = await api.get('/api/expenses', {
        params
      });
      setRows(response.data.expenses || []);
    } catch (error) {
      if (error.response?.status === 404) {
        setRows([]);
        return;
      }
      toast.error(error.response?.data?.message || 'Unable to fetch transactions');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters.search, filters.category, filters.type, filters.startDate, filters.endDate]);

  const exportCsv = () => {
    const headers = ['Type', 'Description', 'Category', 'Amount', 'Date'];
    const csv = [headers, ...rows.map((item) => [item.type || 'expense', item.description, item.category, item.amount, item.date])]
      .map((line) => line.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const onDelete = async (id) => {
    try {
      await api.delete(`/api/expenses/${id}`);
      toast.success('Transaction deleted');
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete transaction');
    }
  };

  return (
    <PageShell
      title="Transactions"
      subtitle="Search, filter, and review transaction history with clarity."
    >
      <div className="panel-card">
        <div className="panel-head">
          <h3>Filters</h3>
        </div>
        <div className="filter-stack">
          <ExpenseFilters filters={filters} onChange={(event) => {
            const { name, value } = event.target;
            setFilters((current) => ({ ...current, [name]: value }));
          }} onExport={exportCsv} />
          <div className="type-filter-row">
            <label>
              Type
              <select
                name="type"
                value={filters.type}
                onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
              >
                <option value="All">All</option>
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <ExpenseTable expenses={rows} onDelete={onDelete} currency={user?.currency} />
      {!rows.length ? (
        <div className="panel-card premium-empty-state">
          <h3>No transactions yet. Start with your first transaction.</h3>
        </div>
      ) : null}
    </PageShell>
  );
}

export default TransactionsPage;
