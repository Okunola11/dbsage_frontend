"use client";

import Image from "next/image";
import { poppins } from "@/app/fonts/fonts";

import { Button } from "../ui/button";

interface Props {
  flagPath: string;
  selectedLanguage: string;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const FlagButton = ({ selectedLanguage, flagPath, onClick }: Props) => {
  return (
    <Button variant={"ghost"} className="px-1 md:p-5" onClick={onClick}>
      <Image
        src={flagPath}
        alt=""
        width={30}
        height={18}
        className="hidden md:block"
      />
      <Image
        src={flagPath}
        alt=""
        width={20}
        height={15}
        className="block md:hidden"
      />
      <div
        className={`${poppins.className} ml-2 text-base md:text-lg uppercase text-primary`}
      >
        {selectedLanguage}
      </div>
    </Button>
  );
};

export default FlagButton;
