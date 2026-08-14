import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { BRANCHES } from '../../constants/nav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'CSE',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Name is required';
    if (!form.email.includes('@')) next.email = 'Enter a valid email';
    if (form.password.length < 8) next.password = 'At least 8 characters';
    if (form.role === 'student' && !form.branch) next.branch = 'Select a branch';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.role === 'mentor') delete payload.branch;
      const result = await register(payload);
      if (result.pendingApproval) {
        push(result.message || 'Submitted for admin approval');
        navigate('/login');
        return;
      }
      push('Account created');
      navigate('/app/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className={styles.wrap}>
        <form className={styles.card} onSubmit={onSubmit}>
          <h1>Create your OfferOS account</h1>
          <p>Students can start immediately. Mentors need admin approval.</p>
          {serverError && <div className={styles.alert}>{serverError}</div>}
          <Input
            id="name"
            label="Name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
          <Select
            id="role"
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
          </Select>
          {form.role === 'student' && (
            <Select
              id="branch"
              label="Branch"
              value={form.branch}
              error={errors.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          )}
          <Button type="submit" loading={loading} className={styles.full}>
            Get started
          </Button>
          <p className={styles.switch}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </PublicLayout>
  );
}
