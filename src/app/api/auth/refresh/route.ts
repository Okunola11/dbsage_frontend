import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import { AuthResponse } from "@/types";
import { tokenManager } from "@/lib/tokenManager";

declare global {
  var tokenRefreshCache:
    | {
        lastResponse?: { response: AuthResponse; timestamp: number };
        pendingRequest?: { promise: Promise<AuthResponse>; timestamp: number };
      }
    | undefined;
}

if (!global.tokenRefreshCache) {
  global.tokenRefreshCache = {};
  console.log("Initializing global token refresh cache");
}

const CACHE_WINDOW = 200000; // 200 seconds
const ERROR_CACHE_WINDOW = 5000; // 5 seconds for error responses

async function performRefresh(refreshToken: string): Promise<AuthResponse> {
  try {
    console.log("Performing actual token refresh");
    const response = await axios.post<AuthResponse>(
      `${process.env.API_URL}/api/v1/auth/refresh`,
      {},
      {
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      }
    );

    const result = response.data;

    global.tokenRefreshCache!.lastResponse = {
      response: result,
      timestamp: Date.now(),
    };

    if (result.success) {
      const cookieHeader = response.headers["set-cookie"];
      tokenManager.setToken(cookieHeader);
    }

    return result;
  } catch (error) {
    const errorResponse: AuthResponse =
      axios.isAxiosError(error) && error.response
        ? {
            success: false,
            status_code: error.response.status ?? 500,
            message: error.response.data.message ?? "Failed to refresh token",
          }
        : {
            success: false,
            status_code: 500,
            message: "An unexpected error occurred",
          };

    // Cache error responses too
    global.tokenRefreshCache!.lastResponse = {
      response: errorResponse,
      timestamp: Date.now(),
    };

    return errorResponse;
  } finally {
    global.tokenRefreshCache!.pendingRequest = undefined;
  }
}

export async function getRefreshResponse(
  refreshToken: string
): Promise<AuthResponse> {
  const cached = global.tokenRefreshCache!.lastResponse;

  if (cached) {
    const age = Date.now() - cached.timestamp;
    const cacheWindow = cached.response.success
      ? CACHE_WINDOW
      : ERROR_CACHE_WINDOW;

    if (age < cacheWindow) {
      console.log(
        `Using cached ${
          cached.response.success ? "success" : "error"
        } response`,
        { age }
      );
      return cached.response;
    }
  }

  const pending = global.tokenRefreshCache!.pendingRequest;
  if (pending && Date.now() - pending.timestamp < CACHE_WINDOW) {
    return pending.promise;
  }

  const promise = performRefresh(refreshToken);

  global.tokenRefreshCache!.pendingRequest = {
    promise,
    timestamp: Date.now(),
  };

  return promise;
}

export async function POST(request: NextRequest) {
  const refreshToken = tokenManager.getToken();

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, status_code: 401, message: "Refresh token missing" },
      { status: 401 }
    );
  }

  const result = await getRefreshResponse(refreshToken);

  // Forward any Set-Cookie headers from the original response if needed
  return NextResponse.json(result);
}
