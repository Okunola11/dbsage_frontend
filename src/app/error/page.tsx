"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layouts/navbar";

enum ErrorType {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  CredentialsSignin = "CredentialsSignin",
}

const errorMap: Record<string, string> = {
  [ErrorType.Configuration]:
    "There was a problem when trying to authenticate. Please contact us if this error persists.",
  [ErrorType.AccessDenied]: "Access was denied.",
  [ErrorType.CredentialsSignin]: "Invalid credentials.",
};

export default function AuthErrorPage() {
  const search = useSearchParams();
  // const router = useRouter();
  const error = search.get("error");

  // Handle the redirect to login with preserved error
  // const handleReturn = () => {
  //   router.push(`/login?authError=${error}`);
  // };

  return (
    <>
      <Navbar />

      <div className="flex h-screen w-full flex-col items-center justify-center">
        <button
          // onClick={handleReturn}
          className="block max-w-xs md:max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Something went wrong
          </h5>
          <div className="font-normal text-gray-700 dark:text-gray-400">
            {error
              ? errorMap[error]
              : "Please contact us if this error persists."}
          </div>
        </button>
      </div>
    </>
  );
}
