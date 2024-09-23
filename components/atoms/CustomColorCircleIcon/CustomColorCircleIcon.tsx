import clsx from "clsx";

import {
  AuctionCatalogJsonldShopAuctionCatalogReadColor,
  ProductJsonldShopProductVariantReadColor,
} from "@/networking/sylius-api-client/.ts.schemas";
import { idealWineIconsFont } from "@/styles/fonts";

import styles from "./CustomColorCircleIcon.module.scss";

type ColorVariant =
  | "redVariant"
  | "whiteVariant"
  | "pinkVariant"
  | "orangeVariant"
  | "greenVariant"
  | "amberVariant"
  | "redWhiteVariant"
  | "amberWhiteVariant"
  | "yellowVariant"
  | "liquorousWhiteVariant"
  | "unknownVariant";

const getColorVariantClassName = (color?: string | null): ColorVariant => {
  switch (color) {
    case "RED":
      return "redVariant";
    case "WHITE":
      return "whiteVariant";
    case "PINK":
      return "pinkVariant";
    case "ORANGE":
      return "orangeVariant";
    case "GREEN":
      return "greenVariant";
    case "AMBER":
      return "amberVariant";
    case "RED_WHITE":
      return "redWhiteVariant";
    case "AMBER_WHITE":
      return "amberWhiteVariant";
    case "SPARKLING_WHITE":
      return "whiteVariant";
    case "SPARKLING_ROSE":
      return "pinkVariant";
    case "VARIOUS":
      return "redWhiteVariant";
    case "SPARKLING_RED":
      return "redVariant";
    case "LIQUOROUS_WHITE":
      return "liquorousWhiteVariant";
    case "ROSE":
      return "pinkVariant";
    case "YELLOW":
      return "yellowVariant";
    case "DEMI_DRY_WHITE":
      return "whiteVariant";
    case "INDIFFERENT":
      return "unknownVariant";
    case "DRY_WHITE":
      return "whiteVariant";
    default:
      return "unknownVariant";
  }
};

type Props = {
  colorVariant?:
    | ProductJsonldShopProductVariantReadColor
    | AuctionCatalogJsonldShopAuctionCatalogReadColor;
  size?: "small" | "medium";
};
const CustomColorCircleIcon = ({ colorVariant, size = "small" }: Props) => {
  const isEffervescent = colorVariant?.includes("SPARKLING");

  return (
    <div
      className={clsx(
        styles[getColorVariantClassName(colorVariant)],
        isEffervescent && idealWineIconsFont.className,
        styles[size],
      )}
    >
      {isEffervescent && <span>H</span>}
    </div>
  );
};

export default CustomColorCircleIcon;
