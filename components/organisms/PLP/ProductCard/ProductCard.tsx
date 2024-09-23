import clsx from "clsx";
import Image from "next/image";

import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon";
import CustomCountdown from "@/components/atoms/CustomCountdown";
import HeartButton from "@/components/molecules/HeartButton";
import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
import { getVariantTitle } from "@/domain/productVariant";
import { refinementsTranslationKeys } from "@/hooks/useAlgoliaRefinements";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { ProductJsonldColor } from "@/networking/sylius-api-client/.ts.schemas";
import ClientOnly, { useClientOnlyValue } from "@/utils/ClientOnly";
import { formatAvailableQuantity } from "@/utils/availableQuantity";
import { getProductVariantInAuctionCatalogIRI } from "@/utils/iriUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotBlank, isNotNullNorUndefined } from "@/utils/ts-utils";

import { AlgoliaHitType } from "../AlgoliaHit/AlgoliaHitType";
import ProductVariantBiologicalProfilIcons from "../ProductVariantBiologicalProfilIcons/ProductVariantBiologicalProfilIcons";
import styles from "./ProductCard.module.scss";

export const IMAGE_WIDTH = 200;

const HOURS_BEFORE_ENDING_SOON = 24;

type Props = {
  product: AlgoliaHitType;
  preloadPicture: boolean;
  className?: string;
  fromPLP?: boolean;
};

