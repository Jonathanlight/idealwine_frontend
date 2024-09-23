import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-light-svg-icons/faEyeSlash";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useAccessToken } from "@/hooks/useAccessToken";
import { usePostCredentials } from "@/networking/mutator/axios-hooks";
import {
  ShopPasswordUpdateCustomerItemMutationBody,
  useShopPasswordUpdateCustomerItem,
} from "@/networking/sylius-api-client/customer/customer";
import { ConstraintViolationList } from "@/networking/types";
import { passwordPattern } from "@/utils/fieldValidators";
import { useTranslation } from "@/utils/next-utils";

import styles from "./ModifyPasswordForm.module.scss";

const ModifyPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ShopPasswordUpdateCustomerItemMutationBody>();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { t } = useTranslation();

  const { user } = useAuthenticatedUserContext();
  const { mutateAsync: putNewPassword, isLoading: isLoadingPutPassword } =
    useShopPasswordUpdateCustomerItem();

  const { mutateAsync: postCredentials, isLoading: isLoadingPostCredentials } =
    usePostCredentials<AxiosError>();

  const { setAccessToken } = useAccessToken();

  const isLoading = isLoadingPutPassword || isLoadingPostCredentials;

  const onSubmit: SubmitHandler<ShopPasswordUpdateCustomerItemMutationBody> = async data => {
    try {
      await putNewPassword({ id: user?.customerId ?? "", data });

      const { token } = await postCredentials({
        data: { email: user?.email, password: data.newPassword ?? undefined },
      });
      if (token !== undefined) setAccessToken(token);

      toast.success<string>(t("accueil-profil:password_has_been_modified"));
    } catch (err) {
      if (!isAxiosError(err) || err.response?.status !== 422) {
        toast.error<string>(t("accueil-profil:error_occurred"));

        return;
      }

      const { violations } = err.response.data as ConstraintViolationList<
        Path<ShopPasswordUpdateCustomerItemMutationBody>
      >;
      violations.forEach(({ propertyPath, message }) => {
        if (propertyPath !== "") setError(propertyPath, { message });
      });
    }
  };

  return (
    <div id="changeMyPassword" className={styles.bigCard}>
      <hgroup>
        <h1>{t("accueil-profil:modifyMyPassword")}</h1>
        <hr />
        <p>{t("common:login.passwordRequirements")}</p>
      </hgroup>

      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={t("common:login.passwordLabel")}
          type={showCurrentPassword ? "text" : "password"}
          showRequiredStar
          error={errors.currentPassword?.message}
          placeholder={t("common:login.passwordPlaceholder")}
          {...register("currentPassword", {
            required: { value: true, message: t("common:form.requiredField") },
          })}
          rightIcon={showCurrentPassword ? faEyeSlash : faEye}
          onRightIconClick={() => setShowCurrentPassword(!showCurrentPassword)}
        />
        <Input
          label={t("common:login.newPasswordLabel")}
          type={showNewPassword ? "text" : "password"}
          showRequiredStar
          error={errors.newPassword?.message}
          placeholder={t("common:login.newPasswordPlaceholder")}
          {...register("newPassword", {
            required: { value: true, message: t("common:form.requiredField") },
            pattern: {
              value: passwordPattern,
              message: t("common:login.passwordRequirements"),
            },
          })}
          rightIcon={showNewPassword ? faEyeSlash : faEye}
          onRightIconClick={() => setShowNewPassword(!showNewPassword)}
        />

        <Input
          label={t("common:login.confirmPasswordLabel")}
          type={showConfirmPassword ? "text" : "password"}
          showRequiredStar
          error={errors.confirmNewPassword?.message}
          placeholder={t("common:login.confirmPasswordPlaceholder")}
          {...register("confirmNewPassword", {
            required: { value: true, message: t("common:form.requiredField") },
            pattern: {
              value: passwordPattern,
              message: t("common:login.passwordRequirements"),
            },
          })}
          rightIcon={showConfirmPassword ? faEyeSlash : faEye}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <Button className={styles.buttonSubmit} variant="primaryBlack" isLoading={isLoading}>
          {t("common:common.submitForm")}
        </Button>
      </form>
    </div>
  );
};

export default ModifyPasswordForm;
