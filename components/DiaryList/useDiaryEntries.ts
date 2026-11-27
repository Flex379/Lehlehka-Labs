import { useQuery } from "@tanstack/react-query";
import { getDiary } from "@/lib/api/clientApi";
import type { DiaryListResponse } from "@/types/diary";

const DIARY_PARAMS = { limit: 100, sortOrder: "desc" } as const;

export const DIARY_QUERY_KEY = ["diary", DIARY_PARAMS];

// Один запит на весь щоденник: список, деталі й сторінка запису
// беруть дані з того самого кешу TanStack Query.
export function useDiaryEntries() {
  return useQuery<DiaryListResponse>({
    queryKey: DIARY_QUERY_KEY,
    queryFn: () => getDiary(DIARY_PARAMS),
  });
}
