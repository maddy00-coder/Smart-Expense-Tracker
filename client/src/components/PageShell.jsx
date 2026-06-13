import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from './AppLogo';
import LogoutConfirmModal from './LogoutConfirmModal';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

function PageShell({ title, subtitle, actions, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  const openProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };

  const openLogoutModal = () => {
    setMenuOpen(false);
    setLogoutModalOpen(true);
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <motion.main
        className="app-main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <header className="topbar">
          <div className="topbar-inner">
            <div className="topbar-title">
              <p className="eyebrow">Smart Expense Tracker</p>
              <h1>{title}</h1>
              <p className="page-subtitle">{subtitle}</p>
            </div>
            <div className="topbar-actions">
              <div className="account-menu" ref={menuRef}>
                <button
                  type="button"
                  className="topbar-account-button"
                  onClick={() => setMenuOpen((current) => !current)}
                >
                  <AppLogo className="topbar-account-avatar" size={34} alt="Smart Expense Tracker logo" />
                  <span className="topbar-account-name">{user?.name || 'Account'}</span>
                </button>
                {menuOpen ? (
                  <div className="account-dropdown">
                    <button type="button" onClick={openProfile}>
                      Open profile
                    </button>
                    <button type="button" onClick={openLogoutModal}>
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>
        <section className="page-content">{children}</section>
        <LogoutConfirmModal
          open={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />
      </motion.main>
    </div>
  );
}

export default PageShell;
