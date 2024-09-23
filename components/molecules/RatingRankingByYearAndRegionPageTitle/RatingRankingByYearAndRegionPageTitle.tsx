import Image from "next/image";

import { RatingsSearchParamType } from "@/utils/getRegionAndYearFromSlug";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./RatingRankingByYearAndRegionPageTitle.module.scss";

type Props = {
  ratingRankingSearchParams: RatingsSearchParamType;
};

const RatingRankingByYearAndRegionPageTitle = ({ ratingRankingSearchParams }: Props) => {
  const { t } = useTranslation("prix-vin");

  return (
    <div className={styles.container}>
      <Image src={"/stonks.png"} alt="Stocks going up" width={150} height={150} />
      <p className={styles.title}>
        {t("wineRanking")}{" "}
        {isNotNullNorUndefined(ratingRankingSearchParams.region) &&
          isNotNullNorUndefined(ratingRankingSearchParams.year) && (
            <>
              {t("byIdealWineRating1")}
              <span className={styles.deal}>{t("byIdealWineRating2")}</span>
              {t("byIdealWineRating3")} {t(`regionSelect.${ratingRankingSearchParams.region}`)} |{" "}
              {t("vintage")} {ratingRankingSearchParams.year}
            </>
          )}
        {isNotNullNorUndefined(ratingRankingSearchParams.year) &&
          !isNotNullNorUndefined(ratingRankingSearchParams.region) && (
            <>
              {t("byIdealWineRating1")}
              <span className={styles.deal}>{t("byIdealWineRating2")}</span>
              {t("byIdealWineRating3")} {t("vintage")} {ratingRankingSearchParams.year}
            </>
          )}
        {!isNotNullNorUndefined(ratingRankingSearchParams.year) &&
          isNotNullNorUndefined(ratingRankingSearchParams.region) && (
            <>
              {t("by")} {t(`regionSelect.${ratingRankingSearchParams.region}`)}{" "}
              {t("byIdealWineRating1")}
              <span className={styles.deal}>{t("byIdealWineRating2")}</span>
              {t("byIdealWineRating3")}
            </>
          )}
      </p>
      <div className={styles.underTitleBox}>
        <p>
          {t("topIdealwineByRating")}
          {isNotNullNorUndefined(ratingRankingSearchParams.region) &&
            t("ofRegion", { region: `${t(`regionSelect.${ratingRankingSearchParams.region}`)}` })}
          {isNotNullNorUndefined(ratingRankingSearchParams.year) &&
            t("ofVintage", { vintageYear: ratingRankingSearchParams.year })}
          .
        </p>
      </div>
    </div>
  );
};

export default RatingRankingByYearAndRegionPageTitle;
