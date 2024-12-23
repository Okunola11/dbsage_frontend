export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  fullname?: string;
  image?: string;
  avatar_url?: string;
  access_token?: string;
  is_active?: boolean;
  is_verified?: boolean;
  is_superadmin?: boolean;
  created_at?: string;
  token_expiry?: number;
}

export interface AuthResponse {
  status_code: number;
  success: boolean;
  message: string;
  data?: User;
  access_token?: string;
  expires_in?: number;
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
