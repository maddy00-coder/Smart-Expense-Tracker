import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../components/AppLogo';
import { useAuth } from '../context/AuthContext';
import PageShell from '../components/PageShell';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/formatters';

const PROFILE_STORAGE_KEY = 'smart-expense-profile';

function getStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savedProfile, setSavedProfile] = useState(() => getStoredProfile());
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: 'Not added',
    location: 'India',
    currency: 'INR',
    notifications: 'Enabled'
  });
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalBalance: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    Promise.all([
      api.get('/api/expenses/dashboard'),
      api.get('/api/expenses', { params: { page: 1, limit: 1 } })
    ])
      .then(([dashboardResponse, expensesResponse]) => {
        const metrics = dashboardResponse.data?.metrics || {};

        setSummary({
          totalIncome: metrics.totalIncome || 0,
          totalExpenses: metrics.totalExpenses || 0,
          totalBalance: metrics.totalBalance || 0,
          totalTransactions: expensesResponse.data?.pagination?.total || 0
        });
      })
      .catch(() => {
        setSummary({
          totalIncome: 0,
          totalExpenses: 0,
          totalBalance: 0,
          totalTransactions: 0
        });
      });
  }, []);

  const profile = {
    id: user?.id,
    name: user?.name || '',
    email: user?.email || '',
    phone: 'Not added',
    location: 'India',
    currency: user?.currency || 'INR',
    notifications: 'Enabled',
    ...savedProfile
  };

  const currency = profile.currency || 'INR';
  const memberSince = useMemo(() => {
    if (!user?.id) {
      return 'Recently joined';
    }

    const parsedDate = new Date(parseInt(user.id.slice(0, 8), 16) * 1000);
    return Number.isNaN(parsedDate.getTime()) ? 'Recently joined' : parsedDate.toLocaleDateString();
  }, [user?.id]);

  const financialStats = [
    { label: 'Total Income', value: formatCurrency(summary.totalIncome, currency) },
    { label: 'Total Expenses', value: formatCurrency(summary.totalExpenses, currency) },
    { label: 'Total Balance', value: formatCurrency(summary.totalBalance, currency) },
    { label: 'Total Transactions', value: summary.totalTransactions.toLocaleString('en-IN') }
  ];

  const openEditProfile = () => {
    setEditForm({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || 'Not added',
      location: profile.location || 'India',
      currency,
      notifications: profile.notifications || 'Enabled'
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();

    const updatedProfile = {
      ...savedProfile,
      name: editForm.name.trim() || profile.name,
      email: editForm.email.trim() || profile.email,
      phone: editForm.phone.trim() || 'Not added',
      location: editForm.location.trim() || 'India',
      currency: editForm.currency,
      notifications: editForm.notifications
    };

    setSavedProfile(updatedProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    localStorage.setItem('smart-expense-currency', updatedProfile.currency);
    localStorage.setItem('smart-expense-notifications', updatedProfile.notifications.toLowerCase());

    try {
      const storedUser = JSON.parse(localStorage.getItem('smart-expense-user')) || {};
      localStorage.setItem(
        'smart-expense-user',
        JSON.stringify({
          ...storedUser,
          name: updatedProfile.name,
          email: updatedProfile.email,
          currency: updatedProfile.currency
        })
      );
    } catch {
      localStorage.setItem(
        'smart-expense-user',
        JSON.stringify({
          name: updatedProfile.name,
          email: updatedProfile.email,
          currency: updatedProfile.currency
        })
      );
    }

    setEditModalOpen(false);
    toast.success('Profile updated successfully.');
  };

  const handleExportData = () => {
    toast('Export available from Transactions page.');
  };

  return (
    <PageShell
      title="Profile"
      subtitle="Your account identity, activity summary, and financial profile settings."
    >
      <div className="profile-layout">
        <section className="panel-card profile-overview-card">
          <div className="profile-hero">
            <AppLogo className="profile-avatar profile-avatar-large" size={76} alt="Smart Expense Tracker logo" />
            <div className="profile-overview-copy">
              <span className="profile-status-badge">Active</span>
              <h3>{profile.name || 'Account Owner'}</h3>
              <p>{profile.email || 'No email added'}</p>
            </div>
          </div>
          <div className="profile-details">
            <div>
              <small>Role</small>
              <strong>User / Account Owner</strong>
            </div>
            <div>
              <small>Account Status</small>
              <strong>Active</strong>
            </div>
            <div>
              <small>Preferred Currency</small>
              <strong>{currency}</strong>
            </div>
            <div>
              <small>Secure Access</small>
              <strong>JWT Protected</strong>
            </div>
          </div>
        </section>

        <section className="panel-card profile-section-card">
          <h3>Personal Details</h3>
          <div className="profile-details">
            <div>
              <small>Full Name</small>
              <strong>{profile.name || 'Not added'}</strong>
            </div>
            <div>
              <small>Email Address</small>
              <strong>{profile.email || 'Not added'}</strong>
            </div>
            <div>
              <small>Phone Number</small>
              <strong>{profile.phone || 'Not added'}</strong>
            </div>
            <div>
              <small>Location</small>
              <strong>{profile.location || 'India'}</strong>
            </div>
            <div>
              <small>Joined Date</small>
              <strong>{memberSince}</strong>
            </div>
          </div>
        </section>

        <section className="panel-card profile-section-card profile-wide-card">
          <h3>Financial Summary</h3>
          <div className="profile-stat-grid">
            {financialStats.map((item) => (
              <div className="profile-stat-box" key={item.label}>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-card profile-section-card">
          <h3>Account Security</h3>
          <div className="profile-details">
            <div>
              <small>Protection</small>
              <strong>JWT Protected</strong>
            </div>
            <div>
              <small>Password / Authentication</small>
              <strong>Enabled</strong>
            </div>
            <div>
              <small>Last Login</small>
              <strong>Recently</strong>
            </div>
            <div>
              <small>Account Badge</small>
              <strong>Secure Account</strong>
            </div>
          </div>
        </section>

        <section className="panel-card profile-section-card">
          <h3>Preferences</h3>
          <div className="profile-details">
            <div>
              <small>Currency</small>
              <strong>{currency}</strong>
            </div>
            <div>
              <small>Notifications</small>
              <strong>{profile.notifications || 'Enabled'}</strong>
            </div>
            <div>
              <small>Theme</small>
              <strong>Green & White</strong>
            </div>
            <div>
              <small>Data Export</small>
              <strong>Available in Transactions</strong>
            </div>
          </div>
        </section>

        <section className="panel-card profile-section-card profile-wide-card">
          <h3>Quick Actions</h3>
          <div className="profile-actions">
            <button type="button" className="primary-button" onClick={openEditProfile}>
              Edit Profile
            </button>
            <button type="button" className="secondary-button" onClick={() => navigate('/transactions')}>
              View Transactions
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate('/settings')}>
              Open Settings
            </button>
            <button type="button" className="ghost-button" onClick={handleExportData}>
              Export Data
            </button>
          </div>
        </section>
      </div>

      {editModalOpen ? (
        <div className="modal-backdrop profile-modal-backdrop" onMouseDown={() => setEditModalOpen(false)}>
          <div className="modal-card profile-edit-modal" onMouseDown={(event) => event.stopPropagation()}>
            <h3>Edit Profile</h3>
            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <label>
                Full Name
                <input name="name" type="text" value={editForm.name} onChange={handleEditChange} />
              </label>
              <label>
                Email Address
                <input name="email" type="email" value={editForm.email} onChange={handleEditChange} />
              </label>
              <label>
                Phone Number
                <input name="phone" type="text" value={editForm.phone} onChange={handleEditChange} />
              </label>
              <label>
                Location
                <input name="location" type="text" value={editForm.location} onChange={handleEditChange} />
              </label>
              <label>
                Preferred Currency
                <select name="currency" value={editForm.currency} onChange={handleEditChange}>
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </label>
              <label>
                Notifications
                <select name="notifications" value={editForm.notifications} onChange={handleEditChange}>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </label>
              <div className="profile-edit-actions">
                <button type="button" className="ghost-button" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

export default ProfilePage;
