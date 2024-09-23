import { sendGTMEvent } from "@next/third-parties/google";
import clsx from "clsx";
import DOMPurify from "isomorphic-dompurify";
import React, { useState } from "react";

import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon";
import IntensityGauge from "@/components/atoms/IntensityGauge/IntensityGauge";
import Tag from "@/components/atoms/Tag/Tag";
import HeartButton from "@/components/molecules/HeartButton";
import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
import { getVariantAlcoolProportion, getVariantVintageTitle } from "@/domain/productVariant";
import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useGetAuctionItemDTOItem } from "@/networking/sylius-api-client/auction-item-dt-o/auction-item-dt-o";
import { cinzelFont, idealWineIconsFont } from "@/styles/fonts";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import AuctionAlertTriggeredDialog from "../../AuctionAlertTriggeredDialog";
import styles from "./ProductVariantMainDescription.module.scss";

export const ProductVariantMainDescription = ({
  productVariant,
  className,
}: {
  productVariant: ProductVariantJsonldShopProductVariantRead;
  className?: string;
}): JSX.Element => {
  const { data: auctionItem } = useGetAuctionItemDTOItem(
    productVariant.auction ? productVariant.code : "", // string is voluntary empty, it does not trigger a call);
  );
  const [isAlertTriggered, setIsAlertTriggered] = useState(false);

  const { t } = useTranslation();
  const isBio = productVariant.product?.bio === true;
  const isNatural = productVariant.product?.natural === true;
  const isTripleA = productVariant.product?.tripleA === true;

  const variantAndVintage = getVariantVintageTitle(productVariant);

  const aromaCase = productVariant.product?.dominantAroma;
  const dominantAroma =
    typeof aromaCase === "string" ? t(`enums:dominantAroma.${aromaCase}`) : null;

  const tastingOccasionCase = productVariant.product?.tastingOccasion;
  const tastingOccasion =
    typeof tastingOccasionCase === "string"
      ? t(`enums:tastingOccasion.${tastingOccasionCase}`)
      : null;

  const profileCase = productVariant.product?.profile;
  const profile = typeof profileCase === "string" ? t(`enums:profile.${profileCase}`) : null;
  const intensity = productVariant.product?.intensity;
  const intensityTooltipText = isNotNullNorUndefined(intensity)
    ? t(`enums:intensity.${intensity}`)
    : null;
  const colorTooltipText =
    productVariant.product?.color !== undefined && typeof productVariant.product.color === "string"
      ? t(`enums:color.${productVariant.product.color}`)
      : null;

  const formattedVolume =
    typeof productVariant.volume === "number" ? productVariant.volume / 1000 : null;

  const alcoolProportion = getVariantAlcoolProportion(productVariant);

  const showTags =
    typeof dominantAroma === "string" ||
    typeof tastingOccasion === "string" ||
    typeof profile === "string";

  const handleAlertTriggered = () => {
    setIsAlertTriggered(true);
    sendGTMEvent({ event: "surveillerVin", goalType: "surveiller_vin" });
  };

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.saleType}>
        <span className={styles.mainTitle}>
          {t(productVariant.auction ? `acheter-vin:auctionName` : `acheter-vin:directPurchaseName`)}
        </span>
        |
        {productVariant.quintessenceSale === true && (
          <span className={cinzelFont.className}>{t("acheter-vin:quintessence")}</span>
        )}
        <HeartButton
          isDirectPurchase={!productVariant.auction}
          code={productVariant.code}
          productVariantInAuctionCatalogId={auctionItem?.variantInAuctionCatalog?.["@id"]}
          followersCount={auctionItem?.followersCount}
          onToggleToOnSuccess={handleAlertTriggered}
          endDateISOString={auctionItem?.endDate}
        />
      </div>
      <h1 className={styles.title}>{variantAndVintage}</h1>
      {showTags ? (
        <div className={styles.infoRow}>
          {typeof dominantAroma === "string" && <Tag text={dominantAroma} />}
          {typeof tastingOccasion === "string" && <Tag text={tastingOccasion} />}
          {typeof profile === "string" && <Tag text={profile} />}
        </div>
      ) : null}
      <div className={styles.infoRow}>
        {typeof productVariant.product?.color === "string" && (
          <>
            <TooltipCustom
              trigger={
                <div>
                  <CustomColorCircleIcon
                    colorVariant={productVariant.product.color}
                    size="medium"
                  />
                </div>
              }
              contentProps={{ side: "bottom" }}
            >
              <span>{colorTooltipText}</span>
            </TooltipCustom>
            <div className={styles.separator} />
          </>
        )}
        {isBio && (
          <>
            <div className={clsx(styles.icon, styles.bioIcon, idealWineIconsFont.className)}>
              <TooltipCustom trigger={<span>A</span>} contentProps={{ side: "right" }}>
                <span>{t("acheter-vin:bio")}</span>
              </TooltipCustom>
            </div>
            <div className={styles.separator} />
          </>
        )}
        {isNatural && (
          <>
            <div className={clsx(styles.icon, idealWineIconsFont.className)}>
              <TooltipCustom trigger={<span>K</span>} contentProps={{ side: "right" }}>
                <span>{t("acheter-vin:natural")}</span>
              </TooltipCustom>
            </div>
            <div className={styles.separator} />
          </>
        )}
        {isTripleA && (
          <>
            <div className={clsx(styles.icon, idealWineIconsFont.className)}>
              <TooltipCustom trigger={<span>S</span>} contentProps={{ side: "right" }}>
                <span>{t("acheter-vin:tripleA")}</span>
              </TooltipCustom>
            </div>
            <div className={styles.separator} />
          </>
        )}

        {typeof alcoolProportion === "number" && (
          <>
            <p>{alcoolProportion}%</p>
            <div className={styles.separator} />
          </>
        )}
        {formattedVolume !== null && (
          <>
            <p>{formattedVolume}L</p>
          </>
        )}
        {isNotNullNorUndefined(intensity) && (
          <>
            <div className={styles.separator} />
            <TooltipCustom
              trigger={
                <div className={styles.tooltipTrigger}>
                  <p>{t(`acheter-vin:intensity`)}</p>
                  <IntensityGauge intensity={intensity} />
                </div>
              }
              contentProps={{ side: "bottom" }}
            >
              <span>{intensityTooltipText}</span>
            </TooltipCustom>
          </>
        )}
      </div>
      <div>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(productVariant.product?.shortDescription ?? ""),
          }}
        />
        <a
          href="#detailed-informations-section"
          className={clsx(styles.link, styles.shortDescriptionLink)}
        >
          {t(`acheter-vin:shortDescriptionLink`)}
        </a>
      </div>
      {isAlertTriggered && (
        <AuctionAlertTriggeredDialog open={isAlertTriggered} setOpen={setIsAlertTriggered} />
      )}
    </div>
  );
};

export default ProductVariantMainDescription;
