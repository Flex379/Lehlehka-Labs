"use client";

import { useState } from "react";
import GreetingBlock from "@/components/Journey/GreetingBlock";
import DiaryList from "@/components/DiaryList/DiaryList";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import AddDiaryEntryModal from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";
import { useDiaryEntries } from "@/components/DiaryList/useDiaryEntries";
import type { DiaryEntry } from "@/types/diary";
import styles from "./page.module.css";

export default function DiaryPage() {
  const { data, isLoading, isError } = useDiaryEntries();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  const entries = data?.diaryNotes ?? [];
  // Поки нічого не вибрано, на десктопі показуємо перший запис.
  const selectedEntry =
    entries.find((entry) => entry._id === selectedId) ?? entries[0] ?? null;

  return (
    <main className={styles.page}>
      <GreetingBlock />

      <div className={styles.content}>
        <div className={styles.listColumn}>
          <DiaryList onSelectEntry={(entry) => setSelectedId(entry._id)} />
        </div>

        {!isLoading && !isError && (
          <div className={styles.detailsColumn}>
            <DiaryEntryDetails
              entry={selectedEntry}
              onEdit={setEditingEntry}
            />
          </div>
        )}
      </div>

      {editingEntry && (
        <AddDiaryEntryModal
          initialEntry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </main>
  );
}
