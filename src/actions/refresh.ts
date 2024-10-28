"use server";

import { AuthResponse } from "@/types";

export async function refreshAccessToken(): Promise<AuthResponse> {
  try {
    // Call our internal API route
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "same-origin",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      status_code: 500,
      message: "Failed to reach refresh endpoint",
    };
  }
}
