import clsx from "clsx";

import { ProductVariantStatus } from "@/components/organisms/ProductVariantsInStock/types";
import { TotalStoredItemDto } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import Price from "../Price";
import styles from "./TotalRecap.module.scss";

type Props = {
  totalRecap: TotalStoredItemDto;
  isErrorTotal: boolean;
  status?: ProductVariantStatus[];
};

const TotalRecap = ({ totalRecap, isErrorTotal }: Props) => {
  const { t } = useTranslation("lots-en-stock");

  if (isErrorTotal) {
    return <div>{t("error")}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.totalTitle}>{t("totalGlobal")}</div>
      <div className={styles.totalBoard}>
        <div className={clsx(styles.totalItem, styles.border)}>
          {totalRecap.totalStocks} {t("lots")}
        </div>
        <div className={clsx(styles.totalItem, styles.border)}>
          {totalRecap.numberOfBottles} {t("bottles")}
        </div>
        <div className={styles.totalItem}>
          {t("actualValue")} <Price price={totalRecap.total ?? 0} size="small" />
        </div>
      </div>
    </div>
  );
};

export default TotalRecap;
