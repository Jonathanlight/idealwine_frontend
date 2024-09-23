import { routeToState, stateToRoute } from "./AlgoliaInstantSearchProvider";

describe("testing routeToState", () => {
  it("should return an empty state if the route is empty", () => {
    const route = {};
    const state = routeToState(route);
    expect(state).toEqual({
      dev_lots: {
        refinementList: {},
      },
    });
  });
  it("should return a state with a query if the route has a query", () => {
    const route = { query: ["test"] };
    const state = routeToState(route);
    expect(state).toEqual({ dev_lots: { query: "test", refinementList: {} } });
  });
  it("should return a state with a page if the route has a page", () => {
    const route = { page: ["1"] };
    const state = routeToState(route);
    expect(state).toEqual({ dev_lots: { page: 1, refinementList: {} } });
  });
  it("should return a state with a sortBy if the route has a sortBy", () => {
    const route = { sortBy: ["test"] };
    const state = routeToState(route);
    expect(state).toEqual({ dev_lots: { sortBy: "test", refinementList: {} } });
  });
  it("should return a state with everything", () => {
    const route = {
      isDirectPurchase: ["true"],
      country: ["CHILI", "FRANCE"],
      region: ["BORDEAUX"],
      subregion: ["Saint-Emilion"],
      color: ["RED"],
      vintage: ["2009", "2010"],
      bottleSize: ["BOUTEILLE"],
      ownerName: ["Château Cheval Blanc"],
      liquidLevels: ["A_10_CM"],
      bottleObservations: ["CAPSULE_NORMALE"],
      tags: ["true"],
      unitPrice: ["-150"],
      woodenCase: ["false", "true"],
      intensity: ["CLASSIQUE"],
      mainAroma: ["FRUITE"],
      tastingOccasion: ["VIN_MEDITATION"],
      hasBids: ["true"],
      refundableVat: ["true"],
      bottleCount: ["4"],
      biologicProfile: ["TRIPLE_A"],
      grapeVariety: ["MERLOT"],
      peak: ["VIEILLISSEMENT"],
      alcoholLevel: ["15-18"],
      productCategory: ["SPIRITUEUX"],
      hasLotDiscount: ["true"],
      hasDiscount: ["true"],
      domainName: ["Château Cheval Blanc"],
      query: ["test"],
      page: ["1"],
      sortBy: ["test"],
    };
    const state = routeToState(route);
    expect(state).toEqual({
      dev_lots: {
        refinementList: {
          isDirectPurchase: ["true"],
          country: ["CHILI", "FRANCE"],
          region: ["BORDEAUX"],
          subregion: ["Saint-Emilion"],
          color: ["RED"],
          vintage: ["2009", "2010"],
          bottleSize: ["BOUTEILLE"],
          ownerName: ["Château Cheval Blanc"],
          liquidLevels: ["A_10_CM"],
          bottleObservations: ["CAPSULE_NORMALE"],
          tags: ["true"],
          woodenCase: ["false", "true"],
          intensity: ["CLASSIQUE"],
          mainAroma: ["FRUITE"],
          tastingOccasion: ["VIN_MEDITATION"],

          hasBids: ["true"],
          refundableVat: ["true"],
          bottleCount: ["4"],
          biologicProfile: ["TRIPLE_A"],
          grapeVariety: ["MERLOT"],
          peak: ["VIEILLISSEMENT"],
          productCategory: ["SPIRITUEUX"],
          hasLotDiscount: ["true"],
          hasDiscount: ["true"],
          domainName: ["Château Cheval Blanc"],
        },
        query: "test",
        page: 1,
        sortBy: "test",
        range: {
          "unitPriceByCountry.FR": ":15000",
          alcoholLevel: "15:18",
        },
      },
    });
  });
});

