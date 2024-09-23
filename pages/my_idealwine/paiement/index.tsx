import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect, useSessionStorageValue } from "@react-hookz/web";
import { captureException } from "@sentry/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Script from "next/script";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button/Button";
import Input from "@/components/atoms/Input/Input";
import Select from "@/components/atoms/Select/SelectRHF";
import TranslatableLink from "@/components/atoms/TranslatableLink/TranslatableLink";
import CheckoutLayout from "@/components/organisms/GeneralCheckout/CheckoutLayout/CheckoutLayout";
import SelectBox from "@/components/organisms/GeneralCheckout/SelectBox/SelectBox";
import UnsupportedCurrencyModal from "@/components/organisms/UnsupportedCurrencyModal";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useFullPageLoaderContext } from "@/context/FullPageLoaderContext/useFullPageLoaderContext";
import { useRedirectInCheckoutFunnel } from "@/hooks/useRedirectUserInCheckoutFunnel";
import {
  AddressJsonldShopAddressCreate,
  OrderOrderAmountValidationOutputDTOJsonldShopOrderRead,
  OrderPaymentProcessingOutputDTOJsonldShopOrderReadPaymentProcessingData,
  ProvinceJsonldShopCountryRead,
  ShippingMethodJsonldShopOrderReadCode,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import {
  getShopGetOrderCollectionQueryKey,
  useApplePayMerchantValidationOrderItem,
  useApplePayOrderAmountValidationOrderItem,
  useApplePayPaymentProcessingOrderItem,
  useGeneratePaymentUrlOrderItem,
  useShopCompleteOrderItem,
  useShopPutOrderItem,
  useShopSelectPaymentMethodOrderItem,
  useShopSelectShippingMethodOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { useShopGetPaymentMethodCollection } from "@/networking/sylius-api-client/payment-method/payment-method";
import { generateAbsoluteUrl, translatedLinks } from "@/urls/linksTranslation";
import {
  APPLE_PAY_PAYMENT_METHOD_DATA,
  APPLE_PAY_PAYMENT_OPTIONS,
  CATEGORIES,
  CODE_TO_SHIPPING_METHOD,
  getGtmCategory2FromCategory,
  PAYMENT_METHOD_CODES,
  PaymentMethodIcons,
  SHIPPING_METHODS_WITHOUT_PAYMENT_RECAP,
  STALE_TIME_HOUR,
  SUBSCRIBED_CURRENCIES,
} from "@/utils/constants";
import { useCountriesProvincesMapping } from "@/utils/countryUtils";
import { centsToUnits } from "@/utils/formatHandler";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { sendCartPaymentGtmEvent } from "@/utils/gtmUtils";
import { ImageFilters } from "@/utils/imageFilters";
import { nextLangToApplePayLocale } from "@/utils/locale";
import { useTranslation } from "@/utils/next-utils";
import { TRANSACTION_CONFIRMATION_DATALAYER_EVENT } from "@/utils/sessionStorageKeys";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const PAYMENT_STATUS_QUERY_PARAM = "payment_status";
const PAYMENT_STATUS_FAILURE = "failure";

const Page = () => {
  const { data: countries } = useShopGetCountryCollection(
    {},
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const countriesProvincesMapping = useCountriesProvincesMapping(countries);
  const { t, lang } = useTranslation();
  const { user, cart, setCart, fetchCart, isFetchCartLoading } = useAuthenticatedUserContext();
  const { mutateAsync: mutateAsyncSelectPayment, isLoading: isLoadingSelectPayment } =
    useShopSelectPaymentMethodOrderItem();
  const { mutateAsync: mutateAsyncValidation, isLoading: isLoadingValidation } =
    useShopCompleteOrderItem();
  const [shouldBeDisabled, setShouldBeDisabled] = useState(true);
  const [isApplePayLoading, setIsApplePayLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isBillingEditOpen, setIsBillingEditOpen] = useState(false);
  const [applePayPaymentInformations, setApplePayPaymentInformations] =
    useState<OrderOrderAmountValidationOutputDTOJsonldShopOrderRead>();
  const { push, query, pathname, replace } = useRouter();
  const { mutateAsync: changeCartAddress } = useShopPutOrderItem();
  const { mutateAsync: changeCartShippingMethod } = useShopSelectShippingMethodOrderItem();
  const { mutateAsync: validateOrderAmount, isLoading: isValidateApplePayAmountLoading } =
    useApplePayOrderAmountValidationOrderItem();
  const { mutateAsync: validateMerchantId } = useApplePayMerchantValidationOrderItem();
  const { mutateAsync: processPayment } = useApplePayPaymentProcessingOrderItem();
  const { setIsFullPageLoaderOpen } = useFullPageLoaderContext();
  const { set: setTransactionConfirmationDatalayerEvent } = useSessionStorageValue(
    TRANSACTION_CONFIRMATION_DATALAYER_EVENT,
  );
  const queryClient = useQueryClient();
  const {
    register,
    getValues,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<AddressJsonldShopAddressCreate>();
  const [isUnsupportedCurrencyModalOpen, setIsUnsupportedCurrencyModalOpen] = useState(false);

  const paymentStatus = query[PAYMENT_STATUS_QUERY_PARAM];

  useEffect(() => {
    if (typeof paymentStatus === "string" && paymentStatus === PAYMENT_STATUS_FAILURE) {
      void toast.error<string>(t("paiement:paymentFailure"), {
        autoClose: false,
        theme: "colored",
      });
      // Erases the query string from the URL, so a refresh/back page won't trigger the toast again
      void replace({ pathname, query: "" }, undefined, { shallow: true });
    }
  }, [pathname, paymentStatus, replace, t]);

  useRedirectInCheckoutFunnel("CART_SHIPPING_HAS_BEEN_SELECTED");

  const shippingMethod = cart?.shipments?.[0]?.method;
  const payments = cart?.payments;
  const isFreeOrder = isNotNullNorUndefined(payments) && payments.length === 0;
  const paymentId = cart?.payments?.[0]?.id?.toString();
  const tokenValue = cart?.tokenValue ?? "missingTokenValue";
  const { data: paymentMethods, isLoading: isLoadingFetchPayments } =
    useShopGetPaymentMethodCollection({ paymentId, tokenValue });

  // Even if eslint doesn't know it, some navigators don't support the Payment Request API, like firefox for Android.
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const hasApplePay = !!window.PaymentRequest;

  const countryName = useMemo(() => {
    return countries?.find(country => country.code === cart?.shippingAddress?.countryCode)?.name;
  }, [countries, cart?.shippingAddress?.countryCode]);

  const [billingAddressProvinces, setBillingAddressProvinces] = useState<
    ProvinceJsonldShopCountryRead[]
  >([]);

  const shouldDisplayRecap =
    isNotNullNorUndefined(shippingMethod) &&
    !SHIPPING_METHODS_WITHOUT_PAYMENT_RECAP.includes(shippingMethod.code);

  useEffect(() => {
    if (cart?.customer) {
      setValue("countryCode", cart.billingAddress?.countryCode ?? "");
      setBillingAddressProvinces(
        countriesProvincesMapping[cart.billingAddress?.countryCode ?? ""] ?? [],
      );
      setValue("provinceCode", cart.billingAddress?.provinceCode ?? "");
    }
  }, [cart?.customer, countriesProvincesMapping, cart?.billingAddress, setValue]);

  useEffect(() => {
    setIsFullPageLoaderOpen(isLoadingFetchPayments || isFetchCartLoading);
  }, [isLoadingFetchPayments, isFetchCartLoading, setIsFullPageLoaderOpen]);

  const onBillingAddressChange = async () => {
    try {
      const {
        firstName,
        lastName,
        street,
        postcode,
        city,
        phoneNumber,
        company,
        countryCode,
        additionalInformations,
      } = getValues();
      const shippingAddress = cart?.shippingAddress;
      await changeCartAddress({
        tokenValue: tokenValue,
        data: {
          billingAddress: {
            ...cart?.billingAddress,
            // @ts-expect-error Orval sending wrong types : probably a serialization issue.
            firstName: firstName,
            lastName: lastName,
            street: street,
            postcode: postcode,
            city: city,
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            additionalInformations: additionalInformations,
            ...(company === "" ? {} : { company: company }),
          },
          shippingAddress: shippingAddress,
        },
      });
      const shippedCart = await changeCartShippingMethod({
        tokenValue: tokenValue,
        shipmentId: cart?.shipments?.[0]?.id?.toString() ?? "0",
        data: {
          shippingMethod: shippingMethod?.code,
        },
        params: { filter: [ImageFilters.CART] },
      });
      setCart(shippedCart);
    } catch (error) {
      toast.error<string>(t("common:common.errorOccurred"));
    }
  };
  const { mutateAsync: generatePaymentUrl, isLoading: isGeneratingPaymentUrl } =
    useGeneratePaymentUrlOrderItem({});

  const goToCreditCardPaymentPage = useCallback(async () => {
    const { url } = await generatePaymentUrl({
      data: {
        urlAfterSuccess: generateAbsoluteUrl("SUCCESS_CREDIT_CARD_URL", lang),
        urlAfterFailure: generateAbsoluteUrl(
          "PAYMENT_URL",
          lang,
          undefined,
          new URLSearchParams({ [PAYMENT_STATUS_QUERY_PARAM]: "failure" }),
        ),
        urlBack: generateAbsoluteUrl("PAYMENT_URL", lang),
      },
      tokenValue,
    });

    if (url !== undefined) await push(`${url}&language=${lang}`);
  }, [generatePaymentUrl, lang, push, tokenValue]);

  const processApplePayPayment = useCallback(
    async (cartTotal: number | undefined, currencyCode: string | undefined) => {
      setIsApplePayLoading(true);

      try {
        if (cartTotal === undefined || currencyCode === undefined) {
          toast.error<string>(t("paiement:applePay.commonError"));

          return;
        }

        const cartTotalInCurrencyUnit = centsToUnits(cartTotal);

        const applePayPaymentDetailsModifier = {
          total: {
            label: "Votre commande",
            amount: {
              value: cartTotalInCurrencyUnit.toString(),
              currency: currencyCode,
            },
          },
        };

        const request = new PaymentRequest(
          APPLE_PAY_PAYMENT_METHOD_DATA,
          applePayPaymentDetailsModifier,
          // @ts-expect-error lib.dom.d.ts does contain correct typing for PaymentRequest : missing optionnal third argument
          APPLE_PAY_PAYMENT_OPTIONS,
        );

        request.onmerchantvalidation = event => {
          // Calling the backend to get a merchant session from Apple
          const applePayMerchantVaidationPromise = validateMerchantId({
            tokenValue: tokenValue,
          })
            .then(
              applePayResponse =>
                JSON.parse(applePayResponse.merchantValidationData ?? "{}") as string,
            )
            .catch(error => {
              toast.error<string>(t("paiement:applePay.errorMerchantValidation"));
              captureException(error);
            });

          event.complete(applePayMerchantVaidationPromise);
        };

        const response = await request.show();
        const paymentInformations = response.details.token;

        const applePayPaymentProcessingResult = await processPayment({
          tokenValue,
          data: {
            paymentProcessingData: JSON.stringify(paymentInformations),
          },
        });

        await response.complete(applePayPaymentProcessingResult.paymentProcessingData);

        if (
          applePayPaymentProcessingResult.paymentProcessingData ===
          OrderPaymentProcessingOutputDTOJsonldShopOrderReadPaymentProcessingData.success
        ) {
          await push(translatedLinks.SUCCESS_CREDIT_CARD_URL[lang]);
        } else {
          toast.error<string>(t("paiement:applePay.errorPaymentProcess"));
        }
      } catch (error) {
        captureException(error);
      } finally {
        setIsApplePayLoading(false);
      }
    },
    [tokenValue, t, validateMerchantId, processPayment, lang, push],
  );

  const onUnsupportedCurrencyModalContinue = async () => {
    setIsUnsupportedCurrencyModalOpen(false);
    switch (selectedPaymentMethod) {
      case "credit_card":
        await goToCreditCardPaymentPage();
        break;
      case "apple_pay":
        await processApplePayPayment(
          applePayPaymentInformations?.amount,
          applePayPaymentInformations?.currencyCode,
        );
        break;
      default:
        await goToCreditCardPaymentPage();
        break;
    }
  };

  const completeOrder = useCallback(async () => {
    const orderHasGroupingShipping =
      cart?.shipments?.[0]?.method?.name ===
      ShippingMethodJsonldShopOrderReadCode["WORLD-SHIPPING-GROUPMENT"];
    const hasGroupedOrders = (cart?.groupedOrders?.length ?? 0) > 0;
    const newOrder = await mutateAsyncValidation({ tokenValue, data: {} });
    await push({
      pathname: translatedLinks.SUCCESS_BANK_TRANSFER_URL[lang],
      query: {
        isFreeOrder: isFreeOrder ? "true" : undefined,
        orderNumber: newOrder.number,
        orderTotal: newOrder.total,
      },
    });
    void fetchCart(); // fetching to get a new cart.

    if (orderHasGroupingShipping || hasGroupedOrders) {
      // we invalidate the collection of orders that are awaiting to be grouped
      void queryClient.invalidateQueries(getShopGetOrderCollectionQueryKey());
    }
  }, [
    cart?.groupedOrders?.length,
    cart?.shipments,
    fetchCart,
    isFreeOrder,
    lang,
    mutateAsyncValidation,
    push,
    queryClient,
    tokenValue,
  ]);

  const onValidation = useCallback(
    async (paymentMethodToValidate = selectedPaymentMethod) => {
      try {
        // If the cart costs 0€, we don't need to select a payment method.
        if (isFreeOrder) {
          await completeOrder();
          sendCartPaymentGtmEvent(cart);

          return;
        }

        const newCart = await mutateAsyncSelectPayment({
          tokenValue,
          paymentId: paymentId ?? "missingPaymentId",
          data: { paymentMethod: paymentMethodToValidate },
        });
        sendCartPaymentGtmEvent(newCart);
        switch (paymentMethodToValidate) {
          case PAYMENT_METHOD_CODES.CREDIT_CARD: {
            if (SUBSCRIBED_CURRENCIES.includes(user?.currencyCode ?? "")) {
              await goToCreditCardPaymentPage();
            } else {
              setIsUnsupportedCurrencyModalOpen(true);
            }

            break;
          }
          case PAYMENT_METHOD_CODES.APPLE_PAY: {
            const orderPaymentInfos = await validateOrderAmount({ tokenValue, data: {} });
            setApplePayPaymentInformations(orderPaymentInfos);
            if ((user?.currencyCode ?? "") === orderPaymentInfos.currencyCode) {
              await processApplePayPayment(
                orderPaymentInfos.amount,
                orderPaymentInfos.currencyCode,
              );
            } else {
              setIsUnsupportedCurrencyModalOpen(true);
            }
            break;
          }
          case PAYMENT_METHOD_CODES.BANK_TRANSFER:
          case PAYMENT_METHOD_CODES.PAY_LATER: {
            await completeOrder();
          }
        }
        if ((newCart.items?.length ?? 0) > 0) {
          setTransactionConfirmationDatalayerEvent({
            cartId: newCart.tokenValue,
            cartCreationUTC:
              isNotNullNorUndefined(newCart.checkoutCompletedAt) &&
              typeof newCart.checkoutCompletedAt === "string"
                ? Math.floor(new Date(newCart.checkoutCompletedAt).getTime() / 1000)
                : "",
            cartCurrency: newCart.currencyCode,
            cartTurnoverTTC: centsToUnits(newCart.itemsTotal ?? 0),
            cartTurnoverTaxFree: newCart.items?.reduce((total, cartItem) => {
              return (
                total +
                (cartItem.variant.priceByCountry
                  ? centsToUnits(cartItem.variant.priceByCountry["JP"])
                  : centsToUnits(cartItem.unitPrice ?? 0)) *
                  (cartItem.quantity ?? 1)
              );
            }, 0),
            cartQuantity: newCart.items?.reduce((count, cartItem) => {
              count += (cartItem.variant.numberOfBottles ?? 0) * (cartItem.quantity ?? 1);

              return count;
            }, 0),
            cartDistinctProduct: newCart.items?.reduce((count, cartItem) => {
              if (!count.includes(cartItem.variant.code)) {
                count.push(cartItem.variant.code);
              }

              return count;
            }, [] as string[]).length,
            shippingType: newCart.shipments?.[0]?.method?.name,
            paymentMode: selectedPaymentMethod,
            transactionId: newCart.tokenValue, // TODO
            promoCode: newCart.couponCode,
            purchaseType: "ecaviste",
            products: newCart.items?.map(item => {
              if (item.variant.auction) {
                return null;
              }

              return {
                cartId: newCart.tokenValue,
                productId: item.variant.code,
                product: item.variant.name,
                productVariant: item.variant.productVintage?.year,
                productBrand: item.variant.product?.owner,
                productDiscount: (item.originalUnitPrice ?? 0) < (item.unitPrice ?? 0),
                productPriceTTC: centsToUnits(item.total ?? 0) / (item.quantity ?? 1),
                productTaxFree: item.variant.priceByCountry
                  ? centsToUnits(item.variant.priceByCountry["JP"]) / (item.quantity ?? 1)
                  : centsToUnits(item.total ?? 0) / (item.quantity ?? 1),
                product_currency: newCart.currencyCode,
                productStock: true, // always true because stock is checked before adding to cart
                product_category1: "e_caviste",
                product_category2: getGtmCategory2FromCategory(item.variant.product?.category),
                product_category3: isNotNullNorUndefined(item.variant.product?.region?.name)
                  ? t(
                      `enums:region.${String(item.variant.product?.region?.name)}`,
                    ).toLocaleLowerCase()
                  : "",
                product_category4: isNotNullNorUndefined(item.variant.product?.color)
                  ? t(`enums:color.${String(item.variant.product?.color)}`).toLocaleLowerCase()
                  : "",
                productQuantity: item.quantity ?? 0,
                paymentMode: selectedPaymentMethod,
                transactionId: newCart.tokenValue,
                promoCode: newCart.couponCode,
              };
            }),
          });
        }
      } catch (error) {
        toast.error<string>(t("common:common.errorOccurred"));
      }
    },
    [
      isFreeOrder,
      user?.currencyCode,
      tokenValue,
      cart,
      paymentId,
      selectedPaymentMethod,
      processApplePayPayment,
      completeOrder,
      goToCreditCardPaymentPage,
      t,
      mutateAsyncSelectPayment,
      setTransactionConfirmationDatalayerEvent,
      validateOrderAmount,
    ],
  );

  const onApplePayButtonClicked = useCallback(async () => {
    // Same as earlier, PaymentRequest is not supported by all browsers, even if eslint doesn't know it.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!hasApplePay) {
      toast.error<string>(t("paiement:applePay.notAvailable"));

      return;
    }

    // Due to asynchronous computation of states, selectedPaymentMethod state won't be updated until the end of the first await.
    // Therefore, we want to set it manually as a parameter here.
    setSelectedPaymentMethod("apple_pay");
    await onValidation("apple_pay");
  }, [onValidation, hasApplePay, t]);

  useEffect(() => {
    window.onApplePayButtonClicked = onApplePayButtonClicked;
  }, [onApplePayButtonClicked]);

  useMountEffect(() => {
    sendGTMEvent({
      page: "paiement",
      pageChapter1: "checkout",
      pageChapter2: "",
    });
  });

  return (
    <CheckoutLayout
      currentPage="payment"
      nextPageUrlName="PAYMENT_URL"
      disabled={shouldBeDisabled && !isFreeOrder}
      onClickNextPage={onValidation}
      isLoading={
        isLoadingValidation ||
        isLoadingSelectPayment ||
        isGeneratingPaymentUrl ||
        isApplePayLoading ||
        isValidateApplePayAmountLoading
      }
      applePayButton={
        <apple-pay-button
          className={styles.applePayButton}
          buttonstyle="black"
          type="check-out"
          locale={nextLangToApplePayLocale(lang)}
          onclick="onApplePayButtonClicked()"
        ></apple-pay-button>
      }
    >
      {/* Apple Pay */}
      <Script
        src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js"
        strategy="afterInteractive"
        id="apple-pay-script"
        crossOrigin="anonymous"
        async
      ></Script>
      <div className={styles.recapBox}>
        <div className={styles.titleLine}>
          <div className={styles.titleContent}>
            <div className={styles.titleText}>{shippingMethod?.name ?? ""}</div>
            <div>{shippingMethod?.description ?? ""}</div>
          </div>
          <TranslatableLink className={styles.editLink} href="SHIPPING_URL">
            {t(`paiement:edit`)}
          </TranslatableLink>
        </div>
        {shouldDisplayRecap && (
          <div>
            {isNotNullNorUndefined(cart?.shippingAddress?.company) &&
              cart?.shippingAddress?.company !== "" && <div>{cart?.shippingAddress?.company}</div>}
            <div>
              {cart?.shippingAddress?.firstName ?? ""} {cart?.shippingAddress?.lastName ?? ""}
            </div>
            <div>{cart?.shippingAddress?.street ?? ""}</div>
            {CODE_TO_SHIPPING_METHOD[shippingMethod.code] !== CATEGORIES.ON_SITE && (
              <div>{cart?.shippingAddress?.additionalInformations ?? ""}</div>
            )}
            <div>
              {cart?.shippingAddress?.postcode ?? ""} {cart?.shippingAddress?.city ?? ""}
            </div>
            <div>{countryName ?? ""}</div>
          </div>
        )}
      </div>
      {isFreeOrder ? (
        <div className={styles.freeCartText}>{t("paiement:nothingToPay")}</div>
      ) : (
        paymentMethods?.["hydra:member"]
          .filter(paymentMethod => paymentMethod.code !== PAYMENT_METHOD_CODES.APPLE_PAY) // TODO : create visible behavior from backend ??
          .filter(paymentMethod => paymentMethod.code !== PAYMENT_METHOD_CODES.FULL_CREDIT_NOTE) // TODO : create visible behavior from backend ??
          .map(paymentMethod => {
            const paymentMethodCode = paymentMethod.code;

            return (
              <SelectBox
                key={paymentMethodCode}
                title={paymentMethod.name ?? "Missing name"}
                description={paymentMethod.description ?? "Missing description"}
                isSelected={selectedPaymentMethod === paymentMethod.code}
                iconUrl={PaymentMethodIcons[paymentMethodCode ?? ""]}
                onSelect={() => {
                  setSelectedPaymentMethod(paymentMethod.code ?? "");
                  setShouldBeDisabled(false);
                }}
              />
            );
          })
      )}
      <div className={styles.shippingAddressContainer}>
        <div className={styles.billingTitle}>{t("paiement:billingAddress")}</div>
        <div>
          {getValues("firstName") ?? cart?.billingAddress?.firstName}{" "}
          {getValues("lastName") ?? cart?.billingAddress?.lastName}
          {", "}
          {getValues("street") ?? cart?.billingAddress?.street}
          {", "}
          {getValues("postcode") ?? cart?.billingAddress?.postcode}{" "}
          {getValues("city") ?? cart?.billingAddress?.city}
          <Button
            onClick={() => {
              setIsBillingEditOpen(true);
            }}
            variant="inline"
            className={styles.editBillingAddressButton}
          >
            {t("paiement:edit")}
          </Button>
        </div>
        {isBillingEditOpen && (
          <form
            onSubmit={handleSubmit(async () => {
              setIsBillingEditOpen(false);
              await onBillingAddressChange();
            })}
            noValidate
            className={styles.formContainer}
          >
            <div className={styles.manyInputs}>
              <Input
                label={t("common:common.firstName")}
                type="text"
                showRequiredStar
                error={errors.firstName?.message}
                placeholder={t("common:common.firstName")}
                defaultValue={cart?.billingAddress?.firstName ?? ""}
                {...register("firstName", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
              <Input
                label={t("common:common.lastName")}
                type="text"
                showRequiredStar
                error={errors.lastName?.message}
                placeholder={t("common:common.lastName")}
                defaultValue={cart?.billingAddress?.lastName ?? ""}
                {...register("lastName", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
            </div>
            <Input
              label={t("common:common.addressLabel")}
              type="text"
              error={errors.street?.message}
              placeholder={t("common:common.addressLabel")}
              defaultValue={cart?.billingAddress?.street ?? ""}
              {...register("street")}
            />
            <Input
              label={t("common:common.additionalInformations")}
              type="text"
              error={errors.additionalInformations?.message}
              placeholder={t("common:common.additionalInformations")}
              defaultValue={cart?.billingAddress?.additionalInformations ?? ""}
              {...register("additionalInformations")}
            />
            <div className={styles.manyInputs}>
              <Input
                label={t("common:common.postalCode")}
                type="text"
                showRequiredStar
                error={errors.postcode?.message}
                placeholder={t("common:common.postalCode")}
                defaultValue={cart?.billingAddress?.postcode ?? ""}
                {...register("postcode", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
              <Input
                label={t("common:common.city")}
                type="text"
                showRequiredStar
                error={errors.city?.message}
                placeholder={t("common:common.city")}
                defaultValue={cart?.billingAddress?.city ?? ""}
                {...register("city", {
                  required: { value: true, message: t("common:form.requiredField") },
                })}
              />
            </div>
            <div className={styles.manyInputs}>
              <Select
                control={control}
                className={styles.expandDropdown}
                showRequiredStar
                error={errors.countryCode?.message}
                {...register("countryCode", {
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
                  setValue("provinceCode", "");
                }}
              />
              <Select
                control={control}
                className={styles.expandDropdown}
                error={errors.provinceCode?.message}
                label={t("common:common.state")}
                showRequiredStar={billingAddressProvinces.length > 0}
                disabled={billingAddressProvinces.length === 0}
                {...register("provinceCode", {
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
            <Input
              label={t("common:common.phone")}
              showRequiredStar
              error={errors.phoneNumber?.message}
              defaultValue={cart?.customer?.phoneNumber ?? ""}
              placeholder={t("common:common.phone")}
              {...register("phoneNumber", {
                required: { value: true, message: t("common:form.requiredField") },
              })}
            />
            <Button variant="primaryBlack" className={styles.validateButton}>
              {t("paiement:validate")}
            </Button>
          </form>
        )}
      </div>
      <UnsupportedCurrencyModal
        onContinue={onUnsupportedCurrencyModalContinue}
        open={isUnsupportedCurrencyModalOpen}
        setOpen={setIsUnsupportedCurrencyModalOpen}
        currency={user?.currencyCode ?? ""}
        amountInEur={cart?.total ?? 0}
      />
    </CheckoutLayout>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
