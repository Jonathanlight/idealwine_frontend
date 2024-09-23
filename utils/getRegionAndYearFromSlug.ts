import {
  noRegion,
  ratingRankingSearchFormRegionChoices,
} from "@/components/organisms/RatingRankingSearchForm/enum";

import { isNotNullNorUndefined } from "./ts-utils";

export type RatingsSearchParamType = {
  region?: string;
  year?: string;
};

export const getRegionAndYearFromSlug = (slug: string): RatingsSearchParamType => {
  let foundRegion = noRegion.name;
  for (const region of ratingRankingSearchFormRegionChoices) {
    const regionValue = region.value;

    if (slug.includes(regionValue)) {
      foundRegion = region.name;
      break;
    }
  }

  const yearPattern = /\b[12]\d{3}\b/;

  const matchedYear = isNotNullNorUndefined(slug) ? slug.match(yearPattern)?.[0] : undefined;

  return {
    ...(foundRegion !== noRegion.name && { region: foundRegion }),
    ...(matchedYear !== undefined && { year: matchedYear }),
  };
};
