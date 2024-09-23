import Image from "next/image";

import StockHistoricalFilter from "@/components/molecules/StockHistoricalFilter/StockHistoricalFilter";
import { StoredItemDTOJsonldShopCustomerProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { getCommonPageStaticProps } from "@/utils/getCommonPageProps";
import { useTranslation } from "@/utils/next-utils";

import StockBoard from "../StockBoard";
import StockHistoricalBoard from "../StockHistoricalBoard";
import styles from "./ProductVariantsInStock.module.scss";
import { ProductVariantStatus, statuses } from "./types";

type Props = {
  storedItems?: StoredItemDTOJsonldShopCustomerProductVariantRead[];
  isError: boolean;
  isHistory?: boolean;
  setStatus?: (status: ProductVariantStatus[]) => void;
  status?: ProductVariantStatus[];
};

const ProductVariantsInStock = ({
  storedItems,
  isError,
  isHistory,
  setStatus,
  status = [],
}: Props) => {
  const { t } = useTranslation("lots-en-stock");

  if (isError) return <div>{t("common:common.errorOccurred")}</div>;

  if (!storedItems) return null;

  if (storedItems.length === 0)
    return (
      <div className={styles.container}>
        {isHistory && status !== statuses && (
          <StockHistoricalFilter status={status} setStatus={setStatus} />
        )}
        <div className={styles.box}>
          <Image src="/cartons.jpg" alt="Empty boxes" width={125} height={125} />
          <div className={styles.message}>
            {status.length === 1
              ? t("noProductForThisFilter")
              : !isHistory
              ? t("noProductsInStock").toLocaleUpperCase()
              : t("neverHadProductInStock").toLocaleUpperCase()}
          </div>
        </div>
      </div>
    );

  if (isHistory)
    return <StockHistoricalBoard storedItems={storedItems} setStatus={setStatus} status={status} />;

  return <StockBoard storedItems={storedItems} />;
};

export const getStaticProps = getCommonPageStaticProps;

export default ProductVariantsInStock;
