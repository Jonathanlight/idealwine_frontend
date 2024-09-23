import { Locale, LOCALES, translatedLinks } from "@/urls/linksTranslation";
import {
  codeToTranslated,
  customSorts,
  KeyList,
  keyList,
  KeyTranslatedToCode,
  keyTranslatedToCode,
  paramsList,
  RefinementType,
  sortByTranslationsList,
  valueSeparator,
  valueTranslatedToCode,
} from "@/utils/algoliaUrlsDataGenerator";

import { isNonEmptyArray, isNotNullNorUndefined } from "./ts-utils";

// Unfortunately, algoliaRoute has to have every value as a string array.
export type AlgoliaRoute = Partial<Record<RefinementType, string[]>> & {
  sortBy?: string[];
};

const hasACustomSort = (
  refinement: KeyList[number]["name"],
): refinement is keyof typeof customSorts => {
  return refinement in customSorts;
};

export const formatRangeTowardsUrl = (rangeString: string) => {
  return rangeString.replace(":", "-");
};

export const formatRangeTowardsState = (rangeString: string) => {
  let currentValue = rangeString.replace("-", ":");
  if (!currentValue.includes(":")) {
    currentValue = currentValue.concat(":");
  }

  return currentValue;
};

export const formatPriceRangeTowardsUrl = (rangeString: string) => {
  const [minString, maxString] = rangeString.split(":");

  const [min, max] = [parseInt(minString) / 100, parseInt(maxString) / 100];

  return `${isNaN(min) ? "" : min}-${isNaN(max) ? "" : max}`;
};

export const formatPriceRangeTowardsState = (rangeString: string) => {
  const [minString, maxString] = rangeString.split("-");

  const [min, max] = [parseFloat(minString) * 100, parseFloat(maxString) * 100];

  return `${isNaN(min) ? "" : min}:${isNaN(max) ? "" : max}`;
};

/**
 * This function is used to find the index of the next key in the url.
 */
const findNextKeyIndex = (myUrl: string): number => {
  return Math.min(
    ...Object.keys(keyTranslatedToCode).map(filter => {
      const keyIndex = myUrl.indexOf("-" + filter);

      if (
        filter === "vente" &&
        (myUrl.startsWith("vente-flash") || myUrl.startsWith("vente-on-line"))
      ) {
        return Infinity;
      }

      return keyIndex >= 0 ? keyIndex : Infinity;
    }),
  );
};

/**
 * This function is used to translate the value of a filter, according to the given language.
 */
export const translateCodeTowardsUrl = (
  value: string,
  name: RefinementType,
  type: string,
  lang: Locale,
) => {
  let refinementConfig;
  switch (type) {
    case "enum":
      refinementConfig = codeToTranslated[name];
      if (refinementConfig.type === "enum") {
        return value in refinementConfig["translatedValues"]
          ? refinementConfig["translatedValues"][value][lang]
          : undefined;
      }
      break;
    case "boolean":
      if (value === "true") {
        return "Y";
      } else {
        return "N";
      }
    case "identical":
      return value;
    case "transform":
    case "query":
      return encodeURIComponent(value).replaceAll("-", "_");
  }
};

/**
 * This function is used to untranslate the value of a filter and get the corresponding algolia key.
 */
const translateUrlTowardsCode = (
  filter: string,
  currentKey: KeyTranslatedToCode[string],
): string | undefined => {
  switch (currentKey.type) {
    case "enum":
      return valueTranslatedToCode[currentKey.name][filter.toLowerCase()];
    case "boolean":
      return filter === "Y" ? "true" : "false";
    case "identical":
      return filter;
    case "transform":
    case "query":
      return decodeURIComponent(filter.replaceAll("_", "-"));
  }
};

/**
 * This function takes an url, and sends back an object containing the filters and their values.
 * The filters and values returned are algolia keys.
 */
export const createRouteFromUrl = (myUrl: string, lang: Locale = "fr"): AlgoliaRoute => {
  let currentString = myUrl;
  const route: AlgoliaRoute = {};
  let currentKey: KeyTranslatedToCode[string];
  let currentValue;
  while (currentString.length > 0) {
    const currentKeyName = Object.keys(keyTranslatedToCode).find(key =>
      currentString.startsWith(key.concat("-")),
    );
    // failsafe to prevent typos in key name
    if (currentKeyName === undefined) {
      return route;
    }
    currentKey = keyTranslatedToCode[currentKeyName];
    currentString = currentString.replace(currentKeyName.concat("-"), "");
    currentValue = currentString.slice(0, findNextKeyIndex(currentString) + 1);
    currentString = currentString.replace(currentValue, "");
    // failsafe to prevent infinite loops.
    if (currentValue.length === 0) {
      return route;
    }
    currentValue = currentValue
      .split(`-${valueSeparator[lang]}-`)
      .map(filter => (filter.endsWith("-") ? filter.slice(0, -1) : filter))
      .map(filter => translateUrlTowardsCode(filter, currentKey));
    currentValue = currentValue.filter(isNotNullNorUndefined);
    route[currentKey.name] = currentValue;
  }

  return route;
};

