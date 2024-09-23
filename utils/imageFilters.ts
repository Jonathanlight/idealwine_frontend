import { isNonNullObject, isNotNullNorUndefined } from "./ts-utils";

export const ImageFilters = {
  CUSTOMER: "product_variant_x_small",
  ALERT: "product_variant_x_small",
  CAROUSEL: "product_variant_medium",
  CAROUSEL_FULLSCREEN: "product_variant_large",
  CART: "product_variant_x_small",
  CURRENT_RATING: "product_current_rating",
  HOMEPAGE_CARD: "product_variant_small",
} as const;

type ImageFiltersKeys = typeof ImageFilters[keyof typeof ImageFilters];

type FilteredImage = {
  id: string;
  path: { [key in ImageFiltersKeys]: string };
};

export const isFilteredImage = (image: unknown): image is FilteredImage =>
  isNonNullObject(image) && isNonNullObject(image.path) && isNotNullNorUndefined(image.id);

export type Image = {
  id?: number;
  path?: unknown;
};

export const productVariantImageFiltersParameter = {
  filter: [ImageFilters.CAROUSEL, ImageFilters.CAROUSEL_FULLSCREEN],
};
