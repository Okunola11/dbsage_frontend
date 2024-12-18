import type { Metadata } from "next";
import "./globals.css";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { inter } from "./fonts/fonts";

export const metadata: Metadata = {
  title: "DBSage",
  description: "Talk with database",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <div className="mx-auto h-full w-full max-w-[1920px]">
          <Providers />
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
