import { Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/schemas";
import LoadingSpinner from "@/components/miscellaneous/loadingSpinner";
import CustomButton from "@/components/common/button/commonButton";
import { Input } from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  t: any;
  form: UseFormReturn<
    {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    },
    any,
    undefined
  >;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof RegisterSchema>) => Promise<void>;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
};

const RegisterForm = ({
  t,
  form,
  isLoading,
  onSubmit,
  showPassword,
  togglePasswordVisibility,
}: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutralColor-dark-2">
                {t("firstName")}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  disabled={isLoading}
                  placeholder={`${t("firstNamePlaceholder")}`}
                  {...field}
                  className={cn(
                    "font-inter w-full rounded-md border px-3 py-6 text-sm font-normal leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                    form.formState.errors.first_name && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage data-testid="name-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutralColor-dark-2">
                {t("lastName")}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  disabled={isLoading}
                  placeholder={`${t("lastNamePlaceholder")}`}
                  {...field}
                  className={cn(
                    "font-inter w-full rounded-md border px-3 py-6 text-sm font-normal leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                    form.formState.errors.last_name && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage data-testid="name-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutralColor-dark-2">
                {t("email")}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  disabled={isLoading}
                  placeholder={`${t("emailPlaceholder")}`}
                  {...field}
                  className={cn(
                    "font-inter w-full rounded-md border px-3 py-6 text-sm font-normal leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                    form.formState.errors.email && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage data-testid="email-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutralColor-dark-2">
                {t("password")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    disabled={isLoading}
                    type={showPassword ? "text" : "password"}
                    placeholder={`${t("passwordPlaceholder")}`}
                    {...field}
                    className={cn(
                      "font-inter w-full rounded-md border px-3 py-6 text-sm font-normal leading-[21.78px] transition duration-150 ease-in-out focus:outline-none",
                      form.formState.errors.password && "border-destructive"
                    )}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <Eye
                        className="h-5 w-5 text-gray-400"
                        data-testid="eye-icon"
                      />
                    ) : (
                      <EyeOff
                        className="h-5 w-5 text-gray-400"
                        data-testid="eye-off-icon"
                      />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage data-testid="password-error" />
            </FormItem>
          )}
        />
        <CustomButton
          type="submit"
          variant="primary"
          size="default"
          className="w-full py-6"
          isDisabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-x-2">
              <span className="animate-pulse">{t("loggingIn")}</span>{" "}
              <LoadingSpinner className="size-4 animate-spin sm:size-5" />
            </span>
          ) : (
            <span>{t("createAccount")}</span>
          )}
        </CustomButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
