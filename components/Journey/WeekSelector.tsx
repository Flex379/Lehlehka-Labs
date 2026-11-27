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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const scrollSelectedIntoView = () => {
      const scroller = scrollerRef.current;
      const selected = selectedRef.current;

      if (!scroller || !selected) {
        return;
      }

      const scrollerRect = scroller.getBoundingClientRect();
      const selectedRect = selected.getBoundingClientRect();
      const offset =
        selectedRect.left +
        selectedRect.width / 2 -
        scrollerRect.left -
        scroller.clientWidth / 2;

      scroller.scrollTo({
        left: scroller.scrollLeft + offset,
        behavior: "smooth",
      });
    };

    const scroller = scrollerRef.current;
    const resizeObserver = new ResizeObserver(scrollSelectedIntoView);

    scrollSelectedIntoView();
    if (scroller) {
      resizeObserver.observe(scroller);
    }

    return () => resizeObserver.disconnect();
  }, [selectedWeek]);

  return (
    <section className={styles.selector} aria-label="Вибір тижня вагітності">
      <div className={styles.scroller} ref={scrollerRef}>
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
