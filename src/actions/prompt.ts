"use server";

import axios from "axios";
import * as z from "zod";

import { PromptSchema } from "@/schemas";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types";

export const getSql = async (
  values: z.infer<typeof PromptSchema>
): Promise<ApiResponse> => {
  const validatedFields = PromptSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      status_code: 401,
      message: "Something went wrong",
    };
  }

  try {
    const response = await apiClient.post<ApiResponse>(
      "/api/v1/prompt",
      validatedFields.data
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
