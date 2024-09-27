import Link from "next/link";

import { Input } from "@/components/common/input";
import CustomButton from "@/components/common/button/commonButton";
import LoadingSpinner from "@/components/miscellaneous/loadingSpinner";

import { socialLinks } from "./footerLinks";
import { FooterLogoProps } from "./footerLogo";
import useFooterLinks from "./hooks/useFooterLinks";

interface FooterNavProps extends FooterLogoProps {}

const FooterNav: React.FC<FooterNavProps> = ({
  t,
  error,
  email,
  setEmail,
  setError,
  loading,
  handleSubmit,
}) => {
  const footerLinks = useFooterLinks();

  return (
    <div className="grid grid-cols-2 gap-x-1 gap-y-[60px] md:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {footerLinks.map((item, index) => {
        return (
          <div key={index}>
            <h5 className="text-neurtal-dark-2 mb-[37px] text-[16px] font-semibold">
              {item.title}
            </h5>
            <ul className="flex flex-col gap-4">
              {item.links.map((item, index) => {
                return (
                  <li key={index}>
                    <Link
                      href={item.link}
                      className="text-md cursor-pointer text-neutral-dark-2 transition-colors duration-300 hover:text-primary hover:underline dark:text-white"
                    >
                      {t(`links.${item.route}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* LARGE SCREEN NEWSLETTER */}
      <div className="hidden lg:block">
        <h5 className="text-neurtal-dark-2 text-md mb-4 font-semibold md:mb-[36px]">
          {t("newsletterSignUp")}
        </h5>

        <div className="">
          <div className="item flex h-[46px] w-full max-w-[283px] items-center justify-start">
            <Input
              className={`border-r-none h-[46px] rounded-r-none border-r-0 border-r-transparent bg-transparent active:border-transparent ${
                error && "!border-red-500"
              }`}
              placeholder="Enter your email"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              onBlur={() =>
                email.length === 0 ? setError(true) : setError(false)
              }
            />
            <CustomButton
              variant="primary"
              className="h-full transition-all hover:-translate-y-1 hover:bg-destructive"
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

      {/* SMALL SCREENS SOCIAL LINKS */}
      <div className="lg:hidden">
        <h5 className="text-neurtal-dark-2 mb-[10px] text-[20px] font-semibold">
          {t("followUs")}
        </h5>
        <div className="flex w-full max-w-[116px] items-center justify-between gap-1 md:max-w-[212px]">
          {socialLinks.map((item, index) => {
            return (
              <div
                key={index}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-primary p-1 hover:bg-default md:h-10 md:w-10"
              >
                <item.icon className="h-[10px] w-[10px] text-white md:h-4 md:w-4" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FooterNav;
