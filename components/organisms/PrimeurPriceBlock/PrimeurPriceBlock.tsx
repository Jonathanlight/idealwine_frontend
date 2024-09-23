import Pourcentage from "@/components/atoms/Pourcentage";
import Price from "@/components/molecules/Price";
import { ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { getVariation } from "@/utils/primeurPriceVariationHandler";
import { isNotNullNorUndefined, isNumber } from "@/utils/ts-utils";

import PrimeurPriceChart from "../PrimeurPriceChart/PrimeurPriceChart";
import styles from "./PrimeurPriceBlock.module.scss";

type Props = {
  primeurPrice: number;
  pastYearPrimeurPrice: number | null | undefined;
  vintageYear: number | string;
  currentYearRating: number;
  productVintageRatings:
    | ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead[]
    | undefined;
};

const PrimeurPriceBlock = ({
  vintageYear,
  primeurPrice,
  pastYearPrimeurPrice,
  productVintageRatings,
  currentYearRating,
}: Props) => {
  const { t } = useTranslation("prix-vin");
  const isPastYearPrimeurPricePositivelyDefined =
    isNotNullNorUndefined(pastYearPrimeurPrice) && pastYearPrimeurPrice > 0;

  return (
    <>
      <div className={styles.blockTitle}>{t("currentTrendTitle")}</div>
      <Price price={primeurPrice} size="big" isPrimeur />
      <div className={styles.primeurPrice}>{t("primeurPrice", { year: vintageYear })}</div>
      {isNumber(vintageYear) && (
        <div className={isPastYearPrimeurPricePositivelyDefined ? styles.twoColumns : ""}>
          <div className={styles.leftColumn}>
            <Pourcentage pourcentage={getVariation(currentYearRating, primeurPrice)} />
            <div className={styles.subTitle}>{t("variationCurrentRatingPrimeurPrice")}</div>
          </div>
          {isPastYearPrimeurPricePositivelyDefined && (
            <div className={styles.rightColumn}>
              <Pourcentage pourcentage={getVariation(primeurPrice, pastYearPrimeurPrice)} />
              <div className={styles.subTitle}>
                {t("variationPrimeurPriceNPrimeurPriceNMinus1", {
                  year: vintageYear,
                  pastYear: vintageYear - 1,
                })}
              </div>
            </div>
          )}
        </div>
      )}
      {isNotNullNorUndefined(productVintageRatings) && (
        <PrimeurPriceChart
          productVintageRatings={productVintageRatings}
          primeurPrice={primeurPrice}
        />
      )}
    </>
  );
};

export default PrimeurPriceBlock;
