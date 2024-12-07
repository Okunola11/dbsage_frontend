import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

const UnderDevelopment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-background dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8 text-center space-y-6 transition-colors duration-200">
        <div className="flex justify-center">
          <Construction className="w-16 h-16 text-indigo-500 dark:text-indigo-400 animate-bounce" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Under Development
          </h1>

          <p className="text-gray-600 dark:text-gray-300">
            We're working hard to bring you something amazing! This page is
            currently under construction and will be available soon.
          </p>

          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full w-3/4 animate-pulse" />
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default UnderDevelopment;
