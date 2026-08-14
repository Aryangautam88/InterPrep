import { useAuth } from '../../context/AuthContext';
import StudentDashboard from '../student/Dashboard';
import MentorDashboard from '../mentor/Dashboard';
import AdminDashboard from '../admin/Dashboard';

export default function RoleDashboard() {
  const { user } = useAuth();
  if (user.role === 'mentor') return <MentorDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <StudentDashboard />;
}
