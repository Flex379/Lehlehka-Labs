import "server-only";

import { cookies } from "next/headers";
import { api } from "./api";

import type {
  GetTasksParams,
  GetDiaryParams,
  GetEmotionsParams,
} from "@/types/api";

const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
};

export const getSession = async () => {
  const cookie = await getCookieHeader();

  const response = await api.get("/auth/session", {
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getMe = async () => {
  const cookie = await getCookieHeader();

  const response = await api.get("/users/current", {
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getTasks = async (params?: GetTasksParams) => {
  const cookie = await getCookieHeader();

  const response = await api.get("/tasks", {
    params,
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getDiary = async (params?: GetDiaryParams) => {
  const cookie = await getCookieHeader();

  const response = await api.get("/diary", {
    params,
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getGreeting = async () => {
  const cookie = await getCookieHeader();

  const response = await api.get("/weeks/greeting", {
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getBabyWeek = async (weekNumber: number) => {
  const cookie = await getCookieHeader();

  const response = await api.get(`/weeks/${weekNumber}/baby`, {
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getMomWeek = async (weekNumber: number) => {
  const cookie = await getCookieHeader();

  const response = await api.get(`/weeks/${weekNumber}/mom`, {
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};

export const getEmotions = async (params?: GetEmotionsParams) => {
  const cookie = await getCookieHeader();

  const response = await api.get("/emotions", {
    params,
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
};
