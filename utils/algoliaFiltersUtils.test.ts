import { RefinementListRenderState } from "instantsearch.js/es/connectors/refinement-list/connectRefinementList";

import { RefinementList } from "@/hooks/useAlgoliaRefinements";
import { getSingleSelectedEstate } from "@/utils/algoliaFiltersUtils";

import { DeepPartial } from "./ts-utils";

// test that getSingleSelectedEstate  returns undefined unless there is only one domainName selected and no other filters
describe("algolia filter utils", () => {
  const getRefinementList = (activeFilters: unknown = {}): DeepPartial<RefinementList> => {
    return {
      region: {
        items: [
          { isRefined: false, value: "bordeaux" },
          { isRefined: false, value: "bourgogne" },
        ],
        canToggleShowMore: false,
      },
      country: {
        items: [
          { isRefined: false, value: "France" },
          { isRefined: false, value: "Ecosse" },
        ],
        canToggleShowMore: false,
      },
      domainName: {
        items: [
          { isRefined: false, value: "chateau" },
          { isRefined: false, value: "domaine" },
        ],
        canToggleShowMore: false,
      },
      grapeVariety: {
        items: [
          { isRefined: false, value: "chateau" },
          { isRefined: false, value: "domaine" },
        ],
        canToggleShowMore: false,
      },
      color: {
        items: [
          { isRefined: false, value: "rouge" },
          { isRefined: false, value: "blanc" },
        ],
        canToggleShowMore: false,
      },
      unitPrice: { start: [-Infinity, Infinity], range: { min: 0, max: 1000 } },
      ...(activeFilters as Record<string, RefinementListRenderState>),
    };
  };

  it("should return a domainName if only one domainName is selected", () => {
    const refinementList = getRefinementList({
      domainName: {
        items: [
          { isRefined: true, value: "Domaine 1" },
          { isRefined: false, value: "Domaine 2" },
        ],
        canToggleShowMore: false,
      },
    });

    expect(getSingleSelectedEstate(refinementList as RefinementList)).toEqual("Domaine 1");
  });

  it("should return undefined if no domainName is selected", () => {
    const refinementList = getRefinementList({});

    expect(getSingleSelectedEstate(refinementList as RefinementList)).toBeUndefined();
  });

  it("should return undefined if more than one domainName is selected", () => {
    const refinementList = getRefinementList({
      domainName: {
        items: [
          { isRefined: true, value: "chateau" },
          { isRefined: true, value: "domaine" },
        ],
        canToggleShowMore: false,
      },
    });

    expect(getSingleSelectedEstate(refinementList as RefinementList)).toBeUndefined();
  });

  it("should return undefined if no domainName is selected but other filters are", () => {
    const refinementList = getRefinementList({
      color: {
        items: [
          { isRefined: true, value: "rouge" },
          { isRefined: false, value: "blanc" },
        ],
        canToggleShowMore: false,
      },
    });

    expect(getSingleSelectedEstate(refinementList as RefinementList)).toBeUndefined();
  });

  it("should return undefined if only one domainName is selected but other filters are", () => {
    const refinementList = getRefinementList({
      domainName: {
        items: [
          { isRefined: true, value: "chateau" },
          { isRefined: false, value: "domaine" },
        ],
        canToggleShowMore: false,
      },
      color: {
        items: [
          { isRefined: true, value: "rouge" },
          { isRefined: false, value: "blanc" },
        ],
        canToggleShowMore: false,
      },
    });

    expect(getSingleSelectedEstate(refinementList as RefinementList)).toBeUndefined();
  });
});
