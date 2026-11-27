"use client";

import { useParams } from "next/navigation";
import DiaryEntryDetails from "@/components/DiaryEntryDetails/DiaryEntryDetails";
import { useDiaryEntries } from "@/components/DiaryList/useDiaryEntries";
import styles from "./page.module.css";

export default function DiaryEntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const { data, isLoading, isError } = useDiaryEntries();

  const entry = data?.tasks.find((item) => item._id === entryId);

  return (
    <main className={styles.page}>
      {isLoading && <p>Завантаження...</p>}

      {!isLoading && isError && <p>Не вдалося завантажити запис.</p>}

      {!isLoading && !isError && !entry && <p>Запис не знайдено.</p>}

      {entry && <DiaryEntryDetails entry={entry} />}
    </main>
  );
}
