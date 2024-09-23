// Warning : restart server after updating this file
import { compile, match } from "path-to-regexp";

export const LOCALES = ["fr", "en", "it", "de"] as const;
export const defaultLocale = "fr";

export type Locale = typeof LOCALES[number];

export const isLocale = (locale?: string): locale is Locale => LOCALES.includes(locale as Locale);

export const MY_IDEALWINE_PAGES_PREFIX = "/my_idealwine";
export const MY_CAVE_PAGES_PREFIX = "/my_cave";

export const translatedLinks = {
  HOME_URL: {
    fr: "/",
    en: "/",
    it: "/",
    de: "/",
  },
  // Header  /domain/partners
  CONTACT_URL: {
    fr: "/aide/contactez-nous",
    en: "/aide/contactez-nous",
    it: "/aide/contactez-nous",
    de: "/aide/contactez-nous",
  },
  BUY_WINE_URL: {
    fr: "/acheter-du-vin",
    en: "/buy-wine",
    it: "/compra-vino",
    de: "/wein-kaufen",
  },
  BUY_WINE_WITH_SLUG_URL: {
    fr: "/acheter-du-vin/:slug",
    en: "/buy-wine/:slug",
    it: "/compra-vino/:slug",
    de: "/wein-kaufen/:slug",
  },
  SELL_MY_WINES_URL: {
    fr: "/vendre-mes-vins",
    en: "/sell-my-wines",
    it: "/vendi-i-tuoi-vini",
    de: "/meinen-wein-verkaufen",
  },
  FREE_WINE_ESTIMATION_URL: {
    fr: "/vendre-mes-vins/estimation-gratuite-vins",
    en: "/sell-my-wines/estimation-gratuite-vins",
    de: "/meinen-wein-verkaufen/estimation-gratuite-vins",
    it: "/vendi-i-tuoi-vini/estimation-gratuite-vins",
  },

  WINE_GUIDE_PDF: {
    fr: "/jevdsmesvinsfr.pdf",
    en: "/jevdsmesvinsen.pdf",
    de: "/jevdsmesvinsde.pdf",
    it: "/jevdsmesvinsit.pdf",
  },

  AUCTION_REPORT_MONTHLY: {
    fr: "/le_marche_encheres/rapports-mensuels-marche-ventes-encheres-vin",
    en: "/le_marche_encheres/rapports-mensuels-marche-ventes-encheres-vin",
    de: "/le_marche_encheres/rapports-mensuels-marche-ventes-encheres-vin",
    it: "/le_marche_encheres/rapports-mensuels-marche-ventes-encheres-vin",
  },

  VINTAGE_RATING_URL: {
    fr: "/cote",
    en: "/cote",
    it: "/cote",
    de: "/cote",
  },
  VINTAGE_RATING_PREFIX: {
    fr: "/prix-vin",
    en: "/wine-prices",
    it: "/prezzo-vino",
    de: "/wein-preise",
  },
  VINTAGE_RATING_WITH_SLUG_URL: {
    fr: "/prix-vin/:slug",
    en: "/wine-prices/:slug",
    it: "/prezzo-vino/:slug",
    de: "/wein-preise/:slug",
  },
  WINE_INVESTMENT_URL: {
    fr: "/le_marche_encheres/idealwine-conseil-3",
    en: "/le_marche_encheres/idealwine-conseil-3",
    it: "/le_marche_encheres/idealwine-conseil-3",
    de: "/le_marche_encheres/idealwine-conseil-3",
  },
  WINE_GUIDE_URL: {
    fr: "/guide-des-vins",
    en: "/guide-des-vins",
    it: "/guide-des-vins",
    de: "/guide-des-vins",
  },
  VINTAGE_SAGA_URL: {
    fr: "/saga_millesime/accueil",
    en: "/saga_millesime/accueil",
    it: "/saga_millesime/accueil",
    de: "/saga_millesime/accueil",
  },
  PRIMEURS_URL: {
    fr: "/decouverte/primeurs",
    en: "/decouverte/primeurs",
    it: "/decouverte/primeurs",
    de: "/decouverte/primeurs",
  },
  WINE_FAIR_URL: {
    fr: "/la-foire-aux-vins-idealwine",
    en: "/idealwine-s-foire-aux-vins",
    de: "/idealwine-s-foire-aux-vins",
    it: "/foire-aux-vins-idealwine",
  },

  FAV_URL_SELECTION: {
    fr: "/acheter-du-vin/selection-FOIRE-AUX-VINS",
    en: "/buy-wine/picks-SPECIAL-OFFER",
    de: "/wein-kaufen/auswahl-FOIRE-AUX-VINS",
    it: "/compra-vino/selezione-FOIRE-AUX-VINS",
  },

  // PDP
  BIOLOGIC_PROFILE_URL: {
    fr: "/viticulture",
    en: "/biologic-profile",
    it: "/profilo-biologico",
    de: "/biologisches-profil",
  },

  // Footer
  ABOUT_US_URL: {
    fr: "/a-propos-d-idealwine",
    en: "/about-idealwine",
    de: "/uber-idealwine",
    it: "/a-proposito-di-idealwine",
  },

  DELIVERY_FEES_URL: {
    fr: "/aide/garanties_idealwine",
    en: "/aide/garanties_idealwine",
    it: "/aide/garanties_idealwine",
    de: "/aide/garanties_idealwine",
  },
  PARTNERS_URL: {
    fr: "/domaine/partenaires",
    en: "/domain/partners",
    de: "/weingut/partner",
    it: "/tenuta/partner",
  },
  GENERAL_CONDITIONS_URL: {
    fr: "/corporate/conditions_generales",
    en: "/corporate/conditions_generales",
    it: "/corporate/conditions_generales",
    de: "/corporate/conditions_generales",
  },
  FAQ_URL: {
    fr: "/aide/faq",
    en: "/help/faq",
    it: "/aiuto/faq",
    de: "/hilfe/faq",
  },
  PERSONAL_DATA: {
    fr: "/corporate/donnees-personnelles",
    en: "/corporate/donnees-personnelles",
    it: "/corporate/donnees-personnelles",
    de: "/corporate/donnees-personnelles",
  },
  PDP_SAMPLE_URL: {
    fr: "/acheter-vin/:code",
    en: "/buy-a-wine/:code",
    it: "/compra-un-vino/:code",
    de: "/kaufen-ein-wein/:code",
  },
  MY_CAVE_URL: {
    fr: `${MY_CAVE_PAGES_PREFIX}/select_cave`,
    en: `${MY_CAVE_PAGES_PREFIX}/select_cave`,
    it: `${MY_CAVE_PAGES_PREFIX}/select_cave`,
    de: `${MY_CAVE_PAGES_PREFIX}/select_cave`,
  },
  // My iDealwine
  MY_IDEALWINE_HOME_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/accueil_profil`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/accueil_profil`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/accueil_profil`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/accueil_profil`,
  },
  BASKET_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/panier`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/panier`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/panier`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/panier`,
  },
  SHIPPING_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/livraison`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/shipping`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/shipping`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/shipping`,
  },
  PAYMENT_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/paiement`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/payment`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/payment`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/payment`,
  },
  SUCCESS_CREDIT_CARD_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/succes`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/succes`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/succes`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/succes`,
  },
  SUCCESS_BANK_TRANSFER_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/succes-virement`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/succes-virement`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/succes-virement`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/succes-virement`,
  },
  BANK_TRANSFER_FORM_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/formulaire-virement`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/formulaire-virement`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/formulaire-virement`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/formulaire-virement`,
  },
  MY_STORED_LOTS: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-stocks`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-stocks`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-stocks`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-stocks`,
  },
  MY_STORED_LOTS_HISTORY: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-stocks-historique`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-stocks-historique`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-stocks-historique`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-stocks-historique`,
  },
  // Storage
  WINE_STORAGE_URL: {
    fr: "/cave-de-stockage",
    en: "/storage-cellar",
    de: "/lagerservice",
    it: "/cantina-di-stoccaggio",
  },
  // My iDealwine - Seller space
  HISTORICAL_SELLS: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/vente-historique`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/vente-historique`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/vente-historique`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/vente-historique`,
  },
  MY_SELLER_INFORMATION: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/mes-infos-vendeur`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/mes-infos-vendeur`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/mes-infos-vendeur`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/mes-infos-vendeur`,
  },
  SELL_MY_BOTTLES: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/vendre-mes-bouteilles`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/vendre-mes-bouteilles`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/vendre-mes-bouteilles`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/vendre-mes-bouteilles`,
  },
  ONGOING_SELLS: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-vente`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-vente`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-vente`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/mes-lots-en-vente`,
  },
  ONGOING_BIDS: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/encours`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/encours`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/encours`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/encours`,
  },
  BIDS_HISTORY: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/historique-encheres`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/bids-history`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/bids-history`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/bids-history`,
  },
  BUY_HISTORY: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/historique`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/historique`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/historique`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/historique`,
  },
  IM_A_NEWBIE_URL: {
    fr: "/jy-connais-rien",
    en: "/i-know-nothing",
    de: "/weinberatung",
    it: "/non-so-nulla-di-vini",
  },
  // Services +
  LOYALTY_PROGRAM_URL: {
    fr: "/landing/programme-idealwine",
    en: "/landing/programme-idealwine",
    it: "/landing/programme-idealwine",
    de: "/landing/programme-idealwine",
  },
  CELEBRATION_URL: {
    fr: "/celebration",
    en: "/celebration",
    it: "/celebration",
    de: "/celebration",
  },
  BUSINESS_GIFTS_URL: {
    fr: "/cadeaux-d-affaire-vin",
    en: "/wine-business-gifts",
    de: "/firmengeschenke",
    it: "/regali-aziendali-vino",
  },
  TAILORMADE_CELLAR_URL: {
    fr: "/cave-sur-mesure",
    en: "/your-cellar-tailor-made",
    de: "/individueller-weinkeller",
    it: "/cantina-su-misura",
  },
  LAST_ORDER_URL: {
    fr: "/last_order",
    en: "/last_order",
    it: "/last_order",
    de: "/last_order",
  },
  WISHLIST_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/wishlist`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/wishlist`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/wishlist`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/wishlist`,
  },
  WATCHLIST_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/surveiller`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/surveiller`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/surveiller`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/surveiller`,
  },
  MY_ALERTS_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/consulter`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/consulter`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/consulter`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/consulter`,
  },
  ADD_ALERT_URL: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/add_alert`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/add_alert`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/add_alert`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/mes_alertes/add_alert`,
  },
  HISTORICAL_ORDERS: {
    fr: `${MY_IDEALWINE_PAGES_PREFIX}/historique_commande`,
    en: `${MY_IDEALWINE_PAGES_PREFIX}/historique_commande`,
    it: `${MY_IDEALWINE_PAGES_PREFIX}/historique_commande`,
    de: `${MY_IDEALWINE_PAGES_PREFIX}/historique_commande`,
  },

  DISCOVERY_WINE_VARIETIES: {
    fr: `/decouverte/cepages`,
    en: `/decouverte/cepages`,
    it: `/decouverte/cepages`,
    de: `/decouverte/cepages`,
  },
  BAROMETER: {
    fr: `/barometre`,
    en: `/barometer`,
    it: `/barometro`,
    de: `/barometer`,
  },
  BOTTLE_FORMATS: {
    fr: `/decouverte/formats-et-etiquettes`,
    en: `/decouverte/formats-et-etiquettes`,
    it: `/decouverte/formats-et-etiquettes`,
    de: `/decouverte/formats-et-etiquettes`,
  },
  BAROMETER_FSA: {
    fr: `/barometre-fsa`,
    en: `/barometre-fsa`,
    it: `/barometre-fsa`,
    de: `/barometre-fsa`,
  },
  // old backlinks point to that URL and are then redirected to the PLP
  IDW_V1_DOMAIN_URL: {
    fr: "/domaine",
    en: "/domain",
    it: "/tenuta",
    de: "/weingut",
  },

  VINTAGE_TABLE_NOTATION_URL: {
    fr: "/saga_millesime/table_notation",
    en: "/saga_millesime/table_notation",
    it: "/saga_millesime/table_notation",
    de: "/saga_millesime/table_notation",
  },

  VINTAGE_TABLE_NOTATION_INT_URL: {
    fr: "/saga_millesime/table_notation_int",
    en: "/saga_millesime/table_notation_int",
    it: "/saga_millesime/table_notation_int",
    de: "/saga_millesime/table_notation_int",
  },

  BEST_WINES_BY_VINTAGE: {
    fr: "/classement/meilleurs-vins-par-cote",
    en: "/classement/meilleurs-vins-par-cote",
    it: "/classement/meilleurs-vins-par-cote",
    de: "/classement/meilleurs-vins-par-cote",
  },

  MOST_EXPENSIVE_WINES: {
    fr: "/classement/vins-les-plus-chers-en",
    en: "/classement/vins-les-plus-chers-en",
    it: "/classement/vins-les-plus-chers-en",
    de: "/classement/vins-les-plus-chers-en",
  },

  TRIPLE_A_WINES: {
    fr: "/les-vins-labellises-triple-a",
    en: "/wines-labelled-triple-a",
    it: "/vini-triple-a",
    de: "/weine-mit-triple-a-label",
  },

  CHATBOT_SOMMELIERE: {
    fr: "/sommeliere/chat",
    en: "/sommeliere/chat",
    it: "/sommeliere/chat",
    de: "/sommeliere/chat",
  },
};

