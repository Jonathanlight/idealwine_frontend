import { ProductVariantShopSimilarProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";

import { isFilteredFirstImage } from "./firstImageFilters";
import { Image, ImageFilters } from "./imageFilters";
import { isNotNullNorUndefined } from "./ts-utils";

export type AvailabilitySimilarImage = {
  path: {
    [ImageFilters.CAROUSEL]: string;
  };
};

const hasCorrectPath = (image?: Image): image is AvailabilitySimilarImage =>
  isFilteredFirstImage(image) && typeof image.path.product_variant_medium === "string";

export const getAvailabilitySimilarImagePath = (
  similarProduct: ProductVariantShopSimilarProductVariantRead,
): string | null => {
  const firstImage = similarProduct.firstImage;
  if (isNotNullNorUndefined(firstImage) && hasCorrectPath(firstImage))
    return firstImage.path.product_variant_medium;

  return null;
};
