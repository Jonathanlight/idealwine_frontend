import Image from "next/image";

import { ShopGetCustomerOrderItemsOrderItemCollection200 } from "@/networking/sylius-api-client/.ts.schemas";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import DirectPurchases from "../DisplayProductHistory/DirectPurchases/DirectPurchases";
import styles from "./ProductVariantInHistoricalDirectPurchases.module.scss";

type Props = {
  orderItems: ShopGetCustomerOrderItemsOrderItemCollection200 | undefined;
  isError: boolean;
};

const ProductVariantInHistoricalDirectPurchases = ({ orderItems, isError }: Props) => {
  const { t } = useTranslation("historique");

  if (isError) return <div>{t("common:common.errorOccurred")}</div>;

  if (!orderItems) return null;

  if (orderItems["hydra:totalItems"] === 0)
    return (
      <div className={styles.box}>
        <Image src="/cartons.jpg" alt="Empty boxes" width={125} height={125} />
        <div className={styles.message}>
          {t("neverBoughtDirectPurchaseProduct").toLocaleUpperCase()}
        </div>
      </div>
    );

  return <DirectPurchases orderItems={orderItems["hydra:member"]} />;
};

export const getStaticProps = getCommonPageStaticProps;

export default ProductVariantInHistoricalDirectPurchases;
