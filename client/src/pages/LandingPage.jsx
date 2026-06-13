import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';

const heroSlides = [
  {
    key: 'clarity',
    title: 'Gain total clarity over your money flow',
    description:
      'Track expenses, budgets, and savings with a fintech-grade interface designed for calm and confident decisions.',
    cta: 'Enter Website',
    to: '/login',
    stat: '92% users report better spending visibility'
  },
  {
    key: 'save',
    title: 'Save smarter every month',
    description:
      'Use monthly insights and category-level trends to convert everyday spending into measurable savings.',
    cta: 'Get Started',
    to: '/signup',
    stat: 'Average monthly savings uplift: 12%'
  },
  {
    key: 'prevent',
    title: 'Track spending before it becomes overspending',
    description:
      'Budget pacing and proactive alerts help you stay on target before expenses drift too far.',
    cta: 'Start Saving Smarter',
    to: '/login',
    stat: 'Live budget pacing across all categories'
  },
  {
    key: 'habits',
    title: 'Build better financial habits',
    description: 'From daily tracking to monthly strategy, keep everything in one secure and elegant workspace.',
    cta: 'Try Smart Tracker',
    to: '/signup',
    stat: 'Daily consistency with clear weekly reviews'
  }
];

const heroVisuals = {
  clarity: {
    eyebrow: 'Spending overview',
    title: 'Live dashboard snapshot',
    totalLabel: 'Monthly balance',
    totalValue: '₹48,200',
    totalDelta: '+8.4% this month',
    bars: [
      { label: 'Budget pacing', value: '82%', width: '82%' },
      { label: 'Savings goal', value: '64%', width: '64%' },
      { label: 'Essentials', value: '47%', width: '47%' }
    ],
    metrics: [
      { label: 'Alerts', value: '03' },
      { label: 'Categories', value: '12' }
    ],
    tags: ['Trends', 'Budget', 'Cashflow']
  },
  save: {
    eyebrow: 'Savings planner',
    title: 'Automation that compounds',
    totalLabel: 'Projected savings',
    totalValue: '₹12,400',
    totalDelta: '+12% improvement',
    bars: [
      { label: 'Emergency fund', value: '73%', width: '73%' },
      { label: 'Travel goal', value: '58%', width: '58%' },
      { label: 'Monthly reserve', value: '91%', width: '91%' }
    ],
    metrics: [
      { label: 'Auto rules', value: '05' },
      { label: 'Wins', value: '18' }
    ],
    tags: ['Goals', 'Rules', 'Monthly']
  },
  prevent: {
    eyebrow: 'Overspend control',
    title: 'Guardrails before drift',
    totalLabel: 'At-risk spend',
    totalValue: '₹6,750',
    totalDelta: '2 categories flagged',
    bars: [
      { label: 'Dining out', value: '88%', width: '88%' },
      { label: 'Transport', value: '61%', width: '61%' },
      { label: 'Shopping', value: '76%', width: '76%' }
    ],
    metrics: [
      { label: 'Warnings', value: '04' },
      { label: 'Safe zones', value: '09' }
    ],
    tags: ['Limits', 'Forecast', 'Protection']
  },
  habits: {
    eyebrow: 'Weekly rhythm',
    title: 'Small habits, stronger months',
    totalLabel: 'Consistency score',
    totalValue: '92/100',
    totalDelta: '7-day check-in streak',
    bars: [
      { label: 'Daily logging', value: '94%', width: '94%' },
      { label: 'Weekly review', value: '78%', width: '78%' },
      { label: 'Savings habit', value: '69%', width: '69%' }
    ],
    metrics: [
      { label: 'Routines', value: '06' },
      { label: 'Reviews', value: '14' }
    ],
    tags: ['Routine', 'Review', 'Discipline']
  }
};

