export interface DiaryEmotion {
  _id: string;
  title: string;
}

export interface DiaryEntry {
  _id: string;
  title: string;
  date: string;
  description: string;
  emotions: DiaryEmotion[];
}

// У api-docs помилково вказано "tasks", реальний бекенд віддає "diaryNotes".
export interface DiaryListResponse {
  diaryNotes: DiaryEntry[];
  totalCount: number;
  totalPages: number;
  page: number;
}
