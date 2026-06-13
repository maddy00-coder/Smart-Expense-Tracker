import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import SkeletonCard from '../components/SkeletonCard';
import BudgetCard from '../components/BudgetCard';
import InsightsPanel from '../components/InsightsPanel';
import ChartCard from '../components/ChartCard';
import { formatCurrency } from '../lib/formatters';
import { useAuth } from '../context/AuthContext';
import { useDashboardData } from '../hooks/useDashboardData';

function DashboardPage() {
  const { user } = useAuth();
  const { data, loading } = useDashboardData();

  const totalIncome = data?.metrics?.totalIncome || 0;
  const monthlyBudget = data?.budget?.amount || 0;
  const currentMonthSpend = data?.metrics?.thisMonthExpenses || 0;
  const budgetUtilization = monthlyBudget ? Math.round((currentMonthSpend / monthlyBudget) * 100) : 0;

  return (
    <PageShell
      title="Financial command center"
      subtitle="Stay ahead of budgets, categories, and spending momentum in one elegant workspace."
    >
      <section className="dashboard-hero panel-card">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Welcome back to your finance cockpit</h2>
          <p className="page-subtitle">
            Monitor spending health, budget utilization, and transaction momentum from one premium dashboard.
          </p>
          <div className="dashboard-hero-insight">
            <span>You have spent {formatCurrency(currentMonthSpend, user?.currency)} this month.</span>
            <span>Budget utilization: {monthlyBudget ? `${budgetUtilization}%` : 'Budget not set'}</span>
            <span>Track your spending from the Add Expense page.</span>
          </div>
        </div>
        <div className="dashboard-hero-metrics">
          <div>
            <small>Current Month Spend</small>
            <strong>{currentMonthSpend.toLocaleString()}</strong>
          </div>
          <div>
            <small>Active Budget</small>
            <strong>{monthlyBudget ? monthlyBudget.toLocaleString() : 'Not set'}</strong>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="stats-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <section className="stats-grid">
            <StatCard
              title="Balance left"
              value={data?.metrics.totalBalance}
              footnote="Remaining against this month’s budget"
              currency={user?.currency}
            />
            <StatCard
              title="Total Income"
              value={totalIncome}
              footnote="Across all tracked income"
              currency={user?.currency}
            />
            <StatCard
              title="Total Expenses"
              value={data?.metrics.totalExpenses}
              footnote="Across all tracked transactions"
              currency={user?.currency}
            />
            <StatCard
              title="Monthly Budget"
              value={monthlyBudget}
              footnote={`${data?.metrics.comparison || 0}% vs previous month`}
              currency={user?.currency}
            />
          </section>

          <section className="content-grid">
            <BudgetCard budget={data?.budget} currency={user?.currency} />
            <InsightsPanel insights={data?.insights} prediction={data?.prediction} currency={user?.currency} />
          </section>

          <section className="content-grid">
            <ChartCard title="Monthly spending trend" type="line" data={data?.monthlyTrend || []} />
            <ChartCard title="Category distribution" type="pie" data={data?.categoryBreakdown || []} />
          </section>
        </>
      )}
    </PageShell>
  );
}

export default DashboardPage;
