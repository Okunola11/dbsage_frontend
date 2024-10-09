"use server";

import axios from "axios";
import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import { apiUrl } from "@/utils/settings.env";
import { ApiResponse } from "@/types";

export const registerUser = async (
  values: z.infer<typeof RegisterSchema>
): Promise<ApiResponse> => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      status_code: 401,
      message: "Something went wrong",
    };
  }

  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/auth/register`,
      validatedFields.data
    );

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
