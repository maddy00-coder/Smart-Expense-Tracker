import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '../components/PageShell';
import { useAuth } from '../context/AuthContext';

function SettingsPage() {
  const { user } = useAuth();
  const [currency, setCurrency] = useState(localStorage.getItem('smart-expense-currency') || 'INR');
  const [notifications, setNotifications] = useState(
    localStorage.getItem('smart-expense-notifications') || 'enabled'
  );
  const [keepSignedIn, setKeepSignedIn] = useState(
    localStorage.getItem('smart-expense-keep-signed-in') !== 'false'
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(
    localStorage.getItem('smart-expense-show-logout-confirm') !== 'false'
  );
  const [secureSession, setSecureSession] = useState(
    localStorage.getItem('smart-expense-secure-session') !== 'false'
  );
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const memberSince = useMemo(() => {
    if (!user?.id) {
      return 'Recently joined';
    }

    const parsedDate = new Date(parseInt(user.id.slice(0, 8), 16) * 1000);
    return Number.isNaN(parsedDate.getTime()) ? 'Recently joined' : parsedDate.toLocaleDateString();
  }, [user?.id]);

  const savePreferences = () => {
    localStorage.setItem('smart-expense-currency', currency);
    localStorage.setItem('smart-expense-notifications', notifications);
    toast.success('Preferences saved');
  };

  const saveToggle = (key, value, setter) => {
    setter(value);
    localStorage.setItem(key, String(value));
  };

  const clearLocalAppData = () => {
    [
      'smart-expense-currency',
      'smart-expense-notifications',
      'smart-expense-keep-signed-in',
      'smart-expense-show-logout-confirm',
      'smart-expense-secure-session',
      'smart-expense-profile'
    ].forEach((key) => localStorage.removeItem(key));

    setCurrency('INR');
    setNotifications('enabled');
    setKeepSignedIn(true);
    setShowLogoutConfirm(true);
    setSecureSession(true);
    setClearModalOpen(false);
    toast.success('Local app data cleared');
  };

  return (
    <PageShell
      title="Settings"
      subtitle="Manage personalization, display options, and quick data controls."
    >
      <div className="settings-layout">
        <section className="panel-card settings-card settings-grid">
          <div className="panel-head">
            <h3>General Preferences</h3>
          </div>
          <label>
            Currency
            <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
          <label>
            Notifications
            <select value={notifications} onChange={(event) => setNotifications(event.target.value)}>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
          <button type="button" className="primary-button" onClick={savePreferences}>
            Save Preferences
          </button>
        </section>

        <section className="panel-card settings-card">
          <div className="panel-head">
            <h3>Account Settings</h3>
          </div>
          <div className="settings-detail-grid">
            <div>
              <small>Name</small>
              <strong>{user?.name || 'Account Owner'}</strong>
            </div>
            <div>
              <small>Email</small>
              <strong>{user?.email || 'Not added'}</strong>
            </div>
            <div>
              <small>Account Status</small>
              <strong>Active</strong>
            </div>
            <div>
              <small>Login Security</small>
              <strong>JWT Protected</strong>
            </div>
            <div>
              <small>Member Since</small>
              <strong>{memberSince}</strong>
            </div>
          </div>
        </section>

        <section className="panel-card settings-card settings-wide-card settings-data-card">
          <div className="panel-head">
            <h3>Data Management</h3>
          </div>
          <p className="empty-text">CSV export is available from Transactions page.</p>
          <div className="settings-action-row">
            <button type="button" className="secondary-button" onClick={() => toast('CSV export is available from Transactions page.')}>
              Export Transactions
            </button>
            <button type="button" className="ghost-button danger-text" onClick={() => setClearModalOpen(true)}>
              Clear Local App Data
            </button>
          </div>
        </section>

        <section className="panel-card settings-card settings-wide-card">
          <div className="panel-head">
            <h3>Security & Privacy</h3>
          </div>
          <div className="settings-toggle-grid">
            <label className="settings-toggle-row">
              <span>
                <strong>Keep me signed in</strong>
                <small>Preserve your session on this browser.</small>
              </span>
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(event) =>
                  saveToggle('smart-expense-keep-signed-in', event.target.checked, setKeepSignedIn)
                }
              />
            </label>
            <label className="settings-toggle-row">
              <span>
                <strong>Show logout confirmation</strong>
                <small>Ask before ending the current session.</small>
              </span>
              <input
                type="checkbox"
                checked={showLogoutConfirm}
                onChange={(event) =>
                  saveToggle('smart-expense-show-logout-confirm', event.target.checked, setShowLogoutConfirm)
                }
              />
            </label>
            <label className="settings-toggle-row">
              <span>
                <strong>Secure session enabled</strong>
                <small>Use protected token-based access.</small>
              </span>
              <input
                type="checkbox"
                checked={secureSession}
                onChange={(event) =>
                  saveToggle('smart-expense-secure-session', event.target.checked, setSecureSession)
                }
              />
            </label>
          </div>
        </section>
      </div>

      {clearModalOpen ? (
        <div className="modal-backdrop settings-modal-backdrop" onMouseDown={() => setClearModalOpen(false)}>
          <div className="modal-card settings-clear-modal" onMouseDown={(event) => event.stopPropagation()}>
            <h3>Clear Local App Data</h3>
            <p className="empty-text">
              This clears saved preferences and temporary local settings only. Your account will not be deleted.
            </p>
            <div className="settings-modal-actions">
              <button type="button" className="ghost-button" onClick={() => setClearModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={clearLocalAppData}>
                Clear Data
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}

export default SettingsPage;
