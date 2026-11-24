export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateMeRequest {
  name: string;
  email: string;
  dueDate: string;
  babyGender: "girl" | "boy";
}

export interface CreateTaskRequest {
  name: string;
  date: string;
}

export interface GetTasksParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface UpdateTaskStatusRequest {
  isDone: boolean;
}

export interface CreateDiaryEntryRequest {
  title: string;
  description: string;
  emotions: string[];
}

export interface GetDiaryParams {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}

export interface UpdateDiaryEntryRequest {
  title: string;
  description: string;
  emotions: string[];
}

export interface GetEmotionsParams {
  page?: number;
  limit?: number;
}
