import Link from "next/link";
import { Copyright } from "lucide-react";

import { socialLinks, footerBottomLinks } from "./footerLinks";
import { Translator } from "@/types";

type FooterBottomProps = {
  t: Translator;
};

const FooterBottom: React.FC<FooterBottomProps> = ({ t }) => {
  return (
    <div className="px-4">
      <div className="mx-auto block w-full max-w-[1200px] items-center justify-between pb-[30px] pt-4 md:pt-[27px] lg:flex">
        <div className="hidden lg:block">
          <div className="flex w-full max-w-[116px] items-center justify-between gap-1 md:max-w-[212px]">
            {socialLinks.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-primary p-1 hover:bg-destructive md:h-10 md:w-10"
                >
                  <item.icon className="h-[10px] w-[10px] text-white md:h-4 md:w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        <span className="flex items-center justify-center gap-1 text-center text-xs font-semibold text-stroke-colors-stroke">
          DBSage
          <Copyright className="h-5 w-5 text-stroke-colors-stroke" />
          {t("footerBottom.copyright")}
        </span>

        <div className="hidden lg:block">
          <ul className="flex items-center justify-between gap-[13px]">
            {footerBottomLinks.map((item, index) => {
              return (
                <li key={index}>
                  <Link
                    href={item.link}
                    className="cursor-pointer text-sm text-neutral-dark-2 transition-colors duration-300 hover:text-primary hover:underline"
                  >
                    {t(`footerBottom.${item.route}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
