"use server";

import axios from "axios";
import { apiUrl } from "@/utils/settings.env";
import { getCurrentSession } from "@/actions/userSession";
import { deleteCurrentSession } from "@/actions/userSession";
import { updateCurrentSession } from "@/actions/userSession";
import { refreshTokens } from "@/actions/refreshTokens";

const apiClient = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getCurrentSession();

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

      // Call refresh endpoint
      const refreshResult = await refreshTokens();

      if (refreshResult.success) {
        const updateData = {
          access_token: refreshResult.access_token,
          token_expiry:
            new Date().getTime() + (refreshResult.expires_in ?? 0) * 1000,
        };
        await updateCurrentSession(updateData);

        const newSession = await getCurrentSession();

        if (newSession?.access_token) {
          return apiClient(originalRequest);
        }
      }

      return await deleteCurrentSession();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
