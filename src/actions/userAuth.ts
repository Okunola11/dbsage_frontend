"use server";

import axios from "axios";
import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { AuthResponse } from "@/types";
import { apiUrl } from "@/utils/settings.env";
import { tokenManager } from "@/lib/tokenManager";

const credentialsAuth = async (
  values: z.infer<typeof LoginSchema>
): Promise<AuthResponse> => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      status_code: 401,
      success: false,
      message: "Something went wrong",
    };
  }

  const { email, password } = validatedFields.data;

  const payload = { email, password };
  try {
    const response = await axios.post<AuthResponse>(
      `${apiUrl}/api/v1/auth/login`,
      payload
    );

    const result = response.data;

    if (result.success) {
      const cookieHeader = response.headers["set-cookie"];
      tokenManager.setToken(cookieHeader);
    }

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

const googleAuth = async (idToken: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${apiUrl}/api/v1/auth/google`,
      {
        id_token: idToken,
      }
    );

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

const twitterAuth = async (access_token: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${apiUrl}/api/v1/auth/twitter`,
      {
        access_token: access_token,
      }
    );

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

export { credentialsAuth, googleAuth, twitterAuth };
