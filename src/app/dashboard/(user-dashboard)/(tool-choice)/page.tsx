"use client";

import { useCurrentSession } from "@/hooks/useCurrentSession";
import { useTranslations } from "next-intl";
import Link from "next/link";

import Navbar from "@/components/layouts/navbar";
import { poppins } from "@/app/fonts/fonts";

export default function DashboardTools() {
  const { session, status } = useCurrentSession();
  const t = useTranslations("dashboard");

  return (
    <>
      <Navbar />
      <div className="max-w-[80%] mx-auto p-4">
        <div className="text-center">
          <p className="bg-subtle text-black inline-block px-4 py-2 mb-6 rounded-md text-sm md:text-base">
            {t("title")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold leading-none tracking-tight mb-6">
            {t("intro.hi")},{" "}
            <span className={`${poppins.className} uppercase text-primary`}>
              {session?.last_name}
            </span>{" "}
            {t("intro.welcome")}.
          </h2>
          <p className="text-lg md:text-xl mb-10">{t("intro.likeToDo")}</p>
          <div className="relative z-20">
            <div className="hover:bg-neutral-200 hover:dark:bg-slate-800/[0.8] p-2 inline-block rounded-3xl overflow-hidden">
              <Link
                className="border border-[hsl(210% 100% 50%)] hover:border-border rounded-2xl inline-block p-4 bg-background shadow"
                href="/dashboard/sage"
              >
                <div className="relative">
                  <h4 className="dark:text-zinc-100 text-zinc-800 font-bold tracking-wide mt-4">
                    Sage
                  </h4>
                  <p className="mt-8 dark:text-zinc-400 text-zinc-900 tracking-wide leading-relaxed text-sm">
                    {t("talkWithSage")}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
