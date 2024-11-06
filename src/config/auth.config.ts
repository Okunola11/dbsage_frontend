import { Session, NextAuthConfig } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Twitter from "next-auth/providers/twitter";

import { LoginSchema } from "@/schemas";
import { CustomJWT, User } from "@/types";
import { credentialsAuth, googleAuth, twitterAuth } from "@/actions/userAuth";
import { CustomAuthError } from "@/types";
import { refreshAccessToken } from "@/actions/refresh";
import { tokenManager } from "@/lib/tokenManager";

const isDevelopment = process.env.NODE_ENV === "development";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          const error = new Error("Invalid credentials") as CustomAuthError;
          error.customMessage = "Invalid credentials";
          throw error;
        }

        const { email, password, rememberMe } = validatedFields.data;
        const response = await credentialsAuth({ email, password, rememberMe });

        if (!response || !response.success) {
          const error = new Error(response.message) as CustomAuthError;
          error.customMessage = response.message;
          throw error;
        }

        const user = response.data as User;

        user.access_token = response.access_token;
        user.token_expiry =
          new Date().getTime() + (response.expires_in ?? 0) * 1000;
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days - this controls the NextAuth session lifetime
  },
  debug: isDevelopment,
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider == "google" && profile?.email) {
        return true;
      }

      if (account?.provider == "twitter") {
        return true;
      }

      return !!user;
    },
    async jwt({ token, user, account }) {
      const customToken = token as CustomJWT;

      if (account?.provider == "google") {
        if (!account.id_token) {
          return token;
        }

        const response = await googleAuth(account.id_token);

        if (!response || !("data" in response)) {
          return token;
        }

        token = response.data as CustomJWT;
        token.access_token = response.access_token;
        token.token_expiry =
          new Date().getTime() + (response.expires_in ?? 0) * 1000; // Add expiry time
        return token;
      }

      if (account?.provider == "twitter") {
        if (!account.access_token) {
          return token;
        }

        const response = await twitterAuth(account.access_token);

        if (!response || !("data" in response)) {
          return token;
        }

        customToken.access_token = response.access_token;
        customToken.token_expiry =
          new Date().getTime() + (response.expires_in ?? 0) * 1000; // Add expiry time
        return customToken;
      }

      if (user) {
        return {
          ...token,
          ...user,
        } as CustomJWT;
      }

      // Check if access token needs refresh
      if (customToken.token_expiry && Date.now() >= customToken.token_expiry) {
        console.log("==== REFRESHING FROM JWT ====");
        try {
          console.log(
            "\n\nJWT callback executing at:",
            new Date().toISOString(),
            "\n\n"
          );
          const response = await refreshAccessToken();

          if (response.success) {
            customToken.access_token = response.access_token;
            customToken.token_expiry =
              new Date().getTime() + (response.expires_in ?? 0) * 1000;

            return customToken;
          } else {
            // eslint-disable-next-line unicorn/no-null
            return null;
          }
        } catch (error) {
          // eslint-disable-next-line unicorn/no-null
          return null;
        }
      }

      return customToken;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const customToken = token as CustomJWT;

      if (!customToken || !customToken.id) {
        return {
          ...session,
          user: {
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            image: "",
          },
          access_token: undefined,
          expires: new Date(0).toISOString(),
        };
      }

      session.user = {
        id: customToken.id as string,
        first_name: customToken.first_name,
        last_name: customToken.last_name,
        image: customToken.avatar_url || "",
        email: customToken.email as string,
      };
      session.access_token = customToken.access_token;

      return session;
    },
  },
  events: {
    signOut: async () => {
      tokenManager.clearToken();
      global.tokenRefreshCache = {};
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
} satisfies NextAuthConfig;
