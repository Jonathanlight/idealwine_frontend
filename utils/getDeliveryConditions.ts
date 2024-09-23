import { Translate } from "next-translate";

export const getDeliveryConditions = (
  countryCode: string,
  t: Translate,
  ukDeliveryPrices?: {
    dozenBottlesDeliveryCost: string;
    dozenBottlesDeliveryCostInActiveCurrency: string;
    dutyAndCustomsCost: string;
    dutyAndCustomsCostInActiveCurrency: string;
  },
): string => {
  let deliveryConditions = "";

  if (
    countryCode === "CH" ||
    countryCode === "JP" ||
    countryCode === "SG" ||
    countryCode === "NO" ||
    countryCode === "IS"
  ) {
    deliveryConditions = t("garanties-idealwine:deliveryConditions.common");
  } else if (countryCode === "TW" || countryCode === "KR") {
    deliveryConditions = t("garanties-idealwine:deliveryConditions.TW_KR");
  } else if (countryCode === "HK") {
    deliveryConditions = t("garanties-idealwine:deliveryConditions.HK");
  } else if (countryCode === "US") {
    deliveryConditions = t("garanties-idealwine:deliveryConditions.US");
  } else if (countryCode === "AU") {
    deliveryConditions = t("garanties-idealwine:deliveryConditions.AU");
  } else if (countryCode === "GB") {
    deliveryConditions = t("garanties-idealwine:deliveryConditions.GB", ukDeliveryPrices);
  }

  if (
    [
      "IT",
      "NL",
      "DE",
      "BE",
      "AT",
      "IE",
      "LU",
      "ES",
      "PT",
      "FR",
      "BG",
      "CY",
      "DK",
      "HR",
      "EE",
      "FI",
      "GR",
      "HU",
      "LV",
      "LT",
      "MT",
      "PL",
      "RO",
      "SK",
      "SI",
      "SE",
      "CZ",
      "MC",
    ].includes(countryCode)
  ) {
    deliveryConditions += `\n${t("garanties-idealwine:deliveryConditions.eu")}`;
  } else if (["NO", "CH", "SG", "LI", "JP", "IS", "HK", "US"].includes(countryCode)) {
    deliveryConditions += `\n${t("garanties-idealwine:deliveryConditions.other")}`;
  }

  return deliveryConditions;
};
