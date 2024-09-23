import { RegionJsonldShopProductVariantReadName } from "@/networking/sylius-api-client/.ts.schemas";

export const noRegionString = "noRegion";
export const noRegion = { name: noRegionString, value: noRegionString };
export type RatingRankingSearchFormRegionChoice = {
  name: string;
  value: string;
};

export const ratingRankingSearchFormRegionChoices: RatingRankingSearchFormRegionChoice[] = [
  noRegion,
  {
    name: RegionJsonldShopProductVariantReadName.BORDEAUX,
    value: "bordeaux",
  },
  {
    name: RegionJsonldShopProductVariantReadName.BOURGOGNE,
    value: "bourgogne",
  },
  {
    name: RegionJsonldShopProductVariantReadName.CHAMPAGNE,
    value: "champagne",
  },
  {
    name: RegionJsonldShopProductVariantReadName.VALLEE_DU_RHONE,
    value: "rhone",
  },
  {
    name: RegionJsonldShopProductVariantReadName.VALLEE_DE_LA_LOIRE,
    value: "loire",
  },
  {
    name: RegionJsonldShopProductVariantReadName.ALSACE,
    value: "alsace",
  },
  {
    name: RegionJsonldShopProductVariantReadName.BEAUJOLAIS,
    value: "beaujolais",
  },
];
