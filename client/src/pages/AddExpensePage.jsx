import { useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '../components/PageShell';
import { api } from '../lib/api';
import { expenseCategories } from '../lib/constants';

const initialState = {
  type: 'expense',
  amount: '',
  category: 'Other',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'UPI',
  description: ''
};

function AddExpensePage() {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitting(true);
    try {
      await api.post('/api/expenses', {
        type: form.type,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
        description: `${form.paymentMethod} - ${form.description}`
      });
      toast.success('Transaction saved');
      setForm(initialState);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      title="Add Transaction"
      subtitle="Capture a transaction quickly with all key details in one clean form."
    >
      <div className="panel-card form-panel">
        <form className="expense-form enhanced-form" onSubmit={handleSubmit}>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label>
            Amount
            <input type="number" min="1" name="amount" value={form.amount} onChange={handleChange} required />
          </label>
          <label>
            Category
            <select name="category" value={form.category} onChange={handleChange}>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </label>
          <label>
            Payment Method
            <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </label>
          <label className="full-width">
            Description
            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief note for this transaction"
              required
            />
          </label>
          <button className="primary-button full-width" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

export default AddExpensePage;
