import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { AccountResetPasswordRequestRequestResetPasswordTokenJsonldShopResetPasswordCreate } from "@/networking/sylius-api-client/.ts.schemas";
import { useShopCreateResetPasswordRequestAccountResetPasswordRequestCollection } from "@/networking/sylius-api-client/account-reset-password-request/account-reset-password-request";
import { emailPattern } from "@/utils/fieldValidators";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ForgotPasswordForm.module.scss";

type Props = { onSuccessSubmit: () => void };

const ForgotPasswordForm = ({ onSuccessSubmit }: Props): JSX.Element => {
  const { t } = useTranslation("common");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountResetPasswordRequestRequestResetPasswordTokenJsonldShopResetPasswordCreate>();

  const {
    mutateAsync: postEmail,
    error,
    isLoading,
  } = useShopCreateResetPasswordRequestAccountResetPasswordRequestCollection<AxiosError>();

  const onSubmit: SubmitHandler<
    AccountResetPasswordRequestRequestResetPasswordTokenJsonldShopResetPasswordCreate
  > = async data => {
    try {
      await postEmail({ data });
      onSuccessSubmit();
    } catch (err) {
      // an error occured, an error message is displayed
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.errorMessage}>
        {error?.response?.status === 401
          ? t("login.wrongCredentials")
          : error && t("common.errorOccurred")}
      </div>
      <Input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        aria-label={t("login.emailLabel")}
        type="email"
        error={errors.email?.message}
        placeholder={t("login.emailLabel")}
        {...register("email", {
          required: { value: true, message: t("form.requiredField") },
          pattern: { value: emailPattern, message: t("login.emailRequirements") },
        })}
      />
      <Button variant="primaryBlack" isLoading={isLoading}>
        {t("login.submitForm")}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
