import { useState } from 'react';
import { APP_LOGO_URL } from '../lib/constants';

function AppLogo({ className = '', size, alt = 'Smart Expense Tracker logo' }) {
  const [hasError, setHasError] = useState(false);
  const style = size ? { width: size, height: size, minWidth: size, minHeight: size } : undefined;
  const classes = ['app-logo', className].filter(Boolean).join(' ');

  if (hasError) {
    return (
      <span className={`${classes} app-logo-fallback`} style={style} aria-label={alt} role="img">
        SE
      </span>
    );
  }

  return (
    <img
      src={APP_LOGO_URL}
      alt={alt}
      className={classes}
      style={style}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

export default AppLogo;
