import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className={styles.page}>
      <header>
        <Badge tone="accent">Student</Badge>
        <h1>Welcome, {user.name.split(' ')[0]}</h1>
        <p>Your placement workspace is live. Readiness scoring arrives in the next phase.</p>
      </header>
      <div className={styles.grid}>
        <Card>
          <h2>Placement readiness</h2>
          <EmptyState
            title="Complete onboarding to generate your readiness score."
            body="Profile, targets, and topic baselines will be collected in Phase 2."
          />
        </Card>
        <Card>
          <h2>Today’s plan</h2>
          <EmptyState title="No tasks yet" body="Daily tasks will be generated from weak areas and target companies." />
        </Card>
      </div>
    </div>
  );
}
