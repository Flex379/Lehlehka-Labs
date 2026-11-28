"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import AddDiaryEntryModal from "@/components/AddDiaryEntryModal/AddDiaryEntryModal";
import {
  useDeleteDiaryEntry,
  useDiaryEntries,
} from "@/components/DiaryList/useDiaryEntries";
import type { DiaryEntry } from "@/types/diary";
import styles from "./page.module.css";
import { Router } from "next/router";

export default function DiaryEntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const { data, isLoading, isError } = useDiaryEntries();
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const router = useRouter();

  const deleteMutation = useDeleteDiaryEntry();
  const handleDelete = (entry: DiaryEntry) => {
    if (!window.confirm("Видалити запис?")) return;
    deleteMutation.mutate(entry._id, {
      onSuccess: () => router.push("/diary"),
    });
  };
  const entry = data?.diaryNotes.find((item) => item._id === entryId);

  return (
    <main className={styles.page}>
      {isLoading && <p>Завантаження...</p>}

      {!isLoading && isError && <p>Не вдалося завантажити запис.</p>}

      {!isLoading && !isError && !entry && <p>Запис не знайдено.</p>}

      {entry && (
        <DiaryEntryDetails
          entry={entry}
          onEdit={setEditingEntry}
          onDelete={handleDelete}
        />
      )}

      {editingEntry && (
        <AddDiaryEntryModal
          initialEntry={editingEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </main>
  );
}
