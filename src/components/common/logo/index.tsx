import Image from "next/image";
import Link from "next/link";
import { lora } from "@/app/fonts/fonts";

const Logo = () => {
  return (
    <>
      <Link
        className="md:flex gap-2 min-w-[80px] md:min-w-[120px] lg:min-w-[150px] items-center justify-center hidden"
        href={"/"}
      >
        <Image
          src={"/images/logo-small.svg"}
          alt="DBSage"
          width={48}
          height={48}
        />
        <div
          className={`${lora.className} text-2xl font-[600] text-foreground`}
        >
          DBSage
        </div>
      </Link>
      <Link
        className="flex md:hidden gap-1 items-center justify-center"
        href={"/"}
      >
        <Image
          src={"/images/logo-big.svg"}
          alt="DBSage"
          width={32}
          height={32}
        />
        <div
          className={`${lora.className} text-xl font-[600] text-[#0A0A0A] dark:text-foreground`}
        >
          DBSage
        </div>
      </Link>
    </>
  );
};

export default Logo;
