import { parse, stringify } from "qs";

import { createUrlParamsPart, parseURLParamsPart } from "@/context/AlgoliaInstantSearchProvider";
import { HrefLangs } from "@/types/HrefLangs";
import {
  buildUrl,
  generateTranslatedUrlRedirectionPerLocale,
  Locale,
  translatedLinks,
  urlMatchPath,
} from "@/urls/linksTranslation";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

export const generateTranslatedUrlWithBothData = (
  translatedUrlRedirection: ReturnType<typeof generateTranslatedUrlRedirectionPerLocale>,
  dynamicTranslatedUrlRedirection: ReturnType<typeof generateTranslatedUrlRedirectionPerLocale>,
  isOnPLP = false,
  routerLocation: { pathname: string; search: string },
  hrefLangs?: HrefLangs,
) => {
  return (currentPath: string, targetLocale: Locale, currentLocale: Locale): string => {
    if (hrefLangs) {
      const url =
        hrefLangs.find(hrefLang => hrefLang.locale === targetLocale)?.hrefLang.substring(3) ?? "";

      return url;
    }
    if (isOnPLP) {
      const location = routerLocation;
      const qsModule = { parse, stringify };
      const routeState = parseURLParamsPart(location, qsModule, currentLocale);
      const newUrl = createUrlParamsPart(routeState, qsModule, targetLocale, location.search);
      const finalUrl = translatedLinks.BUY_WINE_URL[targetLocale] + newUrl;

      return finalUrl;
    }

    const redirection = translatedUrlRedirection[targetLocale][currentPath];
    if (isNotNullNorUndefined(redirection)) {
      return redirection;
    }

    const dynamicRedirectionKey = Object.keys(dynamicTranslatedUrlRedirection[targetLocale]).find(
      path => urlMatchPath(currentPath, path),
    );

    if (isNotNullNorUndefined(dynamicRedirectionKey)) {
      const destinationRedirection =
        dynamicTranslatedUrlRedirection[targetLocale][dynamicRedirectionKey];

      if (destinationRedirection !== dynamicRedirectionKey) {
        const { params } = urlMatchPath(currentPath, dynamicRedirectionKey) as {
          params: Record<string, unknown>;
        };
        const destUrl = buildUrl(destinationRedirection, params);

        return destUrl;
      }
    }

    return currentPath;
  };
};
