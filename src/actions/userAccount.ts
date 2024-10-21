"use server";

import axios from "axios";

import { ApiResponse } from "@/types";
import { apiUrl } from "@/utils/settings.env";

interface verificationRequest {
  email: string;
  token: string;
}

export const verifyAccount = async ({
  email,
  token,
}: verificationRequest): Promise<ApiResponse> => {
  if (!email || !token) {
    return {
      success: false,
      status_code: 401,
      message: "Something went wrong",
    };
  }

  const payload = { email: email, token: token };

  try {
    const response = await axios.post(`${apiUrl}/api/v1/auth/verify`, payload);

    return {
      status: response.data.status,
      success: response.data.success,
      status_code: response.data.status_code,
      message: response.data.message,
      data: response.data.data,
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