export type translatedLinksKeys = keyof typeof translatedLinks;

const generateTranslatedUrlRewrite = (locale: Locale, returnDynamicUrls = false) => {
  const routesRewriteObject: { [key: string]: string } = {};
  for (const paths of Object.values(translatedLinks)) {
    const isDynamicUrl = paths[locale].includes(":");
    if ((returnDynamicUrls && isDynamicUrl) || (!returnDynamicUrls && !isDynamicUrl))
      routesRewriteObject[paths[locale]] = paths[defaultLocale];
  }

  return routesRewriteObject;
};

export const generateTranslatedUrlRewritePerLocale = (returnDynamicUrls = false) => {
  return LOCALES.reduce(
    (accumulator, locale) => ({
      ...accumulator,
      [locale]: generateTranslatedUrlRewrite(locale, returnDynamicUrls),
    }),
    {},
  );
};

const generateTranslatedUrlRedirection = (locale: Locale, returnDynamicUrls = false) => {
  const routesRedirectionObject: { [key: string]: string } = {};
  const allOtherLocale = LOCALES.filter(destLocale => destLocale !== locale);
  for (const paths of Object.values(translatedLinks)) {
    const isDynamicUrl = paths[locale].includes(":");
    if ((returnDynamicUrls && isDynamicUrl) || (!returnDynamicUrls && !isDynamicUrl)) {
      for (const destinationLocale of allOtherLocale) {
        routesRedirectionObject[paths[destinationLocale]] = paths[locale];
      }
    }
  }

  return routesRedirectionObject;
};

