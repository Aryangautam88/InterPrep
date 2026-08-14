import styles from './Avatar.module.css';

export default function Avatar({ name = '', size = 36 }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
  return (
    <span className={styles.avatar} style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials || 'U'}
    </span>
  );
}
