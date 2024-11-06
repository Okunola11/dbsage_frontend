"use client";

import { FC } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "./loadingSpinner";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

interface DisplayLottieProps {
  animationData: unknown;
}

const DisplayLottie: FC<DisplayLottieProps> = ({ animationData }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  return (
    <Lottie
      animationData={defaultOptions.animationData}
      loop={defaultOptions.loop}
    />
  );
};

export default DisplayLottie;
