"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import useVersionSync from "@/actions/useVersionSync";
import UserCard from "@/components/card/userCard";
import Logo from "@/components/common/logo";
import LanguageSwitcher from "@/components/languageSwitcher/languageSwitcher";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./links";
import MobileNav from "./mobile-navbar";
import PreferenceButton from "./preference-button";
import { useCurrentSession } from "@/hooks/useCurrentSession";

const Navbar = () => {
  const [scrolling, setIsScrolling] = useState<boolean>(false);
  const { status } = useCurrentSession();
  const pathname = usePathname();
  const t = useTranslations();

  const version = "v1.0";
  useVersionSync(version);

  const handleScrollEvent = () => {
    if (window.scrollY > 1) {
      setIsScrolling(true);
    } else {
      setIsScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollEvent);

    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  });

  return (
    <nav
      className={`${
        scrolling ? "shadow-md" : "shadow-none"
      } sticky left-0 right-0 top-0 z-40 bg-background`}
    >
      <div
        className={cn(
          `relative mx-auto flex w-full items-center px-4 lg:px-8 md:gap-x-4 transition-all duration-500 justify-between`,
          scrolling ? "py-2" : "py-4 md:py-6",
          status === "authenticated" && "justify-between md:justify-between"
        )}
      >
        <div className="flex items-center justify-center gap-4">
          <MobileNav />
          <Logo />
        </div>

        <div className="hidden w-full items-center justify-center gap-x-4 md:flex lg:gap-x-6">
          {NAV_LINKS.map((item, index) => {
            return (
              <Link
                key={index}
                href={item.link}
                className={`p-3 text-[16px] font-medium transition-all duration-300 hover:text-primary ${
                  pathname === item.link ? "text-primary" : ""
                }`}
              >
                {t(`${item.route}`)}
              </Link>
            );
          })}
        </div>

        <LanguageSwitcher className="block" />

        {status !== "authenticated" && (
          <div className="w-fullx hidden items-center justify-end gap-x-4 justify-self-end md:flex lg:gap-x-8">
            <Link
              href="/login"
              className="grid h-[44px] place-items-center whitespace-nowrap rounded-md border border-primary px-4 text-primary hover:bg-accent lg:px-8"
            >
              {t("navbar.login")}
            </Link>
            <Link
              href="/register"
              className="grid h-[44px] place-items-center whitespace-nowrap rounded-md bg-primary px-4 text-white hover:bg-primary/80 lg:px-8"
            >
              {t("navbar.register")}
            </Link>
          </div>
        )}

        <PreferenceButton />

        {status === "authenticated" && <UserCard />}
      </div>
    </nav>
  );
};

export default Navbar;
