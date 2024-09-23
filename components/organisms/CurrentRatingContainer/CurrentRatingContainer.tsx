import clsx from "clsx";
import Trans from "next-translate/Trans";
import Image from "next/image";
import { useState } from "react";

import LinkButton from "@/components/atoms/Button/LinkButton";
import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import Price from "@/components/molecules/Price";
import { getPlpUrl } from "@/context/AlgoliaInstantSearchProvider";
import {
  ProductJsonldShopProductVintageRatingInfoDtoReadEstate,
  ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead,
  SameProductRatedProductVintageDTOJsonldShopProductVintageRatingInfoDtoRead,
} from "@/networking/sylius-api-client/.ts.schemas";
import { generateUrl, Locale } from "@/urls/linksTranslation";
import { replaceImageBaseUrlWithOriginal } from "@/utils/imageUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import AlgoliaRatingInstantSearch from "../AlgoliaVintageRatingSearchBox/AlgoliaRatingInstantSearch";
import { RatingsPageBreadCrumb } from "../Breadcrumb/RatingsPageBreadCrumb";
import VintagesOfSameProductGrid from "../VintagesOfSameProductGrid";
import styles from "./CurrentRatingContainer.module.scss";

const getBuyThisWineUrl = (
  numberOfSuggestions: number,
  lang: Locale,
  estate?: ProductJsonldShopProductVintageRatingInfoDtoReadEstate,
  productName?: string,
) => {
  switch (true) {
    case numberOfSuggestions > 0: {
      const productRouteState = { query: [productName] };

      return {
        url: getPlpUrl(productRouteState, lang),
        label: "buyThisWine",
      };
    }
    case isNotNullNorUndefined(estate): {
      const estateName = estate?.name;
      const estateRouteState = { domainName: [estateName] };

      return {
        url: getPlpUrl(estateRouteState, lang),
        label: "winesOfTheEstate",
      };
    }
    default: {
      return {
        url: generateUrl("BUY_WINE_URL", lang),
        label: "buy",
      };
    }
  }
};

const CurrentRatingContainer = ({
  vintageYear,
  ratedVintages,
  currentYearRating,
  productName,
  productImagePath,
  numberOfSuggestions,
  results,
}: {
  vintageYear: string | number;
  ratedVintages: SameProductRatedProductVintageDTOJsonldShopProductVintageRatingInfoDtoRead[];
  currentYearRating: number | null | undefined;
  productName: string | undefined;
  productImagePath: string;
  numberOfSuggestions: number;
  results: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead | undefined;
}) => {
  const { t, lang } = useTranslation("prix-vin");
  const estate = results?.productVintage?.product?.estate;
  const productColor =
    typeof results?.productVintage?.product?.color === "string"
      ? t(`enums:color.${results.productVintage.product.color}`).toLocaleLowerCase()
      : "";
  const vintageCode = results?.productVintage?.code;
  const productId = results?.productVintage?.product?.id;
  const buyThisWineUrl = getBuyThisWineUrl(numberOfSuggestions, lang, estate, productName);
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div className={styles.firstGridContainer}>
      <RatingsPageBreadCrumb
        className={styles.breadCrumb}
        productName={productName ?? ""}
        year={vintageYear.toString()}
        color={productColor}
      />
      <div className={styles.searchContainer}>
        <AlgoliaRatingInstantSearch
          searchBoxStyles={{ input: styles.searchInput }}
          hitsStyle={styles.hits}
          placeholder={t("searchPlaceholder")}
          onClickCallback={() => setExpanded(false)}
        />
      </div>
      <div className={styles.gridTitleContainer}>
        <div className={styles.gridMainTitle}>
          <span>
            <Trans
              ns="prix-vin"
              i18nKey="mainTitle"
              components={{ strong: <strong /> }}
              values={{ productName: productName, vintageYear: vintageYear }}
            />
          </span>
          <span className={styles.gridSubTitle}>
            {t("colorTitle", {
              color: productColor,
            })}
          </span>
        </div>
        <GoldenUnderlineTitle size="large" />
      </div>
      <div className={clsx(styles.vintagesOfSameProductContainer, styles.whiteBoxWithShadow)}>
        <VintagesOfSameProductGrid
          ratedVintages={ratedVintages}
          currentVintage={vintageCode}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      </div>
      <div className={clsx(styles.currentRatingContainer, styles.whiteBoxWithShadow)}>
        <div className={styles.currentRatingPicturesContainer}>
          <Image
            src={"/prix-vin/bg-cote-prices.jpg"}
            alt={t("backgroundBottleImage")}
            width={480}
            height={120}
            className={styles.currentRatingPictureBackground}
            priority
          />
          <div className={styles.currentRatingPictureContainer}>
            <Image
              src={replaceImageBaseUrlWithOriginal(productImagePath)}
              alt={t("bottleImage")}
              fill
              priority
              className={styles.currentRatingPicture}
            />
          </div>
        </div>
        <div className={styles.currentRatingTitle}>{t("currentRatingTitle")}</div>
        <div className={styles.currentRatingSubtitle}>{t("currentRatingSubtitle")}</div>
        {isNotNullNorUndefined(currentYearRating) && (
          <Price price={currentYearRating} size="big" dontDisplayCents />
        )}
        <div className={styles.currentRatingButtonContainer}>
          <LinkButton
            variant="secondaryBlack"
            href={buyThisWineUrl.url}
            className={styles.currentRatingButton}
            dontTranslate
          >
            <Trans
              ns="prix-vin"
              i18nKey={buyThisWineUrl.label}
              components={{ strong: <strong /> }}
            />
          </LinkButton>
          <LinkButton
            variant="secondaryWhite"
            href="SELL_MY_WINES_URL"
            className={styles.currentRatingButton}
          >
            <Trans ns="prix-vin" i18nKey="sellThisWine" components={{ strong: <strong /> }} />
          </LinkButton>
        </div>
      </div>
      <div className={clsx(styles.listButtonsContainer)}>
        <ul className={styles.buttonsList}>
          <li>
            <LinkButton variant="primaryWhite" className={styles.listButton} href="MY_CAVE_URL">
              {t("addToMyCellar")}
            </LinkButton>
          </li>
          <li>
            <LinkButton
              variant="primaryWhite"
              href="ADD_ALERT_URL"
              queryParam={
                new URLSearchParams({
                  productId: String(productId),
                  productColor: results?.productVintage?.product?.color ?? "",
                  productVintageYear: String(vintageYear),
                })
              }
              className={clsx(styles.listButton, styles.createAnAlertButton)}
            >
              {t("createAnAlert")}
            </LinkButton>
          </li>
          <li>
            <LinkButton
              variant="primaryWhite"
              href="#detailedCharacteristics"
              className={styles.listButton}
              dontTranslate
            >
              {t("theDetailedCharacteristics")}
            </LinkButton>
          </li>
          <li>
            <LinkButton
              variant="primaryWhite"
              href="#ratingInDetails"
              className={styles.listButton}
              dontTranslate
            >
              {t("theRatingInDetails")}
            </LinkButton>
          </li>
          <li>
            <LinkButton
              variant="primaryWhite"
              href="#tastingNotesAndComments"
              className={styles.listButton}
              dontTranslate
            >
              {t("theVintageNotes")}
            </LinkButton>
          </li>
          <li>
            <LinkButton
              variant="primaryWhite"
              href="#winePerformanceAndAnalysis"
              className={styles.listButton}
              dontTranslate
            >
              {t("analysisAndPerformance")}
            </LinkButton>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CurrentRatingContainer;
