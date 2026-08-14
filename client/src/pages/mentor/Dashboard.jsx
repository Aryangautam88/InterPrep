import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

export default function MentorDashboard() {
  const { user } = useAuth();
  return (
    <div className={styles.page}>
      <header>
        <Badge tone="accent">Mentor</Badge>
        <h1>{user.name}</h1>
        <p>Requests, sessions, and ranking will connect here in Phase 6.</p>
      </header>
      <div className={styles.grid}>
        <Card>
          <h2>Pending requests</h2>
          <EmptyState title="No requests yet" body="Students will be able to ask for help once mentorship APIs ship." />
        </Card>
        <Card>
          <h2>Active students</h2>
          <EmptyState title="No active students" body="Accepted mentorships will appear here." />
        </Card>
      </div>
    </div>
  );
}
