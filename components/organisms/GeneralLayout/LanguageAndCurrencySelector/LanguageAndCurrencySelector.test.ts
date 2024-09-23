import { generateTranslatedUrlRedirectionPerLocale, LOCALES } from "@/urls/linksTranslation";
import { generateTranslatedUrlWithBothData } from "@/utils/generateTranslatedUrlWithBothData";
import { isNullOrUndefined } from "@/utils/ts-utils";

const translatedUrlRedirection = generateTranslatedUrlRedirectionPerLocale();
const dynamicTranslatedUrlRedirection = generateTranslatedUrlRedirectionPerLocale(true);

const dataSetNotDynamic = [
  {
    currentPath: "/",
    targetLocale: "fr",
    currentLocale: "en",
    expected: "/",
  },
  {
    currentPath: "/domain/partners",
    targetLocale: "fr",
    currentLocale: "en",
    expected: "/domaine/partenaires",
  },
  {
    currentPath: "/aide/garanties_idealwine",
    targetLocale: "it",
    currentLocale: "fr",
    expected: "/aide/garanties_idealwine",
  },
  {
    currentPath: "/aide/garanties_idealwine",
    targetLocale: "de",
    currentLocale: "it",
    expected: "/aide/garanties_idealwine",
  },
  {
    currentPath: "/aide/garanties_idealwine",
    targetLocale: "fr",
    currentLocale: "fr",
    expected: "/aide/garanties_idealwine",
  },
] as {
  currentPath: string;
  targetLocale: typeof LOCALES[number];
  currentLocale: typeof LOCALES[number];
  expected: string;
}[];

const dataSetDynamic = [
  {
    currentPath: "/acheter-vin/1234",
    targetLocale: "en",
    currentLocale: "fr",
    expected: "/buy-a-wine/1234",
    isOnPlp: false,
  },
  {
    currentPath: "/buy-a-wine/1234",
    targetLocale: "en",
    currentLocale: "it",
    expected: "/buy-a-wine/1234",
    isOnPlp: false,
  },
  {
    currentPath: "/buy-a-wine/1234",
    targetLocale: "fr",
    currentLocale: "de",
    expected: "/acheter-vin/1234",
    isOnPlp: false,
  },
  {
    currentPath: "/acheter-du-vin/1234",
    targetLocale: "en",
    currentLocale: "fr",
    expected: "/buy-wine/1234",
    isOnPlp: false,
  },
  {
    currentPath: "/acheter-du-vin/1234",
    targetLocale: "fr",
    currentLocale: "fr",
    expected: "/acheter-du-vin/1234",
    isOnPlp: false,
  },
] as {
  currentPath: string;
  targetLocale: typeof LOCALES[number];
  currentLocale: typeof LOCALES[number];
  expected: string;
  isOnPlp: boolean;
}[];

describe("generateTranslatedUrlWithBothData testing : returns the value of the translated url", () => {
  it.each(dataSetNotDynamic)(
    "without dynamic data",
    ({ currentPath, targetLocale, currentLocale, expected }) => {
      const urlQueryParams = currentPath.split("?")[1];
      expect(
        generateTranslatedUrlWithBothData(
          translatedUrlRedirection,
          dynamicTranslatedUrlRedirection,
          false,
          {
            pathname: currentPath.split("?")[0],
            search: isNullOrUndefined(urlQueryParams) ? "" : `?${urlQueryParams}`,
          },
        )(currentPath, targetLocale, currentLocale),
      ).toBe(expected);
    },
  );
  it.each(dataSetDynamic)(
    "with dynamic data",
    ({ currentPath, targetLocale, currentLocale, expected, isOnPlp }) => {
      const urlQueryParams = currentPath.split("?")[1];
      expect(
        generateTranslatedUrlWithBothData(
          translatedUrlRedirection,
          dynamicTranslatedUrlRedirection,
          isOnPlp,
          {
            pathname: currentPath.split("?")[0],
            search: isNullOrUndefined(urlQueryParams) ? "" : `?${urlQueryParams}`,
          },
        )(currentPath, targetLocale, currentLocale),
      ).toBe(expected);
    },
  );
});
