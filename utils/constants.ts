import {
  ProductJsonldShopCartReadCategory,
  ShippingMethodJsonldShopOrderReadCode,
} from "@/networking/sylius-api-client/.ts.schemas";

import { isNullOrUndefined } from "./ts-utils";

export const encodedQueryParamsSeparator = "-_-_-";

export const SEARCH_INPUT_DEBOUNCE_IN_MS = 1000;
export const CATEGORIES = {
  HOME_DELIVERY: "HOME_DELIVERY",
  RELAY_POINT: "RELAY_POINT",
  ON_SITE: "ON_SITE",
  GROUPING: "GROUPING",
  STORAGE: "STORAGE",
};

export const PaymentMethodIcons: Record<string, string | undefined> = {
  credit_card: "/cb.jpg",
  bank_transfer: "/banktransfer.jpg",
};

type ShippingMethodsType = [string, string[] | undefined][];

export const SHIPPING_METHODS: ShippingMethodsType = [
  [
    CATEGORIES.HOME_DELIVERY,
    [
      ShippingMethodJsonldShopOrderReadCode["1-FRANCE-COLISSIMO"],
      ShippingMethodJsonldShopOrderReadCode["1-MONACO-COLISSIMO"],
      ShippingMethodJsonldShopOrderReadCode["1-FRANCE-CHRONOPOST-PARTICULIER"],
      ShippingMethodJsonldShopOrderReadCode["1-MONACO-CHRONOPOST-PARTICULIER"],
      ShippingMethodJsonldShopOrderReadCode["8-BELGIQUE-LUXEMBOURG-PAYS-BAS-ALLEMAGNE-COLISSIMO"],
      ShippingMethodJsonldShopOrderReadCode[
        "8-BELGIQUE-LUXEMBOURG-PAYS-BAS-ALLEMAGNE-CHRONOPOST-INT"
      ],
      ShippingMethodJsonldShopOrderReadCode["9-AUTRICHE-ESPAGNE-ITALIE-PORTUGAL-COLISSIMO"],
      ShippingMethodJsonldShopOrderReadCode["9-AUTRICHE-ESPAGNE-ITALIE-PORTUGAL-CHRONOPOST-INT"],
      ShippingMethodJsonldShopOrderReadCode["9-SUISSE-LIECHTENSTEIN-UPS"],
      ShippingMethodJsonldShopOrderReadCode[
        "10-HONGRIE-LETTONIE-LITUANIE-MALTE-POLOGNE-REPUBLIQUE-TCHEQUE-ROUMANIE-COLISSIMO"
      ],
      ShippingMethodJsonldShopOrderReadCode[
        "10-HONGRIE-LETTONIE-LITUANIE-MALTE-POLOGNE-REPUBLIQUE-TCHEQUE-ROUMANIE-CHRONOPOST-INT"
      ],
      ShippingMethodJsonldShopOrderReadCode["10-ESTONIE-SLOVAQUIE-SLOVENIE-COLISSIMO"],
      ShippingMethodJsonldShopOrderReadCode["10-ESTONIE-SLOVAQUIE-SLOVENIE-CHRONOPOST"],
      ShippingMethodJsonldShopOrderReadCode["12-IRELANDE-FEDEX"],
      ShippingMethodJsonldShopOrderReadCode["12-DANEMARK-UPS"],
      ShippingMethodJsonldShopOrderReadCode["13-SUEDE-UPS-EXPRESS"],
      ShippingMethodJsonldShopOrderReadCode["14-FINLANDE-UPS-EXPRESS"],
      ShippingMethodJsonldShopOrderReadCode["4-BULGARIE-CROATIE-COLISSIMO"],
      ShippingMethodJsonldShopOrderReadCode["4-BULGARIE-CROATIE-CHRONOPOST"],
      ShippingMethodJsonldShopOrderReadCode["4-CHYPRE-CHRONOPOST"],
      ShippingMethodJsonldShopOrderReadCode["4-ISLANDE-UPS"],
      ShippingMethodJsonldShopOrderReadCode["4-NORVEGE-UPS-EXPRESS"],
      ShippingMethodJsonldShopOrderReadCode["4-GRECE-UPS"],
      ShippingMethodJsonldShopOrderReadCode["3-ROYAUME-UNI-FEDEX"],
      ShippingMethodJsonldShopOrderReadCode["7-ETATS-UNIS-FEDEX"],
      ShippingMethodJsonldShopOrderReadCode["7-ETATS-UNIS-PALETTE-USA-AIR"],
      ShippingMethodJsonldShopOrderReadCode["7-AUSTRALIE-FEDEX"],
      ShippingMethodJsonldShopOrderReadCode["5-COREE-DU-SUD-JAPON-UPS"],
      ShippingMethodJsonldShopOrderReadCode["5-SINGAPOUR-PALETTE-SG-AIR"],
      ShippingMethodJsonldShopOrderReadCode["6-HONG-KONG-PALETTE-HK-SEA"],
      ShippingMethodJsonldShopOrderReadCode["6-HONG-KONG-PALETTE-HK-AIR"],
      ShippingMethodJsonldShopOrderReadCode["11-TAIWAN"],
    ],
  ],
  [CATEGORIES.RELAY_POINT, [ShippingMethodJsonldShopOrderReadCode["1-FRANCE-RELAYPOINT"]]],
  [CATEGORIES.ON_SITE, [ShippingMethodJsonldShopOrderReadCode["1-FRANCE-COLOMBES-PICKUP"]]],
  [CATEGORIES.GROUPING, [ShippingMethodJsonldShopOrderReadCode["WORLD-SHIPPING-GROUPMENT"]]],
  [CATEGORIES.STORAGE, [ShippingMethodJsonldShopOrderReadCode["WORLD-STORAGE"]]],
];

