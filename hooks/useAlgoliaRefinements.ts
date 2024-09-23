import {
  useRange,
  useRefinementList,
  UseRefinementListProps,
  useSortBy,
} from "react-instantsearch-hooks-web";

import { useCurrentDeliveryCountry } from "@/hooks/useCurrentDeliveryCountry";
import { sortWithHeadingValues } from "@/utils/sortWithHeadingValues";

export const PLPIndexName = process.env.NEXT_PUBLIC_ALGOLIA_PLP_INDEX_NAME ?? "";
export const vintageRatingIndexName =
  process.env.NEXT_PUBLIC_ALGOLIA_VINTAGE_RATING_INDEX_NAME ?? "";
process.env.NEXT_PUBLIC_ALGOLIA_VINTAGE_RATING_INDEX_NAME ?? "";

const sortByName: UseRefinementListProps["sortBy"] = (a, b) => {
  if (a.isRefined && !b.isRefined) return -1;
  if (!a.isRefined && b.isRefined) return 1;

  return parseInt(a.name) < parseInt(b.name) ? -1 : 1;
};

export const commonProps = {
  limit: 10,
  showMore: true,
  showMoreLimit: 100,
};

const colorSort = sortWithHeadingValues(["RED", "WHITE", "ROSE", "SPARKLING_WHITE"]);
const bottleSizeSort = sortWithHeadingValues([
  "DEMI_CLAVELIN",
  "DEMI_BOUTEILLE",
  "FORMAT_50_CL",
  "CLAVELIN",
  "BOUTEILLE",
  "MAGNUM",
  "MARIE_JEANNE",
  "DOUBLE_MAGNUM",
  "JEROBOAM",
  "DAME_JEANNE",
  "IMPERIALE",
  "MATHUSALEM",
  "SALMANAZAR",
  "BALTHAZAR",
  "NABUCHODONOSOR",
  "SALOMON",
  "MELCHIOR",
]);
const regionSort = sortWithHeadingValues(["BORDEAUX", "BOURGOGNE", "VALLEE_DU_RHONE"]);

export const useAlgoliaRefinements = () => {
  const { currentDeliveryCountry } = useCurrentDeliveryCountry();
  const priceRefinementName = `unitPriceByCountry.${currentDeliveryCountry}`;

  const bottleSize = useRefinementList({
    ...commonProps,
    attribute: "bottleSize",
    sortBy: bottleSizeSort,
  });
  const color = useRefinementList({
    ...commonProps,
    attribute: "color",
    sortBy: colorSort,
  });
  const biologicProfile = useRefinementList({
    ...commonProps,
    attribute: "biologicProfile",
    sortBy: ["name"],
  });
  const unitPrice = useRange({ attribute: priceRefinementName });
  const alcoholLevel = useRange({ attribute: "alcoholLevel", precision: 1 });
  const isDirectPurchase = useRefinementList({
    ...commonProps,
    attribute: "isDirectPurchase",
    sortBy: ["name"],
  });
  const country = useRefinementList({
    ...commonProps,
    attribute: "country",
    sortBy: ["isRefined:desc", "name"],
  });
  const region = useRefinementList({
    ...commonProps,
    attribute: "region",
    sortBy: regionSort,
  });
  const subregion = useRefinementList({
    ...commonProps,

    attribute: "subregion",
    sortBy: ["isRefined:desc", "name"],
  });
  const domainName = useRefinementList({
    ...commonProps,

    attribute: "domainName",
    sortBy: ["isRefined:desc", "name"],
  });
  const vintage = useRefinementList({
    ...commonProps,

    attribute: "vintage",
    sortBy: ["isRefined:desc", "name:desc"],
  });
  const grapeVariety = useRefinementList({
    ...commonProps,
    attribute: "grapeVariety",
    sortBy: ["isRefined:desc", "name"],
  });
  const tags = useRefinementList({
    ...commonProps,
    attribute: "tags",
    sortBy: ["isRefined:desc", "name"],
  });
  const intensity = useRefinementList({
    ...commonProps,
    attribute: "intensity",
    sortBy: ["isRefined:desc", "name"],
  });
  const mainAroma = useRefinementList({
    ...commonProps,
    attribute: "mainAroma",
    sortBy: ["isRefined:desc", "name"],
  });
  const tastingOccasion = useRefinementList({
    ...commonProps,
    attribute: "tastingOccasion",
    sortBy: ["name"],
  });
  const status = useRefinementList({
    ...commonProps,
    attribute: "status",
    sortBy: ["name"],
  });
  const peak = useRefinementList({
    ...commonProps,
    attribute: "peak",
    sortBy: ["name"],
  });
  const productCategory = useRefinementList({
    ...commonProps,
    attribute: "productCategory",
    sortBy: ["name"],
  });
  const bottleCount = useRefinementList({
    ...commonProps,
    attribute: "bottleCount",
    sortBy: sortByName,
  });
  const ownerName = useRefinementList({
    ...commonProps,
    attribute: "ownerName",
    sortBy: ["isRefined:desc", "name"],
  });
  const hasBids = useRefinementList({
    ...commonProps,
    attribute: "hasBids",
    sortBy: ["name:desc"],
  });
  const hasReservePrice = useRefinementList({
    ...commonProps,
    attribute: "hasReservePrice",
    sortBy: ["name:desc"],
  });
  const liquidLevels = useRefinementList({
    ...commonProps,
    attribute: "liquidLevels",
    sortBy: ["name"],
  });
  const bottleObservations = useRefinementList({
    ...commonProps,
    attribute: "bottleObservations",
    sortBy: ["name"],
  });
  const woodenCase = useRefinementList({
    ...commonProps,
    attribute: "woodenCase",
    sortBy: ["name:desc"],
  });
  const refundableVat = useRefinementList({
    ...commonProps,
    attribute: "refundableVat",
    sortBy: ["name:desc"],
  });
  const hasLotDiscount = useRefinementList({
    ...commonProps,
    attribute: "hasLotDiscount",
    sortBy: ["name:desc"],
  });
  const hasDiscount = useRefinementList({
    ...commonProps,
    attribute: "hasDiscount",
    sortBy: ["name:desc"],
  });
  const availableQuantity = useRefinementList({
    ...commonProps,

    attribute: "availableQuantity",
    sortBy: ["name"], // to see "-0" in items list and allow 'hideSold' boolean below to be true
  });
  const auctionCatalogId = useRefinementList({
    ...commonProps,
    attribute: "auctionCatalogId",
    sortBy: ["name"],
  });
  const quintessenceSale = useRefinementList({
    ...commonProps,
    attribute: "quintessenceSale",
  });
  // This enables the "newReleases" filter to work.
  const auctionCatalogStartDate = useRange({
    attribute: "auctionCatalogStartDate",
  });

  const refinementList = {
    bottleSize,
    color,
    biologicProfile,
    unitPrice,
    alcoholLevel,
    isDirectPurchase,
    country,
    region,
    subregion,
    domainName,
    vintage,
    grapeVariety,
    tags,
    intensity,
    mainAroma,
    tastingOccasion,
    status,
    peak,
    productCategory,
    bottleCount,
    ownerName,
    hasBids,
    hasReservePrice,
    liquidLevels,
    bottleObservations,
    woodenCase,
    refundableVat,
    hasLotDiscount,
    hasDiscount,
    availableQuantity,
    auctionCatalogId,
    quintessenceSale,
    auctionCatalogStartDate,
  };

  const sortByChoices = [
    { label: "acheter-du-vin:sortBy", value: PLPIndexName },
    { label: "acheter-du-vin:closingDateDesc", value: `${PLPIndexName}_bid_end_date_desc` },
    { label: "acheter-du-vin:closingDateAsc", value: `${PLPIndexName}_bid_end_date_asc` },
    { label: "acheter-du-vin:priceDesc", value: `${PLPIndexName}_price_desc` },
    { label: "acheter-du-vin:priceAsc", value: `${PLPIndexName}_price_asc` },
    { label: "acheter-du-vin:vintageAsc", value: `${PLPIndexName}_vintage_asc` },
    { label: "acheter-du-vin:vintageDesc", value: `${PLPIndexName}_vintage_desc` },
    { label: "acheter-du-vin:bidsDesc", value: `${PLPIndexName}_bid_count_desc` },
    { label: "acheter-du-vin:bidsAsc", value: `${PLPIndexName}_bid_count_asc` },
    { label: "acheter-du-vin:watchDesc", value: `${PLPIndexName}_bid_watch_desc` },
    { label: "acheter-du-vin:watchAsc", value: `${PLPIndexName}_bid_watch_asc` },
  ];

  const sortBy = useSortBy({ items: sortByChoices });

  return { refinementList, sortBy, priceRefinementName };
};

