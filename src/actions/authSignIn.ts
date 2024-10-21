"use server";

import { signIn } from "@/lib/auth";
import type { CustomAuthError } from "@/types";

interface Data {
  error?: string;
  message?: string;
}

interface SignInResult {
  success: boolean;
  data?: Partial<Data>;
  error?: string;
}

interface SignInProps {
  email: string;
  password: string;
  redirect?: boolean;
}

const credSignIn = async ({
  email,
  password,
}: SignInProps): Promise<SignInResult> => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true, data: result };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "cause" in error &&
      error.cause &&
      typeof error.cause === "object" &&
      "err" in error.cause &&
      error.cause.err &&
      "customMessage" in (error.cause.err as CustomAuthError)
    ) {
      return {
        success: false,
        error: (error.cause.err as CustomAuthError).customMessage,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};

export { credSignIn };
