const plpUrlsByRegion = [
  {
    en: "/en/buy-wine/region-alsace",
    fr: "/acheter-du-vin/region-alsace",
    it: "/it/compra-vino/regione-alsazia",
    de: "/de/wein-kaufen/region-elsass",
    current: "alsace",
  },
  {
    en: "/en/buy-wine/region-beaujolais",
    fr: "/acheter-du-vin/region-beaujolais",
    it: "/it/compra-vino/regione-beaujolais",
    de: "/de/wein-kaufen/region-beaujolais",
    current: "beaujolais",
  },
  {
    en: "/en/buy-wine/region-bordeaux",
    fr: "/acheter-du-vin/region-bordeaux",
    it: "/it/compra-vino/regione-bordeaux",
    de: "/de/wein-kaufen/region-bordeaux",
    current: "bordeaux",
  },
  {
    en: "/en/buy-wine/region-burgundy",
    fr: "/acheter-du-vin/region-bourgogne",
    it: "/it/compra-vino/regione-borgogna",
    de: "/de/wein-kaufen/region-burgund",
    current: "bourgogne",
  },
  {
    en: "/en/buy-wine/region-champagne",
    fr: "/acheter-du-vin/region-champagne",
    it: "/it/compra-vino/regione-champagne",
    de: "/de/wein-kaufen/region-champagne",
    current: "champagne",
  },
  {
    en: "/en/buy-wine/region-jura",
    fr: "/acheter-du-vin/region-jura",
    it: "/it/compra-vino/regione-jura",
    de: "/de/wein-kaufen/region-jura",
    current: "jura",
  },
  {
    en: "/en/buy-wine/region-languedoc",
    fr: "/acheter-du-vin/region-languedoc",
    it: "/it/compra-vino/regione-languedoc",
    de: "/de/wein-kaufen/region-languedoc",
    current: "languedoc",
  },
  {
    en: "/en/buy-wine/region-roussillon",
    fr: "/acheter-du-vin/region-roussillon",
    it: "/it/compra-vino/regione-roussillon",
    de: "/de/wein-kaufen/region-roussillon",
    current: "roussillon",
  },
  {
    en: "/en/buy-wine/region-loire-valley",
    fr: "/acheter-du-vin/region-vallee-de-la-loire",
    it: "/it/compra-vino/regione-valle-della-loira",
    de: "/de/wein-kaufen/region-loiretal",
    current: "loire",
  },
  {
    en: "/en/buy-wine/region-provence",
    fr: "/acheter-du-vin/region-provence",
    it: "/it/compra-vino/regione-provenza",
    de: "/de/wein-kaufen/region-provence",
    current: "provence",
  },
  {
    en: "/en/buy-wine/region-corsica",
    fr: "/acheter-du-vin/region-corse",
    it: "/it/compra-vino/regione-corsica",
    de: "/de/wein-kaufen/region-korsika",
    current: "corse",
  },
  {
    en: "/en/buy-wine/region-savoie",
    fr: "/acheter-du-vin/region-savoie",
    it: "/it/compra-vino/regione-savoia",
    de: "/de/wein-kaufen/region-savoie",
    current: "savoie",
  },
  {
    en: "/en/buy-wine/region-southwest",
    fr: "/acheter-du-vin/region-sud-ouest",
    it: "/it/compra-vino/regione-sud-ouest",
    de: "/de/wein-kaufen/region-sudwesten",
    current: "sud-ouest",
  },
  {
    en: "/en/buy-wine/region-rhone-valley",
    fr: "/acheter-du-vin/region-vallee-du-rhone",
    it: "/it/compra-vino/regione-valle-del-rodano",
    de: "/de/wein-kaufen/region-rhonetal",
    current: "rhone",
  },
];

