"use server";

import axios from "axios";
import * as z from "zod";
import { redirect } from "next/navigation";

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
    const response = await apiClient.post(
      "/api/v1/prompt",
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
    if ((error as Error).message === "AuthenticationError") {
      redirect("/login");
    }
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
