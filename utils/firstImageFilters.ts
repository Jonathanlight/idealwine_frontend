import { isNonNullObject } from "./ts-utils";

export const ImageFilters = {
  CUSTOMER: "product_variant_x_small",
  ALERT: "product_variant_x_small",
  CAROUSEL: "product_variant_medium",
  CAROUSEL_FULLSCREEN: "product_variant_large",
  CART: "product_variant_x_small",
  CURRENT_RATING: "product_current_rating",
} as const;

type ImageFiltersKeys = typeof ImageFilters[keyof typeof ImageFilters];

type FilteredImage = {
  path: { [key in ImageFiltersKeys]: string };
};

export const isFilteredFirstImage = (image: unknown): image is FilteredImage =>
  isNonNullObject(image) && isNonNullObject(image.path);

export type Image = {
  path?: unknown;
};
