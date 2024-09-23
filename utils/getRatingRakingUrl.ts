import { noRegion } from "@/components/organisms/RatingRankingSearchForm/enum";
import { generateUrl, Locale } from "@/urls/linksTranslation";

import { noYear } from "./generateArrayOfYears";
import { isNotNullNorUndefined } from "./ts-utils";

export const buildRatingRakingUrl = (
  lang: Locale,
  vintageYear?: string,
  region?: string,
): string => {
  const url = generateUrl("BEST_WINES_BY_VINTAGE", lang);
  if (
    region !== noRegion.value &&
    isNotNullNorUndefined(region) &&
    vintageYear !== noYear &&
    isNotNullNorUndefined(vintageYear)
  ) {
    return `${url}-${region}-${vintageYear}`;
  }
  if (region !== noRegion.value && isNotNullNorUndefined(region)) {
    return `${url}-${region.toLocaleLowerCase()}`;
  }
  if (vintageYear !== noYear && isNotNullNorUndefined(vintageYear)) {
    return `${url}-${vintageYear}`;
  }

  return url;
};
