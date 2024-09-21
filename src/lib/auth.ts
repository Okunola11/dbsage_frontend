import { DefaultSession } from "next-auth";

import { User } from "@/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: User["id"];
      first_name: User["first_name"];
      last_name: User["last_name"];
      email: User["email"];
      image: User["image"];
      bio?: string;
      username?: string;
      is_superadmin?: boolean;
    } & DefaultSession["user"];
    access_token?: string;
  }
}
