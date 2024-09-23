import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import { useShopCreateResetPasswordRequestAccountResetPasswordRequestCollection } from "@/networking/sylius-api-client/account-reset-password-request/account-reset-password-request";
import { useTranslation } from "@/utils/next-utils";

import ForgotPasswordValidationDialog from "../ForgotPasswordValidationDialog/ForgotPasswordValidationDialog";
import styles from "./PasswordResetTokenErrorMessageBox.module.scss";

type Props = { email: string };

const PasswordResetTokenErrorMessageBox = ({ email }: Props): JSX.Element => {
  const [isPasswordForgotMailValidationModalOpen, setIsPasswordForgotMailValidationModalOpen] =
    useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleClose = async () => {
    await router.push("/");
  };

  const {
    mutateAsync: postEmail,
    error,
    isLoading,
  } = useShopCreateResetPasswordRequestAccountResetPasswordRequestCollection<AxiosError>();

  const handleForgotPasswordClick = async () => {
    try {
      await postEmail({ data: { email } });
      setIsPasswordForgotMailValidationModalOpen(true);
    } catch (err) {
      // an error occured, an error message is displayed
    }
  };

  return (
    <>
      <ForgotPasswordValidationDialog
        open={isPasswordForgotMailValidationModalOpen}
        setOpen={setIsPasswordForgotMailValidationModalOpen}
        onClose={handleClose}
      />
      <div className={styles.errorCauses}>
        <div>
          <p>{t("reset-password:possibleErrorCauses")}</p>
          <ul>
            <li>{t("reset-password:possibleErrorCauseOne")}</li>
            <li>{t("reset-password:possibleErrorCauseTwo")}</li>
          </ul>
          <p>{t("reset-password:resendEmailInstructions", { email })}</p>
          <p>{t("reset-password:contactCustomerService")}</p>
        </div>
        <Button
          type="button"
          variant="primaryBlack"
          onClick={handleForgotPasswordClick}
          isLoading={isLoading}
        >
          {t("reset-password:resendForgotPasswordEmail")}
        </Button>
        <div className={styles.errorMessage}>{error && t("common:common.errorOccurred")}</div>
      </div>
    </>
  );
};

export default PasswordResetTokenErrorMessageBox;
