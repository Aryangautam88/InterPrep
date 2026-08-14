import styles from './EmptyState.module.css';

export default function EmptyState({ title, body, action }) {
  return (
    <div className={styles.wrap}>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}
