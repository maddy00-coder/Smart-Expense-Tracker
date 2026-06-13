import { useState } from 'react';

function BudgetForm({ currentMonth, onSubmit }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      month: currentMonth,
      amount: Number(amount)
    });
    setAmount('');
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <input
        type="number"
        min="1"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="Set monthly budget"
        required
      />
      <button className="primary-button" type="submit">
        Save Budget
      </button>
    </form>
  );
}

export default BudgetForm;
