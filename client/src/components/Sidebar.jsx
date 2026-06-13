import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLogo from './AppLogo';
import LogoutConfirmModal from './LogoutConfirmModal';

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand-compact">
          <AppLogo className="sidebar-brand-logo" size={42} alt="Spendly Smart logo" />
          <div className="sidebar-brand-copy">
            <h2>Spendly Smart</h2>
            <p>Finance dashboard</p>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/add-expense">Add Expense</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          <NavLink to="/settings">Settings</NavLink>
          <button type="button" className="nav-logout" onClick={() => setLogoutModalOpen(true)}>
            Logout
          </button>
        </nav>
      </div>
      <LogoutConfirmModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </aside>
  );
}

export default Sidebar;
