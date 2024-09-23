import { generateUrl, Locale } from "@/urls/linksTranslation";

export const buildAdjudicatedOnIdealWineUrl = (lang: Locale, year: string): string => {
  const url = generateUrl("MOST_EXPENSIVE_WINES", lang);

  return `${url}-${year}`;
};
