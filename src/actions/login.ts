"use server";

import axios from "axios";
import * as z from "zod";
import { cookies } from "next/headers";

import { LoginSchema } from "@/schemas";
import { apiUrl } from "@/utils/settings.env";
import { AuthResponse } from "@/types";
import { setCurrentSession } from "./userSession";

export const loginUser = async (
  values: z.infer<typeof LoginSchema>
): Promise<AuthResponse> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      status_code: 401,
      message: "Something went wrong",
    };
  }

  try {
    const response = await axios.post<AuthResponse>(
      `${apiUrl}/api/v1/auth/login`,
      validatedFields.data,
      { withCredentials: true }
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

export const googleLogin = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get<AuthResponse>(
      `${apiUrl}/api/v1/auth/google`
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

export default async function setCookies(setCookieHeader: string[]) {
  const cookieStore = cookies();

  setCookieHeader
    .filter((cookie) => cookie)
    .forEach((cookie) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [cookieRaw, ..._] = cookie.split("; ");
      const [cookieName, ...cookieAttributes] = cookieRaw.split("=");
      cookieStore.set(cookieName, cookieAttributes.join("="), {
        httpOnly: true,
        sameSite: "lax",
      });
    });
}
