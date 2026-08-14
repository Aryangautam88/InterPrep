import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import Button from '../components/ui/Button';
import styles from './PublicLayout.module.css';

const LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how', label: 'How It Works' },
  { href: '/#companies', label: 'Companies' },
  { href: '/#mentors', label: 'Mentors' },
  { href: '/#testimonials', label: 'Testimonials' },
  { href: '/#pricing', label: 'Pricing' },
];

export default function PublicLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <header className={styles.nav}>
        <Logo />
        <nav className={`${styles.links} ${open ? styles.open : ''}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user ? (
            <Button onClick={() => navigate('/app/dashboard')}>Open app</Button>
          ) : (
            <>
              <NavLink to="/login" className={styles.login}>
                Login
              </NavLink>
              <Button onClick={() => navigate('/register')}>Get Started</Button>
            </>
          )}
          <button className={styles.menu} onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      <main>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <Logo />
            <p>Placement readiness for B.Tech students. Know exactly where you stand.</p>
          </div>
          <div>
            <h4>Product</h4>
            <Link to="/#features">Features</Link>
            <Link to="/#pricing">Pricing</Link>
            <Link to="/register">Get started</Link>
          </div>
          <div>
            <h4>Platform</h4>
            <Link to="/login">Student login</Link>
            <Link to="/register">Become a mentor</Link>
          </div>
          <div>
            <h4>OfferOS</h4>
            <span>© {new Date().getFullYear()} OfferOS</span>
            <span>PlacementOS product line</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
