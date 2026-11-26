"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import type { DiaryEntry } from "@/types/diary";
import styles from "./DiaryEntryCard.module.css";

const DESKTOP_QUERY = "(min-width: 1024px)";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const dayMonth = date.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
  });
  return `${dayMonth} ${date.getFullYear()}`;
}

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onSelect?: (entry: DiaryEntry) => void;
}

export default function DiaryEntryCard({
  entry,
  onSelect,
}: DiaryEntryCardProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // На десктопі показуємо запис у DiaryEntryDetails замість переходу.
    if (onSelect && window.matchMedia(DESKTOP_QUERY).matches) {
      event.preventDefault();
      onSelect(entry);
    }
  };

  return (
    <Link
      href={`/diary/${entry._id}`}
      className={styles.card}
      onClick={handleClick}
    >
      <div className={styles.top}>
        <p className={styles.title}>{entry.title}</p>
        <p className={styles.date}>{formatDate(entry.date)}</p>
      </div>
      <ul className={styles.tags}>
        {entry.emotions.map((emotion) => (
          <li key={emotion._id} className={styles.tag}>
            {emotion.title}
          </li>
        ))}
      </ul>
    </Link>
  );
}
