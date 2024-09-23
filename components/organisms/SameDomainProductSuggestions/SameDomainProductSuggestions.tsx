import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { ProductVintageJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { generateRatingUrlUtils } from "@/utils/generateRatingUrlUtils";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SameDomainProductSuggestions.module.scss";

type Props = {
  sameEstateRatedVintages: ProductVintageJsonldShopProductVintageRatingInfoDtoRead[];
  year: number | undefined | null;
};
const SameDomainProductSuggestions = ({ sameEstateRatedVintages, year }: Props) => {
  const { t, lang } = useTranslation();

  return (
    <div className={styles.sameEstateContainer}>
      <p className={styles.gridRowTitle}>
        {t("prix-vin:sameEstateRatingVintageTitle1")}{" "}
        <strong>{t("prix-vin:sameEstateRatingVintageTitle2")}</strong>
      </p>
      <GoldenUnderlineTitle />
      <div className={styles.recommandations}>
        {sameEstateRatedVintages.map(vintage => {
          const productVintageCode = vintage.code;
          const regionName =
            vintage.product?.region?.name !== undefined
              ? t(`enums:region.${vintage.product.region.name}`)
              : "";
          const productAppellation = vintage.product?.appellation;
          const format = t("enums:formatWithoutCount.BOUTEILLE");
          const estateName = vintage.product?.estate?.name;
          const color =
            typeof vintage.product?.color === "string"
              ? t(`enums:color.${vintage.product.color}`).toLocaleLowerCase()
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
            <TranslatableLink key={vintage.code} dontTranslate href={completeUrl}>
              {vintage.product?.name} {year}
            </TranslatableLink>
          );
        })}
      </div>
    </div>
  );
};

export default SameDomainProductSuggestions;