/**
 * This function takes an object containing the filters and their values, and sends back an url.
 * This function translates the filters and values towards the given language.
 */
export const createUrlFromRoute = (myRoute: AlgoliaRoute, lang: Locale = "fr"): string => {
  let url = "";
  keyList.forEach(refinement => {
    // the refinements sent to params shouldn't be send to path too.
    if (!(refinement.name in paramsList)) {
      const refinementName = refinement.name;
      const translatedRefinementName = codeToTranslated[refinementName]["translatedKey"][lang];
      let currentRefinementValues = myRoute[refinementName];
      if (currentRefinementValues !== undefined) {
        currentRefinementValues = translateAndSortValues(currentRefinementValues, refinement, lang);
        if (!isNonEmptyArray(currentRefinementValues)) return;
        url += `${translatedRefinementName}-${currentRefinementValues.join(
          `-${valueSeparator[lang]}-`,
        )}-`;
      }
    }
  });

  return url.slice(0, -1);
};

export const sortRefinementValues = (
  CurrentRefinementValues: string[],
  name: RefinementType,
  type: string,
  lang: Locale,
): string[] => {
  if (hasACustomSort(name)) {
    // required for typing
    return CurrentRefinementValues.filter(value =>
      isNotNullNorUndefined(translateCodeTowardsUrl(value, name, type, lang)),
    ).sort((firstValue, secondValue) => {
      const nameA = translateCodeTowardsUrl(firstValue, name, type, lang) as string;
      const nameB = translateCodeTowardsUrl(secondValue, name, type, lang) as string;
      if (firstValue in customSorts[name] && secondValue in customSorts[name]) {
        return customSorts[name][firstValue] - customSorts[name][secondValue];
      } else if (firstValue in customSorts[name]) {
        return -1;
      } else if (secondValue in customSorts[name]) {
        return 1;
      }

      return nameA.localeCompare(nameB);
    });
  } else {
    return CurrentRefinementValues.filter(value =>
      isNotNullNorUndefined(translateCodeTowardsUrl(value, name, type, lang)),
    ).sort((a, b) => {
      const nameA = translateCodeTowardsUrl(a, name, type, lang) as string;
      const nameB = translateCodeTowardsUrl(b, name, type, lang) as string;

      return nameA.localeCompare(nameB);
    });
  }
};

/**
 * This function translates and filters the list of values of a single key.
 */
const translateAndSortValues = (
  CurrentRefinementValues: string[],
  refinement: KeyList[number],
  lang: Locale,
): string[] => {
  const { name, type } = refinement;
  const sortedValues = sortRefinementValues(CurrentRefinementValues, name, type, lang);

  return sortedValues
    .map(value => translateCodeTowardsUrl(value, name, type, lang))
    .filter(isNotNullNorUndefined);
};

/**
 * This function takes the url, and sends back the base url (the url deprived of the filters)
 */
export const getPlpBaseUrl = (pathname: string) => {
  const regex = `^(.*)(${LOCALES.map(lang => translatedLinks.BUY_WINE_URL[lang]).join("|")})`;
  const urlParts = pathname.match(new RegExp(regex));
  const baseUrl = `${urlParts ? urlParts[0] : ""}`;

  return baseUrl;
};

/**
 * This function takes the url, and sends back the filters slug (the url deprived of the base url)
 */
export const getPlpFiltersSlug = (pathname: string) => {
  const pathNameWithoutQuery = pathname.split("?")[0];
  const regex = `(?:${LOCALES.map(lang => translatedLinks.BUY_WINE_URL[lang]).join("|")})/(.*)`;
  const pathnameMatches = pathNameWithoutQuery.match(regex);
  let slug = pathnameMatches?.[1] ?? "";

  if (slug.endsWith(".json")) slug = slug.slice(0, -5);

  return slug;
};

/**
 * This function takes an object containing the query params, and sends back the name of the
 * corresponding algolia index. If unknown, it returns undefined.
 */
export const translateParamsTowardsCode = (queryParams: object) => {
  for (const key in queryParams) {
    const typedKey = key as keyof typeof queryParams;
    if (sortByTranslationsList.includes(queryParams[typedKey])) {
      const orderValue = valueTranslatedToCode["sortBy"][queryParams[typedKey]];

      return orderValue;
    }
  }

  return undefined;
};

/**
 * This function takes the requested algolia index, and sends back the corresponding query params,
 * translated in the requested language.
 */
export const translateCodeTowardsParams = (sortingMethod: string, lang: typeof LOCALES[number]) => {
  const sortByConfig = codeToTranslated["sortBy"];

  if (sortByConfig.type === "enum") {
    // No translated values when there is no sorting method
    if (!(sortingMethod in sortByConfig["translatedValues"])) return {};

    const value = sortByConfig["translatedValues"][sortingMethod][lang];
    const key = sortByConfig["translatedKey"][lang];

    return { [key]: value };
  }

  return {};
};
