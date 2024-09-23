import { ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { getVariation } from "@/utils/primeurPriceVariationHandler";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import PrimeurPriceBlock from "../PrimeurPriceBlock/PrimeurPriceBlock";
import PrimeurPriceTrend from "../PrimeurPriceTrend/PrimeurPriceTrend";
import styles from "./PrimeurPriceCard.module.scss";

type Props = {
  primeurPrice: number | null | undefined;
  pastYearPrimeurPrice: number | null | undefined;
  vintageYear: number | string;
  currentYearRating: number;
  previousYearRating: number | null | undefined;
  productVintageRatings:
    | ProductVintageRatingReadModelJsonldShopProductVintageRatingInfoDtoRead[]
    | undefined;
};

const PrimeurPriceCard = ({
  primeurPrice,
  pastYearPrimeurPrice,
  vintageYear,
  currentYearRating,
  previousYearRating,
  productVintageRatings,
}: Props) => {
  const isPrimeurPricePositivelyDefined = isNotNullNorUndefined(primeurPrice) && primeurPrice > 0;

  const ratingYearlyVariation = isNotNullNorUndefined(previousYearRating)
    ? getVariation(currentYearRating, previousYearRating)
    : null;

  return (
    <div className={styles.blockContainer}>
      {isPrimeurPricePositivelyDefined ? (
        <PrimeurPriceBlock
          vintageYear={vintageYear}
          primeurPrice={primeurPrice}
          pastYearPrimeurPrice={pastYearPrimeurPrice}
          productVintageRatings={productVintageRatings}
          currentYearRating={currentYearRating}
        />
      ) : (
        <>
          {isNotNullNorUndefined(ratingYearlyVariation) && (
            <PrimeurPriceTrend
              vintageYear={vintageYear}
              ratingYearlyVariation={ratingYearlyVariation}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PrimeurPriceCard;
