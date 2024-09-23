import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import NegativeRatingTrend from "../RatingTrends/NegativeRatingTrend";
import PositiveRatingTrend from "../RatingTrends/PositiveRatingTrend";
import styles from "./PrimeurPriceTrend.module.scss";

type Props = {
  vintageYear: number | string;
  ratingYearlyVariation: number | null;
};

const PrimeurPriceTrend = ({ vintageYear, ratingYearlyVariation }: Props) => {
  const { t } = useTranslation("prix-vin");

  return (
    <>
      <div className={styles.blockTitle}>{t("primeurPriceTrend")}</div>
      {isNotNullNorUndefined(ratingYearlyVariation) && (
        <>
          {ratingYearlyVariation >= 0 ? (
            <PositiveRatingTrend
              vintageYear={vintageYear}
              ratingYearlyVariation={ratingYearlyVariation}
            />
          ) : (
            <NegativeRatingTrend
              vintageYear={vintageYear}
              ratingYearlyVariation={ratingYearlyVariation}
            />
          )}
        </>
      )}
    </>
  );
};

export default PrimeurPriceTrend;
