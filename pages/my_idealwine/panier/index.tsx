import { faCircleXmark } from "@fortawesome/pro-thin-svg-icons/faCircleXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useMountEffect } from "@react-hookz/web";
import { useQueryClient } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";

import LinkButton from "@/components/atoms/Button/LinkButton";
import Select from "@/components/atoms/Select/Select";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import EmptyCart from "@/components/molecules/EmptyCart/EmptyCart";
import Price from "@/components/molecules/Price/Price";
import CartCountdown from "@/components/organisms/CartPage/CartCountdown";
import CheckoutLayout from "@/components/organisms/GeneralCheckout/CheckoutLayout/CheckoutLayout";
import NonDeliveredOrderSection from "@/components/organisms/NonDeliveredOrderSection/NonDeliveredOrderSection";
import { CountriesNameByCode } from "@/components/organisms/NotDeliveredOrderCartLine/NotDeliveredOrderCartLine";
import NumberOfBottlesWithFormat from "@/components/organisms/NumberOfBottlesWithFormat";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useFullPageLoaderContext } from "@/context/FullPageLoaderContext/useFullPageLoaderContext";
import { CartDataLayer } from "@/hooks/useCartDataLayer";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import {
  CustomerJsonldShopCustomerReadXtraOrder,
  OrderItemJsonldShopCartRead,
  ShippingMethodJsonldShopOrderReadCode,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useShopGetCountryCollection } from "@/networking/sylius-api-client/country/country";
