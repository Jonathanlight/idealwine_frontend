import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";
import { UNITS_TO_TENTHS_FACTOR } from "@/utils/constants";
import { useTranslation } from "@/utils/next-utils";

export const getVariantTitle = (
  productName?: string | null,
  additionalObservations?: string | null,
): string | null => {
  if (typeof productName !== "string") {
    return null;
  }

  let name = productName;

  if (typeof additionalObservations === "string") {
    name = `${name} ${additionalObservations}`;
  }

  return name;
};

export const getVariantVintageTitle = (
  productVariant: ProductVariantJsonldShopProductVariantRead,
): string | null => {
  let variantTitle = getVariantTitle(
    productVariant.product?.name,
    productVariant.additionalObservations,
  );

  if (variantTitle === null) {
    return variantTitle;
  }

  const year = productVariant.productVintage?.year;

  if (typeof year === "number") {
    variantTitle = `${variantTitle} ${year}`;
  }

  return variantTitle;
};

export const useGetVariantDescription = (
  productVariant?: ProductVariantJsonldShopProductVariantRead,
): string | null => {
  const { t } = useTranslation();

  if (productVariant === undefined) {
    return null;
  }

  const variantAndVintage = getVariantVintageTitle(productVariant);

  return variantAndVintage !== null
    ? `${variantAndVintage} - ${t(`acheter-vin:lot`)} ${t(
        `common:enum.format.${productVariant.format ?? "BOUTEILLE"}`,
        { count: productVariant.numberOfBottles ?? 1 },
      )}`
    : null;
};

export const useGetVariantColorAndRegion = (
  productVariant?: ProductVariantJsonldShopProductVariantRead,
): { region: string; color: string } | null => {
  const { t } = useTranslation("enums");

  if (productVariant === undefined) {
    return null;
  }

  const product = productVariant.product;

  if (!product) {
    return null;
  }

  return {
    region: t(`enums:region.${product.region?.name ?? ""}`),
    color: t(`enums:color.${product.color ?? ""}`),
  };
};

export const getVariantTitleAndQuantity = (
  numberOfBottlesWithFormat: string,
  fullName?: string | null,
): string => `${numberOfBottlesWithFormat} ${fullName ?? ""}`.trim();

export const getVariantFullTitle = (
  numberOfBottlesWithFormat: string,
  fullName?: string | null,
  additionalObservations?: string | null,
  productVintageYear?: number | null,
): string => {
  let name = getVariantTitleAndQuantity(numberOfBottlesWithFormat, fullName);

  if ((additionalObservations ?? "") !== "") name = `${name} ${additionalObservations ?? ""}`;

  if ((productVintageYear ?? "") !== "") name = `${name} ${productVintageYear ?? ""}`;

  return name;
};

export const getVariantFullTitleWithDefaultVintage = (
  numberOfBottlesWithFormat: string,
  productVintageYear: string,
  fullName?: string | null,
  additionalObservations?: string | null,
): string => {
  let name = getVariantTitleAndQuantity(numberOfBottlesWithFormat, fullName);

  if ((additionalObservations ?? "") !== "") name = `${name} ${additionalObservations ?? ""}`;

  name = `${name} ${productVintageYear}`;

  return name;
};

export const getVariantAlcoolProportion = (
  productVariant: ProductVariantJsonldShopProductVariantRead,
): number | null => {
  const proportionInTenthsOfPercents =
    productVariant.alcoolProportion ?? productVariant.product?.alcoolProportion ?? null;

  if (typeof proportionInTenthsOfPercents !== "number") {
    return null;
  }

  const proportionInPercents = proportionInTenthsOfPercents / UNITS_TO_TENTHS_FACTOR;

  return proportionInPercents;
};
