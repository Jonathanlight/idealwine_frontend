import { isAxiosError } from "axios";
import { toast } from "react-toastify";

import Button from "@/components/atoms/Button";
import useFileDownload from "@/hooks/useFileDownload";
import {
  OrderItemJsonldShopOrderRead,
  OrderJsonldSellType,
  OrderJsonldShopOrderRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import {
  getGeneratePaymentRecapOrderItemQueryKey,
  useDownloadInvoiceOrderItem,
} from "@/networking/sylius-api-client/order/order";
import { ORDER_PAYMENT_STATES } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import Price from "../Price";
import TooltipCustom from "../Tooltip/Tooltip";
import styles from "./HistoricalOrderDetail.module.scss";

type Props = {
  order: OrderJsonldShopOrderRead;
  key: string;
};

const OLDEST_AVAILABLE_INVOICE = new Date("2024-05-14");

const HistoricalOrderDetail = ({ order }: Props) => {
  const { t, lang } = useTranslation();
  const { refetch: getInvoiceUrl, isFetching: isFetchingInvoice } = useDownloadInvoiceOrderItem(
    order.tokenValue ?? "",
    { query: { enabled: false } },
  );

  const { downloadFile: getPaymentRecap, loading: isFetchingPaymentRecap } = useFileDownload();

  const generateInvoiceUrl = async () => {
    try {
      const { data } = await getInvoiceUrl({ throwOnError: true });
      window.open(data?.url, "_blank");
    } catch (err) {
      if (isAxiosError(err)) {
        toast.error<string>(t("historique:orderHistory.errorGenerateInvoiceUrl"));
      }
    }
  };
  const downloadPaymentRecap = async () =>
    getPaymentRecap(getGeneratePaymentRecapOrderItemQueryKey(order.tokenValue ?? "")[0]);

  const orderNotPaid = order.paymentState !== ORDER_PAYMENT_STATES.PAID;
  const noPaymentAssociatedToOrder = (order.payments?.length ?? 0) === 0;
  const isDeliveryRequest = order.sellType === OrderJsonldSellType.DELIVERY_REQUEST;
  const isVariousFees = (order.items?.length ?? 0) === 0;
  const isSimpleDeliveryRequest = isDeliveryRequest && !isVariousFees;

  const orderTranslatedSellType = isNotNullNorUndefined(order.sellType)
    ? isVariousFees
      ? t(`common:enum.sellType.VARIOUS_FEES`)
      : order.sellType === OrderJsonldSellType.MIXED // TODO: refactor sellType to avoid taking into account grouped orders
      ? t(`common:enum.sellType.DIRECT_SALE`) // hack: here it works because a mixed order is a direct sale order with grouped auction orders
      : t(`common:enum.sellType.${String(order.sellType)}`)
    : "";

  const getTranslatedFormatAndQuantity = (orderItem: OrderItemJsonldShopOrderRead) => {
    const totalQuantity =
      isNotNullNorUndefined(orderItem.quantity) &&
      isNotNullNorUndefined(orderItem.variant.numberOfBottles)
        ? orderItem.quantity * orderItem.variant.numberOfBottles
        : 0;

    return t(
      `common:enum.format.${orderItem.variant.format ?? ""}.${totalQuantity > 1 ? "other" : "1"}`,
      { count: totalQuantity },
    );
  };

  const isOrderInvoiceAvailable =
    isNotNullNorUndefined(order.checkoutCompletedAt) &&
    OLDEST_AVAILABLE_INVOICE > new Date(order.checkoutCompletedAt);

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <div>
          {`${orderTranslatedSellType.toUpperCase()} - ${
            isNotNullNorUndefined(order.checkoutCompletedAt)
              ? new Date(order.checkoutCompletedAt).toLocaleDateString(lang)
              : ""
          } - N°: ${order.number ?? ""}`}
        </div>
        <div className={styles.downloadButtons}>
          {}
          {isOrderInvoiceAvailable ? (
            <TooltipCustom
              trigger={
                <Button variant="primaryBlack" disabled={true}>
                  {t("historique:orderHistory.details.invoice")}
                </Button>
              }
              contentProps={{ side: "bottom" }}
            >
              <span>{t("historique:orderHistory.orderIsPriorToMep")}</span>
            </TooltipCustom>
          ) : (
            <Button
              variant="primaryBlack"
              onClick={generateInvoiceUrl}
              isLoading={isFetchingInvoice}
              disabled={isSimpleDeliveryRequest}
            >
              {t("historique:orderHistory.details.invoice")}
            </Button>
          )}
          <Button
            variant="primaryBlack"
            onClick={downloadPaymentRecap}
            isLoading={isFetchingPaymentRecap}
            disabled={orderNotPaid || noPaymentAssociatedToOrder || isSimpleDeliveryRequest}
          >
            {t("historique:orderHistory.details.paymentRecap")}
          </Button>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.items}>
        {order.items?.map(item => (
          <div key={item.id} className={styles.item}>
            <div className={styles.name}>{`${getTranslatedFormatAndQuantity(item)} ${
              item.productName ?? ""
            } ${item.variant.productVintage?.year ?? ""}`}</div>
            {isNotNullNorUndefined(item.total) && (
              <div className={styles.price}>
                <Price price={item.total} size="normal" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalOrderDetail;
