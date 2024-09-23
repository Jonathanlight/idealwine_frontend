import { getLevelsAndObservationsCounts } from "@/domain/levelsAndObservationsCounts";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";

import styles from "./DetailedCharacteristics.module.scss";

type Props = {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  limit?: number;
  classNames?: {
    item?: string;
    characteristic?: string;
  };
};

export const LevelsCharacteristic = ({
  productVariant,
  limit,
  classNames,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const counts = getLevelsAndObservationsCounts(productVariant);

  const levels = counts?.levels ?? null;

  if (levels === null || Object.keys(levels).length === 0) {
    return null;
  }

  const isOverLimit = typeof limit === "number" && Object.keys(levels).length > limit;
  const displayedLevels = Object.entries(levels).slice(0, limit);

  const name = t(`acheter-vin:condition.level`, { count: Object.keys(levels).length });

  return (
    <span className={classNames?.item ?? styles.item}>
      <span className={classNames?.characteristic ?? styles.characteristic}>{name}</span>{" "}
      {displayedLevels.length > 0
        ? displayedLevels
            .map<React.ReactNode>(([level, count]) => (
              <span key={level}>
                {count} {t(`enums:liquidLevel.${level}`)}
              </span>
            ))
            .reduce<React.ReactNode>(
              (acc, curr) => (acc === null ? [curr] : [acc, ", ", curr]),
              null,
            )
        : null}
      {isOverLimit ? "..." : null}
    </span>
  );
};
