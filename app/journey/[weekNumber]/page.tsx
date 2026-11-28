import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getBabyWeek } from "@/lib/api/serverApi";
import {
  createJourneyQueryClient,
  journeyQueryKeys,
} from "@/lib/queries/journey";
import JourneyWeekPageClient from "./JourneyWeekPageClient";

interface JourneyWeekPageProps {
  params: Promise<{ weekNumber: string }>;
}

export default async function JourneyWeekPage({
  params,
}: JourneyWeekPageProps) {
  const { weekNumber: weekParam } = await params;
  const weekNumber = Number(weekParam);

  if (
    !Number.isInteger(weekNumber) ||
    weekNumber < 1 ||
    weekNumber > 42
  ) {
    notFound();
  }

  const queryClient = createJourneyQueryClient();

  await queryClient.prefetchQuery({
    queryKey: journeyQueryKeys.babyWeek(weekNumber),
    queryFn: () => getBabyWeek(weekNumber),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JourneyWeekPageClient weekNumber={weekNumber} />
    </HydrationBoundary>
  );
}