const ProductCard = ({
  product,
  className,
  preloadPicture,
  fromPLP = false,
}: Props): JSX.Element => {
  const { t, lang } = useTranslation();

  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();
  const currentCountryPrice = (
    product.priceByCountry as typeof product.priceByCountry | undefined
  )?.[countryCode];
  const price = currentCountryPrice ?? 0;
  const currentCountryOriginalPrice = (
    product.originalPriceByCountry as typeof product.originalPriceByCountry | undefined
  )?.[countryCode];
  const originalPrice = currentCountryOriginalPrice ?? 0;

  const endDateMilliseconds = product.bidEndDate * 1000;
  const startDateMilliseconds = product.auctionCatalogStartDate * 1000;
  const now = useClientOnlyValue(Date.now(), 0);

  const isOverTimeBidding =
    product.bidEndDate > product.auctionCatalogEndDate && now < endDateMilliseconds;

  // returns true when remaining time is below 24h but not overTimeBidding
  const showIsEndingSoonStyle =
    !isOverTimeBidding &&
    endDateMilliseconds - HOURS_BEFORE_ENDING_SOON * 60 * 60 * 1000 < now &&
    now < endDateMilliseconds;

  const getRemainingTime = () => {
    if (now < startDateMilliseconds) {
      return t("product-card:incomingSale");
    } else if (now > endDateMilliseconds) {
      return t("product-card:saleOver");
    } else {
      return (
        <CustomCountdown
          date={new Date(endDateMilliseconds)}
          timeoutMessage={t("product-card:saleOver")}
        />
      );
    }
  };

  const hasSoldOut = product.isDirectPurchase && product.availableQuantity === 0;
  const hasUnitDiscount = originalPrice > price;
  const hasLotDiscount = product.lotDiscountPercentage > 0 && product.unitsPerLotOfDiscount > 0;
  // This should be validated on the backend side as well
  const hasLotDiscountStock = product.availableQuantity >= product.unitsPerLotOfDiscount;
  const showLotDiscountPrice = product.isDirectPurchase && hasLotDiscount && hasLotDiscountStock;

  const totalLotDiscount = price * (1 - product.lotDiscountPercentage / 100);

  const limitedQuantityPerOrder = product.limitedQuantityPerOrder;
  const hasValidLimitedQuantityPerOrder =
    isNotNullNorUndefined(limitedQuantityPerOrder) && limitedQuantityPerOrder > 0;
  const lowerStockText = !product.isDirectPurchase
    ? t("product-card:totalBids", { count: product.bidCount })
    : hasValidLimitedQuantityPerOrder
    ? t("product-card:limitedQuantity")
    : t("product-card:currentStock", {
        availableQuantity: formatAvailableQuantity(product.availableQuantity),
      });

  const numberOfBottlesWithFormat = t(`common:enum.format.${product.bottleSize}`, {
    count: product.bottleCount,
  });

  return (
    <div className={clsx(styles.container, className, hasSoldOut && styles.soldoutBackground)}>
      <div
        className={clsx(
          styles.productCardHeader,
          showIsEndingSoonStyle && styles.soonExpired,
          isOverTimeBidding && styles.overTimeBidding,
          product.isDirectPurchase &&
            (hasSoldOut || showLotDiscountPrice
              ? styles.lotDiscountCardHeader
              : styles.emptyCardHeader),
        )}
      >
        {hasSoldOut && <span>{t("product-card:soonAvailable")}</span>}
        {/* Avoid mismatch between client and server regarding Date.now() */}
        {!product.isDirectPurchase && <ClientOnly>{getRemainingTime()}</ClientOnly>}
        {showLotDiscountPrice && (
          <span>
            <Price price={totalLotDiscount} size="small" />{" "}
            {t("product-card:discountResume", {
              unitsPerLotOfDiscount: product.unitsPerLotOfDiscount,
              lotDiscountPercentage: product.lotDiscountPercentage,
            })}
          </span>
        )}
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.cardTopPart}>
          <button className={styles.sellingTitle}>
            <span>
              {product.isDirectPurchase
                ? t("product-card:directPurchase")
                : t("product-card:auction")}
            </span>
            <HeartButton
              isDirectPurchase={product.isDirectPurchase}
              code={product.code}
              productVariantInAuctionCatalogId={getProductVariantInAuctionCatalogIRI(
                product.productVariantInAuctionCatalogId,
              )}
              endDateISOString={new Date(product.bidEndDate * 1000).toISOString()}
            />
          </button>
          <ProductVariantBiologicalProfilIcons
            isBio={product.isBio}
            isNatural={product.isNatural}
            isTripleA={product.isTripleA}
          />
          <PdpLink
            variant={{
              ...product,
              format: product.bottleSize,
              numberOfBottles: product.bottleCount,
              additionalObservations: product.additionalObservations?.[lang],
            }}
            className={styles.linkToProduct}
            fromPLP={fromPLP}
          >
            <Image
              unoptimized
              src={isNotBlank(product.imageUrl) ? product.imageUrl : `/_no_picture_${lang}.jpg`}
              alt={getVariantTitle(product.name, product.additionalObservations?.[lang]) ?? ""}
              width={IMAGE_WIDTH}
              height={IMAGE_WIDTH * 1.334}
              className={clsx(styles.bottleImage, hasSoldOut && styles.soldoutElement)}
              priority={preloadPicture}
            />
            <h2 className={styles.bottleDescription}>
              {getVariantTitle(product.name, product.additionalObservations?.[lang])}
            </h2>
          </PdpLink>
        </div>
        <div className={styles.cardBottomPart}>
          <div className={styles.bottleRelevantFeatures}>
            <TooltipCustom
              trigger={
                <span>
                  <CustomColorCircleIcon colorVariant={product.color as ProductJsonldColor} />
                </span>
              }
              contentProps={{ side: "right" }}
            >
              <span>{t(`${refinementsTranslationKeys.color}.${product.color}`)}</span>
            </TooltipCustom>
            <span className={styles.vintageContainer}>{product.vintage}</span>
          </div>
          <div className={styles.productCardMetadata}>
            {`${t("product-card:lot")} ${numberOfBottlesWithFormat} | ${lowerStockText}`}
          </div>
          <div>
            <span className={styles.price}>
              <Price price={price} isDiscount={hasUnitDiscount} size="medium" />
              {hasUnitDiscount && <Price price={originalPrice} strikethrough size="normal" />}
            </span>{" "}
            <span className={styles.priceDescription}>
              {!product.isDirectPurchase &&
                "(" +
                  (product.bidCount > 0
                    ? t("product-card:actualPrice")
                    : t("product-card:startPrice")) +
                  ")"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
