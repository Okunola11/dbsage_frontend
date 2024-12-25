import { googleIcon } from "./icon";
import CustomButton from "@/components/common/button/commonButton";
import { apiUrl } from "@/utils/settings.env";
import { Translator } from "@/types";

export type LoginProps = {
  t: Translator;
};

const GoogleLogin: React.FC<LoginProps> = ({ t }) => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${apiUrl}/api/v1/auth/google`;
  };

  return (
    <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
      <CustomButton
        variant="outline"
        isLeftIconVisible={true}
        onClick={handleGoogleLogin}
        icon={googleIcon}
      >
        {t("continueWithGoogle")}
      </CustomButton>
    </div>
  );
};

export default GoogleLogin;
