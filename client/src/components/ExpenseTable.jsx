import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../lib/formatters';

function ExpenseTable({ expenses, onEdit, onDelete, currency = 'INR' }) {
  const getTypeLabel = (expense) => (expense.type === 'income' ? 'Income' : 'Expense');

  return (
    <div className="panel-card">
      <div className="panel-head">
        <h3>Recent Transactions</h3>
      </div>
      <div className="transaction-list">
        {expenses?.length ? (
          expenses.map((expense) => (
            <motion.div className="transaction-row" key={expense._id} whileHover={{ x: 4 }}>
              <div>
                <strong>{expense.description}</strong>
                <span>
                  {getTypeLabel(expense)} - {expense.category} - {formatDate(expense.date)}
                </span>
              </div>
              <div className="transaction-actions">
                <strong>
                  {expense.type === 'income' ? '+' : '-'}
                  {formatCurrency(expense.amount, currency)}
                </strong>
                {onEdit ? (
                  <button type="button" className="ghost-button" onClick={() => onEdit(expense)}>
                    Edit
                  </button>
                ) : null}
                {onDelete ? (
                  <button type="button" className="ghost-button danger-text" onClick={() => onDelete(expense._id)}>
                    Delete
                  </button>
                ) : null}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="empty-text">No transactions yet. Start with your first transaction.</p>
        )}
      </div>
    </div>
  );
}

export default ExpenseTable;
