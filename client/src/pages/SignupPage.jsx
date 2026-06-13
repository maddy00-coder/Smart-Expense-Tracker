import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthPageLayout from './AuthPageLayout';
import { api, getApiErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const EMAIL_ERROR = 'Please enter a valid email address.';

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!name || !email || !password) {
      toast.error('Please fill all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(EMAIL_ERROR);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/api/auth/signup', {
        name,
        password,
        email
      });
      login(response.data);
      toast.success(response.data?.message || 'Signup successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to sign up'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthPageLayout
      title="Create account"
      subtitle="Set up your personal finance workspace."
      form={
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>
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
              minLength="6"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create account'}
          </button>
        </form>
      }
      footer={
        <p className="auth-footer">
          Already a member? <Link to="/login">Sign in</Link>
        </p>
      }
    />
  );
}

export default SignupPage;
