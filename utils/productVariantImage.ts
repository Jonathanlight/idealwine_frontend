import { ProductVariantImageJsonldShopProductVariantRead as ProductVariantImage } from "@/networking/sylius-api-client/.ts.schemas";

import { Image, ImageFilters, isFilteredImage } from "./imageFilters";
import { isNonEmptyArray } from "./ts-utils";

export type ProductVariantCarouselImage = {
  path: {
    [ImageFilters.CAROUSEL]: string;
    [ImageFilters.CAROUSEL_FULLSCREEN]: string;
  };
};

export const getDefaultCarouselImages = (lang: string): ProductVariantCarouselImage[] => {
  return [
    {
      path: {
        [ImageFilters.CAROUSEL]: `/_no_picture_${lang}.jpg`,
        [ImageFilters.CAROUSEL_FULLSCREEN]: `/_no_picture_${lang}.jpg`,
      },
    },
  ];
};

export const isProductVariantCarouselImage = (image: Image): image is ProductVariantImage =>
  isFilteredImage(image) &&
  typeof image.path.product_variant_medium === "string" &&
  typeof image.path.product_variant_large === "string";

const areProductVariantCarouselImages = (
  images: Image[] | undefined,
): images is ProductVariantCarouselImage[] =>
  isNonEmptyArray(images) && images.every(isProductVariantCarouselImage);

export const getProductVariantCarouselImages = (
  productVariantImages?: ProductVariantImage[],
  lang = "fr",
): ProductVariantCarouselImage[] =>
  areProductVariantCarouselImages(productVariantImages)
    ? productVariantImages
    : getDefaultCarouselImages(lang);

type ProductVariantAlertImage = {
  id: number;
  path: { [ImageFilters.ALERT]: string };
};

const isProductVariantAlertImage = (image?: Image | null): image is ProductVariantAlertImage =>
  isFilteredImage(image) && typeof image.path.product_variant_x_small === "string";

export const getProductVariantAlertImagePath = (lang: string, image?: Image | null): string =>
  isProductVariantAlertImage(image)
    ? image.path.product_variant_x_small
    : `/_no_picture_${lang}.jpg`;

type CustomerProductVariantImage = {
  id: number;
  path: {
    product_variant_x_small: string;
  };
};

const isCustomerProductVariantImage = (
  image?: Image | null,
): image is CustomerProductVariantImage =>
  isFilteredImage(image) && typeof image.path.product_variant_x_small === "string";

export const getCustomerProductVariantImagePath = (lang: string, image?: Image | null): string =>
  isCustomerProductVariantImage(image)
    ? image.path.product_variant_x_small
    : `/_no_picture_${lang}.jpg`;
