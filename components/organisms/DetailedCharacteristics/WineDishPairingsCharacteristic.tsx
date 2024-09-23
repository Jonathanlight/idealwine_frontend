import { ProductJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./DetailedCharacteristics.module.scss";

type Props = {
  product: ProductJsonldShopProductVintageRatingInfoDtoRead;
};

export const WineDishPairingsCharacteristic = ({ product }: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const wineDishPairings = product.wineDishPairings ?? null;

  if (wineDishPairings === null || wineDishPairings.length === 0) {
    return null;
  }

  return (
    <div className={styles.item}>
      <span className={styles.characteristic}>
        {t(`acheter-vin:detailedInformation.characteristics.wineDishPairings`)} :
      </span>{" "}
      {wineDishPairings.length > 0
        ? wineDishPairings.map<React.ReactNode>((dish, index) => (
            <span key={dish}>
              {dish}
              {index !== wineDishPairings.length - 1 ? ", " : ""}
            </span>
          ))
        : null}
    </div>
  );
};
