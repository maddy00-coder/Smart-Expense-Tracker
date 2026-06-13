import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AppLogo from './AppLogo';

function PublicNavbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (!isHome) {
      return undefined;
    }

    setActiveSection('home');
    const ids = ['home', 'how-it-works', 'features', 'benefits'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 150) {
          setActiveSection('home');
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: '-18% 0px -48% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
      if (window.scrollY < 150) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHome]);

  const handleSectionNav = (event, sectionId) => {
    if (!isHome) {
      return;
    }

    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleHomeNav = (event) => {
    if (!isHome) {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('home');
  };

  const sectionClassName = (sectionId) => {
    const isActiveSection = isHome && activeSection === sectionId;
    return isActiveSection ? 'section-link active' : 'section-link';
  };

  return (
    <header className="landing-nav-wrap">
      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <AppLogo className="landing-brand-mark" size={42} alt="Smart Expense Tracker logo" />
          <div>
            <strong>Smart Expense Tracker</strong>
            <small>Finance with confidence</small>
          </div>
        </Link>

        <div className="landing-links">
          <NavLink
            to="/"
            end
            className={() => (isHome && activeSection === 'home' ? 'active' : '')}
            onClick={handleHomeNav}
          >
            Home
          </NavLink>
          <a
            href="/#how-it-works"
            className={sectionClassName('how-it-works')}
            onClick={(event) => handleSectionNav(event, 'how-it-works')}
          >
            How It Works
          </a>
          <a
            href="/#features"
            className={sectionClassName('features')}
            onClick={(event) => handleSectionNav(event, 'features')}
          >
            Features
          </a>
          <a
            href="/#benefits"
            className={sectionClassName('benefits')}
            onClick={(event) => handleSectionNav(event, 'benefits')}
          >
            Benefits
          </a>
        </div>

        <div className="landing-nav-actions">
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? 'ghost-button nav-pill active' : 'ghost-button nav-pill')}
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) => (isActive ? 'primary-button nav-pill active' : 'primary-button nav-pill')}
          >
            Get Started
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default PublicNavbar;