import {
  useShopChangeQuantityOrderItem,
  useShopCompleteAutomaticCheckoutOrderItem,
  useShopGetOrderCollection,
  useShopRemoveItemOrderItem,
  useShopValidateBasketOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { getShopGetProductVariantItemQueryKey } from "@/networking/sylius-api-client/product-variant/product-variant";
import { translatedLinks } from "@/urls/linksTranslation";
import { MAX_AVAILABLE_QUANTITY_TO_SHOW } from "@/utils/availableQuantity";
import { ORDER_STATES, STALE_TIME_HOUR } from "@/utils/constants";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import {
  sendCartUpdateGtmEvent,
  sendProductAddToCartGtmEvent,
  sendProductRemoveFromCartGtmEvent,
} from "@/utils/gtmUtils";
import {
  ImageFilters,
  Image as ImageInterface,
  isFilteredImage,
  productVariantImageFiltersParameter,
} from "@/utils/imageFilters";
import { useTranslation } from "@/utils/next-utils";
import { getAwaitingPaymentOrders, getNonPaidOrders, getPaidOrders } from "@/utils/orderUtils";
import { isNonEmptyArray, isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";

const isCartProductVariantImage = (
  image?: ImageInterface | null,
): image is { path: { product_variant_x_small: string } } =>
  isFilteredImage(image) && typeof image.path.product_variant_x_small === "string";

const Page = () => {
  const { t, lang } = useTranslation("panier");
  const { data: enabledCountries } = useShopGetCountryCollection(
    { enabled: true },
    { query: { staleTime: STALE_TIME_HOUR } },
  );
  const { currentDeliveryCountry } = useCurrentDeliveryCountry();
  const { user, cart, fetchCart, setCart, isFetchCartLoading } = useAuthenticatedUserContext();
  const { data: nonDeliveredOrdersData, isLoading: isNonDeliveredOrdersLoading } =
    useShopGetOrderCollection(
      {
        filter: [ImageFilters.CART],
        "shipments.method.code": ShippingMethodJsonldShopOrderReadCode["WORLD-SHIPPING-GROUPMENT"],
        state: ORDER_STATES.STATE_NEW,
        itemsPerPage: 500, // No pagination on cart user orders
      },
      { query: { enabled: isNotNullNorUndefined(user) } },
    );
  const nonDeliveredOrders = nonDeliveredOrdersData?.["hydra:member"];

  const { mutateAsync: validateMyCart, isLoading: isValidateMyCartLoading } =
    useShopValidateBasketOrderItem();

  const getCartProductVariantImagePath = (image?: ImageInterface | null): string =>
    isCartProductVariantImage(image)
      ? image.path.product_variant_x_small
      : `/_no_picture_${lang}.jpg`;

  const queryClient = useQueryClient();

  const countriesNameByCode = useMemo(() => {
    return (
      enabledCountries?.reduce((acc, country) => {
        acc[country.code] = country.name ?? "MissingName";

        return acc;
      }, {} as CountriesNameByCode) ?? {}
    );
  }, [enabledCountries]);

  const paidAndNonDeliveredOrders = getPaidOrders(nonDeliveredOrders ?? []);
  const hasPaidAndNonDeliveredOrders = isNonEmptyArray(paidAndNonDeliveredOrders);
  const nonPaidAndNonDeliveredOrders = getNonPaidOrders(nonDeliveredOrders ?? []);
  const hasNonPaidAndNonDeliveredOrders = isNonEmptyArray(nonPaidAndNonDeliveredOrders);
  const awaitingPaymentAndNonDeliveredOrders = getAwaitingPaymentOrders(nonDeliveredOrders ?? []);
  const hasAwaitingPaymentAndNonDeliveredOrders = isNonEmptyArray(
    awaitingPaymentAndNonDeliveredOrders,
  );
  const { mutateAsync: changeQuantityOrderItem, isLoading: isChangingItemQuantity } =
    useShopChangeQuantityOrderItem();
  const { mutateAsync: shopRemoveItemOrderItem, isLoading: isRemovingItem } =
    useShopRemoveItemOrderItem();
  const { isLoading: isDoingAutomaticCheckout } = useShopCompleteAutomaticCheckoutOrderItem();
  const { setIsFullPageLoaderOpen } = useFullPageLoaderContext();
  const { push } = useRouter();
  const hasNonDeliveredOrders =
    hasNonPaidAndNonDeliveredOrders ||
    hasPaidAndNonDeliveredOrders ||
    hasAwaitingPaymentAndNonDeliveredOrders;
  const hasItems = isNonEmptyArray(cart?.items);

  const isXtraOrder = user?.xtraOrder !== CustomerJsonldShopCustomerReadXtraOrder.NO_XTRA_ORDER;

  const options = (cartItem: OrderItemJsonldShopCartRead) => {
    let maximumCartQuantity = undefined;
    if (
      isNotNullNorUndefined(cartItem.variant.onHand) &&
      isNotNullNorUndefined(cartItem.variant.onHold) &&
      isNotNullNorUndefined(cartItem.quantity)
    ) {
      maximumCartQuantity = cartItem.variant.onHand - cartItem.variant.onHold + cartItem.quantity;
    }

    const limitedQuantityPerOrder = cartItem.variant.limitedQuantityPerOrder ?? 0;

    const maximum = Math.min(
      maximumCartQuantity ?? MAX_AVAILABLE_QUANTITY_TO_SHOW,
      limitedQuantityPerOrder !== 0 ? limitedQuantityPerOrder : MAX_AVAILABLE_QUANTITY_TO_SHOW,
      MAX_AVAILABLE_QUANTITY_TO_SHOW,
    );

    return Array.from({ length: maximum }, (_, index) => {
      const lotNumber = (index + 1).toString();

      return { value: lotNumber, label: lotNumber };
    });
  };

  const handleItemNumberChanged = async (
    itemId: number | undefined,
    newValue: number,
    oldValue = 0,
  ) => {
    try {
      const newCart = await changeQuantityOrderItem({
        tokenValue: cart?.tokenValue ?? "",
        orderItemId: itemId?.toString() ?? "",
        params: { filter: [ImageFilters.CART] },
        data: { quantity: newValue },
      });
      const newItem = newCart.items?.find(cartItem => cartItem.id === itemId);
      const itemHasLimitedQuantity =
        isNotNullNorUndefined(newItem?.variant.limitedQuantityPerOrder) &&
        (newItem?.variant.limitedQuantityPerOrder ?? 0) > 0;
      if (newItem?.quantity !== newValue && itemHasLimitedQuantity) {
        toast.warning<string>(t("limitedQuantityWarning"));
      }
      setCart(newCart);
      sendCartUpdateGtmEvent(newCart);

      if (newValue > oldValue) sendProductAddToCartGtmEvent(newCart, currentDeliveryCountry, t);
      if (newValue < oldValue) sendProductRemoveFromCartGtmEvent(cart, newItem, t);

      if (newItem?.variant.code === undefined) return;

      await queryClient.invalidateQueries(
        getShopGetProductVariantItemQueryKey(
          newItem.variant.code,
          productVariantImageFiltersParameter,
        ),
      );

      return;
    } catch (error) {
      toast.error<string>(t("errorOccurred"));

      return;
    }
  };

  const deleteCartItem = async (cartItem: OrderItemJsonldShopCartRead) => {
    try {
      await shopRemoveItemOrderItem({
        tokenValue: cart?.tokenValue ?? "",
        itemId: cartItem.id?.toString() ?? "",
      });

      const newCart = await fetchCart();

      sendCartUpdateGtmEvent(newCart);
      sendProductRemoveFromCartGtmEvent(newCart, cartItem, t);

      return;
    } catch (error) {
      toast.error<string>(t("errorOccurred"));

      return;
    }
  };

  const attachAddressToCart = async () => {
    try {
      const newCart = await validateMyCart({
        tokenValue: cart?.tokenValue ?? "",
        params: { filter: [ImageFilters.CART] },
        data: { couponCode: cart?.couponCode },
      });
      setCart(newCart);
      await push({
        pathname: translatedLinks.SHIPPING_URL[lang],
      });
    } catch (error) {
      toast.error<string>(t("errorOccurred"));
    }
  };

  useEffect(() => {
    setIsFullPageLoaderOpen(
      isFetchCartLoading ||
        isNonDeliveredOrdersLoading ||
        isDoingAutomaticCheckout ||
        isChangingItemQuantity ||
        isRemovingItem,
    );
  }, [
    isChangingItemQuantity,
    isDoingAutomaticCheckout,
    isFetchCartLoading,
    isNonDeliveredOrdersLoading,
    isRemovingItem,
    setIsFullPageLoaderOpen,
  ]);

  useMountEffect(() => {
    sendGTMEvent({
      page: "panier",
      pageChapter1: "checkout",
      pageChapter2: "",
    });
  });

  if (!cart) {
    return null;
  }

  if (!hasNonDeliveredOrders && !hasItems) {
    return <EmptyCart />;
  }

  return (
    <CheckoutLayout
      currentPage="basket"
      nextPageUrlName="SHIPPING_URL"
      onClickNextPage={attachAddressToCart}
      isLoading={isValidateMyCartLoading}
    >
      <NextSeo title={t("seo.title")} description={t("seo.description")} />
      {isNotNullNorUndefined(cart) && <CartDataLayer cart={cart} />}
      <div className={styles.myBasketContainer}>
        <div className={styles.myBasketTitle}>
          <span className={styles.uppercase}>{t("checkout-common:myBasket")}</span>
          {hasItems && (
            <span className={styles.myBasketToolTip}>
              <CartCountdown cart={cart} />
            </span>
          )}
        </div>
        {hasItems ? (
          <div className={styles.myBasketContent}>
            {cart.items?.map(cartItem => {
              const fullPriceWithoutDiscount =
                (cartItem.originalUnitPrice ?? 0) * (cartItem.quantity ?? 0);
              const isItemDiscounted = fullPriceWithoutDiscount !== cartItem.subtotal;

              return (
                <div key={cartItem.id} className={styles.cartItemContainer}>
                  <Image
                    unoptimized
                    src={getCartProductVariantImagePath(cartItem.variant.firstImage)}
                    alt={""}
                    width={84}
                    height={120}
                  />
                  <div className={styles.cartItemContent}>
                    <TranslatableLink
                      href={`/buy-a-wine/${cartItem.variant.code}`}
                      className={styles.cartItemText}
                      dontTranslate
                    >
                      <div className={styles.cartItemDirectSale}>{t("directSale")}</div>
                      <div className={styles.cartItemDescription}>
                        <NumberOfBottlesWithFormat variant={cartItem.variant} />{" "}
                        {cartItem.variant.name}
                      </div>
                    </TranslatableLink>
                    <div className={styles.cartItemToolbox}>
                      <div className={styles.cartItemPrice}>
                        <Price
                          price={cartItem.subtotal ?? 0}
                          size="normal"
                          isDiscount={isItemDiscounted}
                        />
                        {isItemDiscounted && (
                          <Price price={fullPriceWithoutDiscount} size="small" strikethrough />
                        )}
                      </div>
                      {cartItem.variant.secondHand === false && (
                        <Select
                          placeholder={cartItem.quantity?.toString() ?? "1"}
                          triggerClassName={styles.cartItemDropdownSelect}
                          options={{
                            groups: [{ key: "cartItem", options: options(cartItem) }],
                          }}
                          value={cartItem.quantity?.toString()}
                          onValueChange={newValue =>
                            handleItemNumberChanged(
                              cartItem.id,
                              parseInt(newValue),
                              cartItem.quantity,
                            )
                          }
                        />
                      )}
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteCartItem(cartItem)}
                      >
                        <FontAwesomeIcon size="xl" icon={faCircleXmark} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyBasketContainer}>
            {t("panier:emptyBasket")}
            <LinkButton
              href={getPlpUrl({}, lang)}
              variant="primaryBlack"
              dontTranslate
              className={styles.emptyBasketButton}
            >
              {t("panier:emptyBasketCallToAction")}
            </LinkButton>
          </div>
        )}
      </div>

      {hasNonPaidAndNonDeliveredOrders && (
        <NonDeliveredOrderSection
          title={t("checkout-common:myUnpaidOrders")}
          tooltip={
            isXtraOrder ? t("myUnpaidOrdersTooltipXtraOrder") : t("myUnpaidOrdersTooltipNormal")
          }
          orders={nonPaidAndNonDeliveredOrders}
          countriesNameByCode={countriesNameByCode}
        />
      )}

      {hasPaidAndNonDeliveredOrders && (
        <NonDeliveredOrderSection
          title={t("checkout-common:myPaidOrders")}
          tooltip={t("myPaidOrdersTooltip")}
          orders={paidAndNonDeliveredOrders}
          countriesNameByCode={countriesNameByCode}
        />
      )}

      {hasAwaitingPaymentAndNonDeliveredOrders && (
        <NonDeliveredOrderSection
          title={t("myAwaitingPaymentOrders")}
          orders={awaitingPaymentAndNonDeliveredOrders}
          countriesNameByCode={countriesNameByCode}
          canToggleItems={false}
        />
      )}
    </CheckoutLayout>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default Page;
