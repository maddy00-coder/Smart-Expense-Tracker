import { formatCurrency } from '../lib/formatters';

function BudgetCard({ budget, currency = 'INR' }) {
  if (!budget) {
    return (
      <div className="panel-card">
        <div className="panel-head">
          <h3>Monthly Budget</h3>
        </div>
        <p className="empty-text">Set a monthly budget to unlock proactive alerts.</p>
      </div>
    );
  }

  const utilization = Math.min(Math.round(budget.utilization || 0), 100);
  const stateClass = utilization >= 100 ? 'danger' : utilization >= 80 ? 'warning' : 'safe';

  return (
    <div className="panel-card">
      <div className="panel-head">
        <h3>Monthly Budget</h3>
        <span className={`budget-badge ${stateClass}`}>{stateClass}</span>
      </div>
      <div className="budget-meta">
        <div>
          <small>Budget</small>
          <strong>{formatCurrency(budget.amount, currency)}</strong>
        </div>
        <div>
          <small>Spent</small>
          <strong>{formatCurrency(budget.spent, currency)}</strong>
        </div>
      </div>
      <div className="budget-bar">
        <div className={`budget-progress ${stateClass}`} style={{ width: `${utilization}%` }} />
      </div>
      <p className="budget-copy">
        {utilization >= 100
          ? 'Budget exceeded. Consider pausing non-essential spend.'
          : utilization >= 80
            ? 'You are nearing your monthly cap.'
            : 'You are tracking comfortably within budget.'}
      </p>
    </div>
  );
}

export default BudgetCard;
