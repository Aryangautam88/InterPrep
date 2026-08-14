import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ to = '/', compact = false }) {
  return (
    <Link to={to} className={styles.logo}>
      <span className={styles.mark}>O</span>
      {!compact && (
        <span className={styles.text}>
          <strong>OfferOS</strong>
          <small>PlacementOS</small>
        </span>
      )}
    </Link>
  );
}
