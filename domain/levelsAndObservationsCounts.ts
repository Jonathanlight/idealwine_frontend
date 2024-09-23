import { ProductVariantJsonldShopProductVariantRead } from "@/networking/sylius-api-client/.ts.schemas";

export type ConditionCounts = {
  levels: { [key: string]: number };
  observations: { [key: string]: number };
};

export const getLevelsAndObservationsCounts = (
  productVariant: ProductVariantJsonldShopProductVariantRead,
): ConditionCounts | null => {
  const numberOfBottles = productVariant.numberOfBottles;
  const observations = productVariant.observations ?? [];
  const levels = productVariant.levels ?? [];

  const conditionIsDescribed =
    numberOfBottles !== undefined || observations.length > 0 || levels.length > 0;

  if (!conditionIsDescribed) {
    return null;
  }

  const levelsAndObservationsCounts: ConditionCounts = {
    levels: {},
    observations: {},
  };

  levels.map(({ value, quantity }) => {
    if (value !== undefined && quantity !== undefined) {
      if (typeof levelsAndObservationsCounts.levels[value] === "number") {
        levelsAndObservationsCounts.levels[value] += quantity;
      } else {
        levelsAndObservationsCounts.levels[value] = quantity;
      }
    }
  });

  observations.map(({ value, quantity }) => {
    if (value !== undefined && quantity !== undefined) {
      if (typeof levelsAndObservationsCounts.observations[value] === "number") {
        levelsAndObservationsCounts.observations[value] += quantity;
      } else {
        levelsAndObservationsCounts.observations[value] = quantity;
      }
    }
  });

  return levelsAndObservationsCounts;
};
