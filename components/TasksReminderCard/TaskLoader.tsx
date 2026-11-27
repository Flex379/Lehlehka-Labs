import styles from "./TaskLoader.module.css";

export default function TaskLoader() {
  return (
    <span className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="sr-only">Завантаження...</span>
    </span>
  );
}