export const generateTranslatedUrlRedirectionPerLocale = (returnDynamicUrls = false) => {
  return LOCALES.reduce(
    (accumulator, locale) => ({
      ...accumulator,
      [locale]: generateTranslatedUrlRedirection(locale, returnDynamicUrls),
    }),
    {} as { [key in Locale]: { [key: string]: string } },
  );
};

export const urlMatchPath = (url: string, path: string) =>
  match(path, { decode: decodeURIComponent })(url);

export const buildUrl = (path: string, params?: object) =>
  compile(path, { encode: encodeURIComponent })(params);

export const generateUrl = (
  pageKey: translatedLinksKeys,
  lang: Locale,
  params?: object,
  queryParam?: URLSearchParams,
) => {
  let url = `/${lang}${translatedLinks[pageKey][lang]}`;

  if (params) {
    url = buildUrl(url, params);
  }

  if (queryParam != null) {
    const urlSearchParams = new URLSearchParams(queryParam);
    const paramsString = urlSearchParams.toString();

    return url + "?" + paramsString;
  }

  return url;
};

export const generateAbsoluteUrl = (
  pageKey: translatedLinksKeys,
  lang: Locale,
  params?: object,
  queryParam?: URLSearchParams,
) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}${generateUrl(
    pageKey,
    lang,
    params,
    queryParam,
  )}`;
};

export const isKnownUrlName = (href: translatedLinksKeys | string): href is translatedLinksKeys => {
  return Object.prototype.hasOwnProperty.call(translatedLinks, href);
};

export const getTranslatedHref = (
  href: translatedLinksKeys | string,
  lang: Locale,
  dontTranslate?: boolean,
  params?: object,
  queryParam?: URLSearchParams,
): string => {
  if (dontTranslate) {
    return href;
  }

  if (isKnownUrlName(href)) {
    return generateUrl(href, lang, params, queryParam);
  }

  throw new Error(
    `Unknown url name ${href}: either add your url to the translatedLinks object or set dontTranslate to true`,
  );
};
