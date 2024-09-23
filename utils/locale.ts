import { CustomerJsonldShopCustomerReadLocaleCode } from "@/networking/sylius-api-client/.ts.schemas";

export const nextLangToSyliusLocale = (lang?: string): CustomerJsonldShopCustomerReadLocaleCode => {
  switch (lang) {
    case "fr":
      return "fr_FR";
    case "en":
      return "en_US";
    case "it":
      return "it_IT";
    case "de":
      return "de_DE";
    default:
      return "fr_FR";
  }
};

export const nextLangToApplePayLocale = (lang?: string): string => {
  switch (lang) {
    case "fr":
      return "fr-FR";
    case "en":
      return "en-US";
    case "it":
      return "it-IT";
    case "de":
      return "de-DE";
    default:
      return "fr-FR";
  }
};

export const nextLangToNextSeoLocale = (lang?: string): string => {
  switch (lang) {
    case "fr":
      return "fr-FR";
    case "en":
      return "en-US";
    case "it":
      return "it-IT";
    case "de":
      return "de-DE";
    default:
      return "fr-FR";
  }
};

export const syliusLocaleToNextLang = (
  locale: CustomerJsonldShopCustomerReadLocaleCode,
): string => {
  switch (locale) {
    case "fr_FR":
      return "fr";
    case "en_US":
      return "en";
    case "it_IT":
      return "it";
    case "de_DE":
      return "de";
    default:
      return "fr";
  }
};

export const nextLangToNextDateLocaleStringForAuction = (lang: string): string => {
  switch (lang) {
    case "fr":
      return "fr-FR";
    case "en":
      return "en-UK";
    case "it":
      return "it-IT";
    case "de":
      return "de-DE";
    default:
      return "fr-FR";
  }
};
