"use client";

import {
  HydrationBoundary,
  QueryClientProvider,
  type DehydratedState,
} from "@tanstack/react-query";
import { useState } from "react";
import { createJourneyQueryClient } from "@/lib/queries/journey";

interface JourneyQueryProviderProps {
  children: React.ReactNode;
  state: DehydratedState;
}

export default function JourneyQueryProvider({
  children,
  state,
}: JourneyQueryProviderProps) {
  const [queryClient] = useState(createJourneyQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}