describe("testing stateToRoute", () => {
  it("should return an empty route if the state is empty", () => {
    const state = {};
    const route = stateToRoute(state);
    expect(route).toEqual({});
  });
  it("should return a route with a query if the state has a query", () => {
    const state = { dev_lots: { query: "test", refinementList: {} } };
    const route = stateToRoute(state);
    expect(route).toEqual({ query: ["test"] });
  });
  it("should return a route with a page if the state has a page", () => {
    const state = { dev_lots: { page: 1, refinementList: {} } };
    const route = stateToRoute(state);
    expect(route).toEqual({ page: ["1"] });
  });
  it("should return a route with a sortBy if the state has a sortBy", () => {
    const state = { dev_lots: { sortBy: "test", refinementList: {} } };
    const route = stateToRoute(state);
    expect(route).toEqual({ sortBy: ["test"] });
  });
  it("should return a route with everything", () => {
    const state = {
      dev_lots: {
        refinementList: {
          isDirectPurchase: ["true"],
          country: ["CHILI", "FRANCE"],
          region: ["BORDEAUX"],
          subregion: ["Saint-Emilion"],
          color: ["RED"],
          vintage: ["2009", "2010"],
          bottleSize: ["BOUTEILLE"],
          ownerName: ["Château Cheval Blanc"],
          liquidLevels: ["A_10_CM"],
          bottleObservations: ["CAPSULE_NORMALE"],
          tags: ["true"],
          woodenCase: ["false", "true"],
          intensity: ["CLASSIQUE"],
          mainAroma: ["FRUITE"],
          tastingOccasion: ["VIN_MEDITATION"],

          hasBids: ["true"],
          refundableVat: ["true"],
          bottleCount: ["4"],
          biologicProfile: ["TRIPLE_A"],
          grapeVariety: ["MERLOT"],
          peak: ["VIEILLISSEMENT"],
          productCategory: ["SPIRITUEUX"],
          hasLotDiscount: ["true"],
          hasDiscount: ["true"],
          domainName: ["Château Cheval Blanc"],
        },
        query: "test",
        page: 1,
        sortBy: "test",
        range: {
          "unitPriceByCountry.FR": ":15050",
          alcoholLevel: "15:18",
        },
      },
    };
    const route = stateToRoute(state);
    expect(route).toEqual({
      isDirectPurchase: ["true"],
      country: ["CHILI", "FRANCE"],
      region: ["BORDEAUX"],
      subregion: ["Saint-Emilion"],
      color: ["RED"],
      vintage: ["2009", "2010"],
      bottleSize: ["BOUTEILLE"],
      ownerName: ["Château Cheval Blanc"],
      liquidLevels: ["A_10_CM"],
      bottleObservations: ["CAPSULE_NORMALE"],
      tags: ["true"],
      woodenCase: ["false", "true"],
      intensity: ["CLASSIQUE"],
      mainAroma: ["FRUITE"],
      tastingOccasion: ["VIN_MEDITATION"],
      hasBids: ["true"],
      refundableVat: ["true"],
      bottleCount: ["4"],
      biologicProfile: ["TRIPLE_A"],
      grapeVariety: ["MERLOT"],
      peak: ["VIEILLISSEMENT"],
      productCategory: ["SPIRITUEUX"],
      hasLotDiscount: ["true"],
      hasDiscount: ["true"],
      domainName: ["Château Cheval Blanc"],
      query: ["test"],
      page: ["1"],
      sortBy: ["test"],
      unitPrice: ["-150.5"],
      alcoholLevel: ["15-18"],
    });
  });
});

describe("applying both routeToState and StateToRoute shouldn't change anything", () => {
  it("should return the same route", () => {
    const route = {
      isDirectPurchase: ["true"],
      country: ["CHILI", "FRANCE"],
      region: ["BORDEAUX"],
      subregion: ["Saint-Emilion"],
      color: ["RED"],
      vintage: ["2009", "2010"],
      bottleSize: ["BOUTEILLE"],
      ownerName: ["Château Cheval Blanc"],
      liquidLevels: ["A_10_CM"],
      bottleObservations: ["CAPSULE_NORMALE"],
      tags: ["true"],
      woodenCase: ["false", "true"],
      intensity: ["CLASSIQUE"],
      mainAroma: ["FRUITE"],
      tastingOccasion: ["VIN_MEDITATION"],
      hasBids: ["true"],
      refundableVat: ["true"],
      bottleCount: ["4"],
      biologicProfile: ["TRIPLE_A"],
      grapeVariety: ["MERLOT"],
      peak: ["VIEILLISSEMENT"],
      productCategory: ["SPIRITUEUX"],
      hasLotDiscount: ["true"],
      hasDiscount: ["true"],
      domainName: ["Château Cheval Blanc"],
      query: ["test"],
      page: ["1"],
      sortBy: ["test"],
      unitPrice: ["0-150"],
      alcoholLevel: ["15-18"],
    };
    const state = routeToState(route);
    const newRoute = stateToRoute(state);
    expect(newRoute).toEqual(route);
  });
  it("should return the same state", () => {
    const state = {
      dev_lots: {
        refinementList: {
          isDirectPurchase: ["true"],
          country: ["CHILI", "FRANCE"],
          region: ["BORDEAUX"],
          subregion: ["Saint-Emilion"],
          color: ["RED"],
          vintage: ["2009", "2010"],
          bottleSize: ["BOUTEILLE"],
          ownerName: ["Château Cheval Blanc"],
          liquidLevels: ["A_10_CM"],
          bottleObservations: ["CAPSULE_NORMALE"],
          tags: ["true"],
          woodenCase: ["false", "true"],
          intensity: ["CLASSIQUE"],
          mainAroma: ["FRUITE"],
          tastingOccasion: ["VIN_MEDITATION"],
          hasBids: ["true"],
          refundableVat: ["true"],
          bottleCount: ["4"],
          biologicProfile: ["TRIPLE_A"],
          grapeVariety: ["MERLOT"],
          peak: ["VIEILLISSEMENT"],
          productCategory: ["SPIRITUEUX"],
          hasLotDiscount: ["true"],
          hasDiscount: ["true"],
          domainName: ["Château Cheval Blanc"],
        },
        query: "test",
        page: 1,
        sortBy: "test",
        range: {
          "unitPriceByCountry.FR": "100:",
          alcoholLevel: "15:18",
        },
      },
    };
    const route = stateToRoute(state);
    const newState = routeToState(route);
    expect(newState).toEqual(state);
  });
});
