"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import GreetingBlock from "@/components/Journey/GreetingBlock";
import JourneyDetails from "@/components/Journey/JourneyDetails";
import WeekSelector from "@/components/Journey/WeekSelector";
import { getGreeting } from "@/lib/api/clientApi";
import { journeyQueryKeys } from "@/lib/queries/journey";
import type { WeekGreetingResponse } from "@/types/api";
import styles from "./JourneyWeekPage.module.css";

interface JourneyWeekPageClientProps {
  weekNumber: number;
}

export default function JourneyWeekPageClient({
  weekNumber,
}: JourneyWeekPageClientProps) {
  const router = useRouter();
  const greetingQuery = useQuery<WeekGreetingResponse>({
    queryKey: journeyQueryKeys.greeting,
    queryFn: getGreeting,
  });
  const currentWeek = greetingQuery.data?.curWeekToPregnant;
  const isFutureWeek = currentWeek !== undefined && weekNumber > currentWeek;

  useEffect(() => {
    if (isFutureWeek && currentWeek) {
      router.replace(`/journey/${currentWeek}`);
    }
  }, [currentWeek, isFutureWeek, router]);

  if (greetingQuery.isLoading) {
    return (
      <main className={styles.page}>
        <p className={styles.status} role="status">
          Завантажуємо вашу подорож...
        </p>
      </main>
    );
  }

  if (greetingQuery.isError || !greetingQuery.data) {
    const isUnauthorized =
      axios.isAxiosError(greetingQuery.error) &&
      greetingQuery.error.response?.status === 401;

    return (
      <main className={styles.page}>
        <div className={styles.error} role="alert">
          <h1>
            {isUnauthorized
              ? "Увійдіть, щоб переглянути подорож вагітності"
              : "Не вдалося завантажити дані подорожі"}
          </h1>
          {isUnauthorized ? (
            <Link href="/auth/login">Увійти до акаунта</Link>
          ) : (
            <button type="button" onClick={() => greetingQuery.refetch()}>
              Спробувати ще раз
            </button>
          )}
        </div>
      </main>
    );
  }

  if (isFutureWeek) {
    return (
      <main className={styles.page}>
        <p className={styles.status} role="status">
          Відкриваємо поточний тиждень...
        </p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <GreetingBlock />
      <WeekSelector
        currentWeek={greetingQuery.data.curWeekToPregnant}
        selectedWeek={weekNumber}
        onSelectWeek={(nextWeek) => router.push(`/journey/${nextWeek}`)}
      />
      <JourneyDetails key={weekNumber} weekNumber={weekNumber} />
    </main>
  );
}
