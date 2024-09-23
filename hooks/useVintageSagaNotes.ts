import { useMemo } from "react";

import {
  VintageSagaJsonldShopVintageSagaPlpReadRegion,
  VintageSagaJsonldShopVintageSagaTableRead,
  VintageSagaJsonldShopVintageSagaTableReadRegion,
} from "@/networking/sylius-api-client/.ts.schemas";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

export type VintageSagaNote = {
  year: number;
  color: string;
  regionName:
    | VintageSagaJsonldShopVintageSagaTableReadRegion
    | VintageSagaJsonldShopVintageSagaPlpReadRegion;
  rating: number | undefined;
  key: string;
};

export type VintageSagaNotes = {
  year: string;
  notes: VintageSagaNote[];
};

const frenchRegions = [
  { key: "BORDEAUX_RED", color: "red", name: "BORDEAUX" },
  { key: "BORDEAUX_DRY_WHITE", color: "dryWhite", name: "BORDEAUX" },
  { key: "BORDEAUX_LIQUOROUS_WHITE", color: "liquourousWhite", name: "BORDEAUX" },
  { key: "BOURGOGNE_RED", color: "red", name: "BOURGOGNE" },
  { key: "BOURGOGNE_WHITE", color: "white", name: "BOURGOGNE" },
  { key: "CHAMPAGNE", color: undefined, name: "CHAMPAGNE" },
  { key: "VALLEE_DU_RHONE_NORD", color: undefined, name: "VALLEE_DU_RHONE_NORD" },
  { key: "VALLEE_DU_RHONE_SUD", color: undefined, name: "VALLEE_DU_RHONE_SUD" },
  { key: "VALLEE_DE_LA_LOIRE", color: undefined, name: "VALLEE_DE_LA_LOIRE" },
  { key: "ALSACE", color: undefined, name: "ALSACE" },
  { key: "BEAUJOLAIS", color: undefined, name: "BEAUJOLAIS" },
] as const;

const internationalRegions = [
  { key: "ESPAGNE", color: undefined, name: "ESPAGNE" },
  { key: "ITALIE", color: undefined, name: "ITALIE" },
  { key: "PORTUGAL", color: undefined, name: "PORTUGAL" },
  { key: "CALIFORNIE_RED", color: "red", name: "CALIFORNIE" },
  { key: "CALIFORNIE_WHITE", color: "white", name: "CALIFORNIE" },
  { key: "AUSTRALIE", color: undefined, name: "AUSTRALIE" },
] as const;

export const regionsWithSpecialColors = ["BORDEAUX", "BOURGOGNE", "CALIFORNIE"];

const colorsBordeaux = ["RED", "DRY_WHITE", "LIQUOROUS_WHITE"];
const colorsBordeauxAndCalifornie = ["RED", "WHITE"];

export type SortCriteria = {
  column: string;
  direction: "ASC" | "DESC";
};

