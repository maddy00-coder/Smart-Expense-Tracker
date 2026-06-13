import { motion } from 'framer-motion';
import AppLogo from '../components/AppLogo';
import PublicNavbar from '../components/PublicNavbar';

function AuthPageLayout({ title, subtitle, form, footer }) {
  return (
    <div className="public-shell">
      <PublicNavbar />
      <div className="auth-shell">
        <motion.div
          className="auth-showcase"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="glass-orb orb-one" />
          <div className="glass-orb orb-two" />
          <p className="eyebrow">Fintech-grade clarity</p>
          <h1>Smarter spending decisions start with better visibility.</h1>
          <p>
            Track expenses, auto-categorize transactions, monitor budgets, and uncover trends with a
            product experience designed to feel genuinely polished.
          </p>
        </motion.div>

        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <AppLogo className="auth-page-logo" size={55} alt="Smart Expense Tracker logo" />
          <div>
            <p className="eyebrow">Welcome</p>
            <h2>{title}</h2>
            <p className="auth-subtitle">{subtitle}</p>
          </div>
          {form}
          {footer}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthPageLayout;
