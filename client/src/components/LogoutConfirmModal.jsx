import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function LogoutConfirmModal({ open, onClose, onConfirm }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modal-backdrop logout-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onMouseDown={onClose}
        >
          <motion.div
            className="modal-card logout-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-message"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="logout-modal-copy">
              <span className="logout-modal-eyebrow">Security Check</span>
              <h3 id="logout-modal-title">Confirm Logout</h3>
              <p id="logout-modal-message">Are you sure you want to logout from your account?</p>
            </div>
            <div className="logout-modal-actions">
              <button type="button" className="ghost-button logout-cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="primary-button logout-confirm-button" onClick={onConfirm}>
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export default LogoutConfirmModal;
