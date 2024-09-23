import {
  CategoryEnumJsonld,
  DominantAromaEnumJsonld,
  IntensityEnumJsonld,
  ProfileEnumJsonld,
  RegionEnumJsonld,
  TastingOccasionEnumJsonld,
} from "@/networking/sylius-api-client/.ts.schemas";
import { Locale } from "@/urls/linksTranslation";

export type AlgoliaHitType = {
  id: number;
  code: string;
  name: string;
  additionalObservations?: Record<Locale, string | null>;
  description: string;
  appellation: string;
  appellation1: string;
  appellation2: string;
  appellation3: string;
  imageUrl: string;
  color: string;
  country: string;
  region: RegionEnumJsonld;
  subregion: string;
  domainName: string;
  vintage: number;
  bottleCount: number;
  bottleSize: string;
  availableQuantity: number;
  isDirectPurchase: boolean;
  isBio: boolean;
  isNatural: boolean;
  isTripleA: boolean;
  alcoholLevel: number;
  lotDiscountPercentage: number;
  unitsPerLotOfDiscount: number;
  bidCount: number;
  auctionCatalogStartDate: number; // unix timestamp
  auctionCatalogEndDate: number; // unix timestamp
  bidEndDate: number; // unix timestamp
  grapeVariety: string;
  intensity: IntensityEnumJsonld;
  mainAroma: DominantAromaEnumJsonld;
  tastingOccasion: TastingOccasionEnumJsonld;
  status: ProfileEnumJsonld;
  peak?: string; // Currently not sent by the API, but will be sent back as a string soon
  productCategory: CategoryEnumJsonld;
  ownerName: string;
  hasBids: boolean;
  hasReservePrice: boolean;
  liquidLevels: string;
  bottleObservations: string;
  woodenCase: boolean;
  refundableVat: boolean;
  hasLotDiscount: boolean;
  hasDiscount: boolean;
  priceByCountry: { [key: string]: number };
  originalPriceByCountry: { [key: string]: number };
  unitPriceByCountry: { [key: string]: number };
  auctionCatalogId: number;
  productVariantInAuctionCatalogId: number;
  tags: string[];
  quintessenceSale: number;
  limitedQuantityPerOrder: number | null | undefined;
  offlineSale: boolean;
};
