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

// Бекенд повертає записи в полі "tasks" (так записано в api-docs).
export interface DiaryListResponse {
  tasks: DiaryEntry[];
  totalCount: number;
  totalPages: number;
  page: number;
}
