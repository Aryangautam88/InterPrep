import styles from './Input.module.css';

export default function Select({ label, error, id, children, ...props }) {
  return (
    <label className={styles.wrap} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <select id={id} className={styles.input} {...props}>
        {children}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
