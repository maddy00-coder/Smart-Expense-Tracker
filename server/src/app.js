import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const explicitClientUrl = process.env.CLIENT_URL;
      const allowedOrigins = new Set([
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
      ]);

      if (explicitClientUrl) {
        allowedOrigins.add(explicitClientUrl);
      }

      const isLocalhostDevOrigin = /^http:\/\/localhost:\d+$/.test(origin);

      if (allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      if (process.env.NODE_ENV !== 'production' && isLocalhostDevOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Backend running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/insights', insightRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
