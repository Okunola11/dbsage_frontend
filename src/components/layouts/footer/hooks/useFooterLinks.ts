import { useTranslations } from "next-intl";

const useFooterLinks = () => {
  const t = useTranslations("footer");

  return [
    {
      title: t("navigation"),
      links: [
        { route: "home", link: "/" },
        { route: "aboutUs", link: "/" },
        // { route: "career", link: "/career" },
        { route: "features", link: "/" },
        { route: "blog", link: "/" },
        // { route: "status", link: "/status" },
      ],
    },
    {
      title: t("support"),
      links: [
        { route: "helpCenter", link: "/" },
        { route: "faq", link: "/" },
        // { route: "waitingList", link: "/waitlist" },
        // { route: "pricingExperience", link: "/pricing" },
        { route: "contactUs", link: "/" },
      ],
    },
    {
      title: t("legal"),
      links: [
        { route: "privacyPolicy", link: "/" },
        { route: "termsAndConditions", link: "/" },
      ],
    },
  ];
};

export default useFooterLinks;
