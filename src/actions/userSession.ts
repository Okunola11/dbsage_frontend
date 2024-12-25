"use server";

import { cookies } from "next/headers";

import { User } from "@/types";

// Set user session
export async function setCurrentSession(userData: Partial<User>) {
  cookies().set("user_session", JSON.stringify(userData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(Date.now() + 24 * 30 * 60 * 60 * 1000), // 24 * 30 hours
  });
}

// Update current session
export async function updateCurrentSession(userData: Partial<User>) {
  const current_session = await getCurrentSession();

  const newUserData: Partial<User> = {
    ...current_session,
    token_expiry: userData.token_expiry
      ? userData.token_expiry
      : current_session?.token_expiry,
    access_token: userData.access_token
      ? userData.access_token
      : current_session?.access_token,
  };

  cookies().set("user_session", JSON.stringify(newUserData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(Date.now() + 24 * 30 * 60 * 60 * 1000), // 24 * 30 hours
  });
}

// To retrieve user data in a server component or server action
export async function getCurrentSession() {
  const cookieStore = cookies();
  const userSessionCookie = cookieStore.get("user_session");

  // eslint-disable-next-line unicorn/no-null
  if (!userSessionCookie) return null;

  try {
    const decodedString = decodeURIComponent(userSessionCookie.value);

    const trimmedString = decodedString.replace(/^"|"$/g, "");
    const session: User = JSON.parse(trimmedString);

    console.log(session.token_expiry);
    if (session.token_expiry && Date.now() >= session.token_expiry) {
      console.log("\nUSER SESSION IS EXPIRED");
      console.log("Please login again.\n");
      // return null;
    }

    return session;
  } catch (error) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }
}

// Delete the users current session
export async function deleteCurrentSession() {
  const cookieStore = cookies();
  const userSessionCookie = cookieStore.get("user_session");

  // eslint-disable-next-line unicorn/no-null
  if (!userSessionCookie) return null;

  cookieStore.delete("user_session");
  cookieStore.delete("refresh_token");
}
