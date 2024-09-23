import TranslatableLink from "@/components/atoms/TranslatableLink";
import { ProductVintageRatingReadModelJsonldShopProductVintageRatingForEstateRead } from "@/networking/sylius-api-client/.ts.schemas";
import { generateRatingUrlUtils } from "@/utils/generateRatingUrlUtils";
import { RatingsSearchParamType } from "@/utils/getRegionAndYearFromSlug";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import Price from "../Price";
import TooltipCustom from "../Tooltip/Tooltip";
import styles from "./RankedRatings.module.scss";

type Props = {
  index: number;
  ratingRankingSearchParams: RatingsSearchParamType;
  rating: ProductVintageRatingReadModelJsonldShopProductVintageRatingForEstateRead;
};

const RankedRatings = ({ ratingRankingSearchParams, index, rating }: Props) => {
  const { t, lang } = useTranslation();

  const format = t("enums:formatWithoutCount.BOUTEILLE");

  const translatedColor =
    typeof rating.productVintage?.product?.color === "string"
      ? t(`enums:color.${rating.productVintage.product.color}`).toLocaleLowerCase()
      : "";

  const translatedRegion = isNotNullNorUndefined(rating.productVintage?.product?.region?.name)
    ? t(`enums:region.${rating.productVintage?.product?.region?.name ?? ""}`)
    : "";

  const vintageYear = rating.productVintage?.year;

  const { completeUrl } = generateRatingUrlUtils(
    rating.productVintage?.code ?? "",
    format,
    translatedRegion,
    rating.productVintage?.product?.appellation?.toString() ?? "",
    rating.productVintage?.product?.estate?.name?.toString() ?? "",
    translatedColor,
    lang,
  );

  return (
    <div className={styles.container}>
      <div className={styles.rankingContainer}>
        <div className={styles.index}>{index + 1}</div>
        <TooltipCustom
          trigger={
            <div className={styles.tooltipContainer}>
              <TranslatableLink className={styles.infos} dontTranslate href={completeUrl}>
                <p className={styles.text}>
                  {rating.productVintage?.product?.name} (
                  <span className={styles.color}>{translatedColor}</span>){" "}
                  {!isNotNullNorUndefined(ratingRankingSearchParams.year) &&
                    `| ${isNotNullNorUndefined(vintageYear) && vintageYear.toString()}`}
                </p>
                {isNotNullNorUndefined(rating.value) && (
                  <Price
                    className={styles.price}
                    size="normal"
                    dontDisplayCents
                    price={rating.value}
                  />
                )}
              </TranslatableLink>
            </div>
          }
          contentProps={{ side: "bottom" }}
        >
          <span>
            {t("prix-vin:goToRatingPage", {
              productName: rating.productVintage?.product?.name,
              vintageYear: vintageYear,
            })}
          </span>
        </TooltipCustom>
      </div>
    </div>
  );
};

export default RankedRatings;
