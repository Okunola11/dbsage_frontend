"use server";

import axios from "axios";
import * as z from "zod";

import { dbConfigSchema } from "@/schemas";
import { apiUrl } from "@/utils/settings.env";
import { ApiResponse } from "@/types";

export const connectDatabase = async (
  values: z.infer<typeof dbConfigSchema>
): Promise<ApiResponse> => {
  const validatedFields = dbConfigSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      status_code: 401,
      message: "Something went wrong",
    };
  }

  const data = validatedFields.data;
  const db_url = `postgresql://${data.username}:${data.password}@${data.host}:${data.port}/${data.database}`;
  const payload = { db_url: db_url };

  try {
    const response = await axios.post(
      `${apiUrl}/api/v1/database/connect`,
      payload
    );

    return {
      status: response.data.status,
      status_code: response.data.status_code,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status_code: error.response.status ?? error.response.data.status_code,
        message: error.response.data.message
          ? error.response.data.message
          : "Something went wrong.",
      };
    } else {
      return {
        status_code: 500,
        message: "An unexpected error occured.",
      };
    }
  }
};

export const closeDatabaseConnection = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/database/close`);

    return {
      status: response.data.status,
      status_code: response.data.status_code,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status_code: error.response.status ?? error.response.data.status_code,
        message: error.response.data.message
          ? error.response.data.message
          : "Something went wrong.",
      };
    } else {
      return {
        status_code: 500,
        message: "An unexpected error occured.",
      };
    }
  }
};
