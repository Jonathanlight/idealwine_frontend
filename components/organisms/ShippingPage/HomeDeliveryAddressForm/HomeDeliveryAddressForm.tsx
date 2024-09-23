import { useEffect, useState } from "react";
import { Control, FieldErrorsImpl, UseFormRegister } from "react-hook-form";

import Input from "@/components/atoms/Input/Input";
import Select from "@/components/atoms/Select/SelectRHF";
import ShippingMethodButton from "@/components/molecules/ShippingMethodButton/ShippingMethodButton";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import {
  ProvinceJsonldShopCountryRead,
  ShippingMethodJsonldShopShippingMethodRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";

import { FormType } from "../constants";
import styles from "./HomeDeliveryAddressForm.module.scss";

type HomeDeliveryAddressFormProps = {
  register: UseFormRegister<FormType>;
  control: Control<FormType>;
  errors: FieldErrorsImpl<FormType>;
  availableMethodsList: ShippingMethodJsonldShopShippingMethodRead[];
  selectedMethod: string;
  onShippingMethodChange: (newShippingMethod: string) => void;
  currentCountryCode: string;
};

const HomeDeliveryAddressForm = ({
  register,
  control,
  errors,
  availableMethodsList,
  selectedMethod,
  onShippingMethodChange,
  currentCountryCode,
}: HomeDeliveryAddressFormProps) => {
  const { t } = useTranslation();
  const { data: enabledCountries } = useShopGetCountryCollection(
    { enabled: true },
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const { cart } = useAuthenticatedUserContext();
  const shippingAddressCountryCode = cart?.shippingAddress?.countryCode;

  const [shippingAddressProvinces, setShippingAddressProvinces] = useState<
    ProvinceJsonldShopCountryRead[]
  >([]);

  useEffect(() => {
    setShippingAddressProvinces(
      enabledCountries?.find(country => country.code === (shippingAddressCountryCode ?? "FR"))
        ?.provinces ?? [],
    );
  }, [enabledCountries, shippingAddressCountryCode]);

  return (
    <>
      <div className={styles.formContainer}>
        <div className={styles.disclaimerText}>{t("livraison:disclaimer")}</div>

        <div className={styles.manyInputs}>
          <Input
            label={t("common:common.lastName")}
            type="text"
            error={errors.shippingAddress?.lastName?.message}
            showRequiredStar
            placeholder={t("common:common.lastName")}
            {...register("shippingAddress.lastName", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.firstName")}
            type="text"
            error={errors.shippingAddress?.firstName?.message}
            showRequiredStar
            placeholder={t("common:common.firstName")}
            {...register("shippingAddress.firstName", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.company")}
            error={errors.shippingAddress?.company?.message}
            placeholder={t("common:common.company")}
            {...register("shippingAddress.company", {
              required: { value: false, message: t("common:form.requiredField") },
            })}
          />
        </div>
        <Input
          label={t("common:common.addressLabel")}
          showRequiredStar
          error={errors.shippingAddress?.street?.message}
          placeholder={t("common:common.addressLabel")}
          {...register("shippingAddress.street", {
            required: { value: true, message: t("common:form.requiredField") },
          })}
        />
        <Input
          label={t("common:common.additionalInformations")}
          type="text"
          placeholder={t("common:common.additionalInformationsPlaceholder")}
          {...register("shippingAddress.additionalInformations")}
        />
        <div className={styles.manyInputs}>
          <Input
            label={t("common:common.postalCode")}
            error={errors.shippingAddress?.postcode?.message}
            showRequiredStar
            placeholder={t("common:common.postalCode")}
            {...register("shippingAddress.postcode", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.city")}
            error={errors.shippingAddress?.city?.message}
            showRequiredStar
            placeholder={t("common:common.city")}
            {...register("shippingAddress.city", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
        </div>
        <div className={styles.manyInputs}>
          <Input
            label={t("common:common.phone")}
            showRequiredStar
            error={errors.shippingAddress?.phoneNumber?.message}
            placeholder={t("common:common.phone")}
            {...register("shippingAddress.phoneNumber", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.deliveryComments")}
            type="text"
            placeholder={t("common:common.deliveryCommentsPlaceholder")}
            {...register("shippingAddress.deliveryComments")}
          />
        </div>
        <div className={styles.manyInputs}>
          <Select
            control={control}
            className={styles.expandDropdown}
            label={t("common:common.country")}
            disabled
            {...register("shippingAddress.countryCodeDisplay")}
            defaultValue={currentCountryCode}
            options={{
              groups: [
                {
                  key: t("common:common.country"),
                  title: t("common:common.country"),
                  options: (enabledCountries ?? [])
                    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                    .map(country => ({ value: country.code, label: country.name ?? "" })),
                },
              ],
            }}
          />
          <Select
            control={control}
            className={styles.expandDropdown}
            error={errors.shippingAddress?.provinceCode?.message}
            label={t("common:common.state")}
            showRequiredStar={shippingAddressProvinces.length > 0}
            disabled={shippingAddressProvinces.length === 0}
            {...register("shippingAddress.provinceCode", {
              required: {
                value: shippingAddressProvinces.length > 0,
                message: t("common:form.requiredField"),
              },
            })}
            placeholder={shippingAddressProvinces.length > 0 ? t("common:common.state") : undefined}
            options={{
              groups: [
                {
                  key: t("common:common.state"),
                  title: t("common:common.state"),
                  options: shippingAddressProvinces.map(province => ({
                    value: province.code,
                    label: province.name,
                  })),
                },
              ],
            }}
          />
        </div>
      </div>
      <div className={styles.choice}>
        {availableMethodsList.map(shippingMethod => (
          <ShippingMethodButton
            key={shippingMethod.id}
            changeShippingMethod={() => onShippingMethodChange(shippingMethod.code)}
            name={shippingMethod.name}
            code={shippingMethod.code}
            description={shippingMethod.description}
            isSelected={selectedMethod === shippingMethod.code}
          />
        ))}
      </div>
    </>
  );
};

export default HomeDeliveryAddressForm;
