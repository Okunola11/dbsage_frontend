"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { LoginSchema } from "@/schemas";

import GoogleLogin from "./_components/googleLogin";
import FormLogin from "./_components/formLogin";
import TermsOfService from "./_components/termsOfService";
import { credSignIn } from "@/actions/authSignIn";

const Login = () => {
  const t = useTranslations("login");
  const router = useRouter();
  const { toast } = useToast();
  const { status } = useSession();

  const [isLoading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    const { email, password } = values;

    try {
      startTransition(async () => {
        const result = await credSignIn({ email, password });

        if (!result.success) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
          return;
        }

        if (result.data?.error) {
          toast({
            title: "Error",
            description: result.data.error,
            variant: "destructive",
          });
          return;
        }

        router.push("/dashboard");
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          (error as Error).message || "An error occurred during login.",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    document.title = "Login";
  }, []);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-neutral-dark-2 mb-5 text-center text-2xl font-semibold leading-tight">
            {t("title")}
          </h1>
          <p className="text-neutral-dark-2 mt-2 text-center text-sm font-normal leading-6">
            {t("welcomeBack")}
          </p>
        </div>

        <GoogleLogin t={t} />

        <div className="flex items-center justify-center">
          <hr className="w-full border-t border-gray-300" />
          <span className="text-neutral-dark-2 px-3 text-xs font-normal leading-tight">
            OR
          </span>
          <hr className="w-full border-t border-gray-300" />
        </div>

        <FormLogin
          t={t}
          form={form}
          isLoading={isLoading}
          onSubmit={onSubmit}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <p className="text-neutral-dark-2 mt-5 text-center text-sm leading-[15.6px]">
          {t("noAccount")}{" "}
          <Link
            href={"/register"}
            className="ms-1 text-left text-base font-bold leading-[19.2px] text-primary hover:text-primary/80"
          >
            {t("signUp")}
          </Link>
        </p>

        <TermsOfService t={t} />
      </div>
    </div>
  );
};

export default Login;
