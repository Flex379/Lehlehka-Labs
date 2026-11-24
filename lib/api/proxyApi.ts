import axios from "axios";

export const proxyApi = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
