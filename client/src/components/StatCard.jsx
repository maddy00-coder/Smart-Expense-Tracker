import { motion } from 'framer-motion';
import { formatCurrency } from '../lib/formatters';

function StatCard({ title, value, footnote, currency = 'INR' }) {
  return (
    <motion.article
      className="stat-card"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <p>{title}</p>
      <h3>{formatCurrency(value, currency)}</h3>
      <span>{footnote}</span>
    </motion.article>
  );
}

export default StatCard;
