"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBabyWeek, getMomWeek } from "@/lib/api/clientApi";
import { journeyQueryKeys } from "@/lib/queries/journey";
import type { BabyWeekResponse, MomWeekResponse } from "@/types/api";
import styles from "./JourneyDetails.module.css";

type JourneyTab = "baby" | "mom";

interface JourneyDetailsProps {
  weekNumber: number;
}

export default function JourneyDetails({ weekNumber }: JourneyDetailsProps) {
  const [activeTab, setActiveTab] = useState<JourneyTab>("baby");
  const babyQuery = useQuery<BabyWeekResponse>({
    queryKey: journeyQueryKeys.babyWeek(weekNumber),
    queryFn: () => getBabyWeek(weekNumber),
    enabled: activeTab === "baby",
  });
  const momQuery = useQuery<MomWeekResponse>({
    queryKey: journeyQueryKeys.momWeek(weekNumber),
    queryFn: () => getMomWeek(weekNumber),
    enabled: activeTab === "mom",
  });
  const isFetching =
    activeTab === "baby" ? babyQuery.isFetching : momQuery.isFetching;
  const isError = activeTab === "baby" ? babyQuery.isError : momQuery.isError;

  return (
    <section className={styles.details} aria-label="Інформація про цей тиждень">
      <div className={styles.tabs} role="tablist" aria-label="Розділи подорожі">
        <button
          id="baby-tab"
          className={activeTab === "baby" ? styles.activeTab : styles.tab}
          type="button"
          role="tab"
          aria-selected={activeTab === "baby"}
          aria-controls="journey-panel"
          onClick={() => setActiveTab("baby")}
        >
          Розвиток малюка
        </button>
        <button
          id="mom-tab"
          className={activeTab === "mom" ? styles.activeTab : styles.tab}
          type="button"
          role="tab"
          aria-selected={activeTab === "mom"}
          aria-controls="journey-panel"
          onClick={() => setActiveTab("mom")}
        >
          Тіло мами
        </button>
      </div>

      <div
        id="journey-panel"
        className={styles.panel}
        role="tabpanel"
        aria-labelledby={activeTab === "baby" ? "baby-tab" : "mom-tab"}
        aria-busy={isFetching}
      >
        {isFetching && (
          <div className={styles.status} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            Завантажуємо інформацію...
          </div>
        )}

        {!isFetching && isError && (
          <div className={styles.error} role="alert">
            <p>Не вдалося завантажити інформацію за цей тиждень.</p>
            <button
              type="button"
              onClick={() =>
                activeTab === "baby"
                  ? babyQuery.refetch()
                  : momQuery.refetch()
              }
            >
              Спробувати ще раз
            </button>
          </div>
        )}

        {!isFetching && !isError && activeTab === "baby" && babyQuery.data && (
          <BabyContent data={babyQuery.data} />
        )}

        {!isFetching && !isError && activeTab === "mom" && momQuery.data && (
          <MomContent data={momQuery.data} />
        )}
      </div>
    </section>
  );
}

function BabyContent({ data }: { data: BabyWeekResponse }) {
  const analogy = data.analogy
    .replace(/^Ваш малюк зараз .*?\sз\s+/i, "")
    .trim();
  const imageCaption = `Ваш малюк зараз розміром з ${analogy}`;

  return (
    <article className={styles.babyCard}>
      <div className={styles.babyMedia}>
        <div className={styles.illustration}>
          {data.image && (
            <Image
              src={data.image}
              alt={`Ілюстрація малюка: ${analogy}`}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className={styles.babyImage}
              priority
            />
          )}
        </div>
        <p className={styles.imageCaption}>{imageCaption}</p>
      </div>

      <div className={styles.babyCopy}>
        <div className={styles.description}>
          {data.description.map((paragraph, index) => (
            <p key={`${index}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>
        {data.interestingFact && (
          <aside className={styles.factCard}>
            <svg
              className={styles.factIcon}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <use href="/icons-sprite.svg#icon-star-shine" />
            </svg>
            <div>
              <h2>Цікавий факт тижня</h2>
              <p>{data.interestingFact}</p>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}

function MomContent({ data }: { data: MomWeekResponse }) {
  return (
    <div className={styles.momGrid}>
      <article className={`${styles.card} ${styles.momCard}`}>
        <h2>Як ви можете почуватись</h2>
        {data.feelings.states.length > 0 && (
          <ul className={styles.states}>
            {data.feelings.states.map((state) => (
              <li key={state}>{state}</li>
            ))}
          </ul>
        )}
        <p>{data.feelings.sensationDescr}</p>
      </article>

      <article className={`${styles.card} ${styles.tipsCard}`}>
        <h2>Поради для вашого комфорту</h2>
        <ul className={styles.tips}>
          {data.comfortTips.map(({ category, tip }, index) => (
            <li className={styles.tip} key={`${category}-${index}`}>
              <span className={styles.tipIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <use href={`/icons-sprite.svg#${getTipIcon(category)}`} />
                </svg>
              </span>
              <div>
                <h3>{category}</h3>
                <p>{tip}</p>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function getTipIcon(category: string) {
  const normalizedCategory = category.toLocaleLowerCase("uk");

  if (normalizedCategory.includes("харч")) {
    return "icon-fork-spoon";
  }

  if (
    normalizedCategory.includes("актив") ||
    normalizedCategory.includes("рух")
  ) {
    return "icon-fitness-center";
  }

  if (
    normalizedCategory.includes("відпоч") ||
    normalizedCategory.includes("сон")
  ) {
    return "icon-chair";
  }

  return "icon-book";
}