export const useVintageSagaNotes = (
  vintageSagaData: VintageSagaJsonldShopVintageSagaTableRead[],
  variant: string,
  keyColumn: string,
  direction: string,
) => {
  return useMemo(() => {
    const vintageSagaRegions = variant === "frenchRegions" ? frenchRegions : internationalRegions;

    const tableColumns = [{ key: "YEAR", color: undefined, name: "YEAR" }, ...vintageSagaRegions];

    const groupedDataByYear = vintageSagaData.reduce((acc, vintageSaga) => {
      const { year, color, region, rating } = vintageSaga;
      if (
        isNotNullNorUndefined(year) &&
        isNotNullNorUndefined(region) &&
        isNotNullNorUndefined(color)
      ) {
        const regionName = region;
        if (!(year in acc)) {
          acc[year] = [];
        }
        const key = regionsWithSpecialColors.includes(regionName)
          ? String(regionName) + "_" + String(color)
          : regionName;
        const existingNote = acc[year].find(note => note.key === key);
        if (isNotNullNorUndefined(existingNote) && isNotNullNorUndefined(existingNote.rating)) {
          if (isNotNullNorUndefined(rating) && existingNote.rating < rating) {
            existingNote.rating = rating;
          }
        } else {
          if (regionsWithSpecialColors.includes(regionName)) {
            if (
              (regionName === "BORDEAUX" && colorsBordeaux.includes(color)) ||
              (["BOURGOGNE", "CALIFORNIE"].includes(region) &&
                colorsBordeauxAndCalifornie.includes(color))
            ) {
              acc[year].push({ year, color, regionName, rating, key });
            }
          } else {
            acc[year].push({ year, color, regionName, rating, key });
          }
        }
      }

      return acc;
    }, {} as Record<string, VintageSagaNote[]>);

    Object.keys(groupedDataByYear).forEach(year => {
      groupedDataByYear[year] = groupedDataByYear[year].filter(saga =>
        vintageSagaRegions.some(region => region.name === saga.regionName),
      );
      if (!groupedDataByYear[year].some(saga => isNotNullNorUndefined(saga.rating))) {
        delete groupedDataByYear[year];
      }
    });

    const sortByYear = (data: Record<string, VintageSagaNote[]>) => {
      return Object.entries(data).sort(([a], [b]) =>
        direction === "ASC" ? Number(a) - Number(b) : Number(b) - Number(a),
      );
    };

    const sortByRegionRating = (data: Record<string, VintageSagaNote[]>) => {
      return Object.entries(data).sort(([a], [b]) => {
        const ratingA = data[a].find(note => note.key === keyColumn)?.rating ?? 0;
        const ratingB = data[b].find(note => note.key === keyColumn)?.rating ?? 0;
        if (direction === "ASC") return ratingA - ratingB;

        return ratingB - ratingA;
      });
    };

    const sortVintageNotes = (data: Record<string, VintageSagaNote[]>) => {
      if (keyColumn === "YEAR") {
        return sortByYear(data);
      }

      return sortByRegionRating(data);
    };

    return {
      vintageSagas: sortVintageNotes(groupedDataByYear).map(
        ([year, notes]) => ({ year, notes } as VintageSagaNotes),
      ),
      tableColumns,
      vintageSagaRegions,
    };
  }, [vintageSagaData, variant, direction, keyColumn]);
};

export const linkMapping = {
  BOURGOGNE: { key: "region", value: "BOURGOGNE" },
  ALSACE: { key: "region", value: "ALSACE" },
  CHAMPAGNE: { key: "region", value: "CHAMPAGNE" },
  VALLEE_DE_LA_LOIRE: { key: "region", value: "VALLEE_DE_LA_LOIRE" },
  SUD_OUEST: { key: "region", value: "SUD_OUEST" },
  VALLEE_DU_RHONE_NORD: { key: "region", value: "VALLEE_DU_RHONE" },
  VALLEE_DU_RHONE_SUD: { key: "region", value: "VALLEE_DU_RHONE" },
  JURA: { key: "region", value: "JURA" },
  SAVOIE: { key: "region", value: "SAVOIE" },
  ROUSSILLON: { key: "region", value: "ROUSSILLON" },
  BORDEAUX: { key: "region", value: "BORDEAUX" },
  BEAUJOLAIS: { key: "region", value: "BEAUJOLAIS" },
  PROVENCE: { key: "region", value: "PROVENCE" },
  LANGUEDOC: { key: "region", value: "LANGUEDOC" },
  CALIFORNIE: { key: "region", value: "CALIFORNIE" },
  ITALIE: { key: "country", value: "ITALIE" },
  PORTUGAL: { key: "country", value: "PORTUGAL" },
  ESPAGNE: { key: "country", value: "ESPAGNE" },
  AUSTRALIE: { key: "country", value: "AUSTRALIE" },
} as const;

export const getInverseLinkMapping = () => {
  const inverseLinkMapping: Record<string, { key: string; value: string[] }> = {};
  for (const [key, { value, key: linkKey }] of Object.entries(linkMapping)) {
    if (value in inverseLinkMapping) {
      inverseLinkMapping[value] = {
        key: linkKey,
        value: [...inverseLinkMapping[value].value, key],
      };
    } else {
      inverseLinkMapping[value] = { key: linkKey, value: [key] };
    }
  }

  return { inverseLinkMapping };
};
