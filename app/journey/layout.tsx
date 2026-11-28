import { dehydrate } from "@tanstack/react-query";
import JourneyQueryProvider from "@/components/Journey/JourneyQueryProvider";
import { getGreeting } from "@/lib/api/serverApi";
import {
  createJourneyQueryClient,
  journeyQueryKeys,
} from "@/lib/queries/journey";

export default async function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = createJourneyQueryClient();

  await queryClient.prefetchQuery({
    queryKey: journeyQueryKeys.greeting,
    queryFn: getGreeting,
  });

  return (
    <JourneyQueryProvider state={dehydrate(queryClient)}>
      {children}
    </JourneyQueryProvider>
  );
}
