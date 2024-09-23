import { ProductAvailabilityAlertJsonldShopProductAvailabilityAlertRead } from "@/networking/sylius-api-client/.ts.schemas";

import { Image, ImageFilters, isFilteredImage } from "./imageFilters";

export type AvailabilityAlertImage = {
  path: {
    [ImageFilters.ALERT]: string;
  };
};

const hasCorrectPath = (image?: Image): image is AvailabilityAlertImage =>
  isFilteredImage(image) && typeof image.path.product_variant_x_small === "string";

export const getAvailabilityAlertImagePath = (
  availabilityAlert: ProductAvailabilityAlertJsonldShopProductAvailabilityAlertRead,
): string | null => {
  const vintageImages = availabilityAlert.productVintage?.images;
  const firstVintageImage = vintageImages?.[0];
  if (hasCorrectPath(firstVintageImage)) return firstVintageImage.path.product_variant_x_small;

  const productImages = availabilityAlert.productVintage?.product?.images;
  const firstProductImage = productImages?.[0];
  if (hasCorrectPath(firstProductImage)) return firstProductImage.path.product_variant_x_small;

  return null;
};
