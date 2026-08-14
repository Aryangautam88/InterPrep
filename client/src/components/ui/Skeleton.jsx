import styles from './Skeleton.module.css';

export default function Skeleton({ width = '100%', height = 16, radius = 8 }) {
  return <div className={styles.block} style={{ width, height, borderRadius: radius }} />;
}
