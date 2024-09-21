import Link from "next/link";
import { Translation } from "../../login/_components/googleLogin";

const HasAccount = ({ t }: Translation) => {
  return (
    <p className="font-inter text-neutralColor-dark-1 mt-5 text-center text-sm font-normal leading-[15.6px]">
      {t("alreadyHaveAccount")}{" "}
      <Link
        href="/login"
        className="font-inter ms-1 text-left text-base font-bold leading-[19.2px] text-primary hover:text-primary/80"
        data-testid="link"
      >
        Login
      </Link>
    </p>
  );
};

export default HasAccount;