export type RefinementList = ReturnType<typeof useAlgoliaRefinements>["refinementList"];

export const refinementsTranslationKeys = {
  bottleSize: "enums:formatWithoutCount",
  color: "enums:color",
  biologicProfile: "enums:biologicProfile",
  unitPrice: "acheter-du-vin:enums.unitPrice",
  alcoholLevel: "acheter-du-vin:enums.alcoholLevel",
  isDirectPurchase: "acheter-du-vin:enums.isDirectPurchase",
  country: "enums:country",
  region: "enums:region",
  subregion: null,
  domainName: null,
  vintage: null,
  grapeVariety: "enums:wineVarieties",
  tags: "acheter-du-vin:enums.tags",
  intensity: "enums:intensity",
  mainAroma: "enums:dominantAroma",
  tastingOccasion: "enums:tastingOccasion",
  status: "enums:profile",
  peak: "acheter-du-vin:enums.peak",
  productCategory: "acheter-du-vin:enums.productCategory",
  bottleCount: null,
  ownerName: "acheter-du-vin:enums.ownerName",
  hasBids: "acheter-du-vin:enums.hasBids",
  hasReservePrice: "acheter-du-vin:enums.hasReservePrice",
  liquidLevels: "enums:liquidLevel",
  bottleObservations: "enums:bottleObservationWithoutCount",
  woodenCase: "enums:boolean",
  refundableVat: "enums:boolean",
  hasLotDiscount: "enums:boolean",
  hasDiscount: "enums:boolean",
  quintessenceSale: null,
  availableQuantity: "acheter-du-vin:enums.availableQuantity",
  auctionCatalogId: null,
  auctionCatalogStartDate: null,
};

export const findNewReleasesFilterStartValue = () => {
  const currentDate = new Date();
  const currentDateMinusTenDays = currentDate.setDate(currentDate.getDate() - 10);
  const currentTimeStampMinusTenDays = Math.round(currentDateMinusTenDays / 1000 / 3600) * 3600; // round to the closest hour to avoid multiple requests to algolia
  const adjustedCurrentTimeStampMinusTenDays = currentTimeStampMinusTenDays - 1800; // subtract 30 minutes to compensate for the rounding of the current time

  return adjustedCurrentTimeStampMinusTenDays;
};
