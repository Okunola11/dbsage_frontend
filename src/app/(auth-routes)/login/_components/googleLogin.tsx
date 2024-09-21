import { signIn } from "next-auth/react";

import { googleIcon } from "./icon";
import CustomButton from "@/components/common/button/commonButton";

export type Translation = {
  t: any;
};

const GoogleLogin = ({ t }: Translation) => {
  return (
    <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
      <CustomButton
        variant="outline"
        isLeftIconVisible={true}
        onClick={() => signIn("google", { callbackUrl: "/" })}
        icon={googleIcon}
      >
        {t("continueWithGoogle")}
      </CustomButton>
    </div>
  );
};

export default GoogleLogin;
