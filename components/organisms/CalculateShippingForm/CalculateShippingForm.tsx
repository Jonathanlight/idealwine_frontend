import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select/SelectRHF";
import Price from "@/components/molecules/Price";
import ShippingOptimizationDisclaimer from "@/components/molecules/ShippingOptimizationDisclaimer";
import { useCountryShippingMethods } from "@/hooks/useCountryShippingMethods";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import { ShippingMethodRead } from "@/types/ShippingMethods";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { calculateShippingFees } from "@/utils/shippingFees";

import styles from "./CalculateShippingForm.module.scss";

type FormInput = {
  country: string;
  bottles: number;
  magnums: number;
  others: number;
};

type Props = {
  onCountryChange: (countryCode: string) => void;
};

type MethodAndPrice = {
  method: ShippingMethodRead;
  price: number;
};

const CalculateShippingForm = ({ onCountryChange }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    country: "",
    bottles: 0,
    magnums: 0,
    others: 0,
  });
  const { data: enabledCountries } = useShopGetCountryCollection(
    { enabled: true },
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const { availableMethods } = useCountryShippingMethods(formData.country);
  // Calculate price for each method
  const methodsAndPrices: MethodAndPrice[] = [];
  availableMethods.map(method => {
    const price = calculateShippingFees(
      formData.bottles,
      formData.magnums,
      formData.others,
      method.configuration.slice,
      method.configuration.slice1,
    );
    methodsAndPrices.push({ method, price });
  });

  const isFormValid =
    formData.country !== "" && formData.bottles + formData.magnums + formData.others > 0;

  const {
    register,
    formState: { errors },
    control,
    trigger,
    watch,
  } = useForm<FormInput>();

  useEffect(() => {
    const subscription = watch(value => {
      void trigger();
      void setFormData({
        country: value.country ?? "",
        bottles: Number(value.bottles),
        magnums: Number(value.magnums),
        others: Number(value.others),
      });
      onCountryChange(value.country ?? "");
    });

    return () => subscription.unsubscribe();
  }, [trigger, watch, onCountryChange]);

  return (
    <div>
      <div className={styles.shippingOptimizationDisclaimer}>
        {isFormValid && (
          <ShippingOptimizationDisclaimer paymentMethod={availableMethods[0]} {...formData} />
        )}
      </div>
      <form className={styles.form}>
        <Select
          label={t("garanties-idealwine:inputs.country.label")}
          control={control}
          className={styles.countrySelect}
          error={errors.country?.message}
          {...register("country")}
          placeholder={t("garanties-idealwine:inputs.country.placeholder")}
          options={{
            groups: [
              {
                key: t("garanties-idealwine:inputs.country.label"),
                title: t("garanties-idealwine:inputs.country.label"),
                options:
                  enabledCountries
                    ?.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                    .map(country => ({ value: country.code, label: country.name ?? "" })) ?? [],
              },
            ],
          }}
        />
        <div className={styles.inputs}>
          <Input
            label={t("garanties-idealwine:inputs.bottles.label")}
            type="number"
            error={errors.bottles?.message}
            placeholder={t("garanties-idealwine:inputs.bottles.placeholder")}
            {...register("bottles")}
            min={0}
            max={5000}
            defaultValue={0}
          />
          <Input
            label={t("garanties-idealwine:inputs.magnums.label")}
            type="number"
            error={errors.magnums?.message}
            placeholder={t("garanties-idealwine:inputs.magnums.placeholder")}
            {...register("magnums")}
            min={0}
            max={500}
            defaultValue={0}
          />
          <Input
            label={t("garanties-idealwine:inputs.others.label")}
            type="number"
            error={errors.others?.message}
            placeholder={t("garanties-idealwine:inputs.others.placeholder")}
            {...register("others")}
            min={0}
            max={500}
            defaultValue={0}
          />
        </div>
      </form>
      {isFormValid && (
        <div className={styles.shippingMethods}>
          {methodsAndPrices.map(({ method, price }) => (
            <div key={method.id} className={styles.shippingMethod}>
              <div className={styles.shippingMethodCode}>{method.name}</div>
              {formData.bottles > 0 && (
                <div className={styles.shippingMethodContent}>
                  {t("garanties-idealwine:numBottles", { count: formData.bottles })}
                </div>
              )}
              {formData.magnums > 0 && (
                <div className={styles.shippingMethodContent}>
                  {t("garanties-idealwine:numMagnums", { count: formData.magnums })}
                </div>
              )}
              {formData.others > 0 && (
                <div className={styles.shippingMethodContent}>
                  {t("garanties-idealwine:numOthers", { count: formData.others })}
                </div>
              )}
              <Price price={price} size="big" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculateShippingForm;
