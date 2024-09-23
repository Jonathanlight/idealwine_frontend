import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-light-svg-icons/faEyeSlash";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { Path, SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { AccountResetPasswordRequestShopResetPasswordUpdate } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopUpdateResetPasswordRequestAccountResetPasswordRequestItem } from "@/networking/sylius-api-client/account-reset-password-request/account-reset-password-request";
import { ConstraintViolationList } from "@/networking/types";
import { passwordPattern } from "@/utils/fieldValidators";
import { useTranslation } from "@/utils/next-utils";
import { isNullOrUndefined } from "@/utils/ts-utils";

import PasswordResetTokenErrorMessageBox from "../PasswordResetTokenErrorMessageBox";
import styles from "./ResetPasswordForm.module.scss";

type ResetPasswordFormProps = {
  onSuccessSubmit: ({ newPassword }: { newPassword: string }) => void;
  usernameToRestorePassword: string;
  emailToRestorePassword: string;
  passwordResetToken: string;
};

const ResetPasswordForm = ({
  onSuccessSubmit,
  passwordResetToken,
  usernameToRestorePassword,
  emailToRestorePassword,
}: ResetPasswordFormProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<AccountResetPasswordRequestShopResetPasswordUpdate>();

  const {
    mutateAsync: patchPassword,
    error,
    isLoading,
  } = useShopUpdateResetPasswordRequestAccountResetPasswordRequestItem<AxiosError>();

  const onSubmit: SubmitHandler<AccountResetPasswordRequestShopResetPasswordUpdate> = async ({
    newPassword,
    confirmNewPassword,
  }) => {
    try {
      if (isNullOrUndefined(newPassword)) return;
      await patchPassword({
        resetPasswordToken: passwordResetToken,
        data: { newPassword, confirmNewPassword },
      });
      onSuccessSubmit({ newPassword });
    } catch (err) {
      if (!isAxiosError(err) || err.response?.status !== 422) return; // a generic error message is displayed
      const { violations } = err.response.data as ConstraintViolationList<
        Path<AccountResetPasswordRequestShopResetPasswordUpdate>
      >;
      violations.forEach(({ propertyPath, message }) => {
        if (propertyPath !== "") setError(propertyPath, { message });
      });
    }
  };

  return (
    <>
      {error && error.response?.status !== 422 ? (
        <>
          <div className={styles.errorMessage}>
            <span>{t("common:common.errorOccurred")}</span>
          </div>
          <PasswordResetTokenErrorMessageBox email={emailToRestorePassword} />
        </>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            aria-label={t("common:login.usernameLabel")}
            value={usernameToRestorePassword}
            disabled
          />

          <Input
            aria-label={t("common:login.emailLabel")}
            type="email"
            value={emailToRestorePassword}
            disabled
          />

          <Input
            aria-label={t("reset-password:newPasswordLabel")}
            type={showPassword ? "text" : "password"}
            error={errors.newPassword?.message}
            placeholder={t("reset-password:newPasswordPlaceholder")}
            {...register("newPassword", {
              required: { value: true, message: t("common:form.requiredField") },
              pattern: {
                value: passwordPattern,
                message: t("common:login.passwordRequirements"),
              },
            })}
            rightIcon={showPassword ? faEyeSlash : faEye}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />

          <Input
            aria-label={t("reset-password:confirmNewPasswordLabel")}
            type={showConfirmPassword ? "text" : "password"}
            error={errors.confirmNewPassword?.message}
            placeholder={t("reset-password:confirmNewPasswordPlaceholder")}
            {...register("confirmNewPassword", {
              required: { value: true, message: t("common:form.requiredField") },
              validate: value =>
                value === getValues("newPassword") || t("common:login.passwordsDontMatch"),
            })}
            rightIcon={showConfirmPassword ? faEyeSlash : faEye}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
          <Button variant="primaryBlack" isLoading={isLoading}>
            {t("common:login.submitForm")}
          </Button>
        </form>
      )}
    </>
  );
};

export default ResetPasswordForm;
