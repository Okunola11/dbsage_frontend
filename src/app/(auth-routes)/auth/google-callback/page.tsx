"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getLoginTokens } from "@/actions/getGoogleLoginTokens";

const AccountVerification = () => {
  const fetchAttempted = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const getGoogleLoginTokens = async () => {
      if (fetchAttempted.current) return;

      const token = searchParams.get("token");

      if (!token) {
        toast({
          variant: "destructive",
          title: "Google login Failed",
          description: "Google login failed",
          duration: 5000,
        });
        router.push("/login");
        return;
      }

      fetchAttempted.current = true;

      try {
        const response = await getLoginTokens({ token });

        if (response.success) {
          toast({
            title: "Google login Successfully!",
            description: "Redirecting to dashboard...",
          });

          router.push("/dashboard");
        } else {
          toast({
            variant: "destructive",
            title: "Google login failed",
            description: response.message || "Google login failed",
          });
          router.push("/login");
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Google login failed",
          description: (err as Error).message || "Google login failed",
        });
        router.push("/login");
      }
    };

    getGoogleLoginTokens();
  }, [searchParams, router, toast]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center space-y-8 rounded-xl bg-white/80 p-12 backdrop-blur-sm dark:bg-gray-800/80">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          <div className="absolute inset-3 animate-spin rounded-full border-b-4 border-t-4 border-purple-500 [animation-direction:reverse]"></div>
          <div className="absolute inset-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Logging you in
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Please wait while we complete the authentication
          </p>
        </div>

        <div className="flex space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-pink-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AccountVerification;
