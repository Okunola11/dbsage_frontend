"use client";

import { Component, ReactNode, Suspense } from "react";
import Lottie from "lottie-react";
import LoadingSpinner from "./loadingSpinner";

interface DisplayLottieProps {
  animationData: unknown;
}

export default class DisplayLottie extends Component<DisplayLottieProps> {
  render(): ReactNode {
    const { animationData } = this.props;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
    };

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Lottie
          animationData={defaultOptions.animationData}
          loop={defaultOptions.loop}
        />
      </Suspense>
    );
  }
}
