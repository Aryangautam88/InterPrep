import { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { changePassword } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await changePassword(form);
      push('Password updated. Sign in again.');
      await logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420, marginTop: 16 }}>
        {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        <Input
          id="current"
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        />
        <Input
          id="next"
          label="New password"
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <Button type="submit" loading={loading}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
