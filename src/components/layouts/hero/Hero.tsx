import { useTranslations } from "next-intl";

import { poppins } from "@/app/fonts/fonts";
import { Spotlight } from "./spotlight";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <div className="min-h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-background/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden max-w-[95%] sm:max-w-full">
      <Spotlight
        className="left-0 md:left-60 -top-36 md:-top-40"
        fill="hsl(var(--primary))"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-opacity-50">
            {t("headline")} <br />{" "}
            <span className="text-3xl md:text-5xl">{t("subHeadline")}</span>
          </h1>

          <div className="max-w-[300px] md:max-w-[500px] mt-1 md:mt-2">
            <Image
              src="/images/hero/stroke.svg"
              width={497}
              height={34}
              className="h-[50px] w-full"
              alt=""
            />
          </div>

          <p
            className={`${poppins.className} mt-4 font-normal text-base text-foreground max-w-lg text-center`}
          >
            {t("description")}
          </p>

          <div className="mt-9 md:mt-10">
            <Link
              href="/register"
              className="rounded bg-primary px-8 py-4 text-background dark:text-foreground hover:bg-destructive"
              data-testid="get-started"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
