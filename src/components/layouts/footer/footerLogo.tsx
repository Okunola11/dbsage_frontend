import Image from "next/image";
import React, { SetStateAction } from "react";

import { lora } from "@/app/fonts/fonts";
import { Input } from "@/components/common/input";
import CustomButton from "@/components/common/button/commonButton";
import LoadingSpinner from "@/components/miscellaneous/loadingSpinner";
import { Translator } from "@/types";

export interface FooterLogoProps {
  t: Translator;
  loading: boolean;
  error: boolean;
  email: string;
  setEmail: (value: SetStateAction<string>) => void;
  setError: (value: SetStateAction<boolean>) => void;
  handleSubmit: () => Promise<void>;
}

const FooterLogo: React.FC<FooterLogoProps> = ({
  t,
  loading,
  error,
  email,
  setEmail,
  setError,
  handleSubmit,
}) => {
  return (
    <div className="mb-[100px] max-w-[272px] shrink-0 px-2.5 lg:mb-0 mx-auto sm:mx-0">
      <div className="mb-[47px] flex w-full flex-col items-center justify-center sm:mb-[60px] md:block md:max-w-[254px] lg:max-w-[200px] lg:mb-0">
        <h5 className="text-md mb-[18px] flex items-center gap-2.5 text-center font-bold text-neutral-dark-2 sm:text-left">
          <Image
            src={"/images/logo-big.svg"}
            alt="DBSage"
            width={48}
            height={48}
          />
          <span className={`text-2xl font-semibold ${lora.className}`}>
            DBSage
          </span>
        </h5>

        <p className="text-nuetral-dark-2 text-center text-sm font-medium sm:text-left">
          1101, Lagos Island, Lagos, Nigeria
        </p>
      </div>

      {/* SMALL SCREEN NEWSLETTER */}
      <div className="flex flex-col items-center justify-center md:block lg:hidden">
        <h5 className="text-neurtal-dark-2 text-md mb-4 text-center font-semibold sm:text-left md:mb-[36px]">
          {t("newsletterSignUp")}
        </h5>
        <div className="">
          <div className="item flex h-[46px] w-full items-center justify-start md:max-w-[283px]">
            <div className="flex flex-col gap-0.5">
              <Input
                placeholder="Enter your email"
                className={`border-r-none text-md h-[46px] rounded-r-none border-r-0 border-r-transparent bg-transparent active:border-transparent ${
                  error && "!border-red-500"
                }`}
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                onBlur={() =>
                  email.length === 0 ? setError(true) : setError(false)
                }
              />
            </div>
            <CustomButton
              variant="primary"
              className="h-full transition-all hover:-translate-y-2"
              onClick={handleSubmit}
            >
              {loading ? (
                <LoadingSpinner className="size-4 animate-spin sm:size-5" />
              ) : (
                t("subscribe")
              )}
            </CustomButton>
          </div>
          {error && (
            <small className="mt-0.5 block text-xs text-red-500">
              Please provide your email
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default FooterLogo;
