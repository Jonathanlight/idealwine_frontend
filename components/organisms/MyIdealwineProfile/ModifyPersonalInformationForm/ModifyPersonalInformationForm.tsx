import { useQueryClient } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select/SelectRHF";
import Switch from "@/components/atoms/Switch";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useCurrentCurrency } from "@/hooks/useCurrentCurrency";
import { useSendRefreshTokenRequest } from "@/networking/mutator/axios-hooks";
import {
  CustomerJsonldShopCustomerRead,
  CustomerJsonldShopCustomerUpdate,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import { useShopGetCurrencyCollection } from "@/networking/sylius-api-client/currency/currency";
import {
  getShopGetCustomerItemQueryKey,
  useShopPutCustomerItem,
} from "@/networking/sylius-api-client/customer/customer";
import { useShopValidateBasketOrderItem } from "@/networking/sylius-api-client/order/order";
import { ConstraintViolationList } from "@/networking/types";
import { STALE_TIME_HOUR } from "@/utils/constants";
import { useCountriesProvincesMapping } from "@/utils/countryUtils";
import { emailPattern } from "@/utils/fieldValidators";
import { ImageFilters } from "@/utils/imageFilters";
import { getCurrencyIRI } from "@/utils/iriUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import { FROM_BASKET_QUERY_PARAM } from "../../GeneralCheckout/CompletePersonalInfoDialog/CompletePersonalInfoDialog";
import ReturnToCartDialog from "../ReturnToCartDialog";
import styles from "./ModifyPersonalInformationForm.module.scss";

export enum Gender {
  Male = "m",
  Female = "f",
}

enum LegalStatus {
  EURL = "EURL",
  SARL = "SARL",
  SA = "SA",
  SAS = "SAS",
  SNC = "SNC",
  ASSO = "ASSO",
}

enum ActivitySector {
  CAVIST = "CAVIST",
  MERCHANT = "MERCHANT",
  PRODUCER = "PRODUCER",
  RESTAURANT = "RESTAURANT",
  HOTEL_BUSINESS = "HOTEL_BUSINESS",
  DISTRIBUTION = "DISTRIBUTION",
  OTHER = "OTHER",
}

type Props = {
  customer: CustomerJsonldShopCustomerRead | undefined;
};

const ModifyPersonalInformationForm = ({ customer }: Props): JSX.Element => {
  const { data: countries } = useShopGetCountryCollection(
    {},
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const { data: currencies } = useShopGetCurrencyCollection({
    query: { staleTime: STALE_TIME_HOUR },
  });
  const [isProfessional, setIsProfessional] = useState(false);
  const [isEditBillingAddressOpen, setIsEditBillingAddressOpen] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
    reset,
    resetField,
  } = useForm<CustomerJsonldShopCustomerUpdate>();
  const { user, cart, setCart } = useAuthenticatedUserContext();
  const { currentCurrency } = useCurrentCurrency();
  const { mutateAsync: validateMyCart } = useShopValidateBasketOrderItem();

  const countriesProvincesMapping = useCountriesProvincesMapping(countries);

  const [defaultAddressProvinces, setDefaultAddressProvinces] = useState(
    countriesProvincesMapping[customer?.defaultAddress?.countryCode ?? ""] ?? [],
  );

  const [billingAddressProvinces, setBillingAddressProvinces] = useState(
    countriesProvincesMapping[customer?.billingAddress?.countryCode ?? ""] ?? [],
  );

  const { sendRefreshTokenRequest } = useSendRefreshTokenRequest();
  const queryClient = useQueryClient();
  const { query } = useRouter();

  const [isCustomerVatValid, setIsCustomerVatValid] = useState<boolean | undefined>(undefined);
  const [isReturnToCartDialogOpen, setIsReturnToCartDialogOpen] = useState(false);

  const { mutateAsync: putCustomer, isLoading } = useShopPutCustomerItem<AxiosError>();

  const onSubmit: SubmitHandler<CustomerJsonldShopCustomerUpdate> = async data => {
    try {
      const previousCountryCode = customer?.defaultAddress?.countryCode;

      const updatedCustomer = await putCustomer({
        id: user?.customerId ?? "",
        data: {
          ...data,
          defaultAddress: {
            ...data.defaultAddress,
            "@id": customer?.defaultAddress?.["@id"],
            firstName: data.firstName ?? undefined,
            lastName: data.lastName ?? undefined,
            provinceCode:
              data.defaultAddress?.provinceCode === "" ? null : data.defaultAddress?.provinceCode,
          },
          billingAddress: isEditBillingAddressOpen
            ? {
                ...data.billingAddress,
                "@id": customer?.billingAddress?.["@id"],
                firstName: data.billingAddress?.firstName ?? undefined,
                lastName: data.billingAddress?.lastName ?? undefined,
                provinceCode:
                  data.billingAddress?.provinceCode === ""
                    ? null
                    : data.billingAddress?.provinceCode,
              }
            : null,
          companyName: isProfessional ? data.companyName : null,
          exciseNumber: isProfessional ? data.exciseNumber : null,
          vatNumber: isProfessional ? data.vatNumber : null,
          legalStatus: isProfessional ? data.legalStatus : null,
          activitySector: isProfessional ? data.activitySector : null,
        },
      });

      const newCountryCode = updatedCustomer.defaultAddress?.countryCode;

      // Revalidate cart to update shipping costs and VAT calculations
      if (newCountryCode !== previousCountryCode) {
        const newCart = await validateMyCart({
          tokenValue: cart?.tokenValue ?? "",
          params: { filter: [ImageFilters.CART] },
          data: { couponCode: cart?.couponCode },
        });
        setCart(newCart);
      }

      setIsCustomerVatValid(updatedCustomer.isVatNumberValid ?? undefined);

      queryClient.setQueryData(
        getShopGetCustomerItemQueryKey(user?.customerId ?? ""),
        updatedCustomer,
      );

      if (!isEditBillingAddressOpen) {
        resetField("billingAddress");
      }

      const previousHasSetupAddress = user?.hasSetupAddress;

      await sendRefreshTokenRequest(); // update values stored in JWT token

      if (query[FROM_BASKET_QUERY_PARAM] === "true" && previousHasSetupAddress === false) {
        setIsReturnToCartDialogOpen(true);
      } else {
        toast.success<string>(t("accueil-profil:information_has_been_saved"));
      }
    } catch (err) {
      if (!isAxiosError(err) || err.response?.status !== 422) {
        toast.error<string>(t("accueil-profil:error_occurred"));

        return;
      }

      const { violations } = err.response.data as ConstraintViolationList<
        Path<CustomerJsonldShopCustomerUpdate>
      >;
      violations.forEach(({ propertyPath, message }) => {
        if (
          propertyPath !== "" &&
          // don't show error for defaultAddress.firstName and defaultAddress.lastName
          // because we don't show them in the form and so the user can't fix them by touching the field
          // and so the form remains blocked because of these errors
          propertyPath !== "defaultAddress.firstName" &&
          propertyPath !== "defaultAddress.lastName"
        )
          setError(propertyPath, { message });
      });
    }
  };

  useEffect(() => {
    if (customer) {
      setValue("defaultAddress.provinceCode", customer.defaultAddress?.provinceCode);
    }
  }, [customer, defaultAddressProvinces, setValue]);

  useEffect(() => {
    if (customer) {
      setValue("billingAddress.provinceCode", customer.billingAddress?.provinceCode);
    }
  }, [customer, billingAddressProvinces, setValue]);

  useEffect(() => {
    if (customer) {
      setDefaultAddressProvinces(
        countriesProvincesMapping[customer.defaultAddress?.countryCode ?? ""] ?? [],
      );
      setBillingAddressProvinces(
        countriesProvincesMapping[customer.billingAddress?.countryCode ?? ""] ?? [],
      );
      setIsEditBillingAddressOpen(isNotNullNorUndefined(customer.billingAddress));
      setIsProfessional(customer.proClient ?? false);
      reset({
        ...customer,
        gender: customer.gender !== "u" ? customer.gender : undefined,
        currency: customer.currency?.["@id"],
        paymentMethod: customer.paymentMethod?.["@id"],
      });
    }
  }, [customer, reset, countriesProvincesMapping]);

  useEffect(() => {
    setIsCustomerVatValid(customer?.isVatNumberValid ?? undefined);
  }, [customer]);

  useEffect(() => {
    if (customer && typeof currentCurrency === "string") {
      const selectedCurrency = currencies?.find(currency => currency.code === currentCurrency);
      if (selectedCurrency) {
        setValue("currency", getCurrencyIRI(selectedCurrency.code));
      }
    }
  }, [customer, currentCurrency, setValue, currencies]);

  return (
    <div id="personalInformation" className={styles.bigCard}>
      <h1>{t("accueil-profil:formTitle")}</h1>
      <hr />
      {t("accueil-profil:formDescription")}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.twoInputs}>
          <Select
            control={control}
            {...register("gender", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
            showRequiredStar
            className={styles.singleSelect}
            label={t("common:common.genderLabel")}
            error={errors.gender?.message}
            placeholder={t("common:common.genderPlaceholder")}
            options={{
              groups: [
                {
                  key: t("common:common.genderLabel"),
                  title: t("common:common.genderLabel"),
                  options: [
                    { value: Gender.Male, label: t("common:common.mr") },
                    { value: Gender.Female, label: t("common:common.mrs") },
                  ],
                },
              ],
            }}
          />
        </div>

        <div className={styles.twoInputs}>
          <Input
            label={t("common:common.lastName")}
            type="text"
            showRequiredStar
            error={errors.lastName?.message}
            placeholder={t("common:common.lastName")}
            {...register("lastName", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.firstName")}
            type="text"
            showRequiredStar
            error={errors.firstName?.message}
            placeholder={t("common:common.firstName")}
            {...register("firstName", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
        </div>

        <Input
          label={t("common:common.company")}
          type="text"
          className={styles.input}
          error={errors.defaultAddress?.company?.message}
          placeholder={t("common:common.company")}
          {...register("defaultAddress.company")}
        />

        <Input
          label={t("common:common.address")}
          showRequiredStar
          className={styles.input}
          error={errors.defaultAddress?.street?.message}
          placeholder={t("common:common.address")}
          {...register("defaultAddress.street", {
            required: { value: true, message: t("common:form.requiredField") },
          })}
        />

        <Input
          label={t("common:common.additionalInformations")}
          type="text"
          className={styles.input}
          placeholder={t("common:common.additionalInformationsPlaceholder")}
          {...register("defaultAddress.additionalInformations")}
        />

        <div className={styles.twoInputs}>
          <Input
            label={t("common:common.postalCode")}
            showRequiredStar
            error={errors.defaultAddress?.postcode?.message}
            placeholder={t("common:common.postalCode")}
            {...register("defaultAddress.postcode", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
          <Input
            label={t("common:common.city")}
            showRequiredStar
            error={errors.defaultAddress?.city?.message}
            placeholder={t("common:common.city")}
            {...register("defaultAddress.city", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
        </div>

        <div className={styles.twoInputs}>
          <Select
            control={control}
            className={styles.fullWidth}
            showRequiredStar
            error={errors.defaultAddress?.countryCode?.message}
            {...register("defaultAddress.countryCode", {
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
                      ?.filter(country => country.enabled)
                      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                      .map(country => ({ value: country.code, label: country.name ?? "" })) ?? [],
                },
              ],
            }}
            onValueChange={value => {
              setDefaultAddressProvinces(countriesProvincesMapping[value] ?? []);
              setValue("defaultAddress.provinceCode", "");
            }}
          />
          <Select
            control={control}
            className={styles.fullWidth}
            label={t("common:common.state")}
            showRequiredStar={defaultAddressProvinces.length > 0}
            disabled={defaultAddressProvinces.length === 0}
            error={errors.defaultAddress?.provinceCode?.message}
            {...register("defaultAddress.provinceCode", {
              required: {
                value: defaultAddressProvinces.length > 0,
                message: t("common:form.requiredField"),
              },
            })}
            placeholder={defaultAddressProvinces.length > 0 ? t("common:common.state") : undefined}
            options={{
              groups: [
                {
                  key: t("common:common.state"),
                  title: t("common:common.state"),
                  options: defaultAddressProvinces.map(province => ({
                    value: province.code,
                    label: province.name,
                  })),
                },
              ],
            }}
          />
        </div>

        <div className={styles.twoInputs}>
          <Select
            control={control}
            className={styles.fullWidth}
            showRequiredStar
            error={errors.currency?.message}
            {...register("currency", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
            label={t("common:common.currency")}
            placeholder={t("common:common.currency")}
            options={{
              groups: [
                {
                  key: t("common:common.currency"),
                  title: t("common:common.currency"),
                  options:
                    currencies?.map(currency => ({
                      value: getCurrencyIRI(currency.code),
                      label: currency.code,
                    })) ?? [],
                },
              ],
            }}
          />

          <Input
            label={t("common:common.phone")}
            showRequiredStar
            error={errors.phoneNumber?.message}
            placeholder={t("common:common.phone")}
            {...register("phoneNumber", {
              required: { value: true, message: t("common:form.requiredField") },
            })}
          />
        </div>

        <Input
          label={t("common:common.email")}
          type="email"
          showRequiredStar
          className={styles.input}
          error={errors.email?.message}
          placeholder={t("common:common.email")}
          {...register("email", {
            required: { value: true, message: t("common:form.requiredField") },
            pattern: { value: emailPattern, message: t("common:login.emailRequirements") },
          })}
        />

        <p className={styles.billingAddressFormTitle}>
          {t("accueil-profil:billingAddress")}
          <Switch
            size="small"
            checked={isEditBillingAddressOpen}
            onChange={() => setIsEditBillingAddressOpen(!isEditBillingAddressOpen)}
          />
        </p>

        {isEditBillingAddressOpen && (
          <div>
            <div className={styles.twoInputs}>
              <Input
                label={t("common:common.lastName")}
                type="text"
                showRequiredStar
                error={errors.billingAddress?.lastName?.message}
                placeholder={t("common:common.lastName")}
                {...register("billingAddress.lastName", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
              <Input
                label={t("common:common.firstName")}
                type="text"
                showRequiredStar
                error={errors.billingAddress?.firstName?.message}
                placeholder={t("common:common.firstName")}
                {...register("billingAddress.firstName", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
            </div>

            <Input
              label={t("common:common.address")}
              showRequiredStar
              className={styles.input}
              error={errors.billingAddress?.street?.message}
              placeholder={t("common:common.address")}
              {...register("billingAddress.street", {
                required: { value: true, message: t("common:form.requiredField") },
              })}
            />

            <Input
              label={t("common:common.additionalInformations")}
              type="text"
              className={styles.input}
              placeholder={t("common:common.additionalInformationsPlaceholder")}
              {...register("billingAddress.additionalInformations")}
            />

            <div className={styles.twoInputs}>
              <Input
                label={t("common:common.postalCode")}
                showRequiredStar
                error={errors.billingAddress?.postcode?.message}
                placeholder={t("common:common.postalCode")}
                {...register("billingAddress.postcode", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
              <Input
                label={t("common:common.city")}
                showRequiredStar
                error={errors.billingAddress?.city?.message}
                placeholder={t("common:common.city")}
                {...register("billingAddress.city", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
            </div>

            <div className={styles.twoInputs}>
              <Select
                control={control}
                className={styles.fullWidth}
                showRequiredStar
                error={errors.billingAddress?.countryCode?.message}
                {...register("billingAddress.countryCode", {
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
                          .map(country => ({ value: country.code, label: country.name ?? "" })) ??
                        [],
                    },
                  ],
                }}
                onValueChange={value => {
                  setBillingAddressProvinces(countriesProvincesMapping[value] ?? []);
                  setValue("billingAddress.provinceCode", "");
                }}
              />
              <Select
                control={control}
                className={styles.fullWidth}
                label={t("common:common.state")}
                showRequiredStar={billingAddressProvinces.length > 0}
                disabled={billingAddressProvinces.length === 0}
                error={errors.billingAddress?.provinceCode?.message}
                {...register("billingAddress.provinceCode", {
                  required: {
                    value: billingAddressProvinces.length > 0,
                    message: t("common:form.requiredField"),
                  },
                })}
                placeholder={
                  billingAddressProvinces.length > 0 ? t("common:common.state") : undefined
                }
                options={{
                  groups: [
                    {
                      key: t("common:common.state"),
                      title: t("common:common.state"),
                      options: billingAddressProvinces.map(province => ({
                        value: province.code,
                        label: province.name,
                      })),
                    },
                  ],
                }}
              />
            </div>
          </div>
        )}

        <hr style={{ marginTop: "2rem", marginBottom: "2rem" }} />

        {customer && (
          <h2 className={styles.professionalBoxTitle}>
            {(isNullOrUndefined(customer.proClient) || isProfessional) &&
              t("accueil-profil:businessContact")}
            {isNullOrUndefined(customer.proClient) && (
              <Switch
                checked={isProfessional}
                onChange={() => setIsProfessional(!isProfessional)}
              />
            )}
          </h2>
        )}

        {isProfessional && (
          <div>
            <div className={styles.twoInputs}>
              <Input
                label={t("common:common.company")}
                className={styles.input}
                error={errors.companyName?.message}
                showRequiredStar={isProfessional}
                placeholder={t("common:common.company")}
                {...register("companyName", {
                  required: { value: isProfessional, message: t("common:form.requiredField") },
                })}
              />

              <Input
                label={t("accueil-profil:excise")}
                className={styles.input}
                error={errors.exciseNumber?.message}
                placeholder={t("accueil-profil:excise")}
                {...register("exciseNumber")}
              />
            </div>

            <div className={styles.twoInputs}>
              <Input
                label={t("accueil-profil:vatNumber")}
                message={
                  isCustomerVatValid !== undefined &&
                  (isCustomerVatValid ? (
                    <span className={styles.validVatNumber}>
                      {t("accueil-profil:valid_vat_number")}
                    </span>
                  ) : (
                    <span className={styles.invalidVatNumber}>
                      {t("accueil-profil:invalid_vat_number")}
                    </span>
                  ))
                }
                error={errors.vatNumber?.message}
                placeholder={t("accueil-profil:vatNumber")}
                {...register("vatNumber")}
              />

              <div className={styles.fullWidth}>
                <Select
                  control={control}
                  {...register("legalStatus")}
                  label={t("accueil-profil:legalStatus")}
                  placeholder={t("accueil-profil:legalStatus")}
                  options={{
                    groups: [
                      {
                        key: t("accueil-profil:legalStatus"),
                        title: t("accueil-profil:legalStatus"),
                        options: Object.values(LegalStatus).map(legalStatus => ({
                          value: legalStatus,
                          label: t(`accueil-profil:legal_status.${legalStatus}`),
                        })),
                      },
                    ],
                  }}
                />
              </div>
            </div>

            <Select
              control={control}
              {...register("activitySector")}
              className={styles.singleSelect}
              label={t("accueil-profil:activitySector")}
              placeholder={t("accueil-profil:activitySector")}
              options={{
                groups: [
                  {
                    key: t("accueil-profil:activitySector"),
                    title: t("accueil-profil:activitySector"),
                    options: Object.values(ActivitySector).map(activitySector => ({
                      value: activitySector,
                      label: t(`accueil-profil:activity_sector.${activitySector}`),
                    })),
                  },
                ],
              }}
            />
          </div>
        )}
        <div className={styles.buttonContainer}>
          <Button className={styles.confirmButton} variant="primaryBlack" isLoading={isLoading}>
            {t("common:common.submitForm")}
          </Button>
          <span className={styles.requiredFields}>
            <span className={styles.requiredStar}>*</span>
            {t("common:form.requiredFields")}
          </span>
        </div>
      </form>
      <ReturnToCartDialog open={isReturnToCartDialogOpen} setOpen={setIsReturnToCartDialogOpen} />
    </div>
  );
};

export default ModifyPersonalInformationForm;
