"use client";

import { useEffect, useRef } from "react";
import styles from "./WeekSelector.module.css";

interface WeekSelectorProps {
  currentWeek: number;
  selectedWeek: number;
  onSelectWeek: (weekNumber: number) => void;
}

export default function WeekSelector({
  currentWeek,
  selectedWeek,
  onSelectWeek,
}: WeekSelectorProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [selectedWeek]);

  return (
    <section className={styles.selector} aria-label="Вибір тижня вагітності">
      <div className={styles.scroller}>
        <div className={styles.weeks}>
          {Array.from({ length: 42 }, (_, index) => {
            const week = index + 1;
            const isCurrent = week === currentWeek;
            const isSelected = week === selectedWeek;
            const isFuture = week > currentWeek;

            return (
              <button
                key={week}
                ref={isSelected ? selectedRef : undefined}
                type="button"
                className={[
                  styles.week,
                  isCurrent && styles.current,
                  isSelected && styles.selected,
                  isFuture && styles.future,
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`${week}-й тиждень${isCurrent ? ", поточний" : ""}`}
                aria-current={isSelected ? "step" : undefined}
                disabled={isFuture}
                onClick={() => onSelectWeek(week)}
              >
                <span className={styles.number}>{week}</span>
                <span className={styles.caption}>Тиждень</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
