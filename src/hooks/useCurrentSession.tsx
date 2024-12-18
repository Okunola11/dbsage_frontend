"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { getCurrentSession } from "@/actions/userSession";

export const useCurrentSession = () => {
  // eslint-disable-next-line unicorn/no-null
  const [session, setSession] = useState<User | null>(null);
  const [status, setStatus] = useState<string>("loading");
  const pathName = usePathname();

  const retrieveSession = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const user = await getCurrentSession();
      if (user) {
        setSession(user);
        setStatus("authenticated");
        return;
      }

      setStatus("unauthenticated");
    } catch (error) {
      setStatus("unauthenticated");
      // eslint-disable-next-line unicorn/no-null
      setSession(null);
    }
  }, []);

  useEffect(() => {
    // We only want to retrieve the session when there is no session
    if (!session) {
      retrieveSession();
    }

    // use the pathname to force a re-render when the user navigates to a new page
  }, [retrieveSession, session, pathName]);
  console.log(status);

  return { session, status };
};
