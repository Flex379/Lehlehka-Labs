"use client";

import { useState } from "react";
import DiaryEntryCard from "@/components/DiaryEntryCard/DiaryEntryCard";
import AddDiaryEntryModal from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";
import type { DiaryEntry } from "@/types/diary";
import { useDiaryEntries } from "./useDiaryEntries";
import styles from "./DiaryList.module.css";

interface DiaryListProps {
  onSelectEntry?: (entry: DiaryEntry) => void;
}

export default function DiaryList({ onSelectEntry }: DiaryListProps) {
  const { data, isLoading, isError: hasError } = useDiaryEntries();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const entries = data?.diaryNotes ?? [];

  return (
    <section className={styles.list}>
      <h1 className="sr-only">Щоденник</h1>

      <div className={styles.header}>
        <h2 className={styles.title}>Ваші записи</h2>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
        >
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

      {isAddModalOpen && (
        <AddDiaryEntryModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </section>
  );
}
