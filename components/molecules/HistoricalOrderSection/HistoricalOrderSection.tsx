import { faChevronDown } from "@fortawesome/pro-light-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/pro-light-svg-icons/faChevronUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import useFileDownload from "@/hooks/useFileDownload";
import { OrderJsonldShopOrderRead } from "@/networking/sylius-api-client/.ts.schemas";
import { getGenerateShippingRecapOrderItemQueryKey } from "@/networking/sylius-api-client/order/order";
import { ORDER_PAYMENT_STATES, ORDER_SHIPPING_STATES } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import HistoricalOrderDetail from "../HistoricalOrderDetail";
import styles from "./HistoricalOrderSection.module.scss";

export const HistoricalOrderSection = (order: OrderJsonldShopOrderRead) => {
  const { t } = useTranslation("historique");
  const [showDetails, setShowDetails] = useState(false);

  const { downloadFile: getShippingRecap, loading: isFetchingShippingRecap } = useFileDownload();

  const downloadShippingRecap = async () =>
    getShippingRecap(getGenerateShippingRecapOrderItemQueryKey(order.tokenValue ?? "")[0]);

  const toggleInvoices = () => {
    setShowDetails(!showDetails);
  };

  const orderAndGroupedOrders = [order, ...(order.groupedOrders ?? [])];

  const translatedPaymentState =
    order.paymentState === ORDER_PAYMENT_STATES.STATE_CANCELLED &&
    order.canceledForNoPayment === true
      ? t(`paymentStateEnum.unpaid`)
      : t(`paymentStateEnum.${order.paymentState ?? ""}`);
  const translatedShippingState = t(`shippingStateEnum.${order.shippingState ?? ""}`);

  const carrier = order.shipments?.[0]?.method?.carrier ?? {};
  const shipment = order.shipments?.[0] ?? {};

  const isPickup =
    order.shippingState === ORDER_SHIPPING_STATES.PICKED_UP ||
    order.shippingState === ORDER_SHIPPING_STATES.PICKUP_READY;

  return (
    <div className={styles.orderContainer}>
      <div className={styles.sectionHeader}>
        <div>
          <h2>
            {t("orderHistory.orderNumber", {
              orderDate: isNotNullNorUndefined(order.checkoutCompletedAt)
                ? new Date(order.checkoutCompletedAt).toLocaleDateString("fr")
                : "",
            })}
          </h2>
        </div>
        <Button
          variant="primaryBlack"
          onClick={downloadShippingRecap}
          isLoading={isFetchingShippingRecap}
        >
          {t("orderHistory.recap")}
        </Button>
      </div>
      <div className={styles.orderDetails}>
        <p className={styles.orderDetail}>
          {t("orderHistory.paymentState", { paymentState: translatedPaymentState })}
        </p>
        <p className={styles.orderDetail}>
          {t("orderHistory.shippingState", { shippingState: translatedShippingState })}{" "}
          {(order.shippingState === ORDER_SHIPPING_STATES.STATE_SHIPPED ||
            order.shippingState === ORDER_SHIPPING_STATES.PICKED_UP) && (
            <span>
              &nbsp;
              {isNotNullNorUndefined(shipment.shippedByGambaAt)
                ? new Date(shipment.shippedByGambaAt).toLocaleDateString("fr")
                : ""}
            </span>
          )}
        </p>
        {!isPickup && (
          <>
            <p className={styles.orderDetail}>
              {t("orderHistory.shippingMethod", {
                shippingMethod: carrier.name ?? "",
              })}
            </p>
            {isNotNullNorUndefined(shipment.trackingNumbers) &&
              shipment.trackingNumbers.length > 0 && (
                <>
                  <p className={styles.orderDetail}>
                    {t("orderHistory.packageReference")}{" "}
                    {shipment.trackingNumbers.map(trackingNumber => (
                      <span className={styles.trackingNumber} key={trackingNumber}>
                        {isNotNullNorUndefined(carrier.trackingUrl) ? (
                          <a
                            className={styles.link}
                            href={`${carrier.trackingUrl}${trackingNumber}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {trackingNumber}
                          </a>
                        ) : (
                          <>{trackingNumber}</>
                        )}
                      </span>
                    ))}
                  </p>
                </>
              )}
          </>
        )}
      </div>
      <hr className={styles.fullHorizontalWidth} />
      <div
        className={clsx(
          styles.invoicesContainer,
          showDetails ? styles.directionColumnReverse : styles.directionColumn,
        )}
      >
        <div className={styles.footerSection}>
          <Button variant="inline" className={styles.button} onClick={toggleInvoices}>
            {t("orderHistory.details.title")}
            <FontAwesomeIcon icon={showDetails ? faChevronUp : faChevronDown} />
          </Button>
        </div>
        {showDetails && (
          <div className={styles.tableContainer}>
            {orderAndGroupedOrders.map(mappedOrder => (
              <HistoricalOrderDetail order={mappedOrder} key={order.number ?? ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalOrderSection;
