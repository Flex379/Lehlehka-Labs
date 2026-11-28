import type {
  CreateDiaryEntryRequest,
  CreateTaskRequest,
  GetDiaryParams,
  GetEmotionsParams,
  GetTasksParams,
  LoginRequest,
  RegisterRequest,
  UpdateDiaryEntryRequest,
  UpdateMeRequest,
  UpdateTaskStatusRequest,
} from "@/types/api";
import type { DiaryEmotion } from "@/types/diary";
import { api } from "./api";
import { proxyApi } from "./proxyApi";

export const register = async (data: RegisterRequest) => {
  const response = await proxyApi.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginRequest) => {
  const response = await proxyApi.post("/auth/login", data);
  return response.data;
};

export const logout = async () => {
  const response = await proxyApi.post("/auth/logout");
  return response.data;
};

export const getSession = async () => {
  const response = await proxyApi.get("/auth/session");
  return response.data;
};

export const getMe = async () => {
  const response = await proxyApi.get("/users/current");
  return response.data;
};

export const updateMe = async (data: UpdateMeRequest) => {
  const response = await proxyApi.patch("/users/current", data);
  return response.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await proxyApi.patch("/users/current/avatar", formData);
  return response.data;
};

export const createTask = async (data: CreateTaskRequest) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const getTasks = async (params?: GetTasksParams) => {
  const response = await api.get("/tasks", { params });
  return response.data;
};

export const updateTaskStatus = async (
  taskId: string,
  data: UpdateTaskStatusRequest,
) => {
  const response = await api.patch(`/tasks/status/${taskId}`, data);
  return response.data;
};

export const createDiaryEntry = async (data: CreateDiaryEntryRequest) => {
  const response = await proxyApi.post("/diary", data);
  return response.data;
};

export const getDiary = async (params?: GetDiaryParams) => {
  const response = await proxyApi.get("/diary", { params });
  return response.data;
};

export const updateDiaryEntry = async (
  noteId: string,
  data: UpdateDiaryEntryRequest,
) => {
  const response = await proxyApi.patch(`/diary/${noteId}`, data);
  return response.data;
};

export const deleteDiaryEntry = async (noteId: string) => {
  const response = await proxyApi.delete(`/diary/${noteId}`);
  return response.data;
};

export const getGreeting = async () => {
  const response = await proxyApi.get("/weeks/greeting");
  return response.data;
};

export const getPublicGreeting = async () => {
  const response = await api.get("/weeks/greeting/public");
  return response.data;
};

export const getBabyWeek = async (weekNumber: number) => {
  const response = await proxyApi.get(`/weeks/${weekNumber}/baby`);
  return response.data;
};

export const getMomWeek = async (weekNumber: number) => {
  const response = await proxyApi.get(`/weeks/${weekNumber}/mom`);
  return response.data;
};

export const getEmotions = async (
  params?: GetEmotionsParams,
): Promise<DiaryEmotion[]> => {
  const response = await api.get<
    DiaryEmotion[] | { emotions?: DiaryEmotion[]; tasks?: DiaryEmotion[] }
  >("/emotions", { params });

  if (Array.isArray(response.data)) return response.data;
  return response.data.emotions ?? response.data.tasks ?? [];
};
