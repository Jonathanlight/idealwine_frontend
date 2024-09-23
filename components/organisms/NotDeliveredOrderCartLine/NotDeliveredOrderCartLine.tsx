import { faClock } from "@fortawesome/pro-light-svg-icons/faClock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUpdateEffect } from "@react-hookz/web";
import { isAxiosError } from "axios";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";

import GoldenCheckbox from "@/components/atoms/GoldenCheckbox";
import Price from "@/components/molecules/Price/Price";
import { useAuthenticatedUserContext } from "@/context/AuthenticatedUserContext";
import { useFullPageLoaderContext } from "@/context/FullPageLoaderContext/useFullPageLoaderContext";
import {
  CustomerJsonldShopCustomerReadXtraOrder,
  OrderJsonldShopOrderRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  useShopAddListGroupedOrderOrderItem,
  useShopDeleteListGroupedOrderOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { useTranslation } from "@/utils/next-utils";
import { hasPayLaterPaymentMethodCode, isPaid } from "@/utils/orderUtils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import IncompatibleOrderCountriesModal from "../GeneralCheckout/IncompatibleOrderCountries/IncompatibleOrderCountriesModal";
import NumberOfBottlesWithFormat from "../NumberOfBottlesWithFormat";
import styles from "./NotDeliveredOrderCartLine.module.scss";

export type CountriesNameByCode = {
  [countryCode: string]: string | undefined;
};

type Props = {
  order: OrderJsonldShopOrderRead;
};

const NotDeliveredOrderCartLine = ({ order }: Props) => {
  const { setIsFullPageLoaderOpen } = useFullPageLoaderContext();
  const [incompatibleOrderCountriesModalOpen, setIncompatibleOrderCountriesModalOpen] =
    useState(false);
  const { user, cart, setCart } = useAuthenticatedUserContext();
  const { t } = useTranslation();

  const isXtraOrderWithoutStorageFees =
    isNotNullNorUndefined(user?.xtraOrder) &&
    user?.xtraOrder === CustomerJsonldShopCustomerReadXtraOrder.XTRA_ORDER_WITHOUT_FEES;
  const isSelected = cart?.groupedOrders?.some(groupedOrder => groupedOrder.id === order.id);

  const items = order.items ?? [];
  const isWaitingForPaimentOrder = !isPaid(order) && !hasPayLaterPaymentMethodCode(order);
  const tokenValue = cart?.tokenValue ?? "";
  const groupedOrderId = String(order.id);
  const isPaidOrder = isPaid(order);
  const itemsTotal = order.itemsTotal ?? 0;

  const { mutateAsync: addGroupedOrderItem, isLoading: isAddingGroupedOrder } =
    useShopAddListGroupedOrderOrderItem();
  const { mutateAsync: deleteGroupedOrderItem, isLoading: isDeletingGroupedOrder } =
    useShopDeleteListGroupedOrderOrderItem();

  const handleCheck = async () => {
    try {
      const newCart = await (isSelected ? deleteGroupedOrderItem : addGroupedOrderItem)({
        tokenValue,
        data: { groupedOrderIds: [groupedOrderId] },
      });
      setCart(newCart);
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.headers["idw-error"] === "incompatible-countries-grouping"
      ) {
        setIncompatibleOrderCountriesModalOpen(true);
      } else if (isAxiosError(error) && error.response?.status === 403) {
        toast.error<string>(t("panier:forbidden"));
      } else {
        toast.error<string>(t("panier:errorOccurred"));
      }
    }
  };

  // useUpdateEffect to avoid conflict with useEffect in panier/index.tsx on first render
  useUpdateEffect(() => {
    setIsFullPageLoaderOpen(isAddingGroupedOrder || isDeletingGroupedOrder);
  }, [isAddingGroupedOrder, isDeletingGroupedOrder, setIsFullPageLoaderOpen]);

  const storageFeeInCents = order.storageFeeInCents ?? 0;

  return (
    <>
      <IncompatibleOrderCountriesModal
        open={incompatibleOrderCountriesModalOpen}
        setOpen={setIncompatibleOrderCountriesModalOpen}
      />
      <label
        htmlFor={`order_${order.id?.toString() ?? ""}`}
        className={clsx(styles.selectBoxContainer)}
      >
        <div className={styles.selectBoxHeader}>
          <div className={styles.headerPart}>
            {isWaitingForPaimentOrder ? (
              <FontAwesomeIcon icon={faClock} className={styles.clockIcon} />
            ) : (
              <GoldenCheckbox checked={!!isSelected} onClick={handleCheck} size="lg" />
            )}
            <div>
              <span className={styles.headerPartTitle}>
                {t("panier:orderNumber", { orderNumber: order.number ?? "" })}
              </span>
              <br />

              <div className={styles.selectBoxContentContainer}>
                {items.map(item => (
                  <div key={item.id} className={styles.variantInfoContainer}>
                    <span>
                      {t("panier:quantityOf", { count: item.quantity })}{" "}
                      <NumberOfBottlesWithFormat variant={item.variant} /> {item.variant.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.headerPart}>
            <div className={styles.priceContainer}>
              <span className={styles.priceDisplay}>
                {isPaidOrder ? (
                  <span className={styles.paidStatus}>
                    <Price price={itemsTotal} size="small" /> / {t("panier:alreadyPaid")}
                  </span>
                ) : (
                  <Price price={itemsTotal} size="small" />
                )}
              </span>
              {storageFeeInCents > 0 && !isXtraOrderWithoutStorageFees && (
                <div className={styles.storageFeeDisplay}>
                  + <Price price={storageFeeInCents} size={"tiny"} />{" "}
                  {t("panier:storageFee", { numberOfDays: order.numberOfPayingStorageDays ?? 0 })}
                </div>
              )}
            </div>
          </div>
        </div>
      </label>
    </>
  );
};

export default NotDeliveredOrderCartLine;
