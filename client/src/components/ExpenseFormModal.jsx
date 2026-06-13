import { useEffect, useState } from 'react';
import { expenseCategories } from '../lib/constants';

const initialState = {
  type: 'expense',
  amount: '',
  category: 'Other',
  date: new Date().toISOString().slice(0, 10),
  description: ''
};

function ExpenseFormModal({ open, onClose, onSubmit, expense, submitting }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (expense) {
      setForm({
        type: expense.type || 'expense',
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().slice(0, 10),
        description: expense.description
      });
    } else {
      setForm(initialState);
    }
  }, [expense, open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount)
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="panel-head">
          <h3>{expense ? 'Edit Expense' : 'Add Expense'}</h3>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="expense-form" onSubmit={handleSubmit}>
          <label>
            Type
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label>
            Amount
            <input name="amount" type="number" min="1" value={form.amount} onChange={handleChange} required />
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
            <input name="date" type="date" value={form.date} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Lunch at Swiggy, Uber to office, rent payment..."
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : expense ? 'Update expense' : 'Save expense'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpenseFormModal;
