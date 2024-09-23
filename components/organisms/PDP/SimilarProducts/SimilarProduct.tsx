import clsx from "clsx";
import Image from "next/image";

import CustomColorCircleIcon from "@/components/atoms/CustomColorCircleIcon";
import PdpLink from "@/components/molecules/PdpLink";
import Price from "@/components/molecules/Price";
import TooltipCustom from "@/components/molecules/Tooltip/Tooltip";
import { refinementsTranslationKeys } from "@/hooks/useAlgoliaRefinements";
import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import {
  ProductShopSimilarProductVariantRead,
  ProductVariantShopSimilarProductVariantRead,
  ProductVariantShopSimilarProductVariantReadProductVintage,
} from "@/networking/sylius-api-client/.ts.schemas";
import { getAvailabilitySimilarImagePath } from "@/utils/availabilitySimilarImage";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import ProductVariantBiologicalProfilIcons from "../../PLP/ProductVariantBiologicalProfilIcons";
import styles from "./SimilarProduct.module.scss";

export const IMAGE_WIDTH = 200;

type Props = {
  product: ProductVariantShopSimilarProductVariantRead;
  preloadPicture: boolean;
  className?: string;
};

const SimilarProduct = ({ product, className, preloadPicture }: Props): JSX.Element => {
  const { t, lang } = useTranslation("acheter-vin");

  const { currentDeliveryCountry: countryCode } = useCurrentDeliveryCountry();
  const currentCountryPrice = product.priceByCountry?.[countryCode];
  const price = currentCountryPrice ?? 0;
  const discountedPrice = (price * (100 - (product.lotDiscountPercentage ?? 0))) / 100;

  const remainingStocks =
    typeof product.onHand === "number" && typeof product.onHold === "number"
      ? product.onHand - product.onHold
      : 0;

  const productOfVariant: ProductShopSimilarProductVariantRead =
    product.product !== undefined ? product.product : {};

  const fullProductName = productOfVariant.name ?? "";
  const productName =
    fullProductName.length >= 50 ? `${fullProductName.substring(0, 50)}...` : fullProductName;

  const shortDescription = isNotNullNorUndefined(productOfVariant.shortDescription)
    ? productOfVariant.shortDescription
    : "";

  const productVintage: ProductVariantShopSimilarProductVariantReadProductVintage =
    isNotNullNorUndefined(product.productVintage) ? product.productVintage : {};

  const availabilitySimilarImagePath =
    getAvailabilitySimilarImagePath(product) ?? `/_no_picture_${lang}.jpg`;

  return (
    <div className={className}>
      <div className={styles.cardContainer}>
        <div className={styles.cardTopPart}>
          <PdpLink
            variant={{
              ...product,
              format: product.format,
              numberOfBottles: product.numberOfBottles,
            }}
            className={styles.linkToProduct}
          >
            <Image
              unoptimized
              src={availabilitySimilarImagePath}
              alt="bottle of wine"
              width={IMAGE_WIDTH}
              height={IMAGE_WIDTH * 1.334}
              className={clsx(styles.bottleImage)}
              priority={preloadPicture}
            />
            <h2 className={styles.bottleDescriptionContainer}>
              <div className={styles.bottleDescription}>
                <TooltipCustom
                  trigger={
                    <span>
                      <CustomColorCircleIcon colorVariant={productOfVariant.color} />
                    </span>
                  }
                  contentProps={{ side: "right" }}
                >
                  <span>
                    {t(`${refinementsTranslationKeys.color}.${productOfVariant.color as string}`)}
                  </span>
                </TooltipCustom>{" "}
                <span className={styles.productName}>{productName}</span>
                <ProductVariantBiologicalProfilIcons
                  isBio={product.product?.bio ?? false}
                  isNatural={product.product?.natural ?? false}
                  isTripleA={product.product?.tripleA ?? false}
                  isBlockLayout={false}
                />
              </div>
            </h2>
            <div className={styles.vintageYear}>{productVintage.year}</div>
          </PdpLink>
        </div>
        <div className={styles.cardBottomPart}>
          <p>
            {shortDescription.length > 40
              ? `${shortDescription.substring(0, 40)}...`
              : product.product?.shortDescription}
          </p>
          <span className={styles.price}>
            <Price price={price} size="medium" />
          </span>{" "}
        </div>
        {remainingStocks > 0 && remainingStocks <= 5 && (
          <div className={styles.remainingStocks}>
            {t(`remainingStocks.${remainingStocks === 1 ? "singular" : "plural"}`, {
              remainingStocks: remainingStocks,
            })}
          </div>
        )}
        {true === product.hasLotDiscount && (
          <div className={styles.lotDiscountContainer}>
            <Price price={discountedPrice} size="small" />{" "}
            {t(`lotDiscount`, {
              bottleNumber: product.lotDiscountBottleNumber ?? 0,
              discountPercentage: product.lotDiscountPercentage ?? 0,
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarProduct;
