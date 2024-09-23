import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { LoginSchema } from "@/schemas";
import LoadingSpinner from "@/components/miscellaneous/loadingSpinner";
import CustomButton from "@/components/common/button/commonButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/common/input";
import { Translator } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormLoginProps = {
  t: Translator;
  form: UseFormReturn<
    {
      email: string;
      password: string;
      rememberMe?: boolean | undefined;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    undefined
  >;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof LoginSchema>) => Promise<void>;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
};

const FormLogin = ({
  t,
  form,
  isLoading,
  onSubmit,
  showPassword,
  togglePasswordVisibility,
}: FormLoginProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-dark-2">Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder={`${t("emailPlaceholder")}`}
                  {...field}
                  className={cn(
                    "w-full rounded-md border px-3 py-6 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                    form.formState.errors.email && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-dark-2">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isLoading}
                    type={showPassword ? "text" : "password"}
                    placeholder={`${t("passwordPlaceholder")}`}
                    {...field}
                    className={cn(
                      "w-full rounded-md border px-3 py-6 text-sm leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                      form.formState.errors.password && "border-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("rememberMe")}</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div>
            <Link
              href={"/forgot-password"}
              className="text-sm font-medium text-neutral-dark-2"
            >
              {t("forgotPassword")}
            </Link>
          </div>
        </div>

        <CustomButton
          type="submit"
          variant="primary"
          size="default"
          className="w-full py-6"
          isDisabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-x-2">
              <span className="animate-pulse">Logging in...</span>{" "}
              <LoadingSpinner className="size-4 animate-spin sm:size-5" />
            </span>
          ) : (
            <span>{t("loginButton")}</span>
          )}
        </CustomButton>
      </form>
    </Form>
  );
};

export default FormLogin;
