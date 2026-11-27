"use client";

import { useState } from "react";
import DiaryList from "@/components/DiaryList/DiaryList";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { useDiaryEntries } from "@/components/DiaryList/useDiaryEntries";
import styles from "./page.module.css";

export default function DiaryPage() {
  const { data, isLoading, isError } = useDiaryEntries();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entries = data?.tasks ?? [];
  // Поки нічого не вибрано, на десктопі показуємо перший запис.
  const selectedEntry =
    entries.find((entry) => entry._id === selectedId) ?? entries[0] ?? null;

  return (
    <main className={styles.page}>
      <div className={styles.listColumn}>
        <DiaryList onSelectEntry={(entry) => setSelectedId(entry._id)} />
      </div>

      {!isLoading && !isError && (
        <div className={styles.detailsColumn}>
          <DiaryEntryDetails entry={selectedEntry} />
        </div>
      )}
    </main>
  );
}
