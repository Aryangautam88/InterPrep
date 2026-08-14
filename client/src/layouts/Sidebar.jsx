import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LineChart,
  ListTree,
  Medal,
  MessagesSquare,
  Mic,
  Settings,
  Trophy,
  User,
  UserCheck,
  Users,
} from 'lucide-react';
import { ADMIN_NAV, MENTOR_NAV, STUDENT_NAV } from '../constants/nav';
import Logo from '../components/Logo';
import styles from './Sidebar.module.css';

const ICONS = {
  LayoutDashboard,
  BookOpen,
  Building2,
  ClipboardList,
  Users,
  MessagesSquare,
  Mic,
  FileText,
  LineChart,
  Trophy,
  Settings,
  Inbox,
  GraduationCap,
  Calendar,
  Medal,
  User,
  UserCheck,
  ListTree,
};

function itemsFor(role) {
  if (role === 'mentor') return MENTOR_NAV;
  if (role === 'admin') return ADMIN_NAV;
  return STUDENT_NAV;
}

export default function Sidebar({ role, onNavigate }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Logo to="/app/dashboard" />
      </div>
      <nav>
        {itemsFor(role).map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              onClick={onNavigate}
            >
              {Icon && <Icon size={18} />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
