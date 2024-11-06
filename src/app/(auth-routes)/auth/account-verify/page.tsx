"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { verifyAccount } from "@/actions/userAccount";

const AccountVerification = () => {
  const verificationAttemptedRef = useRef(false);
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verifyUserAccount = async () => {
      if (verificationAttemptedRef.current) return;

      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setVerificationStatus("failed");
        setError("Invalid verification link");
        return;
      }

      verificationAttemptedRef.current = true;

      try {
        const response = await verifyAccount({ email, token });

        if (response.success) {
          setVerificationStatus("success");

          toast({
            title: "Account Verified Successfully!",
            description: "Redirecting you to login...",
            duration: 3000,
          });

          // Redirect to login page after 3 seconds
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        } else {
          setVerificationStatus("failed");
          setError(response.message || "An error occurred during verification");

          toast({
            variant: "destructive",
            title: "Verification Failed",
            description:
              response.message || "An error occurred during verification",
          });
        }
      } catch (err) {
        setVerificationStatus("failed");
        setError(
          (err as Error).message || "An error occurred during verification"
        );

        toast({
          variant: "destructive",
          title: "Verification Failed",
          description:
            (err as Error).message || "An error occurred during verification",
        });
      }
    };

    verifyUserAccount();
  }, [searchParams, router, toast]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <h2 className="text-lg font-semibold mb-2">
              Verifying Your Account
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your account...
            </p>
          </div>
        );
      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-500" />
            <h2 className="text-lg font-semibold mb-2 text-green-700">
              Account Verified Successfully!
            </h2>
            <p className="text-gray-600">Your account has been verified.</p>
            <p className="text-gray-600">
              Redirecting you to the login page...
            </p>
          </div>
        );
      case "failed":
        return (
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-lg font-semibold mb-2 text-red-700">
              Verification Failed
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        );
      default:
        // eslint-disable-next-line unicorn/no-null
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Account Verification</CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default AccountVerification;
