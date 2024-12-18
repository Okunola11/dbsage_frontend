"use server";

import axios from "axios";

import { apiUrl } from "@/utils/settings.env";
import { AuthResponse } from "@/types";
import { cookies } from "next/headers";
import setCookies from "./login";

export const refreshTokens = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${apiUrl}/api/v1/auth/refresh`,
      {},
      {
        headers: {
          Cookie: `refresh_token=${cookies().get("refresh_token")?.value}`,
        },
      }
    );

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      await setCookies(setCookieHeader);
    }

    const result = response.data;

    return result;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: error.response.data.success,
        status_code: error.response.status ?? error.response.data.status_code,
        message: error.response.data.message
          ? error.response.data.message
          : "Something went wrong.",
      };
    } else {
      return {
        success: false,
        status_code: 500,
        message: "An unexpected error occured.",
      };
    }
  }
};
