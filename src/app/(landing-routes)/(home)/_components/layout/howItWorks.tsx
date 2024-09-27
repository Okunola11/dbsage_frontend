import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { poppins } from "@/app/fonts/fonts";
import DisplayLottie from "@/components/miscellaneous/displayLottie";
import codingPerson from "../../../../../../public/lottie/codingPerson.json";

const HowItWorks = () => {
  const t = useTranslations("howItWorks");

  const keys = ["1", "2", "3", "4", "5"] as const;

  return (
    <div className="max-w-[95%] mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row w-full items-center justify-between">
        <div className="flex-1">
          <DisplayLottie animationData={codingPerson} />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 md:mb-4 text-4xl md:text-5xl small-spacing md:big-spacing">
            {t("title")}
          </h3>
          <p className="text-base mb-4 md:mb-10">{t("subTitle")}</p>
          <ul>
            {keys.map((key, i) => (
              <li key={i} className="flex items-start gap-3 mb-4 w-full">
                <div className="w-6 h-6">
                  <Zap className="text-primary" fill="hsl(210 100% 50%)" />
                </div>
                <p
                  className={`${poppins.className} text-sm flex-grow text-foreground/80`}
                >
                  {t(`messages.${key}`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