const plpUrlsByCountry = [
  {
    en: "/en/buy-wine/country-italy",
    fr: "/acheter-du-vin/pays-italie",
    it: "/it/compra-vino/paese-italia",
    de: "/de/wein-kaufen/land-italien",
    current: "italie",
  },
  {
    en: "/en/buy-wine/country-portugal",
    fr: "/acheter-du-vin/pays-portugal",
    it: "/it/compra-vino/paese-portogallo",
    de: "/de/wein-kaufen/land-portugal",
    current: "portugal",
  },
  {
    en: "/en/buy-wine/country-spain",
    fr: "/acheter-du-vin/pays-espagne",
    it: "/it/compra-vino/paese-spagna",
    de: "/de/wein-kaufen/land-spanien",
    current: "espagne",
  },
  {
    en: "/en/buy-wine/country-hungary",
    fr: "/acheter-du-vin/pays-hongrie",
    it: "/it/compra-vino/paese-ungheria",
    de: "/de/wein-kaufen/land-ungarn",
    current: "hongrie",
  },
  {
    en: "/en/buy-wine/country-united-states",
    fr: "/acheter-du-vin/pays-etats-unis",
    it: "/it/compra-vino/paese-stati-uniti",
    de: "/de/wein-kaufen/land-vereinigte-staaten",
    current: "etats-unis",
  },
  {
    en: "/en/buy-wine/country-australia",
    fr: "/acheter-du-vin/pays-australie",
    it: "/it/compra-vino/paese-australia",
    de: "/de/wein-kaufen/land-australien",
    current: "australie",
  },
];

const LOCALES = ["fr", "en", "de", "it"];

const sourceLocalePart = locale => (locale === "en" ? "/uk" : locale === "fr" ? "" : `/${locale}`);

const regionRedirects = plpUrlsByRegion
  .map(urls => {
    return LOCALES.map(locale => ({
      source: `${sourceLocalePart(locale)}/guide-vin/${urls.current}`,
      destination: urls[locale],
      statusCode: 301,
    }));
  })
  .flat();

const countryRedirects = plpUrlsByCountry
  .map(urls => {
    return LOCALES.map(locale => ({
      source: `${sourceLocalePart(locale)}/guide-vin/${urls.current}`,
      destination: urls[locale],
      statusCode: 301,
    }));
  })
  .flat();

