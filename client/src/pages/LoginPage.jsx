import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { api, getApiErrorMessage, isNetworkError } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const RETRY_DELAY_MS = 1000;
const EMAIL_ERROR = 'Please enter a valid email address.';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function runWithNetworkRetry(request) {
  try {
    return await request();
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }

    await wait(RETRY_DELAY_MS);
    return request();
  }
}

async function checkBackendHealth() {
  await runWithNetworkRetry(() => api.get('/health'));
}

function getLoginErrorMessage(error) {
  if (isNetworkError(error)) {
    return 'Unable to connect to server. Please try again.';
  }

  return getApiErrorMessage(error, 'Unable to log in. Please try again.');
}

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(EMAIL_ERROR);
      return;
    }

    setSubmitting(true);
    try {
      await checkBackendHealth();
      const response = await runWithNetworkRetry(() =>
        api.post('/auth/login', {
          ...form,
          email
        })
      );
      login(response.data);
      toast.success(response.data?.message || 'Login successful.');
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(getLoginErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      title="Sign in"
      subtitle="Continue with your existing account."
      form={
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Sign in'}
          </button>
        </form>
      }
      footer={
        <p className="auth-footer">
          No account yet? <Link to="/signup">Create one</Link>
        </p>
      }
    />
  );
}

export default LoginPage;
