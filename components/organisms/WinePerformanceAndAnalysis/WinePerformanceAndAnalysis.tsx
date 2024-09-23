import clsx from "clsx";
import Image from "next/image";

import LinkButton from "@/components/atoms/Button/LinkButton";
import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import { ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import PrimeurPriceCard from "../PrimeurPriceCard";
import RatingsVariationHorizontalChart from "../RatingsVariationHorizontalChart";
import styles from "./WinePerformanceAndAnalysis.module.scss";

const WinePerformanceAndAnalysis = ({
  productName,
  vintageYear,
  results,
}: {
  productName: string | undefined;
  vintageYear: string | number;
  results: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead | undefined;
}) => {
  const { t } = useTranslation("prix-vin");
  const ratingsVariations = results?.ratingsVariations;
  const productVintageRatings = results?.productVintageRatings;
  const currentYearRating = results?.currentYearRating;
  const previousYearRating = results?.previousYearRating;
  const alertsCount = results?.productVintageAvailabilityAlertsCount;
  const primeurPrice = results?.primeurPrice;
  const pastYearPrimeurPrice = results?.pastYearPrimeurPrice;

  return (
    <div className={styles.fourthGridContainer}>
      <div className={styles.gridTitleContainer}>
        <div id="winePerformanceAndAnalysis" className={styles.gridRowTitle}>
          {t("winePerformanceAndAnalysis")}{" "}
          <strong>
            {productName} {vintageYear}
          </strong>
        </div>
        <GoldenUnderlineTitle />
      </div>
      {isNotNullNorUndefined(ratingsVariations) && (
        <div
          className={clsx(
            styles.priceEstimateHorizontalChartCardContainer,
            styles.whiteBoxWithShadow,
          )}
        >
          <RatingsVariationHorizontalChart
            vintageYear={vintageYear}
            ratingsVariations={ratingsVariations}
          />
        </div>
      )}
      <div className={clsx(styles.alertsCounterContainer, styles.whiteBoxWithShadow)}>
        <Image src={"/alert.svg"} width={100} height={110} alt={t("alertImage")} />
        <div className={styles.alertsCounterTitle}>
          {t("alertsCounter", { count: alertsCount })}
        </div>
        <GoldenUnderlineTitle />
        <div className={styles.alertsCounterSubtitle}>{t("alertsCounterSubtitle")}</div>
        {alertsCount === 0 && (
          <LinkButton href="ADD_ALERT_URL" variant="primaryBlack" className={styles.newAlertButton}>
            {t("createNewAlert")}
          </LinkButton>
        )}
      </div>
      <div className={clsx(styles.currentTrendContainer, styles.whiteBoxWithShadow)}>
        {isNotNullNorUndefined(currentYearRating) && (
          <PrimeurPriceCard
            primeurPrice={primeurPrice}
            pastYearPrimeurPrice={pastYearPrimeurPrice}
            vintageYear={vintageYear}
            productVintageRatings={productVintageRatings}
            currentYearRating={currentYearRating}
            previousYearRating={previousYearRating}
          />
        )}
      </div>
    </div>
  );
};

export default WinePerformanceAndAnalysis;
