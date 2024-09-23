import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import Trans from "next-translate/Trans";
import Image from "next/image";

import Button from "@/components/atoms/Button";
import LinkButton from "@/components/atoms/Button/LinkButton";
import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import TranslatableLink from "@/components/atoms/TranslatableLink";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import {
  GetProductVintageRatingReadModelCollection200,
  ProductVintageJsonldShopProductVintageRatingInfoDtoRead,
  ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyArray, isNonEmptyString, isNotNullNorUndefined } from "@/utils/ts-utils";

import ProductVintageDetailedCharacteristics from "../ProductVintageDetailedCharacteristics";
import SameDomainProductSuggestions from "../SameDomainProductSuggestions";
import styles from "./ProductInformation.module.scss";

const ProductInformation = ({
  productName,
  productImagePath,
  results,
  estateRatings,
  sameEstateRatedVintages,
  vintageYear,
}: {
  productName: string | undefined;
  productImagePath: string;
  results: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead | undefined;
  estateRatings?: GetProductVintageRatingReadModelCollection200;
  sameEstateRatedVintages: ProductVintageJsonldShopProductVintageRatingInfoDtoRead[];
  vintageYear: number | undefined | null;
}) => {
  const { t, lang } = useTranslation("prix-vin");

  const product = results?.productVintage?.product;
  const estateName = results?.productVintage?.product?.estate?.name;
  const estateDescription = results?.productVintage?.product?.estate?.description;
  const productDescription = results?.productVintage?.product?.description;
  const showDetailedInformation =
    isNonEmptyString(estateDescription) || isNonEmptyString(productDescription);
  const aromaCase = results?.productVintage?.product?.dominantAroma;
  const dominantAroma =
    typeof aromaCase === "string" ? t(`enums:dominantAroma.${aromaCase}`) : null;

  const tastingOccasionCase = results?.productVintage?.product?.tastingOccasion;
  const tastingOccasion =
    typeof tastingOccasionCase === "string"
      ? t(`enums:tastingOccasion.${tastingOccasionCase}`)
      : null;

  const profileCase = results?.productVintage?.product?.profile;
  const profile = typeof profileCase === "string" ? t(`enums:profile.${profileCase}`) : null;
  const intensityCase = isNotNullNorUndefined(results?.productVintage?.product?.intensity)
    ? results?.productVintage?.product?.intensity
    : null;
  const intensity =
    typeof intensityCase === "string" ? t(`enums:intensity.${intensityCase}`) : null;

  return (
    <div className={styles.secondGridContainer}>
      {showDetailedInformation && (
        <>
          <div className={styles.productInformationTitleContainer}>
            <div id="productInformation" className={styles.gridRowTitle}>
              <Trans
                ns="prix-vin"
                i18nKey="productInformation"
                components={{ strong: <strong />, br: <br /> }}
                values={{ productName: productName }}
              />
            </div>
            <GoldenUnderlineTitle />
          </div>
          <div className={styles.aboutEstateAndProduct}>
            {isNonEmptyString(estateDescription) && (
              <>
                <div className={styles.aboutTitle}>{t("aboutEstate")}</div>
                <p
                  className={styles.aboutText}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(estateDescription) }}
                />
              </>
            )}
            {isNonEmptyString(productDescription) && (
              <>
                <div className={styles.aboutTitle}>{t("aboutProduct")}</div>
                <p
                  className={styles.aboutText}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productDescription) }}
                />
              </>
            )}
            {isNonEmptyArray(estateRatings?.["hydra:member"]) && (
              <LinkButton
                href={getPlpUrl({ domainName: [estateName] }, lang) + "#estateRatings"}
                variant="primaryBlack"
                dontTranslate
                className={styles.consultEstateRatings}
              >
                {t("consultEstateRatings", { estateName: estateName ?? "" })}
              </LinkButton>
            )}
          </div>
        </>
      )}
      <div className={styles.caracteristicsSidePanel}>
        <div className={styles.productPictureContainer}>
          <Image
            unoptimized
            src={productImagePath}
            alt={t("backgroundBottleImage")}
            fill
            className={styles.productPicture}
          />
        </div>
        <ul className={styles.productCaracteristicsList}>
          {isNotNullNorUndefined(dominantAroma) && (
            <li className={styles.caracteristicsItem}>{dominantAroma}</li>
          )}
          {isNotNullNorUndefined(tastingOccasion) && (
            <li className={styles.caracteristicsItem}>{tastingOccasion}</li>
          )}
          {isNotNullNorUndefined(profile) && (
            <li className={styles.caracteristicsItem}>{profile}</li>
          )}
          {isNotNullNorUndefined(intensity) && (
            <li className={styles.caracteristicsItem}>{intensity}</li>
          )}
          <li>
            <TranslatableLink href="SELL_MY_WINES_URL">
              <Button>{t("youHaveASimilarWine")}</Button>
            </TranslatableLink>
          </li>
        </ul>
      </div>
      <div
        className={clsx(
          styles.detailedCharacteristicsContainer,
          showDetailedInformation ? styles.thirdRow : styles.secondRow,
        )}
        id="detailedCharacteristics"
      >
        {sameEstateRatedVintages.length > 0 && (
          <SameDomainProductSuggestions
            sameEstateRatedVintages={sameEstateRatedVintages}
            year={vintageYear}
          />
        )}
        <div className={styles.gridRowTitle}>
          <Trans
            ns="prix-vin"
            i18nKey="estateAndVintageCharacteristics"
            components={{ strong: <strong /> }}
          />
        </div>
        <GoldenUnderlineTitle />
        {isNotNullNorUndefined(product) && (
          <>
            <ProductVintageDetailedCharacteristics product={product} />
            <div className={styles.disclaimer}>{t("disclaimer")}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductInformation;
