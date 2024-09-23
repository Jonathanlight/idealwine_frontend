import { translatedLinks } from "@/urls/linksTranslation";

export const enum RankingPageToDisplay {
  BEST_WINES_BY_VINTAGE = "BEST_WINES_BY_VINTAGE",
  MOST_EXPENSIVE_WINES = "MOST_EXPENSIVE_WINES",
  NONE = "NONE",
}

const getWantedSlugFromUrl = (url: string) => url.split("/")[2];

export const getRankingPageToDisplay = (slug: string): RankingPageToDisplay => {
  const urlSearchedByLangBestWines = Object.values(translatedLinks.BEST_WINES_BY_VINTAGE);
  const isMatchBestWinesByVintage = urlSearchedByLangBestWines.some(url =>
    slug.includes(getWantedSlugFromUrl(url)),
  );

  if (isMatchBestWinesByVintage) {
    return RankingPageToDisplay.BEST_WINES_BY_VINTAGE;
  }

  const urlSearchedByLangMostExpensiveWines = Object.values(translatedLinks.MOST_EXPENSIVE_WINES);
  const isMatchMostExpensiveWines = urlSearchedByLangMostExpensiveWines.some(url =>
    slug.includes(getWantedSlugFromUrl(url)),
  );

  if (isMatchMostExpensiveWines) {
    return RankingPageToDisplay.MOST_EXPENSIVE_WINES;
  }

  return RankingPageToDisplay.NONE;
};
