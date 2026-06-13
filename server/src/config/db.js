import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function isDnsSrvError(error) {
  const message = String(error?.message || '');
  return (
    error?.code === 'ENOTFOUND' ||
    error?.code === 'ECONNREFUSED' ||
    message.includes('querySrv') ||
    message.includes('_mongodb._tcp')
  );
}

export async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI?.trim();
  const fallbackUri = process.env.MONGO_URI_FALLBACK?.trim();

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  mongoose.set('strictQuery', true);
  const connectionOptions = {
    serverSelectionTimeoutMS: 10000
  };

  try {
    await mongoose.connect(mongoUri, connectionOptions);
  } catch (error) {
    if (mongoUri.startsWith('mongodb+srv://') && isDnsSrvError(error)) {
      if (fallbackUri) {
        console.warn('Primary mongodb+srv connection failed due to DNS/SRV resolution. Trying MONGO_URI_FALLBACK...');
        await mongoose.connect(fallbackUri, connectionOptions);
        return;
      }

      const dnsError = new Error(
        'MongoDB SRV DNS lookup failed. Add MONGO_URI_FALLBACK with a mongodb:// Atlas connection string.'
      );
      dnsError.statusCode = 500;
      throw dnsError;
    }
    throw error;
  }
}
