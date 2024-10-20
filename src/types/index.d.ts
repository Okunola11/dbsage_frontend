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
  status_code: number;
  success: boolean;
  message: string;
  data?: User;
  access_token?: string;
}

export interface ErrorResponse {
  status_code: number;
  success: boolean;
  message: string;
}

export interface ApiResponse {
  status?: string;
  status_code: number;
  success: boolean;
  message: string;
  data?: unknown;
}

export type Translator = {
  <TargetKey>(
    key: TargetKey,
    values?: TranslationValues,
    formats?: Partial<Formats>
  ): string;
  rich(
    TargetKey: unknown,
    values?: RichTranslationValues,
    formats?: Partial<Formats>
  ): string | ReactElement | ReactNodeArray;
  markup(
    TargetKey: unknown,
    values?: MarkupTranslationValues,
    formats?: Partial<Formats>
  ): string;
  raw(TargetKey: unknown): unknown;
};

export interface CustomAuthError extends Error {
  customMessage: string;
}
