function InsightsPanel({ insights, prediction, currency = 'INR' }) {
  return (
    <div className="panel-card">
      <div className="panel-head">
        <h3>Smart Insights</h3>
        <span className="panel-tag">Rule-based</span>
      </div>
      <div className="insight-list">
        {(insights?.length ? insights : ['Add a few expenses to start generating insights.']).map((insight) => (
          <div className="insight-item" key={insight}>
            <div className="insight-dot" />
            <p>{insight}</p>
          </div>
        ))}
      </div>
      <div className="prediction-card">
        <small>Next month forecast</small>
        <strong>
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
          }).format(prediction || 0)}
        </strong>
      </div>
    </div>
  );
}

export default InsightsPanel;
