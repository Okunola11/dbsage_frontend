import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { LoginProps } from "./googleLogin";

const TermsOfService: React.FC<LoginProps> = ({ t }) => {
  return (
    <p className="mt-2 text-center text-xs text-gray-500">
      <ShieldCheck className="mr-1 hidden h-4 w-4 text-gray-400 sm:inline-block" />
      {t("agree")}{" "}
      <Link
        target="_blank"
        href="/terms-and-conditions"
        className="text-sm font-bold text-primary hover:text-primary/80"
      >
        {t("termsOfService")}
      </Link>{" "}
      {t("and")}{" "}
      <Link
        target="_blank"
        href="/privacy-policy"
        className="text-sm font-bold text-primary hover:text-primary/80"
      >
        {t("privacyPolicy")}
      </Link>
    </p>
  );
};

export default TermsOfService;
