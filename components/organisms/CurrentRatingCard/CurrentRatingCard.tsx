import dynamic from "next/dynamic";
import React, { useMemo } from "react";

import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import Price from "@/components/molecules/Price";
import {
  ProductVariantJsonldShopProductVintageRatingInfoDtoRead,
  ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import LastAdjudicationsChart from "../LastAdjudicationsChart";
import styles from "./CurrentRatingCard.module.scss";

const BLACK = "#000000";
const GREYLIGHT = "#f3f3f3";
const GREYBLUE = "#3f4c6b";

export const CurrentRatingCard = ({
  results,
  vintageYear,
  lastAdjudications,
}: {
  results: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead | undefined;
  vintageYear: number | string;
  lastAdjudications: ProductVariantJsonldShopProductVintageRatingInfoDtoRead[] | undefined;
}) => {
  const { t } = useTranslation("prix-vin");

  const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false }); // https://stackoverflow.com/questions/75555873/error-require-of-es-module-in-react-gauge-chart-nextjs?newreg=5251096e281a46a294415af2210f9c55

  const reversedLastAdjudications = useMemo(
    () => [...(lastAdjudications ?? [])].reverse(),
    [lastAdjudications],
  );

  return (
    <>
      <div className={styles.header}>
        <div className={styles.blockTitle}>{t("currentYearRating", { year: vintageYear })}</div>
        <GoldenUnderlineTitle />
      </div>
      <div className={styles.priceContainer}>
        <Price
          price={results?.currentYearRating ?? 0}
          size="medium"
          className={styles.price}
          dontDisplayCents
        />
      </div>

      {isNotNullNorUndefined(results?.pastYearMinAdjudication) && (
        <div className={styles.lastYearAdjudicationsGaugeChartsContainer}>
          <div className={styles.lastYearAdjudicationsGaugeChart}>
            <GaugeChart
              id="minAdjudicationGaugeChartContainer"
              needleColor={GREYBLUE}
              needleBaseColor={GREYBLUE}
              arcPadding={0}
              arcsLength={[0.2, 0.8]}
              arcWidth={0.3}
              percent={0.19}
              nrOfLevels={2}
              colors={[BLACK, GREYLIGHT]}
              cornerRadius={0}
              needleLength={1.3}
              hideText={true}
            />
            <Price price={results?.pastYearMinAdjudication ?? 0} size="tiny" dontDisplayCents />

            <div className={styles.text}>{t("minAdjudication")}</div>
          </div>
          <div className={styles.lastYearAdjudicationsGaugeChart}>
            <GaugeChart
              id="maxAdjudicationGaugeChartContainer"
              needleColor={GREYBLUE}
              needleBaseColor={GREYBLUE}
              arcPadding={0}
              arcsLength={[0.8, 0.2]}
              arcWidth={0.3}
              percent={0.81}
              nrOfLevels={2}
              colors={[BLACK, GREYLIGHT]}
              cornerRadius={0}
              needleLength={1.3}
              hideText={true}
            />
            <Price price={results?.pastYearMaxAdjudication ?? 0} size="tiny" dontDisplayCents />
            <div className={styles.text}>{t("maxAdjudication")}</div>
          </div>
        </div>
      )}
      {isNotNullNorUndefined(lastAdjudications) && (
        <LastAdjudicationsChart
          lastAdjudications={reversedLastAdjudications}
          vintageYear={vintageYear}
        />
      )}
    </>
  );
};

export default CurrentRatingCard;
