"use client";

import { useQuery } from "@tanstack/react-query";
import { getDiary } from "@/lib/api/clientApi";
import DiaryEntryCard from "@/components/DiaryEntryCard/DiaryEntryCard";
import type { DiaryEntry, DiaryListResponse } from "@/types/diary";
import styles from "./DiaryList.module.css";

const DIARY_PARAMS = { limit: 100, sortOrder: "desc" } as const;

interface DiaryListProps {
  onSelectEntry?: (entry: DiaryEntry) => void;
}

export default function DiaryList({ onSelectEntry }: DiaryListProps) {
  const {
    data,
    isLoading,
    isError: hasError,
  } = useQuery<DiaryListResponse>({
    queryKey: ["diary", DIARY_PARAMS],
    queryFn: () => getDiary(DIARY_PARAMS),
  });

  const entries = data?.tasks ?? [];

  return (
    <section className={styles.list}>
      <h1 className="sr-only">Щоденник</h1>

      <div className={styles.header}>
        <h2 className={styles.title}>Ваші записи</h2>
        <button type="button" className={styles.addButton}>
          Новий запис
          <svg width="24" height="24" aria-hidden="true">
            <use href="/icons-sprite.svg#icon-add-circle" />
          </svg>
        </button>
      </div>

      {isLoading && <p className={styles.status}>Завантаження...</p>}

      {!isLoading && hasError && (
        <p className={styles.status}>Не вдалося завантажити записи.</p>
      )}

      {!isLoading && !hasError && entries.length === 0 && (
        <p className={styles.status}>Наразі записи у щоденнику відсутні.</p>
      )}

      {!isLoading && !hasError && entries.length > 0 && (
        <ul className={styles.items}>
          {entries.map((entry) => (
            <li key={entry._id}>
              <DiaryEntryCard entry={entry} onSelect={onSelectEntry} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
