import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/ui/Avatar';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);

  async function onLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className={styles.shell}>
      <div className={styles.desktopSidebar}>
        <Sidebar role={user.role} />
      </div>
      {drawer && (
        <div className={styles.drawer}>
          <button className={styles.backdrop} onClick={() => setDrawer(false)} aria-label="Close menu" />
          <div className={styles.drawerPanel}>
            <button className={styles.close} onClick={() => setDrawer(false)} aria-label="Close">
              <X size={18} />
            </button>
            <Sidebar role={user.role} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menu} onClick={() => setDrawer(true)} aria-label="Open navigation">
            <Menu size={18} />
          </button>
          <div className={styles.topTitle}>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <div className={styles.topActions}>
            <button className={styles.icon} aria-label="Notifications">
              <Bell size={18} />
              <i className={styles.dot} />
            </button>
            <button className={styles.icon} onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Avatar name={user.name} />
            <button className={styles.icon} onClick={onLogout} aria-label="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
