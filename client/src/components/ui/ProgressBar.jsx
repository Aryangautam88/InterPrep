import styles from './ProgressBar.module.css';

export default function ProgressBar({ value = 0 }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={styles.track} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
}
