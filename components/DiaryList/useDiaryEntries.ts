import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDiaryEntry, getDiary } from "@/lib/api/clientApi";
import type { DiaryListResponse } from "@/types/diary";
import toast from "react-hot-toast";

const DIARY_PARAMS = { limit: 100, sortOrder: "desc" } as const;

export const DIARY_QUERY_KEY = ["diary", DIARY_PARAMS];

export function useDiaryEntries() {
  return useQuery<DiaryListResponse>({
    queryKey: DIARY_QUERY_KEY,
    queryFn: () => getDiary(DIARY_PARAMS),
  });
}

export function useDeleteDiaryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => deleteDiaryEntry(entryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["diary"] });
      toast.success("Запис видалено.");
    },
    onError: () => {
      toast.error("Не вдалося видалити запис. Спробуйте ще раз.");
    },
  });
}
