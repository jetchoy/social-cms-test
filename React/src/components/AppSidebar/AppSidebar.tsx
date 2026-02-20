import { useEffect, useState } from 'react';
import {
  Plus, SquarePen, Calendar, SquareCheckBig,
  PanelsTopLeft, Settings, LogOut, Moon, Sun,
} from 'lucide-react';
import { usePostStore } from '../../store/usePostStore';
import styles from './AppSidebar.module.css';

function isMobile() { return window.innerWidth <= 767; }

export function AppSidebar() {
  const sidebarOpen   = usePostStore(s => s.sidebarOpen);
  const setSidebarOpen = usePostStore(s => s.setSidebarOpen);

  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobile, setMobile] = useState(() => isMobile());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Close sidebar and track mobile breakpoint on resize
  useEffect(() => {
    function handleResize() {
      const nowMobile = isMobile();
      setMobile(nowMobile);
      if (nowMobile) setSidebarOpen(false);
    }
    if (mobile) setSidebarOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavClick = () => {
    if (mobile && sidebarOpen) setSidebarOpen(false);
  };

  const sidebarClass = [
    styles.sidebar,
    !sidebarOpen && !mobile ? styles.isClosed : '',
    mobile && sidebarOpen   ? styles.isMobileOpen : '',
  ].filter(Boolean).join(' ');

  const backdropClass = [
    styles.backdrop,
    mobile && sidebarOpen ? styles.isVisible : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <aside className={sidebarClass} aria-label="Navigation sidebar">

        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoFull}>
            <img src="/assets/tatler-logo-full.png" alt="Tatler" width={57} height={32} />
          </div>
          <div className={styles.logoIcon}>
            <img src="/assets/tatler-logo-icon.png" alt="Tatler" width={32} height={32} />
          </div>
        </div>

        {/* Create button */}
        <div className={styles.createWrap}>
          <button className={styles.btnCreate} aria-label="Create new post">
            <Plus size={16} />
            <span className={styles.btnLabel}>Create</span>
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_ITEMS.map(item => (
            <button
              key={item.route}
              className={`${styles.navItem}${item.route === 'drafts' ? ` ${styles.isActive}` : ''}`}
              onClick={handleNavClick}
            >
              <span className={styles.navIcon}><item.icon size={16} /></span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}

          {/* Theme toggle — between Settings and Logout */}
          <button
            className={styles.navItem}
            aria-label="Toggle colour theme"
            onClick={() => setIsDark(d => !d)}
          >
            <span className={styles.navIcon}>{isDark ? <Sun size={16} /> : <Moon size={16} />}</span>
            <span className={styles.navLabel}>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>

          <button
            className={styles.navItem}
            onClick={handleNavClick}
          >
            <span className={styles.navIcon}><LogOut size={16} /></span>
            <span className={styles.navLabel}>Logout</span>
          </button>
        </nav>

      </aside>

      {/* Mobile backdrop */}
      <div
        className={backdropClass}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      />
    </>
  );
}

const NAV_ITEMS = [
  { route: 'drafts',     label: 'Drafts',     icon: SquarePen       },
  { route: 'scheduled',  label: 'Scheduled',  icon: Calendar        },
  { route: 'published',  label: 'Published',  icon: SquareCheckBig  },
  { route: 'templates',  label: 'Templates',  icon: PanelsTopLeft   },
  { route: 'settings',   label: 'Settings',   icon: Settings        },
];