const redirects = [
  ...regionRedirects,
  ...countryRedirects,
  {
    source: "/accord_ideal/votre_accord.jsp",
    destination:
      "https://www.idealwine.net/category/degustations-et-accords/accords-metsvins-degustations-et-accords/",
    statusCode: 301,
  },
  {
    source: "/devenez_membre/reactivation.jsp",
    destination: "/login",
    statusCode: 301,
  },
  {
    source: "/uk/devenez_membre/reactivation.jsp",
    destination: "/en/login",
    statusCode: 301,
  },
  {
    source: "/devenez_membre/user_registration.jsp",
    destination: "/login",
    statusCode: 301,
  },
  {
    source: "/uk/devenez_membre/user_registration.jsp",
    destination: "/en/login",
    statusCode: 301,
  },
  {
    source: "/Recrutement/index.jsp",
    destination: "https://idealwine.welcomekit.co/",
    statusCode: 301,
  },
  {
    source: "/uk/Recrutement/index.jsp",
    destination: "https://idealwine.welcomekit.co/",
    statusCode: 301,
  },
  {
    source: "/it/Recrutement/index.jsp",
    destination: "https://idealwine.welcomekit.co/",
    statusCode: 301,
  },
  {
    source: "/de/Recrutement/index.jsp",
    destination: "https://idealwine.welcomekit.co/",
    statusCode: 301,
  },
  {
    source: "/acheter-du-vin/vins-en-vente.jsp",
    destination: "/acheter-du-vin",
    statusCode: 301,
  },
  {
    source: "/uk/buy-wine/see-all-wines.jsp",
    destination: "/en/buy-wine/see-all-wines.jsp",
    statusCode: 301,
  },
  {
    source: "/it/compra-vino/vini-in-vendita.jsp",
    destination: "/it/compra-vino",
    statusCode: 301,
  },
  {
    source: "/de/wein-kaufen/weine-im-verkauf.jsp",
    destination: "/de/wein-kaufen",
    statusCode: 301,
  },
  {
    source: "/millesime-anniversaire.jsp",
    destination: "/acheter-du-vin",
    statusCode: 301,
  },
  {
    source: "/uk/vintage-anniversary.jsp",
    destination: "/en/buy-wine",
    statusCode: 301,
  },
  {
    source: "/de/jahrgang-jubilaeum.jsp",
    destination: "/de/wein-kaufen",
    statusCode: 301,
  },
  {
    source: "/it/annata-regalo.jsp",
    destination: "/it/compra-vino",
    statusCode: 301,
  },
  {
    source: "/my_idealwine/mes-lots-fsa-en-vente.jsp",
    destination: "/my_idealwine/mes-lots-en-vente",
    statusCode: 301,
  },
  {
    source: "/uk/my_idealwine/mes-lots-fsa-en-vente.jsp",
    destination: "/en/my_idealwine/mes-lots-en-vente",
    statusCode: 301,
  },
  {
    source: "/my_idealwine/login.jsp",
    destination: "/login",
    statusCode: 301,
  },
  {
    source: "/uk/my_idealwine/login.jsp",
    destination: "/en/login",
    statusCode: 301,
  },
  {
    source: "/my_idealwine/choix_commande.jsp",
    destination: "/my_idealwine/panier",
    statusCode: 301,
  },
  {
    source: "/uk/my_idealwine/choix_commande.jsp",
    destination: "/en/my_idealwine/panier",
    statusCode: 301,
  },
  {
    source: "/my_idealwine/achats_directs.jsp",
    destination: "/my_idealwine/panier",
    statusCode: 301,
  },
  {
    source: "/uk/my_idealwine/achats_directs.jsp",
    destination: "/en/my_idealwine/panier",
    statusCode: 301,
  },
  {
    source: "/my_idealwine/vente-fsa-historique.jsp",
    destination: "/my_idealwine/vente-historique",
    statusCode: 301,
  },
  {
    source: "/uk/my_idealwine/vente-fsa-historique.jsp",
    destination: "/en/my_idealwine/vente-historique",
    statusCode: 301,
  },
  {
    source: "/mes_alertes/add_alert.jsp",
    destination: "/my_idealwine/mes_alertes/add_alert",
    statusCode: 301,
  },
  {
    source: "/uk/mes_alertes/add_alert.jsp",
    destination: "/en/my_idealwine/mes_alertes/add_alert",
    statusCode: 301,
  },
  {
    source: "/mes_alertes/consulter.jsp",
    destination: "/my_idealwine/mes_alertes/consulter",
    statusCode: 301,
  },
  {
    source: "/uk/mes_alertes/consulter.jsp",
    destination: "/en/my_idealwine/mes_alertes/consulter",
    statusCode: 301,
  },
  {
    source: "/devenez_membre/formulaire2.html",
    destination: "/my_idealwine/formulaire-virement",
    statusCode: 301,
  },
  {
    source: "/images/signature.jpg",
    destination: "https://www.idealwine.biz/img/signature.jpg",
    statusCode: 301,
  },
  {
    source: "/uk/devenez_membre/formulaire2.html",
    destination: "/en/my_idealwine/formulaire-virement",
    statusCode: 301,
  },
  {
    source: "/devenez_membre/confirmation_quick.jsp",
    destination: "/my_idealwine/confirmation-inscription",
    statusCode: 301,
  },
  {
    source: "/uk/devenez_membre/confirmation_quick.jsp",
    destination: "/en/my_idealwine/confirmation-inscription",
    statusCode: 301,
  },
  {
    source: "/vendre-son-vin",
    destination: "/vendre-mes-vins",
    statusCode: 301,
  },
  {
    source: "/uk/vendre-son-vin/",
    destination: "/en/sell-my-wines",
    statusCode: 301,
  },
  {
    source: "/it/vendre-son-vin/",
    destination: "/it/vendere-il-mio-vino",
    statusCode: 301,
  },
  {
    source: "/de/vendre-son-vin/",
    destination: "/de/sell-my-wines",
    statusCode: 301,
  },
  {
    source: "/domaine/partenaires.jsp",
    destination: "/domaine/partenaires",
    statusCode: 301,
  },
  {
    source: "/uk/domain/partners.jsp",
    destination: "/en/domain/partners",
    statusCode: 301,
  },
  {
    source: "/index.jsp",
    destination: "/",
    statusCode: 301,
  },
  {
    source: "/uk/index.jsp",
    destination: "/en",
    statusCode: 301,
  },
  {
    source:
      "/uk/:path((?!le_marche_encheres/passage_ordre_descr_lot)(?!saga_millesime/table_notation_results)(?!decouverte/cepage_)(?!buy-wine)(?!domain).*)*.jsp",
    destination: "/en/:path*",
    statusCode: 301,
  },
  {
    source:
      "/uk/:path((?!le_marche_encheres/passage_ordre_descr_lot)(?!saga_millesime/table_notation_results)(?!decouverte/cepage_)(?!buy-wine)(?!domain).*)*",
    destination: "/en/:path*",
    statusCode: 301,
  },
  {
    source:
      "/:path((?!uk)(?!le_marche_encheres/passage_ordre_descr_lot)(?!saga_millesime/table_notation_results)(?!decouverte/cepage_)(?!acheter-du-vin)(?!buy-wine)(?!domain).*)*.jsp",
    destination: "/:path*",
    statusCode: 301,
  },
];

module.exports = redirects;
