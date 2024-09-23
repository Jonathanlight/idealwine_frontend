import { useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select/SelectRHF";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import {
  CustomerJsonldShopCustomerRead,
  CustomerJsonldShopCustomerUpdate,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import {
  getShopGetCustomerItemQueryKey,
  useShopPutCustomerItem,
} from "@/networking/sylius-api-client/customer/customer";
import { ConstraintViolationList } from "@/networking/types";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useCountriesProvincesMapping } from "@/utils/countryUtils";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SellerForm.module.scss";

type Props = {
  customer: CustomerJsonldShopCustomerRead | undefined;
};

const SellerForm = ({ customer }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { data: countries } = useShopGetCountryCollection(
    {},
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
    reset,
  } = useForm<CustomerJsonldShopCustomerUpdate>();
  const { user } = useAuthenticatedUserContext();

  const countriesProvincesMapping = useCountriesProvincesMapping(countries);

  const [sellerAddressProvinces, setSellerAddressProvinces] = useState(
    countriesProvincesMapping[customer?.sellerAddress?.countryCode ?? ""] ?? [],
  );

  const queryClient = useQueryClient();

  const { mutateAsync: putCustomer, isLoading } = useShopPutCustomerItem<AxiosError>();

  const onSubmit: SubmitHandler<CustomerJsonldShopCustomerUpdate> = async data => {
    try {
      const updatedCustomer = await putCustomer({
        id: user?.customerId ?? "",
        data: {
          ...data,
          sellerAddress: {
            ...data.sellerAddress,
            "@id": customer?.sellerAddress?.["@id"],
            firstName: data.sellerAddress?.firstName ?? undefined,
            lastName: data.sellerAddress?.lastName ?? undefined,
            city: data.sellerAddress?.city ?? undefined,
            street: data.sellerAddress?.street ?? undefined,
            countryCode: data.sellerAddress?.countryCode ?? undefined,
            provinceName: data.sellerAddress?.provinceName ?? undefined,
            provinceCode:
              data.sellerAddress?.provinceCode === "" ? null : data.sellerAddress?.provinceCode,
            phoneNumber: data.sellerAddress?.phoneNumber ?? undefined,
          },
        },
      });

      queryClient.setQueryData(
        getShopGetCustomerItemQueryKey(user?.customerId ?? ""),
        updatedCustomer,
      );

      toast.success<string>(t("section-vendeur:information_has_been_saved"));
    } catch (err) {
      if (!isAxiosError(err) || err.response?.status !== 422) {
        toast.error<string>(t("error_occurred"));

        return;
      }

      const { violations } = err.response.data as ConstraintViolationList<
        Path<CustomerJsonldShopCustomerUpdate>
      >;
      violations.forEach(({ propertyPath, message }) => {
        if (propertyPath !== "") setError(propertyPath, { message });
      });
    }
  };

  const dateObj = new Date(customer?.createdAt ?? "");

  useEffect(() => {
    setValue("sellerAddress.provinceCode", customer?.sellerAddress?.provinceCode);
  }, [customer, sellerAddressProvinces, setValue]);

  useEffect(() => {
    setSellerAddressProvinces(
      countriesProvincesMapping[customer?.sellerAddress?.countryCode ?? ""] ?? [],
    );
    reset({
      ...customer,
      currency: customer?.currency?.["@id"],
      paymentMethod: customer?.paymentMethod?.["@id"],
    });
  }, [customer, reset, countriesProvincesMapping]);

  return (
    <div className={styles.bigCard}>
      {t("section-vendeur:formDescription")}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.twoInputs}>
          <Input
            label={t("common:common.lastName")}
            type="text"
            showRequiredStar
            error={errors.lastName?.message}
            placeholder={t("common:common.lastName")}
            {...register("sellerAddress.lastName", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.firstName")}
            type="text"
            showRequiredStar
            error={errors.firstName?.message}
            placeholder={t("common:common.firstName")}
            {...register("sellerAddress.firstName", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
        </div>

        <Input
          label={t("common:common.address")}
          showRequiredStar
          className={styles.input}
          error={errors.sellerAddress?.street?.message}
          placeholder={t("common:common.address")}
          {...register("sellerAddress.street", {
            required: { value: true, message: t("common:form.requiredField") },
          })}
        />

        <Input
          label={t("common:common.phone")}
          showRequiredStar
          className={styles.input}
          error={errors.sellerAddress?.phoneNumber?.message}
          placeholder={t("common:common.phone")}
          {...register("sellerAddress.phoneNumber", {
            required: { value: true, message: t("common:form.requiredField") },
          })}
        />

        <div className={styles.twoInputs}>
          <Input
            label={t("common:common.postalCode")}
            showRequiredStar
            error={errors.sellerAddress?.postcode?.message}
            placeholder={t("common:common.postalCode")}
            {...register("sellerAddress.postcode", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.city")}
            showRequiredStar
            error={errors.sellerAddress?.city?.message}
            placeholder={t("common:common.city")}
            {...register("sellerAddress.city", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
        </div>

        <div className={styles.twoInputs}>
          <Select
            control={control}
            className={styles.fullWidth}
            showRequiredStar
            error={errors.sellerAddress?.countryCode?.message}
            {...register("sellerAddress.countryCode", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
            label={t("common:common.country")}
            placeholder={t("common:common.country")}
            options={{
              groups: [
                {
                  key: t("common:common.country"),
                  title: t("common:common.country"),
                  options:
                    countries
                      ?.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                      .map(country => ({ value: country.code, label: country.name ?? "" })) ?? [],
                },
              ],
            }}
            onValueChange={value => {
              setSellerAddressProvinces(countriesProvincesMapping[value] ?? []);
            }}
          />
          <Select
            control={control}
            className={styles.fullWidth}
            label={t("common:common.state")}
            showRequiredStar={sellerAddressProvinces.length > 0}
            disabled={sellerAddressProvinces.length === 0}
            error={errors.sellerAddress?.provinceCode?.message}
            {...register("sellerAddress.provinceCode", {
              required: {
                value: sellerAddressProvinces.length > 0,
                message: t("common:form.requiredField"),
              },
            })}
            placeholder={sellerAddressProvinces.length > 0 ? t("common:common.state") : undefined}
            options={{
              groups: [
                {
                  key: t("common:common.state"),
                  title: t("common:common.state"),
                  options: sellerAddressProvinces.map(province => ({
                    value: province.code,
                    label: province.name,
                  })),
                },
              ],
            }}
          />
        </div>

        <Input
          label={t("common:common.isProSeller")}
          type="checkbox"
          showRequiredStar
          className={styles.input}
          {...register("proSeller")}
        />

        <Input
          label={t("common:common.createdAt")}
          showRequiredStar={false}
          disabled
          value={dateObj.toLocaleDateString("fr")}
          className={styles.input}
        />

        <hr style={{ marginTop: "2rem", marginBottom: "2rem" }} />

        <Button variant="primaryBlack" isLoading={isLoading}>
          {t("common:common.submitForm")}
        </Button>
      </form>
    </div>
  );
};

export default SellerForm;
