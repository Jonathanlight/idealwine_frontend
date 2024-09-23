import TranslatableLink from "@/components/atoms/TranslatableLink";
import { SameProductRatedProductVintageDTOJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { generateRatingUrlUtils } from "@/utils/generateRatingUrlUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./VintagesOfSameProductGrid.module.scss";

const VintagesOfSameProductGrid = ({
  ratedVintages,
  currentVintage,
  expanded,
  setExpanded,
}: {
  ratedVintages: SameProductRatedProductVintageDTOJsonldShopProductVintageRatingInfoDtoRead[];
  currentVintage: string | undefined;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}) => {
  const { t, lang } = useTranslation("prix-vin");

  return (
    <>
      <div className={expanded ? styles.gridContainerExpanded : styles.gridContainerNotExpanded}>
        {ratedVintages.map(ratedVintage => {
          const productVintageCode = ratedVintage.code;
          const regionName = isNotNullNorUndefined(ratedVintage.productRegionName)
            ? t(`enums:region.${ratedVintage.productRegionName}`)
            : "";

          const productAppellation = ratedVintage.productAppellation;
          const format = t("enums:formatWithoutCount.BOUTEILLE");
          const estateName = ratedVintage.productEstateName;
          const color =
            typeof ratedVintage.productColor === "string"
              ? t(`enums:color.${ratedVintage.productColor}`).toLocaleLowerCase()
              : "";

          const { completeUrl } = generateRatingUrlUtils(
            productVintageCode ?? "",
            format,
            regionName,
            productAppellation?.toString() ?? "",
            estateName?.toString() ?? "",
            color,
            lang,
          );

          return (
            <TranslatableLink
              dontTranslate
              href={completeUrl}
              className={
                currentVintage === ratedVintage.code ? styles.activeGridItem : styles.gridItem
              }
              key={ratedVintage.code}
            >
              {ratedVintage.year ?? t("noVintageYear")}
            </TranslatableLink>
          );
        })}
      </div>
      <label htmlFor="expandVintagesGridButton" className={styles.label}>
        <button
          id="expandVintagesGridButton"
          className={expanded ? styles.buttonClicked : styles.buttonUnClicked}
          onClick={() => setExpanded(!expanded)}
        >
          ✕
        </button>
      </label>
    </>
  );
};

export default VintagesOfSameProductGrid;
