import { cookies } from "next/headers";

type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  maxAge?: number;
};

interface TokenStore {
  memoryToken: string | null;
  pendingCookieUpdate: string | null;
  lastUpdated?: number;
}

declare global {
  var tokenStore: TokenStore;
}

if (!global.tokenStore) {
  global.tokenStore = {
    memoryToken: null,
    pendingCookieUpdate: null,
    lastUpdated: Date.now(),
  };
}

export class TokenManager {
  private readonly cookieName: string;
  private static instance: TokenManager;

  private constructor() {
    this.cookieName = "refresh_token";
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    };
  }

  public setToken(cookieHeader: string[] | undefined): void {
    try {
      if (cookieHeader && cookieHeader.length > 0) {
        const allCookies = cookieHeader[0];
        const refreshToken = allCookies.match(/refresh_token=([^;]*)/)?.[1];

        if (refreshToken) {
          console.log(
            `[${new Date().toISOString()}] Setting new token from header`
          );

          global.tokenStore = {
            ...global.tokenStore,
            memoryToken: refreshToken,
            pendingCookieUpdate: refreshToken,
            lastUpdated: Date.now(),
          };

          try {
            cookies().set(
              this.cookieName,
              refreshToken,
              this.getCookieOptions()
            );
          } catch (error) {
            console.warn(
              "Unable to set cookie directly, will rely on pending update:",
              error
            );
          }
        }
      }
    } catch (error) {
      console.error("Error setting token:", error);
      throw new Error("Failed to set token");
    }
  }

  public getToken(): string | null {
    try {
      if (global.tokenStore?.memoryToken) {
        return global.tokenStore.memoryToken;
      }

      // Fallback to cookie after server restart
      const cookieToken = cookies().get(this.cookieName);
      if (cookieToken) {
        global.tokenStore = {
          ...global.tokenStore,
          memoryToken: cookieToken.value,
          lastUpdated: Date.now(),
        };
        return cookieToken.value;
      }
    } catch (error) {
      console.error("Error reading token:", error);
    }
    return null;
  }

  public hasPendingCookieUpdate(): boolean {
    return Boolean(global.tokenStore?.pendingCookieUpdate);
  }

  public applyPendingCookieUpdate(): void {
    console.log("Applying pending update, current state:", {
      pendingUpdate: global.tokenStore?.pendingCookieUpdate,
      lastUpdated: global.tokenStore?.lastUpdated,
    });

    if (global.tokenStore?.pendingCookieUpdate) {
      try {
        cookies().set(
          this.cookieName,
          global.tokenStore.pendingCookieUpdate,
          this.getCookieOptions()
        );

        global.tokenStore = {
          ...global.tokenStore,
          pendingCookieUpdate: null,
          lastUpdated: Date.now(),
        };
      } catch (error) {
        console.error("Failed to apply pending cookie update:", error);
      }
    }
  }

  public clearToken(): void {
    global.tokenStore = {
      memoryToken: null,
      pendingCookieUpdate: null,
      lastUpdated: Date.now(),
    };
    cookies().delete(this.cookieName);
  }
}

export const tokenManager = TokenManager.getInstance();
