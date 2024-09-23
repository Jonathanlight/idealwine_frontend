import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { isAxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Input from "@/components/atoms/Input/Input";
import CheckoutLayout from "@/components/organisms/GeneralCheckout/CheckoutLayout/CheckoutLayout";
import NonMatchingAdressesModal from "@/components/organisms/GeneralCheckout/NonMatchingAdresses/NonMatchingAdressesModal";
import SelectBox from "@/components/organisms/GeneralCheckout/SelectBox/SelectBox";
import CommandGroupingComponent from "@/components/organisms/ShippingPage/CommandGroupingComponent/CommandGroupingComponent";
import HomeDeliveryAddressForm from "@/components/organisms/ShippingPage/HomeDeliveryAddressForm/HomeDeliveryAddressForm";
import OnSiteComponent from "@/components/organisms/ShippingPage/OnSiteComponent/OnSiteComponent";
import RelayPointComponent from "@/components/organisms/ShippingPage/RelayPointComponent/RelayPointComponent";
import StorageComponent from "@/components/organisms/ShippingPage/StorageComponent/StorageComponent";
import { FormType } from "@/components/organisms/ShippingPage/constants";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useFullPageLoaderContext } from "@/context/FullPageLoaderContext/useFullPageLoaderContext";
import { useAvailableShippingMethods } from "@/hooks/useAvailableShippingMethods";
import { useRedirectInCheckoutFunnel } from "@/hooks/useRedirectUserInCheckoutFunnel";
import {
  RelayPointDTOJsonld,
  ShippingMethodJsonldShopOrderReadCode,
  ShippingMethodJsonldShopShippingMethodRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  useShopPutOrderItem,
  useShopSelectShippingMethodOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { ConstraintViolationList } from "@/networking/types";
import { translatedLinks } from "@/urls/linksTranslation";
import { ADDRESSES, CATEGORIES, CODE_TO_SHIPPING_METHOD } from "@/utils/constants";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { sendCartDeliveryGtmEvent } from "@/utils/gtmUtils";
import { ImageFilters } from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyArray, isNotNullNorUndefined, isNullOrUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

type AddressingDataType = {
  relayPointCode?: string;
  street: string | undefined;
  postcode: string | undefined;
  city: string | undefined;
  additionalInformations: string | undefined;
  deliveryComments: string | undefined;
  provinceCode: string | undefined;
  company: string | undefined;
};

const Page = () => {
  const { t, lang } = useTranslation();
  const { cart, setCart, isFetchCartLoading, user } = useAuthenticatedUserContext();
  const [shouldBeDisabled, setShouldBeDisabled] = useState(true);
  const [giftMessageOpen, setGiftMessageOpen] = useState(false);
  const [dataAlreadyLoaded, setDataAlreadyLoaded] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [relayPoints, setRelayPoints] = useState<RelayPointDTOJsonld[] | null>(null);
  const { mutateAsync: changeCartShippingMethod, isLoading: changeCartShippingMethodLoading } =
    useShopSelectShippingMethodOrderItem();
  const { mutateAsync: changeCartAddress, isLoading: changeCartAddressLoading } =
    useShopPutOrderItem();
  const { availableMethods, isLoading } = useAvailableShippingMethods(cart, lang);
  const { setIsFullPageLoaderOpen } = useFullPageLoaderContext();
  const {
    register,
    getValues,
    control,
    formState: { errors },
    trigger,
    setError,
    reset,
    handleSubmit,
    setValue,
  } = useForm<FormType>();
  const { push } = useRouter();

  const [alreadyShownModal, setAlreadyShownModal] = useState(false);
  const [nonMatchingAdressesOpen, setNonMatchingAdressesOpen] = useState(false);

  const usesShippingGroupingMethod = cart?.shipments?.find(
    shipment =>
      shipment.method?.code === ShippingMethodJsonldShopOrderReadCode["WORLD-SHIPPING-GROUPMENT"],
  );

  useRedirectInCheckoutFunnel("CART_HAS_BEEN_ADRESSED");

  useEffect(() => {
    setIsFullPageLoaderOpen(isLoading || isFetchCartLoading);
  }, [isLoading, isFetchCartLoading, setIsFullPageLoaderOpen]);

  useEffect(() => {
    if (alreadyShownModal) {
      return;
    }
    if (isNullOrUndefined(user?.countryCode) || isNullOrUndefined(cart?.shippingAddress)) {
      return;
    }
    if (user?.countryCode !== cart?.shippingAddress?.countryCode) {
      setNonMatchingAdressesOpen(true);
      setAlreadyShownModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.shippingAddress, user?.countryCode]);

  const currentCountryCode = cart?.shippingAddress?.countryCode ?? "FR";

  useEffect(() => {
    if (
      isNotNullNorUndefined(cart?.shippingAddress?.giftMessage) &&
      cart?.shippingAddress?.giftMessage !== ""
    ) {
      setValue("giftMessage", cart?.shippingAddress?.giftMessage ?? "");
      setGiftMessageOpen(true);
    } else {
      setValue("giftMessage", "");
      setGiftMessageOpen(false);
    }
  }, [cart?.shippingAddress?.giftMessage, setValue]);

  useEffect(() => {
    const currentShippingMethod = cart?.shipments?.[0]?.method?.code;
    if (isNullOrUndefined(cart) || dataAlreadyLoaded) {
      return;
    }
    if (isNullOrUndefined(currentShippingMethod)) {
      setDataAlreadyLoaded(true);

      return;
    }
    setSelectedMethod(currentShippingMethod);
    setSelectedTab(CODE_TO_SHIPPING_METHOD[currentShippingMethod]);
    setFormData(
      currentShippingMethod,
      {
        address1: "",
        postcode: "",
        localite: "",
        countryCode: "",
        name: "",
      },
      currentShippingMethod,
    );
    if (CODE_TO_SHIPPING_METHOD[currentShippingMethod] === CATEGORIES.RELAY_POINT) {
      setShouldBeDisabled(true);
    } else {
      setShouldBeDisabled(false);
    }
    setDataAlreadyLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.shipments]);

  const setFormData = (
    newShippingMethod: string,
    relayPointData: RelayPointDTOJsonld = {
      address1: "",
      postcode: "",
      localite: "",
      countryCode: "",
      name: "",
    },
    previousShippingMethod: ShippingMethodJsonldShopOrderReadCode = ShippingMethodJsonldShopOrderReadCode[
      "WORLD-STORAGE"
    ],
  ) => {
    const customerData = {
      firstName: cart?.customer?.firstName ?? "",
      lastName: cart?.customer?.lastName ?? "",
      phoneNumber: cart?.customer?.phoneNumber ?? "",
      company: cart?.customer?.companyName ?? "",
    };
    let addressingData: AddressingDataType;
    const previousShippingCategory = CODE_TO_SHIPPING_METHOD[previousShippingMethod];
    switch (CODE_TO_SHIPPING_METHOD[newShippingMethod]) {
      case CATEGORIES.HOME_DELIVERY:
        if (previousShippingCategory === CATEGORIES.HOME_DELIVERY) {
          addressingData = {
            street: cart?.shippingAddress?.street ?? "",
            postcode: cart?.shippingAddress?.postcode ?? "",
            city: cart?.shippingAddress?.city ?? "",
            additionalInformations: cart?.shippingAddress?.additionalInformations ?? "",
            provinceCode: cart?.shippingAddress?.provinceCode ?? "",
            company: cart?.shippingAddress?.company ?? "",
            deliveryComments: cart?.shippingAddress?.deliveryComments ?? "",
          };
        } else {
          addressingData = {
            street: cart?.customer?.defaultAddress?.street ?? "",
            postcode: cart?.customer?.defaultAddress?.postcode ?? "",
            city: cart?.customer?.defaultAddress?.city ?? "",
            additionalInformations: cart?.customer?.defaultAddress?.additionalInformations ?? "",
            provinceCode: cart?.customer?.defaultAddress?.provinceCode ?? "",
            company: cart?.customer?.defaultAddress?.company ?? "",
            deliveryComments: "",
          };
        }
        break;
      case CATEGORIES.STORAGE:
      case CATEGORIES.ON_SITE:
        if (newShippingMethod in ADDRESSES) {
          const typedNewShippingMethod = newShippingMethod as keyof typeof ADDRESSES;
          const currentProvinceCode = getValues("shippingAddress.provinceCode") ?? undefined;
          addressingData = {
            ...ADDRESSES[typedNewShippingMethod],
            additionalInformations: "",
            provinceCode: currentProvinceCode,
            deliveryComments: "",
          };
        } else {
          addressingData = {
            street: "",
            postcode: "",
            city: "",
            additionalInformations: "",
            provinceCode: "",
            company: "",
            deliveryComments: "",
          };
        }
        break;
      case CATEGORIES.GROUPING:
        addressingData = {
          street: cart?.customer?.defaultAddress?.street ?? "",
          postcode: cart?.customer?.defaultAddress?.postcode ?? "",
          city: cart?.customer?.defaultAddress?.city ?? "",
          additionalInformations: cart?.customer?.defaultAddress?.additionalInformations ?? "",
          provinceCode: cart?.customer?.defaultAddress?.provinceCode ?? "",
          company: cart?.customer?.defaultAddress?.company ?? "",
          deliveryComments: "",
        };
        break;
      case CATEGORIES.RELAY_POINT:
        addressingData = {
          relayPointCode: relayPointData.id,
          street: relayPointData.address1,
          postcode: relayPointData.postcode,
          city: relayPointData.localite,
          additionalInformations: "",
          provinceCode: "",
          company: relayPointData.name,
          deliveryComments: "",
        };
        break;
      default:
        addressingData = {
          street: "",
          postcode: "",
          city: "",
          additionalInformations: "",
          provinceCode: "",
          company: "",
          deliveryComments: "",
        };
        break;
    }
    reset({
      shippingAddress: {
        ...customerData,
        ...addressingData,
        company: addressingData.company,
        additionalInformations:
          addressingData.additionalInformations !== ""
            ? addressingData.additionalInformations
            : getValues("shippingAddress.additionalInformations"),
        deliveryComments:
          addressingData.deliveryComments !== ""
            ? addressingData.deliveryComments
            : getValues("shippingAddress.deliveryComments"),
        countryCode: currentCountryCode,
      },
      relayPoint: {
        ...getValues("relayPoint"),
        countryCode: currentCountryCode,
      },
      giftMessage: getValues("giftMessage"),
    });
  };

  const onShippingMethodChange = async (newShippingMethod: string) => {
    try {
      setSelectedMethod(newShippingMethod);
      const newCart = await changeCartShippingMethod({
        tokenValue: cart?.tokenValue ?? "",
        shipmentId: cart?.shipments?.[0]?.id?.toString() ?? "0",
        data: {
          shippingMethod: newShippingMethod,
        },
        params: { filter: [ImageFilters.CART] },
      });
      setCart(newCart);
    } catch (e) {
      toast.error<string>(t("checkout-common:errorOccurred"));
    }
  };

  const generateCategoryContent = (
    category: string,
    availableMethodsList: ShippingMethodJsonldShopShippingMethodRead[],
  ) => {
    switch (category) {
      case "HOME_DELIVERY":
        return (
          <HomeDeliveryAddressForm
            register={register}
            control={control}
            errors={errors}
            availableMethodsList={availableMethodsList}
            selectedMethod={selectedMethod}
            onShippingMethodChange={onShippingMethodChange}
            currentCountryCode={currentCountryCode}
          />
        );
      case "GROUPING":
        return <CommandGroupingComponent />;
      case "STORAGE":
        return <StorageComponent allowed={categoryIsNotEmpty(availableMethodsList)} />;
      case "ON_SITE":
        return (
          <OnSiteComponent
            availableMethodsList={availableMethodsList}
            selectedMethod={selectedMethod}
            onShippingMethodChange={onShippingMethodChange}
            setFormData={setFormData}
          />
        );
      case "RELAY_POINT":
        return (
          <RelayPointComponent
            currentShippingMethod={selectedMethod}
            setFormData={setFormData}
            register={register}
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            relayPoints={relayPoints}
            setRelayPoints={setRelayPoints}
            customer={cart?.customer}
            setShouldBeDisabled={setShouldBeDisabled}
            currentCountryCode={currentCountryCode}
          />
        );
      default:
        return;
    }
  };

  const onShippingValidation = async () => {
    try {
      const validForm = await trigger();
      if (!validForm) {
        return;
      }
      const formValues = getValues();
      const {
        firstName,
        lastName,
        street,
        postcode,
        city,
        phoneNumber,
        company,
        provinceCode,
        additionalInformations,
        relayPointCode,
        deliveryComments,
      } = formValues.shippingAddress;
      const message = usesShippingGroupingMethod ? "" : formValues.giftMessage;
      const billingAddress = cart?.billingAddress;
      await changeCartAddress({
        tokenValue: cart?.tokenValue ?? "",
        data: {
          billingAddress: billingAddress,
          shippingAddress: {
            ...cart?.shippingAddress,
            // @ts-expect-error Orval sending wrong types : probably a serialization issue.
            firstName: firstName,
            lastName: lastName,
            street: street,
            postcode: postcode,
            city: city,
            countryCode: currentCountryCode,
            phoneNumber: phoneNumber,
            company: company,
            provinceCode: provinceCode === "" ? null : provinceCode,
            additionalInformations: additionalInformations,
            deliveryComments: deliveryComments,
            relayPointCode: relayPointCode,
            ...(usesShippingGroupingMethod || giftMessageOpen
              ? { giftMessage: message }
              : { giftMessage: null }),
          },
          couponCode: cart?.couponCode,
        },
      });
      const shippedCart = await changeCartShippingMethod({
        tokenValue: cart?.tokenValue ?? "",
        shipmentId: cart?.shipments?.[0]?.id?.toString() ?? "0",
        data: {
          shippingMethod: selectedMethod,
        },
        params: { filter: [ImageFilters.CART] },
      });
      sendCartDeliveryGtmEvent(shippedCart);
      setCart(shippedCart);
      await push({
        pathname: translatedLinks.PAYMENT_URL[lang],
      });
    } catch (error) {
      toast.error<string>(t("checkout-common:errorOccurred"));
      if (!isAxiosError(error) || error.response?.status !== 422) {
        return;
      }

      const { violations } = error.response.data as ConstraintViolationList<keyof FormType>;
      violations.forEach(({ propertyPath, message }) => {
        if (propertyPath !== "") setError(propertyPath, { message });
      });
    }
  };

  const categoryIsNotEmpty = (
    availableMethodsList: ShippingMethodJsonldShopShippingMethodRead[] | undefined,
  ): availableMethodsList is ShippingMethodJsonldShopShippingMethodRead[] => {
    return isNotNullNorUndefined(availableMethodsList) && isNonEmptyArray(availableMethodsList);
  };

  const mustAlwaysBeDisplayed = (category: string): boolean => {
    return category === "STORAGE";
  };

  useMountEffect(() => {
    sendGTMEvent({
      page: "livraison",
      pageChapter1: "checkout",
      pageChapter2: "",
    });
  });

  return (
    <CheckoutLayout
      currentPage="shipping"
      nextPageUrlName="PAYMENT_URL"
      disabled={shouldBeDisabled}
      onClickNextPage={onShippingValidation}
      isLoading={changeCartShippingMethodLoading || changeCartAddressLoading}
    >
      <NonMatchingAdressesModal
        open={nonMatchingAdressesOpen}
        setOpen={setNonMatchingAdressesOpen}
      />
      <div className={styles.shippingTitleContainer}>
        <h1 className={styles.shippingTitle}>{t("livraison:chooseShipping")}</h1>
      </div>
      {availableMethods.map(([category, availableMethodsList]) => {
        return (
          (categoryIsNotEmpty(availableMethodsList) || mustAlwaysBeDisplayed(category)) && (
            <SelectBox
              key={category}
              title={t(`livraison:${category}.title`)}
              isSelected={selectedTab === category}
              onSelect={async () => {
                setSelectedTab(category);
                setShouldBeDisabled(category === CATEGORIES.RELAY_POINT);
                if (categoryIsNotEmpty(availableMethodsList)) {
                  setFormData(availableMethodsList[0].code);
                  setSelectedMethod(availableMethodsList[0].code);
                  await onShippingMethodChange(availableMethodsList[0].code);

                  return;
                }
                setShouldBeDisabled(true);
              }}
            >
              {generateCategoryContent(category, availableMethodsList ?? [])}
            </SelectBox>
          )
        );
      })}
      {!usesShippingGroupingMethod && (
        <div className={styles.giftMessageContainer}>
          <Input
            type="checkbox"
            label={t("livraison:giftMessageCheckboxLabel")}
            onChange={() => setGiftMessageOpen(!giftMessageOpen)}
            checked={giftMessageOpen}
            labelClassName={styles.giftMessageInput}
            inputClassName={styles.giftMessageCheckbox}
          />
          {giftMessageOpen && (
            <>
              <label className={styles.textareaLabel}>
                {t("livraison:giftMessageTextareaLabel")}
                <input
                  type="text"
                  maxLength={300}
                  className={styles.giftMessageCustomerInput}
                  {...register("giftMessage")}
                  placeholder={t("livraison:giftMessageTextareaPlaceholder")}
                />
              </label>
              <div className={styles.giftMessageBottomText}>{t("livraison:maxCharacters")}</div>
            </>
          )}
        </div>
      )}
    </CheckoutLayout>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
