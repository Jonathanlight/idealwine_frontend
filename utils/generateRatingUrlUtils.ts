import { useCallback } from "react";

import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { generateUrl, Locale } from "@/urls/linksTranslation";

import { useTranslation } from "./next-utils";
import { normalizeRatingVintageUrl } from "./stringUtils";
import { isNotNullNorUndefined } from "./ts-utils";

export const generateRatingUrlUtils = (
  productVintageCode: string,
  format: string,
  regionName: string,
  productAppellation: string,
  estateName: string,
  color: string,
  lang: Locale,
) => {
  const url = `${productVintageCode}-${format}-${regionName}-${productAppellation}-${estateName}-${color}`;

  const prefix = generateUrl("VINTAGE_RATING_PREFIX", lang);

  const normalizedSlug = normalizeRatingVintageUrl(url);

  const completeUrl = `${prefix}/${normalizedSlug}`;

  return { normalizedSlug, completeUrl };
};

export const useGenerateRatingUrlFromVariant = () => {
  const { t, lang } = useTranslation();

  const generateRatingUrlFromVariant = useCallback(
    (productVariant: ProductVariantJsonldShopProductVariantRead) => {
      const format = t("enums:formatWithoutCount.BOUTEILLE");

      const translatedColor =
        typeof productVariant.product?.color === "string"
          ? t(`enums:color.${productVariant.product.color}`).toLocaleLowerCase()
          : "";

      const translatedRegion = isNotNullNorUndefined(productVariant.product?.region?.name)
        ? t(`enums:region.${productVariant.product?.region?.name ?? ""}`)
        : "";

      const { completeUrl } = generateRatingUrlUtils(
        productVariant.productVintage?.code ?? "",
        format,
        translatedRegion,
        productVariant.product?.appellation?.toString() ?? "",
        productVariant.product?.estate?.name?.toString() ?? "",
        translatedColor,
        lang,
      );

      return completeUrl;
    },
    [lang, t],
  );

  return { generateRatingUrlFromVariant };
};
