import * as z from "zod";

const PasswordSchema = z
  .string()
  .min(1, { message: "Password is required." })
  .min(8, { message: "Password must be at least 8 characters long." })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter.",
  })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((value) => /\d/.test(value), {
    message: "Password must contain at least one number.",
  })
  .refine((value) => /[\W_]/.test(value), {
    message: "Password must contain at least one special character.",
  });

export const RegisterSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: "First name is required." })
    .min(3, { message: "First name must be at least 3 characters." }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required." })
    .min(3, { message: "Last name must be at least 3 characters." }),
  email: z
    .string()
    .min(1, { message: "Field is required." })
    .email({ message: "Invalid email address." }),
  password: PasswordSchema,
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  password: PasswordSchema,
  rememberMe: z.boolean().default(false).optional(),
});

export const PasswordResetSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password == data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const PromptSchema = z.object({
  prompt: z.string().min(1, { message: "Please provide a prompt." }),
});

export const dbConfigSchema = z.object({
  host: z.string().min(1, { message: "Host or socket is required." }),
  port: z
    .number()
    .int()
    .min(1, { message: "Port number is required" })
    .max(65535),
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
  database: z.string().min(1, { message: "Database name is required." }),
});