export const SHIPPING_METHODS_WITHOUT_PAYMENT_RECAP: ShippingMethodJsonldShopOrderReadCode[] = [
  ShippingMethodJsonldShopOrderReadCode["WORLD-SHIPPING-GROUPMENT"],
  ShippingMethodJsonldShopOrderReadCode["WORLD-STORAGE"],
];

export const CODE_TO_SHIPPING_METHOD = SHIPPING_METHODS.reduce((partialObject, [key, value]) => {
  if (value) {
    value.forEach(code => {
      partialObject[code] = key;
    });
  }

  return partialObject;
}, {} as { [key: string]: string });

export const ADDRESSES = {
  [ShippingMethodJsonldShopOrderReadCode["1-FRANCE-COLOMBES-PICKUP"]]: {
    street: "190 Rue d'Estienne d'Orves",
    postcode: "92700",
    city: "Colombes",
    company: "iDealwine",
  },
  [ShippingMethodJsonldShopOrderReadCode["WORLD-STORAGE"]]: {
    street: "2 rue des Varennes",
    postcode: "10140",
    city: "Vendeuvre-sur-Barse",
    company: "Gamba & Rota",
  },
};

// All the possible order checkout states in sylius, see OrderCheckoutStates interface in Sylius\Component\Core\OrderCheckoutStates
export const ORDER_CHECKOUT_STATES = {
  STATE_ADDRESSED: "addressed",
  STATE_CART: "cart",
  STATE_COMPLETED: "completed",
  STATE_PAYMENT_SELECTED: "payment_selected",
  STATE_PAYMENT_SKIPPED: "payment_skipped",
  STATE_SHIPPING_SELECTED: "shipping_selected",
  STATE_SHIPPING_SKIPPED: "shipping_skipped",
};

// All the possible order payment states in sylius, see OrderPaymentStates interface in Sylius\Component\Core\OrderPaymentStates
export const ORDER_PAYMENT_STATES = {
  STATE_CART: "cart",
  STATE_AWAITING_PAYMENT: "awaiting_payment",
  STATE_PARTIALLY_AUTHORIZED: "partially_authorized",
  STATE_AUTHORIZED: "authorized",
  STATE_PARTIALLY_PAID: "partially_paid",
  STATE_CANCELLED: "cancelled",
  PAID: "paid",
  STATE_PARTIALLY_REFUNDED: "partially_refunded",
  STATE_REFUNDED: "refunded",
};

// All the possible order shipping states in sylius, see OrderShippingStates interface in App\Entity\Order\OrderShippingStates
export const ORDER_SHIPPING_STATES = {
  STATE_CART: "cart",
  STATE_READY: "ready",
  STATE_CANCELLED: "cancelled",
  STATE_PARTIALLY_SHIPPED: "partially_shipped",
  STATE_SHIPPED: "shipped",
  STATE_ON_GOING: "on_going",
  PICKUP_READY: "pickup_ready",
  PICKED_UP: "picked_up",
};

// All the payment method codes available
export const PAYMENT_METHOD_CODES = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  PAY_LATER: "pay_later",
  APPLE_PAY: "apple_pay",
  FULL_CREDIT_NOTE: "full_credit_note",
};

// All the possible order states in sylius
export const ORDER_STATES = {
  STATE_CART: "cart",
  STATE_NEW: "new",
  STATE_CANCELLED: "cancelled",
  STATE_FULFILLED: "fulfilled",
};

export const UNITS_TO_TENTHS_FACTOR = 10;

// Shipping methods calculator
export const SHIPPING_CALCULATOR_MEDIUM_CAPACITY = 6;
export const SHIPPING_CALCULATOR_SMALL_CAPACITY = 12;
export const VOLUME_MAPPING = {
  // In mL
  DEMI_BOUTEILLE: 375,
  BALTHAZAR: 12000,
  BOUTEILLE: 750,
  CHOPINE: 500,
  CLAVELIN: 620,
  DOUBLE_MAGNUM: 3000,
  FILLETTE: 500,
  FLACON: 1000,
  FORMAT_50_CL: 500,
  IMPERIALE: 6000,
  JEROBOAM: 4500,
  LITRE: 1000,
  MAGNUM: 1500,
  MELCHIOR: 18000,
  MATHUSALEM: 6000,
  NABUCHODONOSOR: 15000,
  INCONNU: 0,
  POT: 1000,
  REHOBOAM: 4500,
  SALMANAZAR: 9000,
};

