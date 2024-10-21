"use server";

import axios from "axios";
import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { AuthResponse, ErrorResponse } from "@/types";
import { apiUrl } from "@/utils/settings.env";

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
    const response = await axios.post(`${apiUrl}/api/v1/auth/login`, payload);

    return {
      status_code: response.data.status_code,
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      access_token: response.data.access_token,
    };
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
    const response = await axios.post(`${apiUrl}/api/v1/auth/google`, {
      id_token: idToken,
    });

    return {
      status_code: response.data.status_code,
      success: response.data.success,
      message: response.data.message,
      data: response.data.user,
      access_token: response.data.access_token,
    };
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

const twitterAuth = async (
  access_token: string
): Promise<AuthResponse | ErrorResponse> => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/auth/twitter`, {
      access_token: access_token,
    });

    return {
      data: response.data.user,
      access_token: response.data.access_token,
    };
  } catch (error) {
    return {
      status_code:
        axios.isAxiosError(error) && error.response
          ? error.response.status
          : undefined,
      message:
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data.message
          ? error.response.data.message
          : "Something went wrong.",
    };
  }
};

export { credentialsAuth, googleAuth, twitterAuth };
