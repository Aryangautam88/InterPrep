import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Auth.module.css';

export default function Login() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const next = {};
    if (!form.email.includes('@')) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      push('Signed in successfully');
      const dest = location.state?.from?.pathname || '/app/dashboard';
      navigate(dest, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className={styles.wrap}>
        <form className={styles.card} onSubmit={onSubmit}>
          <h1>Welcome back</h1>
          <p>Sign in to your OfferOS workspace.</p>
          {serverError && <div className={styles.alert}>{serverError}</div>}
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" loading={loading} className={styles.full}>
            Login
          </Button>
          <p className={styles.switch}>
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </PublicLayout>
  );
}
