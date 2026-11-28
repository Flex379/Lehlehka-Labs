"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import AddDiaryEntryModal from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";
import { useDiaryEntries } from "@/components/DiaryList/useDiaryEntries";
import type { DiaryEntry } from "@/types/diary";
import styles from "./page.module.css";

export default function DiaryEntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const { data, isLoading, isError } = useDiaryEntries();
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  const entry = data?.tasks.find((item) => item._id === entryId);

  return (
    <main className={styles.page}>
      {isLoading && <p>Завантаження...</p>}

      {!isLoading && isError && <p>Не вдалося завантажити запис.</p>}

      {!isLoading && !isError && !entry && <p>Запис не знайдено.</p>}

      {entry && <DiaryEntryDetails entry={entry} onEdit={setEditingEntry} />}

      {editingEntry && (
        <AddDiaryEntryModal
          initialEntry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </main>
  );
}
