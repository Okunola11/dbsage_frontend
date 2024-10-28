"use server";

import axios from "axios";
import { apiUrl } from "@/utils/settings.env";
import { auth } from "./auth";

const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await auth();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const session = await auth();

      if (!session?.access_token) {
        throw new Error("AuthenticationError");
      }

      const newSession = await auth();

      if (newSession?.access_token) {
        originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
