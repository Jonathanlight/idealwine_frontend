import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-light-svg-icons/faEyeSlash";
import { sendGTMEvent } from "@next/third-parties/google";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { Path, SubmitHandler, useForm } from "react-hook-form";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useShopPostCustomerCollection } from "@/networking/sylius-api-client/customer/customer";
import { ConstraintViolationList } from "@/networking/types";
import { emailPattern, passwordPattern, usernamePattern } from "@/utils/fieldValidators";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SignupForm.module.scss";

type SignupUser = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  referer: string;
  birthday: string;
  acceptGTC: boolean;
  subscribedToNewsletter: boolean;
};

type Props = { onSuccessSubmit: () => void };

const SignupForm = ({ onSuccessSubmit }: Props): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation("common");
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<SignupUser>();

  const {
    mutateAsync: postNewUser,
    error,
    isLoading,
  } = useShopPostCustomerCollection<AxiosError>();

  const onSubmit: SubmitHandler<SignupUser> = async ({
    username,
    email,
    password,
    birthday,
    subscribedToNewsletter,
  }) => {
    try {
      await postNewUser({
        data: {
          username,
          email,
          password,
          birthday,
          subscribedToNewsletter,
        },
      });

      sendGTMEvent({ event: "userRegistered", goalType: "inscription_quick" });
      if (subscribedToNewsletter) {
        sendGTMEvent({ event: "newsletterSubscription", goalType: "inscription_newsletter" });
      }
      onSuccessSubmit();
    } catch (err) {
      if (!isAxiosError(err) || err.response?.status !== 422) return; // a generic error message is displayed

      const { violations } = err.response.data as ConstraintViolationList<Path<SignupUser>>;
      violations.forEach(({ propertyPath, message }) => {
        if (propertyPath !== "") setError(propertyPath, { message });
      });
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.errorMessage}>
        {error && error.response?.status !== 422 && t("common.errorOccurred")}
      </div>

      <Input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        aria-label={t("login.usernameLabel")}
        error={errors.username?.message}
        placeholder={t("login.usernamePlaceholder")}
        message={t("login.usernameMessage")}
        showMessageOnlyOnFocus
        {...register("username", {
          required: { value: true, message: t("form.requiredField") },
          pattern: { value: usernamePattern, message: t("login.usernameRequirements") },
        })}
      />

      <Input
        aria-label={t("login.emailLabel")}
        type="email"
        error={errors.email?.message}
        placeholder={t("login.emailPlaceholder")}
        {...register("email", {
          required: { value: true, message: t("form.requiredField") },
          pattern: { value: emailPattern, message: t("login.emailRequirements") },
        })}
      />

      <Input
        aria-label={t("login.passwordLabel")}
        type={showPassword ? "text" : "password"}
        error={errors.password?.message}
        placeholder={t("login.passwordPlaceholder")}
        {...register("password", {
          required: { value: true, message: t("form.requiredField") },
          pattern: { value: passwordPattern, message: t("login.passwordRequirements") },
        })}
        rightIcon={showPassword ? faEyeSlash : faEye}
        onRightIconClick={() => setShowPassword(!showPassword)}
      />

      <Input
        aria-label={t("login.confirmPasswordLabel")}
        type={showConfirmPassword ? "text" : "password"}
        error={errors.confirmPassword?.message}
        placeholder={t("login.confirmPasswordPlaceholder")}
        {...register("confirmPassword", {
          required: { value: true, message: t("form.requiredField") },
          validate: value => value === getValues("password") || t("login.passwordsDontMatch"),
        })}
        rightIcon={showConfirmPassword ? faEyeSlash : faEye}
        onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <Input
        label={t("login.birthday")}
        type="date"
        max={
          new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            .split("T")[0]
        }
        min={"1900-01-01"}
        error={errors.birthday?.message}
        {...register("birthday", {
          required: { value: true, message: t("form.requiredField") },
          validate: value => {
            // verify that user is at least 18 years old and born after 1900
            const birthday = new Date(value);
            const year = birthday.getFullYear();

            const ageDiffMs = new Date().getTime() - birthday.getTime();
            const ageDate = new Date(ageDiffMs); // miliseconds from epoch

            const isAValidDate = ageDate.getUTCFullYear() - 1970 >= 18 && year >= 1900;

            return isAValidDate || t("login.ageNotValid");
          },
        })}
      />

      <Input
        label={t("login.acceptGTC")}
        type="checkbox"
        error={errors.acceptGTC?.message}
        placeholder={t("login.acceptGTC")}
        {...register("acceptGTC", {
          required: { value: true, message: t("login.acceptGTCRequired") },
        })}
      />

      <Input
        label={t("login.subscribeToNewsletter")}
        type="checkbox"
        placeholder={t("login.subscribedToNewsletter")}
        {...register("subscribedToNewsletter")}
      />

      <Button variant="primaryBlack" isLoading={isLoading}>
        {t("login.submitForm")}
      </Button>
    </form>
  );
};

export default SignupForm;
