import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-light-svg-icons/faEyeSlash";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useAccessToken } from "@/hooks/useAccessToken";
import { usePostCredentials } from "@/networking/mutator/axios-hooks";
import { ShopUserCredentials } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./LoginForm.module.scss";

type Props = {
  onSuccessSubmit: () => void;
  setLoginModalOpen?: (open: boolean) => void;
};

const LoginForm = ({ onSuccessSubmit, setLoginModalOpen }: Props): JSX.Element => {
  const { t } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopUserCredentials>();

  const {
    setIsForgotPasswordModalOpen,
    setIsSignupModalOpen,
    setIsResendMailValidationModalOpen,
    setEmailToBeValidated,
  } = useAuthenticatedUserContext();

  const handleSignupClick = () => {
    setLoginModalOpen?.(false);
    setIsSignupModalOpen(true);
  };

  const handleForgotPasswordClick = () => {
    setLoginModalOpen?.(false);
    setIsForgotPasswordModalOpen(true);
  };

  const { mutateAsync: postCredentials, error, isLoading } = usePostCredentials<AxiosError>();
  const { setAccessToken } = useAccessToken();

  const onSubmit: SubmitHandler<ShopUserCredentials> = async data => {
    try {
      const { token } = await postCredentials({ data });
      if (token !== undefined) setAccessToken(token);
      onSuccessSubmit();
    } catch (err) {
      if (!isAxiosError<{ message: string }>(err)) return; // an error occured, an error message is displayed

      if (err.response?.data.message === "User account is disabled.") {
        setLoginModalOpen?.(false);
        setEmailToBeValidated(data.email ?? "");
        setIsResendMailValidationModalOpen(true);
      }
    }
  };

  return (
    <>
      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.errorMessage}>
          {error?.response?.status === 401
            ? t("login.wrongCredentials")
            : error && t("common.errorOccurred")}
        </div>
        <Input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          aria-label={t("login.usernameOrEmailLabel")}
          error={errors.email?.message}
          placeholder={t("login.usernameOrEmailPlaceholder")}
          {...register("email", { required: { value: true, message: t("form.requiredField") } })}
        />
        <Input
          aria-label={t("login.passwordLabel")}
          type={showPassword ? "text" : "password"}
          error={errors.password?.message}
          placeholder={t("login.passwordPlaceholder")}
          rightIcon={showPassword ? faEyeSlash : faEye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          {...register("password", { required: { value: true, message: t("form.requiredField") } })}
        />
        <Button variant="primaryBlack" isLoading={isLoading}>
          {t("login.submitForm")}
        </Button>
      </form>

      <div className={styles.signupContainer}>
        <Button
          variant="inline"
          onClick={handleForgotPasswordClick}
          className={styles.forgotPasswordButton}
        >
          {t("login.forgotPassword")}
        </Button>
        <br />
        {t("login.newToiDealwine")}{" "}
        <Button variant="inline" onClick={handleSignupClick}>
          {t("login.signUp")}
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
