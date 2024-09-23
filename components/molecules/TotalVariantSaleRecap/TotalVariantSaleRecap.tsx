import { TotalProductVariantSaleDTOJsonld } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import Price from "../Price";
import styles from "./TotalVariantSaleRecap.module.scss";

type Props = {
  totalRecap: TotalProductVariantSaleDTOJsonld;
  global?: boolean;
  current?: boolean;
};

const TotalVariantSaleRecap = ({ totalRecap, global, current }: Props) => {
  const { t } = useTranslation("section-vendeur");

  return (
    <div className={styles.container}>
      <div className={styles.totalTitle}>
        {t(global ? "totals.globalTitle" : "totals.displayTitle")}
      </div>
      <div className={styles.totalBoard}>
        <div className={styles.totalItem}>
          {totalRecap.variantsCount} {t("totals.variants")}
        </div>
        <div className={styles.totalItem}>
          {totalRecap.bottlesCount} {t("totals.bottles")}
        </div>
        <div className={styles.totalItem}>
          {t("totals.reserveBidOnline")}{" "}
          <Price price={totalRecap.totalReserveBid ?? 0} size="small" />
        </div>
        <div className={styles.totalItem}>
          {t(current ? "totals.currentPrice" : "totals.finalPrice")}{" "}
          <Price price={totalRecap.finalPrice ?? 0} size="small" />
        </div>
        <div className={styles.totalItem}>
          {t("totals.gap")} : {totalRecap.gap}%
        </div>
      </div>
    </div>
  );
};

export default TotalVariantSaleRecap;
