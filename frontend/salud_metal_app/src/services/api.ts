import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { notifyApiError } from "../utils/notify.ts";

const BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (import.meta as any)?.env?.VITE_API_URL ||
  "http://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Inyectar token automáticamente
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("mh_token") : null;
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Manejo de refresh token (cola para evitar múltiples refresh simultáneos)
let isRefreshing = false;
let pendingQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any) => {
  pendingQueue.forEach(({ reject }) => reject(error));
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then(() => {
            // reintentar con nuevo token inyectado por request interceptor
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh-token");
        const newToken = (res.data as any)?.data?.token || (res.data as any)?.token;
        if (newToken) {
          localStorage.setItem("mh_token", newToken);
        }
        isRefreshing = false;
        // Desbloquear la cola
        pendingQueue.forEach(({ resolve }) => resolve(undefined));
        pendingQueue = [];
        return api(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        processQueue(refreshErr);
        // Limpiar sesión y redirigir a login
        try {
          localStorage.removeItem("mh_token");
        } catch {}
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }
    // Mostrar errores globales para otros estados (4xx/5xx) salvo que se omita explícitamente
    try {
      const skip = (originalRequest?.headers as any)?.["x-skip-error-toast"] === "1";
      if (!skip) notifyApiError(error);
    } catch {}
    return Promise.reject(error);
  }
);
