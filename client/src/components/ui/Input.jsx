import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

export default function Input({
  label,
  error,
  type = 'text',
  id,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && visible ? 'text' : type;

  return (
    <label className={styles.wrap} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.field}>
        <input id={id} className={styles.input} type={inputType} {...props} />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </span>
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
