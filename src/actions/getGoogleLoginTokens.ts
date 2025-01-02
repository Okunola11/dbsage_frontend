"use server";

import axios from "axios";

import { AuthResponse } from "@/types";
import { apiUrl } from "@/utils/settings.env";
import { setCurrentSession } from "./userSession";
import setCookies from "./login";

interface tokenRequest {
  token: string;
}

export const getLoginTokens = async ({
  token,
}: tokenRequest): Promise<AuthResponse> => {
  if (!token) {
    return {
      success: false,
      status_code: 401,
      message: "Something went wrong",
    };
  }

  const payload = { token: token };

  try {
    const response = await axios.post<AuthResponse>(
      `${apiUrl}/api/v1/auth/google/tokens`,
      payload
    );

    const result = response.data;

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      await setCookies(setCookieHeader);
    }

    // Set user data in cookie
    const userData = {
      ...result.data,
      access_token: result.access_token,
      token_expiry: new Date().getTime() + (result.expires_in ?? 0) * 1000,
    };
    await setCurrentSession(userData);

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
