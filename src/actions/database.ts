"use server";

import axios from "axios";
import * as z from "zod";

import { dbConfigSchema } from "@/schemas";
import { apiUrl } from "@/utils/settings.env";
import { ApiResponse } from "@/types";
import { redirect } from "next/navigation";

import apiClient from "@/lib/apiClient";

export const connectDatabase = async (
  values: z.infer<typeof dbConfigSchema>
): Promise<ApiResponse> => {
  const validatedFields = dbConfigSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      status_code: 401,
      message: "Something went wrong",
    };
  }

  const data = validatedFields.data;
  const db_url = `postgresql://${data.username}:${data.password}@${data.host}:${data.port}/${data.database}`;
  const payload = { db_url: db_url };

  try {
    const response = await apiClient.post<ApiResponse>(
      "/api/v1/database/connect",
      payload
    );

    const result = response.data;

    return result;
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

export const closeDatabaseConnection = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      "/api/v1/database/close"
    );

    const result = response.data;

    return result;
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
