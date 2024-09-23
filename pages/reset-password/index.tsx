import { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

import Button from "@/components/atoms/Button/Button";
import ResetPasswordForm from "@/components/organisms/ResetPasswordForm";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useAccessToken } from "@/hooks/useAccessToken";
import { usePostCredentials } from "@/networking/mutator/axios-hooks";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const Page = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const query = router.query;

  const passwordResetToken = query.passwordResetToken as string;
  const email = query.email as string;
  const username = query.username as string;
  const [password, setPassword] = useState<string>();

  const { setEmailToBeValidated, setIsResendMailValidationModalOpen } =
    useAuthenticatedUserContext();

  const { mutateAsync: postCredentials, error, isLoading } = usePostCredentials<AxiosError>();
  const { setAccessToken } = useAccessToken();
  const onLoginClick = async () => {
    try {
      const { token } = await postCredentials({ data: { email, password } });
      if (token !== undefined) setAccessToken(token);
      await router.push("/");
    } catch (err) {
      if (!isAxiosError<{ message: string }>(err)) return; // an error occured, an error message is displayed

      if (err.response?.data.message === "User account is disabled.") {
        setEmailToBeValidated(email);
        setIsResendMailValidationModalOpen(true);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        {password === undefined ? (
          <>
            <h1>{t("reset-password:resetPasswordTitle")}</h1>
            <ResetPasswordForm
              emailToRestorePassword={email}
              usernameToRestorePassword={username}
              passwordResetToken={passwordResetToken}
              onSuccessSubmit={({ newPassword }) => {
                setPassword(newPassword);
              }}
            />
          </>
        ) : (
          <>
            <h1>{t("reset-password:newPasswordChangedSuccesfullyTitle")}</h1>
            <p>{t("reset-password:newPasswordChangedSuccesfullyDescription")}</p>
            <Button variant="primaryBlack" onClick={onLoginClick} isLoading={isLoading}>
              {t("reset-password:login")}
            </Button>
          </>
        )}
        <div className={styles.errorMessage}>
          {error && <span> {t("common:common.errorOccurred")} </span>}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
