import { Session, type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { User } from "next-auth";

export interface CustomJWT extends JWT {
  id?: string;
  email?: string;
  picture?: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  fullname?: string;
  access_token?: string;
}

export interface User extends User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  fullname?: string;
  image?: string;
  avatar_url?: string;
  access_token?: string;
}

export interface AuthResponse {
  data: User;
  access_token: string;
}

export interface ErrorResponse {
  status_code?: number;
  message: string;
}
