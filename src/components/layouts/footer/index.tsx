"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

import FooterLogo from "./footerLogo";
import FooterNav from "./footerNav";
import FooterBottom from "./footerBottom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const t = useTranslations("footer");

  const locale = localStorage.getItem("preferredLanguage");
  const toastDesc =
    locale === "fr"
      ? "Veuillez fournir votre e-mail"
      : locale === "es"
      ? "Por favor, proporcione su correo electrónico"
      : "Please provide a valid email";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (email: string): boolean => emailRegex.test(email);

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setError(true);

      toast({
        title: "Error",
        description: toastDesc,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    toast({
      title: "Thank you for subscribing!",
      description:
        "You've successfully joined our newsletter. We're excited to keep you updated with our latest news and offers!",
      variant: "default",
    });
  };

  return (
    <footer>
      <div className="px-4">
        <div className="mx-auto w-full max-w-[95%] md:max-w-[98%] items-start justify-between gap-[60px] pb-[130px] pt-[28px] sm:grid-cols-2 md:gap-4 md:pb-[46px] md:pt-[72px] lg:flex">
          <FooterLogo
            t={t}
            loading={loading}
            error={error}
            email={email}
            setEmail={setEmail}
            setError={setError}
            handleSubmit={handleSubmit}
          />

          <FooterNav
            t={t}
            loading={loading}
            error={error}
            email={email}
            setEmail={setEmail}
            setError={setError}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      <div className="h-[1px] w-full bg-foreground"></div>

      <FooterBottom t={t} />

      <Toaster />
    </footer>
  );
};

export default Footer;
