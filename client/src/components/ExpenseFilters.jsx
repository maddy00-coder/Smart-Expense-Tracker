import { expenseCategories } from '../lib/constants';

function ExpenseFilters({ filters, onChange, onExport }) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        name="search"
        value={filters.search}
        onChange={onChange}
        placeholder="Search descriptions"
      />
      <select name="category" value={filters.category} onChange={onChange}>
        <option value="All">All categories</option>
        {expenseCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input type="date" name="startDate" value={filters.startDate} onChange={onChange} />
      <input type="date" name="endDate" value={filters.endDate} onChange={onChange} />
      <button className="secondary-button" type="button" onClick={onExport}>
        Export CSV
      </button>
    </div>
  );
}

export default ExpenseFilters;
