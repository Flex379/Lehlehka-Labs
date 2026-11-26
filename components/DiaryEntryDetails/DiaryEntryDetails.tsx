import type { DiaryEntry } from "@/types/diary";
import { formatDiaryDate } from "@/lib/formatDiaryDate";
import styles from "./DiaryEntryDetails.module.css";

interface DiaryEntryDetailsProps {
  entry: DiaryEntry | null;
  onEdit?: (entry: DiaryEntry) => void;
  onDelete?: (entry: DiaryEntry) => void;
}

export default function DiaryEntryDetails({
  entry,
  onEdit,
  onDelete,
}: DiaryEntryDetailsProps) {
  if (!entry) {
    return (
      <section className={styles.details}>
        <p className={styles.placeholder}>
          Наразі записи у щоденнику відсутні
        </p>
      </section>
    );
  }

  return (
    <section className={styles.details}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{entry.title}</h2>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Редагувати запис"
            onClick={() => onEdit?.(entry)}
          >
            <svg width="24" height="24" aria-hidden="true">
              <use href="/icons-sprite.svg#icon-edit-square" />
            </svg>
          </button>
        </div>

        <div className={styles.dateRow}>
          <p className={styles.date}>{formatDiaryDate(entry.date)}</p>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Видалити запис"
            onClick={() => onDelete?.(entry)}
          >
            <svg width="24" height="24" aria-hidden="true">
              <use href="/icons-sprite.svg#icon-delete-forever" />
            </svg>
          </button>
        </div>
      </div>

      <p className={styles.text}>{entry.description}</p>

      <ul className={styles.tags}>
        {entry.emotions.map((emotion) => (
          <li key={emotion._id} className={styles.tag}>
            {emotion.title}
          </li>
        ))}
      </ul>
    </section>
  );
}
