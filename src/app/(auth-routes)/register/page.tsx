"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/actions/register";
import { RegisterSchema } from "@/schemas";

import GoogleLogin from "../login/_components/googleLogin";
import RegisterForm from "./_components/registerForm";
import HasAccount from "./_components/hasAccount";
import { useCurrentSession } from "@/hooks/useCurrentSession";

const Register = () => {
  const t = useTranslations("register");
  const router = useRouter();
  const { toast } = useToast();
  const { status } = useCurrentSession();
  const [isLoading, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      await registerUser(values).then(async (data) => {
        if (data.status_code === 201) {
          router.push("/login");

          toast({
            title: "Account created successfully.",
            description: "Please verify your account.",
          });
        } else {
          toast({
            title: "An error occurred",
            description: data.message,
          });
        }
      });
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    document.title = "Register";
  }, []);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-inter text-neutralColor-dark-2 mb-5 text-center text-2xl font-semibold leading-tight">
            {t("signUp")}
          </h1>
          <p className="font-inter text-neutralColor-dark-2 mt-2 text-center text-sm font-normal leading-6">
            {t("createAccountDesc")}
          </p>
        </div>

        <GoogleLogin t={t} />

        <div className="flex items-center justify-center">
          <hr className="w-full border-t border-gray-300" />
          <span className="font-inter text-neutralColor-dark-1 px-3 text-xs font-normal leading-tight">
            OR
          </span>
          <hr className="w-full border-t border-gray-300" />
        </div>

        <RegisterForm
          t={t}
          form={form}
          isLoading={isLoading}
          onSubmit={onSubmit}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
        />

        <HasAccount t={t} />
      </div>
    </div>
  );
};

export default Register;
