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

export const ObservationsCharacteristic = ({
  productVariant,
  limit,
  classNames,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const counts = getLevelsAndObservationsCounts(productVariant);

  const observations = counts?.observations ?? null;

  if (observations === null || Object.keys(observations).length === 0) {
    return null;
  }

  const isOverLimit = typeof limit === "number" && Object.keys(observations).length > limit;
  const displayedObservations = Object.entries(observations).slice(0, limit);

  const name = t(`acheter-vin:condition.observation`, { count: Object.keys(observations).length });

  return (
    <span className={classNames?.item ?? styles.item}>
      <span className={classNames?.characteristic ?? styles.characteristic}>{name}</span>{" "}
      {displayedObservations.length > 0
        ? displayedObservations
            .map<React.ReactNode>(([observation, count]) => (
              <span key={observation}>
                {t(`enums:bottleObservations.${observation}`, { count })}
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