export const REGIONS = {
  ALSACE: "ALSACE",
  BEAUJOLAIS: "BEAUJOLAIS",
  BORDEAUX: "BORDEAUX",
  BOURGOGNE: "BOURGOGNE",
  CHAMPAGNE: "CHAMPAGNE",
  JURA: "JURA",
  LANGUEDOC: "LANGUEDOC",
  ROUSSILLON: "ROUSSILLON",
  VALLEE_DE_LA_LOIRE: "VALLEE_DE_LA_LOIRE",
  PROVENCE: "PROVENCE",
  CORSE: "CORSE",
  SAVOIE: "SAVOIE",
  SUD_OUEST: "SUD_OUEST",
  VALLEE_DU_RHONE: "VALLEE_DU_RHONE",
};

export const COUNTRIES_GDV = {
  AUSTRALIE: "AUSTRALIE",
  ESPAGNE: "ESPAGNE",
  ETATS_UNIS: "ETATS_UNIS",
  HONGRIE: "HONGRIE",
  ITALIE: "ITALIE",
  PORTUGAL: "PORTUGAL",
};

export const CURRENCY_LOGOS = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  HKD: "HK$",
  SEK: "kr",
  CHF: "CHF",
  DKK: "kr",
  SGD: "SGD$",
};

export const DB_SOURCE_CURRENCY: keyof typeof CURRENCY_LOGOS = "EUR";

// currencies enabled on Axepta
export const SUBSCRIBED_CURRENCIES = ["EUR", "GBP", "USD"];

export const APPLE_PAY_PAYMENT_METHOD_DATA = [
  {
    supportedMethods: "https://apple.com/apple-pay",
    data: {
      version: 4,
      merchantIdentifier: "merchant.com.idealwine.v2",
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["cartesBancaires", "masterCard", "visa"],
      countryCode: "FR",
    },
  },
];

export const APPLE_PAY_PAYMENT_OPTIONS = {
  requestPayerName: false,
  requestBillingAddress: false,
  requestPayerEmail: false,
  requestPayerPhone: false,
  requestShipping: false,
};

export const BUYER_FEE_PERCENTAGE = 0.21;
export const TVA_PERCENTAGE_FRANCE = 0.2;

export const STALE_TIME_MINUTE = 60 * 1000;
export const STALE_TIME_FIVE_MINUTES = 5 * 60 * 1000;
export const STALE_TIME_HOUR = 60 * 60 * 1000;

export const DOZEN_BOTTLES_DELIVERY_COST = 29;
export const DUTY_AND_CUSTOMS_COST = 3.4;

export const WELCOME_COUPON_AMOUNT = 1500;

// 7 minutes and 30 seconds, in milliseconds : the maximum overtime bidding time
export const MAXIMUM_OVERTIME_BIDDING = 450000;

export const BIO_VALUES = [
  "TRIPLE_A_ET_BIOLOGIQUE",
  "TRIPLE_A_ET_BIODYNAMIQUE",
  "BIOLOGIQUE_ET_NATURE",
  "BIODYNAMIQUE_ET_NATURE",
  "BIOLOGIQUE",
  "BIODYNAMIQUE",
];

export const NATURE_VALUES = [
  "TRIPLE_A_ET_BIOLOGIQUE",
  "TRIPLE_A_ET_BIODYNAMIQUE",
  "TRIPLE_A",
  "NATURE",
  "BIOLOGIQUE_ET_NATURE",
  "BIODYNAMIQUE_ET_NATURE",
];

export const TRIPLE_A_VALUES = ["TRIPLE_A", "TRIPLE_A_ET_BIOLOGIQUE", "TRIPLE_A_ET_BIODYNAMIQUE"];

export const SEARCH_QUERY_VALUES = {
  whisky: true,
  armagnac: true,
  cognac: true,
  rhum: true,
};

export const CACHE_DURATIONS_IN_SECONDS = {
  FIVE_SECONDS: 5,
  TWO_MINUTES: 120,
  FIVE_MINUTES: 300,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
};

export type CheckoutPage = "basket" | "shipping" | "payment";

const CategoryToGtmCategory2: Record<Exclude<ProductJsonldShopCartReadCategory, null>, string> = {
  AUTRES_VINS: "vins",
  PRODUITS_INTERMEDIAIRES: "produits_intermediaires",
  SPIRITUEUX: "spiritueux",
  VDN: "vins",
  VINS_AOC_AVEC_IG_AOP: "vins",
  VINS_MOUSSEUX: "vins",
  BIERE: "bières",
};

export const getGtmCategory2FromCategory = (category?: ProductJsonldShopCartReadCategory) => {
  if (isNullOrUndefined(category)) return undefined;

  return CategoryToGtmCategory2[category];
};
