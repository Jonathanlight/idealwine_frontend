import { Translate } from "next-translate";

import { generateUrl, Locale } from "@/urls/linksTranslation";
import { normalizePdpUrlVariantTitle } from "@/utils/stringUtils";

import { getVariantFullTitleWithDefaultVintage } from "../domain/productVariant";

const DEFAULT_VINTAGE_YEAR = "----";

export type UrlAndSlug = {
  url: string;
  urlWithCodeWithoutSlug: string;
  slugWithCode: string;
  slugWithoutCode: string;
};

export type PdpLinkVariant = {
  code?: string | null;
  format?: string | null;
  additionalObservations?: string | null;
  numberOfBottles?: number | null;
  color?: string | null;
  product?: {
    color?: string | null;
    name?: string | null;
  } | null;
  name?: string | null;
  variantName?: string | null;
  productVintage?: {
    year?: number | null;
  } | null;
  vintage?: number | null;
  productVintageYear?: number | null;
};

export const buildPdpUrl = (variant: PdpLinkVariant, t: Translate, lang: Locale): UrlAndSlug => {
  const numberOfBottlesWithFormat = t(`common:enum.format.${variant.format ?? "INCONNU"}`, {
    count: variant.numberOfBottles,
  });

  const name = getName(variant);
  if (
    typeof numberOfBottlesWithFormat !== "string" ||
    typeof name !== "string" ||
    variant.code == null
  ) {
    return {
      url: generateUrl("PDP_SAMPLE_URL", lang, { code: variant.code }),
      slugWithCode: "",
      slugWithoutCode: "",
      urlWithCodeWithoutSlug: "",
    };
  }

  const color = getColor(variant);

  const translatedColor = typeof color === "string" ? t(`enums:color.${color}`) : null;

  const variantTitle = getVariantFullTitleWithDefaultVintage(
    numberOfBottlesWithFormat,
    getVintageYear(variant),
    name,
    variant.additionalObservations,
  );

  const variantTitleWithColor = `${variantTitle} ${translatedColor ?? ""}`.trim();

  const normalizedVariantTitle = normalizePdpUrlVariantTitle(variantTitleWithColor);

  const pdpUrlWithCodeAndWithoutSlug = generateUrl("PDP_SAMPLE_URL", lang, {
    code: variant.code,
  });
  const slugWithCode = `${variant.code}-${normalizedVariantTitle}`;
  const fullPdpUrl = `${pdpUrlWithCodeAndWithoutSlug}-${normalizedVariantTitle}`;

  return {
    url: fullPdpUrl,
    urlWithCodeWithoutSlug: pdpUrlWithCodeAndWithoutSlug,
    slugWithCode,
    slugWithoutCode: normalizedVariantTitle,
  };
};

const getVintageYear = (variant: PdpLinkVariant): string => {
  if (typeof variant.productVintage?.year === "number") {
    return String(variant.productVintage.year);
  }
  if (typeof variant.productVintageYear === "number") {
    return String(variant.productVintageYear);
  }
  if (typeof variant.vintage === "number") {
    return String(variant.vintage);
  }

  return DEFAULT_VINTAGE_YEAR;
};

const getColor = (variant: PdpLinkVariant): string | null => {
  if (typeof variant.color === "string") {
    return variant.color;
  }

  if (typeof variant.product?.color === "string") {
    return variant.product.color;
  }

  return null;
};

const getName = (variant: PdpLinkVariant): string | null => {
  if (typeof variant.product?.name === "string") {
    return variant.product.name;
  }

  if (typeof variant.name === "string") {
    return variant.name;
  }

  if (typeof variant.variantName === "string") {
    return variant.variantName;
  }

  return null;
};
