"use client";

import DisplayLottie from "./displayLottie";
import splashAnimation from "../../../public/lottie/splashAnimation.json";
import { redressed } from "@/app/fonts/fonts";

const SplashScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="h-[50vh]">
        <DisplayLottie animationData={splashAnimation} />
      </div>
      <div className="text-4xl">
        <span className="text-gray-700">&lt;</span>
        <span className={`${redressed.className}`}>DBSage</span>
        <span className="text-gray-700">/&gt;</span>
      </div>
    </div>
  );
};

export default SplashScreen;
