import { QueryClient } from "@tanstack/react-query";

export const journeyQueryKeys = {
  greeting: ["journey", "greeting"] as const,
  babyWeek: (weekNumber: number) =>
    ["journey", weekNumber, "baby"] as const,
  momWeek: (weekNumber: number) => ["journey", weekNumber, "mom"] as const,
};

export const createJourneyQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
