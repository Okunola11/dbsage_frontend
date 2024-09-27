import { useTranslations } from "next-intl";

const useFooterLinks = () => {
  const t = useTranslations("footer");

  return [
    {
      title: t("navigation"),
      links: [
        { route: "home", link: "/" },
        { route: "aboutUs", link: "/about-us" },
        // { route: "career", link: "/career" },
        { route: "features", link: "/" },
        { route: "blog", link: "/blog" },
        // { route: "status", link: "/status" },
      ],
    },
    {
      title: t("support"),
      links: [
        { route: "helpCenter", link: "/help-center" },
        { route: "faq", link: "/faqs" },
        // { route: "waitingList", link: "/waitlist" },
        // { route: "pricingExperience", link: "/pricing" },
        { route: "contactUs", link: "/contact-us" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { route: "privacyPolicy", link: "/privacy-policy" },
        { route: "termsAndConditions", link: "/terms-and-conditions" },
      ],
    },
  ];
};

export default useFooterLinks;
