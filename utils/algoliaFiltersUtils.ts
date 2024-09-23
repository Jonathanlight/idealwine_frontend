import { RefinementList } from "@/hooks/useAlgoliaRefinements";

import { isNonEmptyString, isNullOrUndefined, ObjectKeys } from "./ts-utils";

export const getSelectedFiltersCount = (refinementList: RefinementList, numberOfFilters = 1) => {
  const refinedFilters = ObjectKeys(refinementList).filter(key => {
    const refinement = refinementList[key];
    const isRange = "range" in refinement;

    if (isRange) {
      return refinement.start[0] !== -Infinity || refinement.start[1] !== Infinity;
    }

    return refinement.items.some(item => item.isRefined);
  });

  const selectedFilters =
    numberOfFilters === 1 ? refinedFilters[0] : refinedFilters.slice(0, numberOfFilters);

  return refinedFilters.length === numberOfFilters ? selectedFilters : undefined;
};

export const getSingleSelectedEstate = (
  refinementList: RefinementList,
  searchQuery: string | undefined = undefined,
) => {
  if (isNonEmptyString(searchQuery)) return;

  const selectedFilter = getSelectedFiltersCount(refinementList);
  if (!isNonEmptyString(selectedFilter)) {
    return;
  }

  const selectedEstates = refinementList.domainName.items.filter(item => item.isRefined);

  return selectedEstates.length === 1 ? selectedEstates[0].value : undefined;
};

const hasValidVintageSagaSelection = (
  refinementList: RefinementList,
  searchQuery: string | undefined = undefined,
) => {
  if (isNonEmptyString(searchQuery)) return false;

  const selectedFilters = getSelectedFiltersCount(refinementList, 2);

  if (isNullOrUndefined(selectedFilters) || !selectedFilters.includes("vintage")) {
    return false;
  }

  const hasRegion = selectedFilters.includes("region");
  const hasCountry = selectedFilters.includes("country");

  if (!hasRegion && !hasCountry) {
    return false;
  }

  return true;
};

export const getSelectedRegion = (
  refinementList: RefinementList,
  searchQuery: string | undefined = undefined,
) => {
  if (hasValidVintageSagaSelection(refinementList, searchQuery)) {
    const selectedRegions = refinementList.region.items.filter(item => item.isRefined);
    if (selectedRegions.length === 1) {
      return selectedRegions[0].value;
    }
  }

  return undefined;
};

export const getSelectedCountry = (
  refinementList: RefinementList,
  searchQuery: string | undefined = undefined,
) => {
  if (hasValidVintageSagaSelection(refinementList, searchQuery)) {
    const selectedCountry = refinementList.country.items.filter(item => item.isRefined);
    if (selectedCountry.length === 1) {
      return selectedCountry[0].value;
    }
  }

  return undefined;
};

export const getSelectedVintage = (
  refinementList: RefinementList,
  searchQuery: string | undefined = undefined,
) => {
  if (hasValidVintageSagaSelection(refinementList, searchQuery)) {
    const selectedVintages = refinementList.vintage.items.filter(item => item.isRefined);
    if (selectedVintages.length === 1) {
      return selectedVintages[0].value;
    }
  }

  return undefined;
};
