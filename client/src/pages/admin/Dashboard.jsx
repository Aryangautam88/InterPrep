import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className={styles.page}>
      <header>
        <Badge tone="accent">Admin</Badge>
        <h1>Platform overview</h1>
        <p>Signed in as {user.email}. Full admin CRUD arrives in Phase 8.</p>
      </header>
      <div className={styles.grid}>
        <Card>
          <h2>Users</h2>
          <p className={styles.muted}>Search, activate, and deactivate accounts in a later phase.</p>
        </Card>
        <Card>
          <h2>Mentors</h2>
          <p className={styles.muted}>Approve or reject mentor applications from this console.</p>
        </Card>
        <Card>
          <h2>Content</h2>
          <p className={styles.muted}>Companies, topics, tests, and community moderation.</p>
        </Card>
      </div>
    </div>
  );
}
