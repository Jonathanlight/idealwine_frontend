import { faBagShopping } from "@fortawesome/pro-light-svg-icons/faBagShopping";
import { faCartFlatbedBoxes } from "@fortawesome/pro-light-svg-icons/faCartFlatbedBoxes";
import { faCreditCard } from "@fortawesome/pro-light-svg-icons/faCreditCard";
import { faLightbulbExclamationOn } from "@fortawesome/pro-light-svg-icons/faLightbulbExclamationOn";
import { faLockKeyhole } from "@fortawesome/pro-light-svg-icons/faLockKeyhole";
import { faCircleMinus } from "@fortawesome/pro-thin-svg-icons/faCircleMinus";
import { faCirclePlus } from "@fortawesome/pro-thin-svg-icons/faCirclePlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGTMEvent } from "@next/third-parties/google";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { format } from "date-fns";
import Image from "next/image";
import { Fragment, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button/Button";
import LinkButton from "@/components/atoms/Button/LinkButton";
import FillableBar from "@/components/atoms/FillableBar";
import GroupedOrderRecapLine from "@/components/atoms/GroupedOrderRecapLine/GroupedOrderRecapLine";
import Price from "@/components/molecules/Price/Price";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import {
  CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram,
  CustomerJsonldShopCustomerReadXtraOrder,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useGetCreditNoteCollection } from "@/networking/sylius-api-client/credit-note/credit-note";
import {
  getShopGetOrderCollectionQueryKey,
  useShopCompleteAutomaticCheckoutOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { CheckoutPage, getGtmCategory2FromCategory } from "@/utils/constants";
import { AVAILABLE_LOCALES, getFormatDateWithoutTime } from "@/utils/datesHandler";
import { centsToUnits } from "@/utils/formatHandler";
import { isEmptyCart } from "@/utils/isEmptyCart";
import { useTranslation } from "@/utils/next-utils";
import { sortOrdersBySellTypeDateAndCountry } from "@/utils/orderUtils";
import { isNonEmptyArray, isNotNullNorUndefined, ObjectKeys } from "@/utils/ts-utils";

import BasketGroupingInfoMessageDialog from "../../BasketGroupingInfoMessageDialog";
import CartShippingOptimization from "../../CartShippingOptimization/CartShippingOptimization";
import CompletePersonalInfoDialog from "../CompletePersonalInfoDialog/CompletePersonalInfoDialog";
import styles from "./CheckoutLayout.module.scss";
import CheckoutNavigationLink from "./CheckoutNavigationLink";
import CodePromoPanel from "./CodePromoPanel";
import CreditNotePanel from "./CreditNotePanel";

type CheckoutLayoutProps = {
  children: React.ReactNode;
  currentPage: CheckoutPage;
  nextPageUrlName: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClickNextPage?: () => void;
  applePayButton?: JSX.Element;
};

type GroupedOrdersByDate = {
  date: string;
  auctionPrice: number | null;
  directPurchasePrice: number | null;
  type: string;
}[];

const CheckoutLayout = ({
  children,
  currentPage,
  nextPageUrlName,
  isLoading = false,
  disabled = false,
  onClickNextPage,
  applePayButton,
}: CheckoutLayoutProps) => {
  const { t, lang } = useTranslation("");
  const { user, cart, fetchCart } = useAuthenticatedUserContext();
  const basketItemsCount = cart?.items?.reduce((acc, item) => acc + (item.quantity ?? 1), 0) ?? 0;

  const hasEmptyCart = isEmptyCart(cart);

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isOrderRecapExpend, setIisOrderRecapExpend] = useState(false);
  const [isBasketGroupingInfoMessageDialogOpen, setIsBasketGroupingInfoMessageDialogOpen] =
    useState(false);

  const { data: availableCreditNotes } = useGetCreditNoteCollection({
    available_credit_notes: true,
    valid_credit_notes: true,
    enabled_credit_notes: true,
  });

  const queryClient = useQueryClient();
  const handleNextPageClick = () => {
    if (!user?.hasSetupAddress) {
      setIsConfirmationDialogOpen(true);
    } else {
      onClickNextPage?.();
    }
  };
  const { mutateAsync: doAutomaticCheckout } = useShopCompleteAutomaticCheckoutOrderItem();

  const groupedOrdersByDate = useMemo(() => {
    if (!cart?.groupedOrders) return [];
    const tempGroupedOrdersByDate = [] as GroupedOrdersByDate;
    const sortedGroupedOrders = sortOrdersBySellTypeDateAndCountry(cart.groupedOrders);
    sortedGroupedOrders.forEach(groupedOrder => {
      const checkoutCompletedDate =
        groupedOrder.checkoutCompletedAt?.split("T")?.[0] ?? "invalid date";
      const items = groupedOrder.items ?? [];
      const isAuction = items.length > 0 ? items[0].variant.auction ?? false : false;
      const total = groupedOrder.paymentState === "paid" ? 0 : groupedOrder.total ?? 0;

      let correctDateItems = tempGroupedOrdersByDate.find(
        tempGroupedOrder => tempGroupedOrder.date === checkoutCompletedDate,
      );

      if (correctDateItems === undefined) {
        correctDateItems = {
          date: checkoutCompletedDate,
          auctionPrice: null,
          directPurchasePrice: null,
          type: groupedOrder.paymentState ?? "default",
        };
        tempGroupedOrdersByDate.push(correctDateItems);
      }

      if (isAuction) {
        correctDateItems.auctionPrice = (correctDateItems.auctionPrice ?? 0) + total;
      } else {
        correctDateItems.directPurchasePrice = (correctDateItems.directPurchasePrice ?? 0) + total;
      }
    });

    // Group by type
    const groupedByType = tempGroupedOrdersByDate.reduce((acc, order) => {
      const { type } = order;
      // eslint-disable-next-line
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(order);

      return acc;
    }, {} as Record<string, GroupedOrdersByDate>);

    // Convert grouped object to array
    return Object.keys(groupedByType).map(type => ({
      type,
      orders: groupedByType[type],
    }));
  }, [cart?.groupedOrders]);

  const cartStorageFeeTotal = cart?.storageFeeTotal ?? 0;
  const customsFee = cart?.customsFee ?? 0;

  const fullPromotionsAmount = useMemo(() => {
    const promotionsAmount = cart?.orderItemOrUnitPromotionsAmountByCode ?? {};

    return Object.values(promotionsAmount).reduce((acc, amount) => acc + amount, 0);
  }, [cart?.orderItemOrUnitPromotionsAmountByCode]);
  // Minus here, because the promotion amount is negative (or at least should be)
  const cartItemsTotalBeforePromotions = (cart?.itemsTotal ?? 0) - fullPromotionsAmount;
  const isBasketPage = currentPage === "basket";
  const hasItems = isNonEmptyArray(cart?.items);
  const hasGroupedItems = cart?.groupedOrders?.some(
    groupedOrder => (groupedOrder.items?.length ?? 0) > 0,
  );
  const displayShippingOptimisation = isBasketPage && (hasItems || hasGroupedItems);

  const basketPageState = currentPage === "basket" ? "progress" : "done";
  const shippingPageState =
    currentPage === "shipping" ? "progress" : currentPage === "basket" ? "pending" : "done";
  const paymentPageState = currentPage === "payment" ? "progress" : "pending";
  const isXtraOrder = user?.xtraOrder !== CustomerJsonldShopCustomerReadXtraOrder.NO_XTRA_ORDER;

  const canDoAutomaticCheckout =
    (isXtraOrder ||
      CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.IDEAL === user.loyaltyProgram ||
      CustomerJsonldShopAuctionItemDtoReadLoyaltyProgram.QUINTESSENCE === user.loyaltyProgram) &&
    hasItems &&
    user?.hasSetupAddress &&
    currentPage === "basket";
  const isAutomaticCheckoutDisabled =
    cart?.creditNotes?.length !== 0 || isNotNullNorUndefined(cart.couponCode);

  const executeAutomaticCheckout = async () => {
    try {
      await doAutomaticCheckout({ tokenValue: cart?.tokenValue ?? "", data: cart ?? {} });
      await fetchCart();
      sendGTMEvent({ ecommerce: null });
      sendGTMEvent({
        event: "transactionConfirmation",
        ecommerce: {
          cartId: cart?.tokenValue,
          cartCreationUTC:
            isNotNullNorUndefined(cart?.checkoutCompletedAt) &&
            typeof cart?.checkoutCompletedAt === "string"
              ? Math.floor(new Date(cart.checkoutCompletedAt).getTime() / 1000)
              : "",
          cartCurrency: cart?.currencyCode,
          cartTurnoverTTC: centsToUnits(cart?.itemsTotal ?? 0),
          cartTurnoverTaxFree: cart?.items?.reduce((total, cartItem) => {
            return (
              total +
              (cartItem.variant.priceByCountry
                ? centsToUnits(cartItem.variant.priceByCountry["JP"])
                : centsToUnits(cartItem.unitPrice ?? 0)) *
                (cartItem.quantity ?? 1)
            );
          }, 0),
          cartQuantity: cart?.items?.reduce((count, cartItem) => {
            count += (cartItem.variant.numberOfBottles ?? 0) * (cartItem.quantity ?? 1);

            return count;
          }, 0),
          cartDistinctProduct: cart?.items?.reduce((count, cartItem) => {
            if (!count.includes(cartItem.variant.code)) {
              count.push(cartItem.variant.code);
            }

            return count;
          }, [] as string[]).length,
          shippingType: cart?.shipments?.[0]?.method?.name,
          paymentMode: "xtraorder",
          transactionId: cart?.tokenValue, // TODO
          promoCode: cart?.couponCode,
          purchaseType: "ecaviste",
          products: cart?.items?.map(item => {
            if (item.variant.auction) {
              return null;
            }

            return {
              cartId: cart.tokenValue,
              productId: item.variant.code,
              product: item.variant.name,
              productVariant: item.variant.productVintage?.year,
              productBrand: item.variant.product?.owner,
              productDiscount: (item.originalUnitPrice ?? 0) < (item.unitPrice ?? 0),
              productPriceTTC: centsToUnits(item.total ?? 0) / (item.quantity ?? 1),
              productTaxFree: item.variant.priceByCountry
                ? centsToUnits(item.variant.priceByCountry["JP"]) / (item.quantity ?? 1)
                : centsToUnits(item.total ?? 0) / (item.quantity ?? 1),
              product_currency: cart.currencyCode,
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
              paymentMode: "xtraorder",
              transactionId: cart.tokenValue,
              promoCode: cart.couponCode,
            };
          }),
        },
      });
      await queryClient.invalidateQueries(getShopGetOrderCollectionQueryKey());
    } catch (error) {
      toast.error<string>(t("panier:errorOccurred"));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <CompletePersonalInfoDialog
        open={isConfirmationDialogOpen}
        setOpen={setIsConfirmationDialogOpen}
      />
      <BasketGroupingInfoMessageDialog
        open={isBasketGroupingInfoMessageDialogOpen}
        setOpen={setIsBasketGroupingInfoMessageDialogOpen}
      />
      <div className={styles.whitePart}>
        {isNotNullNorUndefined(cart) && displayShippingOptimisation && (
          <CartShippingOptimization cart={cart} />
        )}
        {children}
      </div>
      <div className={styles.greyPart}>
        <div className={styles.stickyDiv}>
          <div className={clsx(styles.divider, styles.dontShowOnDesktop)} />
          <div className={styles.navigationLogos}>
            <CheckoutNavigationLink href="BASKET_URL" icon={faBagShopping} state={basketPageState}>
              {t("checkout-common:basketName")}
            </CheckoutNavigationLink>
            <div className={clsx(styles.dontShowOnSmallDesktop, styles.progressBar)}>
              <FillableBar filledPercentage={basketPageState === "done" ? 100 : 50} />
            </div>
            <CheckoutNavigationLink
              href="SHIPPING_URL"
              icon={faCartFlatbedBoxes}
              state={shippingPageState}
            >
              {t("checkout-common:shippingName")}
            </CheckoutNavigationLink>
            <div className={clsx(styles.dontShowOnSmallDesktop, styles.progressBar)}>
              <FillableBar
                filledPercentage={
                  shippingPageState === "done" ? 100 : shippingPageState === "progress" ? 50 : 0
                }
              />
            </div>
            <CheckoutNavigationLink href="PAYMENT_URL" icon={faCreditCard} state={paymentPageState}>
              {t("checkout-common:paymentName")}
            </CheckoutNavigationLink>
          </div>
          <div className={styles.orderRecap}>
            <div className={styles.recapTitle}>{t("checkout-common:recap")}</div>
            <div className={styles.orderRecapContent}>
              <div
                className={clsx(
                  styles.orderRecapContentCommands,
                  isOrderRecapExpend && styles.expended,
                )}
              >
                {basketItemsCount > 0 && (
                  <div className={styles.orderRecapSection}>
                    <div className={styles.orderRecapBasket}>{t("checkout-common:myBasket")}</div>
                    <div className={styles.orderRecapLine}>
                      <span>{t("checkout-common:basketItems", { count: basketItemsCount })}</span>
                      <Price price={cartItemsTotalBeforePromotions} size="small" />
                    </div>
                    {cart?.orderItemOrUnitPromotionsAmountByCode !== undefined &&
                      ObjectKeys(cart.orderItemOrUnitPromotionsAmountByCode).length > 0 && (
                        <>
                          <i>{t("checkout-common:promotionsAndReductions")}</i>
                          {Object.entries(cart.orderItemOrUnitPromotionsAmountByCode).map(
                            ([code, amount]) => (
                              <div key={code} className={styles.orderRecapLine}>
                                <span>- {code}</span>
                                <Price price={amount} size="small" />
                              </div>
                            ),
                          )}
                        </>
                      )}
                  </div>
                )}
                {groupedOrdersByDate.map(({ orders, type }) => (
                  <>
                    <div className={styles.orderRecapBasket}>
                      {type === "awaiting_payment"
                        ? t("checkout-common:myUnpaidOrders")
                        : t("checkout-common:myPaidOrders")}
                    </div>

                    {orders.map(order => (
                      <Fragment key={order.date}>
                        {order.auctionPrice !== null && (
                          <div className={styles.orderRecapLine}>
                            <GroupedOrderRecapLine
                              date={getFormatDateWithoutTime(order.date, "fr")}
                              price={order.auctionPrice}
                              isAuction={true}
                            />
                          </div>
                        )}
                        {order.directPurchasePrice !== null && (
                          <div className={styles.orderRecapLine}>
                            <GroupedOrderRecapLine
                              date={getFormatDateWithoutTime(order.date, "fr")}
                              price={order.directPurchasePrice}
                              isAuction={false}
                            />
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </>
                ))}
                {cartStorageFeeTotal > 0 && (
                  <div className={styles.orderRecapLine}>
                    <span>{t("checkout-common:storage")}</span>
                    <Price price={cartStorageFeeTotal} size="small" />
                  </div>
                )}
                <div className={styles.orderRecapLine}>
                  <span>{t("checkout-common:shippingNameDelivery")}</span>
                  <Price price={cart?.shippingTotal ?? 0} size="small" />
                </div>
                {Object.entries(cart?.orderPromotionsAmountByCode ?? {}).map(([code, amount]) => (
                  <div key={code} className={styles.orderRecapLine}>
                    <span>{code}</span>
                    <Price price={amount} size="small" />
                  </div>
                ))}
                {cart?.creditNotes?.map(creditNote => {
                  const [transKey, creditNoteDate] = isNotNullNorUndefined(creditNote.startDate)
                    ? ["creditNoteLabelWithStartDate", creditNote.startDate]
                    : isNotNullNorUndefined(creditNote.enabledAt)
                    ? ["creditNoteLabelWithEnabledAt", creditNote.enabledAt]
                    : ["creditNoteLabel"];

                  return (
                    <div key={creditNote.id} className={styles.orderRecapLine}>
                      <span>
                        {t(`common:${transKey}`, {
                          date: isNotNullNorUndefined(creditNoteDate)
                            ? format(new Date(creditNoteDate), "d MMMM yyyy", {
                                locale: AVAILABLE_LOCALES[lang],
                              })
                            : "",
                        })}
                      </span>
                      <Price price={-1 * (creditNote.amount ?? 0)} size="small" />
                    </div>
                  );
                })}
                {customsFee > 0 && (
                  <div className={styles.orderRecapLine}>
                    <span>{t("checkout-common:customsFee")}</span>
                    <Price price={customsFee} size="small" />
                  </div>
                )}
              </div>
              <div className={styles.recapDivider}>
                <div className={styles.recapDividerSegment} />
                <FontAwesomeIcon
                  icon={isOrderRecapExpend ? faCircleMinus : faCirclePlus}
                  size="xl"
                  onClick={() => setIisOrderRecapExpend(!isOrderRecapExpend)}
                />
                <div className={styles.recapDividerSegment} />
              </div>

              <div className={clsx(styles.orderRecapTotal, styles.orderRecapLine)}>
                <span>{t("checkout-common:total")}</span>
                <Price price={cart?.total ?? 0} size="small" />
              </div>
              <div className={styles.orderRecapLine}>
                <span>{t("checkout-common:includingVAT")}</span>
                <Price price={cart?.globalTaxesTotal ?? 0} size="small" />
              </div>
              {isNotNullNorUndefined(onClickNextPage) || disabled ? (
                <Button
                  className={styles.validationButton}
                  variant="primaryGolden"
                  disabled={disabled || hasEmptyCart}
                  onClick={handleNextPageClick}
                  isLoading={isLoading}
                  id={
                    currentPage === "basket"
                      ? "validationpanier"
                      : currentPage === "shipping"
                      ? "validationlivraison"
                      : "paiementcommande"
                  }
                >
                  {t(`checkout-common:${currentPage}.nextPageButtonText`)}
                </Button>
              ) : (
                <LinkButton href={nextPageUrlName}>
                  {t(`checkout-common:${currentPage}.nextPageButtonText`)}
                </LinkButton>
              )}
              {canDoAutomaticCheckout && (
                <Button
                  variant="secondaryGolden"
                  onClick={executeAutomaticCheckout}
                  disabled={isAutomaticCheckoutDisabled}
                  id="validationxtraorder"
                >
                  {t("panier:xtraOrderAutomaticCheckoutButton")}
                </Button>
              )}
              {isNotNullNorUndefined(applePayButton) && applePayButton}
              {!hasEmptyCart && !disabled && currentPage !== "payment" && (
                <>
                  <CodePromoPanel />
                  {isNotNullNorUndefined(availableCreditNotes) &&
                    isNonEmptyArray(availableCreditNotes["hydra:member"]) && (
                      <CreditNotePanel creditNotes={availableCreditNotes["hydra:member"]} />
                    )}
                </>
              )}
              <div className={styles.securePaymentContainer}>
                <FontAwesomeIcon icon={faLockKeyhole} size="lg" />
                {t("checkout-common:securePayment")}
                <Image
                  src="/securePaymentMethods.jpg"
                  alt="secure payment methods"
                  width={121}
                  height={38}
                />
              </div>
            </div>
            {currentPage === "basket" && (
              <div className={styles.basketGroupingInfoMessage}>
                <FontAwesomeIcon icon={faLightbulbExclamationOn} size="2xl" />
                <span>
                  {t("panier:basketGroupingInfoMessage")}
                  {" | "}
                  <Button
                    variant="inline"
                    onClick={() => setIsBasketGroupingInfoMessageDialogOpen(true)}
                  >
                    {t("panier:learnMore")}
                  </Button>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
