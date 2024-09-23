import clsx from "clsx";
import Image from "next/image";

import Button from "@/components/atoms/Button";
import PdpLink from "@/components/molecules/PdpLink";
import OrderPrice from "@/components/molecules/Price/OrderPrice";
import NumberOfBottlesWithFormat from "@/components/organisms/NumberOfBottlesWithFormat";
import {
  OrderItemJsonldShopCustomerOrderItemRead,
  OrderJsonldShopCustomerOrderItemRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { getFormatDateWithoutTime } from "@/utils/datesHandler";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";
import { getCustomerProductVariantImagePath } from "@/utils/productVariantImage";

import styles from "./DirectPurchases.module.scss";

type Props = {
  orderItems: OrderItemJsonldShopCustomerOrderItemRead[];
};

type OrderItemWithCompleteOrder = OrderItemJsonldShopCustomerOrderItemRead & {
  order: Required<OrderJsonldShopCustomerOrderItemRead>;
};

const hasOrder = (
  orderItem: OrderItemJsonldShopCustomerOrderItemRead,
): orderItem is OrderItemWithCompleteOrder =>
  orderItem.order !== undefined &&
  Object.values(orderItem.order).every(value => value !== undefined);

const DirectPurchases = ({ orderItems }: Props) => {
  const { t, lang } = useTranslation("historique");

  return (
    <div className={styles.box}>
      {orderItems.filter(hasOrder).map((orderItem: OrderItemWithCompleteOrder) => (
        <div key={orderItem.id} className={styles.rectangle}>
          <Image
            unoptimized
            src={getCustomerProductVariantImagePath(lang, orderItem.variant.firstImage)}
            alt={orderItem.variant.name ?? t("wineBottle")}
            className={styles.fixedImage}
            width={70}
            height={80}
          />

          <div className={styles.infos}>
            <div className={styles.title}>
              <NumberOfBottlesWithFormat variant={orderItem.variant} /> {orderItem.variant.name}
            </div>
            <div className={styles.directPurchaseInfoContainer}>
              <div className={styles.directPurchaseInfoSection}>
                {getFormatDateWithoutTime(orderItem.order.checkoutCompletedAt, "fr")}
              </div>
              <div className={clsx(styles.orderPriceContainer, styles.directPurchaseInfoSection)}>
                {t("purchasePrice")}
                {typeof orderItem.total === "number" && (
                  <OrderPrice displayAsRow={true} price={orderItem.total} size="small" />
                )}
              </div>
              <div className={styles.directPurchaseInfoSection}>
                {t("quantity")} {orderItem.quantity}
              </div>
            </div>
          </div>
          <PdpLink variant={orderItem.variant}>
            {orderItem.variant.offlineSale !== true && (
              <Button className={styles.button} variant="primaryBlack">
                {t("see")}
              </Button>
            )}
          </PdpLink>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = getCommonPageStaticProps;

export default DirectPurchases;