function HeroVisual({ slideKey }) {
  const visual = heroVisuals[slideKey];

  return (
    <motion.div
      key={slideKey}
      className="hero-visual"
      initial={{ opacity: 0, x: 18, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="hero-visual-orb hero-visual-orb-one" />
      <div className="hero-visual-orb hero-visual-orb-two" />

      <article className="hero-dashboard-card">
        <div className="hero-dashboard-head">
          <div>
            <small>{visual.eyebrow}</small>
            <strong>{visual.title}</strong>
          </div>
          <span className="hero-dashboard-badge">Live</span>
        </div>

        <div className="hero-dashboard-total">
          <span>{visual.totalLabel}</span>
          <strong>{visual.totalValue}</strong>
          <small>{visual.totalDelta}</small>
        </div>

        <div className="hero-dashboard-bars">
          {visual.bars.map((bar) => (
            <div key={bar.label} className="hero-dashboard-bar-row">
              <div className="hero-dashboard-bar-copy">
                <span>{bar.label}</span>
                <strong>{bar.value}</strong>
              </div>
              <div className="hero-dashboard-track">
                <div className="hero-dashboard-fill" style={{ width: bar.width }} />
              </div>
            </div>
          ))}
        </div>

        <div className="hero-dashboard-footer">
          {visual.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </article>

      <article className="hero-mini-card hero-mini-card-metrics">
        {visual.metrics.map((metric) => (
          <div key={metric.label}>
            <small>{metric.label}</small>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </article>

      <article className="hero-mini-card hero-mini-card-chart">
        <div className="hero-ring-chart">
          <div className="hero-ring-chart-core">
            <strong>84%</strong>
            <span>on track</span>
          </div>
        </div>
        <div className="hero-chart-legend">
          <span>Healthy cash pacing</span>
          <small>Updated from latest transactions</small>
        </div>
      </article>
    </motion.div>
  );
}

function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const currentSlide = heroSlides[activeSlide];

  return (
    <div className="landing-shell">
      <PublicNavbar />

      <main className="landing-main">
        <section className={`hero-carousel hero-${currentSlide.key}`} id="home">
          <div className="hero-overlay" />
          <div className="hero-content-grid">
            <motion.div
              key={activeSlide}
              className="hero-slide"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <p className="eyebrow">Fintech-grade money management</p>
              <h1>{currentSlide.title}</h1>
              <p>{currentSlide.description}</p>
              <div className="hero-cta-row">
                <Link to={currentSlide.to} className="primary-button">
                  {currentSlide.cta}
                </Link>
                <Link to="/login" className="secondary-button">
                  Login
                </Link>
              </div>
              <div className="hero-stat-chip">{currentSlide.stat}</div>
            </motion.div>

            <HeroVisual slideKey={currentSlide.key} />
          </div>

          <div className="hero-dots">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={index === activeSlide ? 'hero-dot active' : 'hero-dot'}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="landing-section panel-card" id="about">
          <h2>About Smart Expense Tracker</h2>
          <p>
            Smart Expense Tracker is a modern personal finance workspace that helps you monitor income,
            expenses, savings, and budgets from one reliable dashboard. It is designed for real-life
            decision-making: clearer monthly planning, less leakage in discretionary spending, and better
            long-term financial habits.
          </p>
          <div className="about-metrics">
            <article className="metric-card">
              <h3>Income Planning</h3>
              <p>Map monthly inflow and assign purpose-based budget targets.</p>
            </article>
            <article className="metric-card">
              <h3>Expense Visibility</h3>
              <p>Understand category behavior with real-time trend tracking.</p>
            </article>
            <article className="metric-card">
              <h3>Savings Confidence</h3>
              <p>Measure what you can safely save without disrupting essentials.</p>
            </article>
          </div>
        </section>

        <section className="landing-section" id="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-grid">
            {[
              'Create account',
              'Add income and expenses',
              'View reports and charts',
              'Improve saving habits'
            ].map((step, index) => (
              <article key={step} className="step-card">
                <span>Step {index + 1}</span>
                <h3>{step}</h3>
                <p>
                  {index === 0 && 'Create your secure account and set your starting financial context.'}
                  {index === 1 && 'Log day-to-day transactions to keep your money picture accurate.'}
                  {index === 2 && 'Review charts and monthly reports to identify spending patterns.'}
                  {index === 3 && 'Adjust behavior with targeted goals and category limits.'}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="examples">
          <h2>Money-Saving Example</h2>
          <div className="example-grid">
            <article className="panel-card">
              <h3>Monthly Snapshot</h3>
              <p className="example-income">Income: INR 20,000</p>
              <div className="example-row">
                <span>Food</span>
                <strong>INR 5,000</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill food" />
              </div>
              <div className="example-row">
                <span>Travel</span>
                <strong>INR 2,000</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill travel" />
              </div>
              <div className="example-row">
                <span>Shopping</span>
                <strong>INR 3,000</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill shopping" />
              </div>
            </article>
            <article className="panel-card">
              <h3>Insight from the App</h3>
              <p>
                You can instantly see which categories consume the most money and reduce non-essential
                spending to increase savings every month.
              </p>
              <div className="insight-chip">Potential monthly saving improvement: +INR 2,000</div>
            </article>
          </div>
        </section>

        <section className="landing-section" id="budget-planning">
          <h2>Monthly Budget Planning</h2>
          <div className="budget-plan-grid">
            <article className="panel-card">
              <h3>Recommended Allocation</h3>
              <div className="budget-line">
                <span>Needs</span>
                <strong>50%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill needs" />
              </div>
              <div className="budget-line">
                <span>Wants</span>
                <strong>30%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill wants" />
              </div>
              <div className="budget-line">
                <span>Savings</span>
                <strong>20%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill savings" />
              </div>
            </article>
            <article className="panel-card">
              <h3>Monthly Review Checklist</h3>
              <ul className="landing-list">
                <li>Verify recurring expenses and subscriptions</li>
                <li>Identify top two categories with unexpected growth</li>
                <li>Set next-month spending ceiling for discretionary items</li>
                <li>Lock a fixed transfer amount into savings at month start</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="landing-section" id="features">
          <h2>Features</h2>
          <div className="features-grid">
            {[
              'Expense tracking',
              'Income tracking',
              'Category-wise spending',
              'Monthly reports',
              'Budget alerts',
              'Secure login',
              'Dashboard analytics'
            ].map((feature) => (
              <article key={feature} className="feature-card">
                <h3>{feature}</h3>
                <p>Built for practical finance decisions with clean visual guidance.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="benefits">
          <h2>Benefits</h2>
          <div className="benefits-grid">
            {[
              'Save more money',
              'Understand spending habits',
              'Avoid overspending',
              'Plan monthly budget',
              'Track financial goals'
            ].map((benefit) => (
              <article key={benefit} className="benefit-card">
                <h3>{benefit}</h3>
                <p>Small improvements compound into stronger monthly outcomes.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section" id="why-choose">
          <h2>Why Choose This App</h2>
          <div className="why-grid">
            <article className="panel-card">
              <h3>Calm, focused design</h3>
              <p>A professional interface that keeps attention on financial priorities.</p>
            </article>
            <article className="panel-card">
              <h3>Actionable insight</h3>
              <p>Not just numbers. The app helps you know what to improve next.</p>
            </article>
            <article className="panel-card">
              <h3>Built for consistency</h3>
              <p>Simple daily tracking that supports long-term money discipline.</p>
            </article>
          </div>
        </section>

        <section className="landing-cta panel-card">
          <h2>Start tracking your money smarter</h2>
          <p>Enter your finance workspace and take control of every rupee with better visibility.</p>
          <div className="hero-cta-row">
            <Link to="/login" className="primary-button">
              Enter Website
            </Link>
            <Link to="/signup" className="secondary-button">
              Get Started
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
