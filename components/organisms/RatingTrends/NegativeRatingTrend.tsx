import { faArrowDown } from "@fortawesome/pro-duotone-svg-icons/faArrowDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Pourcentage from "@/components/atoms/Pourcentage";
import { useTranslation } from "@/utils/next-utils";

import styles from "./RatingTrends.module.scss";

type Props = {
  vintageYear: number | string;
  ratingYearlyVariation: number;
};

const NegativeRatingTrend = ({ vintageYear, ratingYearlyVariation }: Props) => {
  const { t } = useTranslation("prix-vin");
  const thisYear = new Date().getFullYear();
  const lastYear = thisYear - 1;

  return (
    <>
      <FontAwesomeIcon icon={faArrowDown} size="7x" className={styles.redArrow} />
      <Pourcentage className={styles.pourcentage} pourcentage={ratingYearlyVariation} />
      <div className={styles.blockText}>
        {t("primeurPriceTrendDown", {
          vintageYear: vintageYear,
          thisYear: thisYear,
          lastYear: lastYear,
        })}
      </div>
    </>
  );
};

export default NegativeRatingTrend;
