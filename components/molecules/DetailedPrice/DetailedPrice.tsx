import { useTranslation } from "@/utils/next-utils";

import Price from "../Price/Price";
import styles from "./DetailedPrice.module.scss";

type Props = {
  price: number;
  size: "small" | "medium" | "normal" | "big";
  originalPrice: number;
  hasStock: boolean;
  priceClassName?: string;
  detailedPriceClassName?: string;
};

const DetailedPrice = ({
  price,
  size,
  originalPrice,
  hasStock,
  priceClassName,
  detailedPriceClassName,
}: Props) => {
  const hasDiscount = price < originalPrice;
  const discount = hasDiscount ? Math.round((100 * (originalPrice - price)) / originalPrice) : 0;

  const { t } = useTranslation("acheter-vin");

  return (
    <div className={styles.mainContainer}>
      <Price price={price} size={size} className={priceClassName} disabled={!hasStock} />
      {hasDiscount && (
        <div className={styles.discountContainer}>
          <span className={styles.discount}>-{discount}%</span>
          <span className={styles.promoText}>
            {t("insteadOf")}{" "}
            {<Price price={originalPrice} size={"small"} className={detailedPriceClassName} />}{" "}
          </span>
        </div>
      )}
    </div>
  );
};

export default DetailedPrice;
