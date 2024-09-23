import {
  createRouteFromUrl,
  createUrlFromRoute,
  getPlpBaseUrl,
  getPlpFiltersSlug,
  translateCodeTowardsParams,
  translateParamsTowardsCode,
} from "@/utils/algoliaUrls";

describe("testing transformation from url to object", () => {
  it("should handle a single value", () => {
    expect(createRouteFromUrl("region-bordeaux")).toEqual({ region: ["BORDEAUX"] });
    expect(createRouteFromUrl("vente-vente-on-line")).toEqual({
      isDirectPurchase: ["false"],
    });
    expect(createRouteFromUrl("couleur-blanc")).toEqual({ color: ["WHITE"] });
    expect(createRouteFromUrl("prix-entre-140-700")).toEqual({ unitPrice: ["140-700"] });
    expect(createRouteFromUrl("country-france")).toEqual({ country: ["FRANCE"] });
  });

  it("should handle two different values", () => {
    expect(createRouteFromUrl("region-bordeaux-vente-vente-on-line")).toEqual({
      region: ["BORDEAUX"],
      isDirectPurchase: ["false"],
    });
    expect(createRouteFromUrl("vente-vente-on-line-couleur-blanc")).toEqual({
      isDirectPurchase: ["false"],
      color: ["WHITE"],
    });
    expect(createRouteFromUrl("couleur-blanc-region-bordeaux")).toEqual({
      color: ["WHITE"],
      region: ["BORDEAUX"],
    });
    expect(createRouteFromUrl("vente-vente-on-line-region-bordeaux")).toEqual({
      region: ["BORDEAUX"],
      isDirectPurchase: ["false"],
    });
    expect(createRouteFromUrl("couleur-blanc-vente-vente-on-line")).toEqual({
      isDirectPurchase: ["false"],
      color: ["WHITE"],
    });
    expect(createRouteFromUrl("region-bordeaux-couleur-blanc")).toEqual({
      color: ["WHITE"],
      region: ["BORDEAUX"],
    });
  });

  it("should handle two values with the same key", () => {
    expect(createRouteFromUrl("region-bordeaux-ou-bourgogne")).toEqual({
      region: ["BORDEAUX", "BOURGOGNE"],
    });
    expect(createRouteFromUrl("vente-vente-on-line-ou-vente-flash")).toEqual({
      isDirectPurchase: ["false", "true"],
    });
    expect(createRouteFromUrl("couleur-rouge-ou-blanc")).toEqual({
      color: ["RED", "WHITE"],
    });
  });

  it("should handle three values, two of them with the same key", () => {
    expect(createRouteFromUrl("region-bordeaux-ou-bourgogne-vente-vente-on-line")).toEqual({
      region: ["BORDEAUX", "BOURGOGNE"],
      isDirectPurchase: ["false"],
    });
    expect(createRouteFromUrl("vente-vente-on-line-ou-vente-flash-couleur-rouge")).toEqual({
      isDirectPurchase: ["false", "true"],
      color: ["RED"],
    });
    expect(createRouteFromUrl("couleur-rouge-ou-blanc-prix-entre-140-700")).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
    });
    expect(createRouteFromUrl("vente-vente-on-line-region-bordeaux-ou-bourgogne")).toEqual({
      region: ["BORDEAUX", "BOURGOGNE"],
      isDirectPurchase: ["false"],
    });
    expect(createRouteFromUrl("couleur-rouge-vente-vente-on-line-ou-vente-flash")).toEqual({
      isDirectPurchase: ["false", "true"],
      color: ["RED"],
    });
    expect(createRouteFromUrl("prix-entre-140-700-couleur-rouge-ou-blanc")).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
    });
  });
  it("should handle four values", () => {
    expect(
      createRouteFromUrl("region-bordeaux-ou-bourgogne-vente-vente-on-line-ou-vente-flash"),
    ).toEqual({
      region: ["BORDEAUX", "BOURGOGNE"],
      isDirectPurchase: ["false", "true"],
    });
    expect(createRouteFromUrl("vente-vente-on-line-ou-vente-flash-couleur-rouge-ou-blanc")).toEqual(
      {
        isDirectPurchase: ["false", "true"],
        color: ["RED", "WHITE"],
      },
    );
    expect(createRouteFromUrl("couleur-rouge-ou-blanc-prix-entre-140-700-region-bordeaux")).toEqual(
      {
        color: ["RED", "WHITE"],
        unitPrice: ["140-700"],
        region: ["BORDEAUX"],
      },
    );
    expect(createRouteFromUrl("couleur-rouge-ou-blanc-region-bordeaux-prix-entre-140-700")).toEqual(
      {
        color: ["RED", "WHITE"],
        unitPrice: ["140-700"],
        region: ["BORDEAUX"],
      },
    );
    expect(createRouteFromUrl("region-bordeaux-couleur-rouge-ou-blanc-prix-entre-140-700")).toEqual(
      {
        color: ["RED", "WHITE"],
        unitPrice: ["140-700"],
        region: ["BORDEAUX"],
      },
    );
    expect(createRouteFromUrl("region-bordeaux-prix-entre-140-700-couleur-rouge-ou-blanc")).toEqual(
      {
        color: ["RED", "WHITE"],
        unitPrice: ["140-700"],
        region: ["BORDEAUX"],
      },
    );
    expect(createRouteFromUrl("prix-entre-140-700-region-bordeaux-couleur-rouge-ou-blanc")).toEqual(
      {
        color: ["RED", "WHITE"],
        unitPrice: ["140-700"],
        region: ["BORDEAUX"],
      },
    );
    expect(createRouteFromUrl("prix-entre-140-700-couleur-rouge-ou-blanc-region-bordeaux")).toEqual(
      {
        color: ["RED", "WHITE"],
        unitPrice: ["140-700"],
        region: ["BORDEAUX"],
      },
    );
  });

  it("should handle four values in english", () => {
    expect(
      createRouteFromUrl("region-bordeaux-or-bourgogne-sale-vente-on-line-or-vente-flash", "en"),
    ).toEqual({
      region: ["BORDEAUX", "BOURGOGNE"],
      isDirectPurchase: ["false", "true"],
    });
    expect(
      createRouteFromUrl("sale-vente-on-line-or-vente-flash-color-red-or-white", "en"),
    ).toEqual({
      isDirectPurchase: ["false", "true"],
      color: ["RED", "WHITE"],
    });
    expect(
      createRouteFromUrl("color-red-or-white-price-between-140-700-region-bordeaux", "en"),
    ).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
      region: ["BORDEAUX"],
    });
    expect(
      createRouteFromUrl("color-red-or-white-region-bordeaux-price-between-140-700", "en"),
    ).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
      region: ["BORDEAUX"],
    });
    expect(
      createRouteFromUrl("region-bordeaux-color-red-or-white-price-between-140-700", "en"),
    ).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
      region: ["BORDEAUX"],
    });
    expect(
      createRouteFromUrl("region-bordeaux-price-between-140-700-color-red-or-white", "en"),
    ).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
      region: ["BORDEAUX"],
    });
    expect(
      createRouteFromUrl("price-between-140-700-region-bordeaux-color-red-or-white", "en"),
    ).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
      region: ["BORDEAUX"],
    });
    expect(
      createRouteFromUrl("price-between-140-700-color-red-or-white-region-bordeaux", "en"),
    ).toEqual({
      color: ["RED", "WHITE"],
      unitPrice: ["140-700"],
      region: ["BORDEAUX"],
    });

    // test 2 keys with the same value
    expect(createRouteFromUrl("product-category-vins-mousseux", "en")).toEqual({
      productCategory: ["VINS_MOUSSEUX"],
    });
    expect(createRouteFromUrl("color-sparkling", "en")).toEqual({
      color: ["SPARKLING_WHITE"],
    });
    expect(createRouteFromUrl("color-sparkling-product-category-vins-mousseux", "en")).toEqual({
      color: ["SPARKLING_WHITE"],
      productCategory: ["VINS_MOUSSEUX"],
    });
  });

  it("should allow to search a string equals to a filter key", () => {
    expect(createRouteFromUrl("recherche-couleur", "fr")).toEqual({
      query: ["couleur"],
    });
    expect(createRouteFromUrl("recherche-couleur-page-2", "fr")).toEqual({
      query: ["couleur"],
      page: ["2"],
    });
  });
});

describe("testing transformation from url to object", () => {
  it("should handle one value", () => {
    expect(createUrlFromRoute({ country: ["FRANCE"] })).toEqual("pays-france");
    expect(createUrlFromRoute({ isDirectPurchase: ["false"] })).toEqual("vente-vente-on-line");
    expect(createUrlFromRoute({ color: ["WHITE"] })).toEqual("couleur-blanc");
    expect(createUrlFromRoute({ region: ["BORDEAUX"] })).toEqual("region-bordeaux");
    expect(createUrlFromRoute({ unitPrice: ["140-700"] })).toEqual("prix-entre-140-700");
  });
  it("should handle two values", () => {
    expect(createUrlFromRoute({ country: ["FRANCE"], isDirectPurchase: ["false"] })).toEqual(
      "vente-vente-on-line-pays-france",
    );
    expect(createUrlFromRoute({ color: ["WHITE"], region: ["BORDEAUX"] })).toEqual(
      "region-bordeaux-couleur-blanc",
    );
    expect(createUrlFromRoute({ isDirectPurchase: ["false"], color: ["WHITE"] })).toEqual(
      "vente-vente-on-line-couleur-blanc",
    );
    expect(createUrlFromRoute({ region: ["BORDEAUX"], unitPrice: ["140-700"] })).toEqual(
      "region-bordeaux-prix-entre-140-700",
    );
    expect(createUrlFromRoute({ unitPrice: ["140-700"], country: ["FRANCE"] })).toEqual(
      "pays-france-prix-entre-140-700",
    );
  });
  it("should handle two values with same key", () => {
    expect(createUrlFromRoute({ country: ["FRANCE", "ALLEMAGNE"] })).toEqual(
      "pays-allemagne-ou-france",
    );
    expect(
      createUrlFromRoute({
        isDirectPurchase: ["false", "true"],
      }),
    ).toEqual("vente-vente-flash-ou-vente-on-line");
    expect(createUrlFromRoute({ color: ["WHITE", "RED"] })).toEqual("couleur-blanc-ou-rouge");
    expect(createUrlFromRoute({ region: ["BORDEAUX", "BOURGOGNE"] })).toEqual(
      "region-bordeaux-ou-bourgogne",
    );
  });
  it("should handle three values", () => {
    expect(
      createUrlFromRoute({
        country: ["FRANCE"],
        isDirectPurchase: ["false"],
        color: ["WHITE"],
      }),
    ).toEqual("vente-vente-on-line-pays-france-couleur-blanc");
    expect(
      createUrlFromRoute({
        region: ["BORDEAUX"],
        isDirectPurchase: ["false"],
        color: ["WHITE"],
      }),
    ).toEqual("vente-vente-on-line-region-bordeaux-couleur-blanc");
    expect(
      createUrlFromRoute({
        region: ["BORDEAUX"],
        isDirectPurchase: ["false"],
        unitPrice: ["140-700"],
      }),
    ).toEqual("vente-vente-on-line-region-bordeaux-prix-entre-140-700");
    expect(
      createUrlFromRoute({
        region: ["BORDEAUX"],
        color: ["WHITE"],
        unitPrice: ["140-700"],
      }),
    ).toEqual("region-bordeaux-couleur-blanc-prix-entre-140-700");
    expect(
      createUrlFromRoute({
        region: ["BORDEAUX"],
        color: ["WHITE"],
        unitPrice: ["140-700"],
      }),
    ).toEqual("region-bordeaux-couleur-blanc-prix-entre-140-700");
  });
  it("should handle three values in english", () => {
    expect(
      createUrlFromRoute(
        {
          country: ["FRANCE"],
          isDirectPurchase: ["false"],
          color: ["WHITE"],
        },
        "en",
      ),
    ).toEqual("sale-vente-on-line-country-france-color-white");
    expect(
      createUrlFromRoute(
        {
          region: ["BORDEAUX"],
          isDirectPurchase: ["false"],
          color: ["WHITE"],
        },
        "en",
      ),
    ).toEqual("sale-vente-on-line-region-bordeaux-color-white");
    expect(
      createUrlFromRoute(
        {
          region: ["BORDEAUX"],
          isDirectPurchase: ["false"],
          unitPrice: ["140-700"],
        },
        "en",
      ),
    ).toEqual("sale-vente-on-line-region-bordeaux-price-between-140-700");
    expect(
      createUrlFromRoute(
        {
          region: ["BORDEAUX"],
          color: ["WHITE"],
          unitPrice: ["140-700"],
        },
        "en",
      ),
    ).toEqual("region-bordeaux-color-white-price-between-140-700");
    expect(
      createUrlFromRoute(
        {
          region: ["BORDEAUX"],
          color: ["WHITE"],
          unitPrice: ["140-700"],
        },
        "en",
      ),
    ).toEqual("region-bordeaux-color-white-price-between-140-700");
  });
  it("should be correctly sorted", () => {
    expect(
      createUrlFromRoute({
        country: ["FRANCE", "ALLEMAGNE", "ESPAGNE", "CHILI"],
      }),
    ).toEqual("pays-allemagne-ou-chili-ou-espagne-ou-france");
    expect(
      createUrlFromRoute({
        region: ["BOURGOGNE", "CHAMPAGNE", "VALLEE_DU_RHONE", "BORDEAUX", "VALLEE_DE_LA_LOIRE"],
      }),
    ).toEqual("region-bordeaux-ou-bourgogne-ou-champagne-ou-vallee-de-la-loire-ou-vallee-du-rhone");
    expect(
      createUrlFromRoute({
        color: ["ROSE", "SPARKLING_WHITE", "WHITE", "RED"],
      }),
    ).toEqual("couleur-blanc-ou-blanc-effervescent-ou-rose-ou-rouge");
    expect(
      createUrlFromRoute({
        bottleSize: ["DEMI_BOUTEILLE", "MAGNUM", "BOUTEILLE", "NABUCHODONOSOR", "JEROBOAM"],
      }),
    ).toEqual("format-bouteille-ou-demi-bouteille-ou-jeroboam-ou-magnum-ou-nabuchodonosor");
  });
});

describe("end to end", () => {
  it("going back and forth should give the same result", () => {
    expect(
      createRouteFromUrl(
        createUrlFromRoute({
          country: ["FRANCE", "ALLEMAGNE", "ESPAGNE", "CHILI"],
        }),
      ),
    ).toEqual({
      country: ["ALLEMAGNE", "CHILI", "ESPAGNE", "FRANCE"],
    });
    expect(
      createRouteFromUrl(
        createUrlFromRoute({
          region: ["BORDEAUX"],
          color: ["WHITE"],
          unitPrice: ["140-700"],
        }),
      ),
    ).toEqual({
      region: ["BORDEAUX"],
      color: ["WHITE"],
      unitPrice: ["140-700"],
    });
    expect(
      createUrlFromRoute(createRouteFromUrl("vente-vente-on-line-pays-france-couleur-blanc")),
    ).toEqual("vente-vente-on-line-pays-france-couleur-blanc");
    expect(createUrlFromRoute(createRouteFromUrl("pays-allemagne-ou-france"))).toEqual(
      "pays-allemagne-ou-france",
    );
  });
});

describe("getPlpBaseUrl", () => {
  expect(getPlpBaseUrl("http://localhost:3000/en/buy-wine")).toEqual(
    "http://localhost:3000/en/buy-wine",
  );
  expect(getPlpBaseUrl("http://localhost:3000/fr/acheter-du-vin")).toEqual(
    "http://localhost:3000/fr/acheter-du-vin",
  );
  expect(getPlpBaseUrl("http://localhost:3000/en/buy-wine/color-Ambr%C3%A9")).toEqual(
    "http://localhost:3000/en/buy-wine",
  );
  expect(getPlpBaseUrl("http://localhost:3000/fr/acheter-du-vin/color-Ambr%C3%A9")).toEqual(
    "http://localhost:3000/fr/acheter-du-vin",
  );
});

describe("getPlpFiltersSlug", () => {
  expect(getPlpFiltersSlug("http://localhost:3000/en/buy-wine")).toEqual("");
  expect(getPlpFiltersSlug("http://localhost:3000/buy-wine")).toEqual("");
  expect(getPlpFiltersSlug("http://localhost:3000/acheter-du-vin")).toEqual("");
  expect(getPlpFiltersSlug("http://localhost:3000/fr/acheter-du-vin")).toEqual("");
  expect(getPlpFiltersSlug("http://localhost:3000/en/buy-wine/color-Ambr%C3%A9")).toEqual(
    "color-Ambr%C3%A9",
  );
  expect(getPlpFiltersSlug("http://localhost:3000/buy-wine/color-Ambr%C3%A9")).toEqual(
    "color-Ambr%C3%A9",
  );
  expect(getPlpFiltersSlug("http://localhost:3000/fr/acheter-du-vin/color-Ambr%C3%A9")).toEqual(
    "color-Ambr%C3%A9",
  );
  expect(getPlpFiltersSlug("http://localhost:3000/acheter-du-vin/color-Ambr%C3%A9")).toEqual(
    "color-Ambr%C3%A9",
  );
  expect(
    getPlpFiltersSlug(
      "http://localhost:3000/fr/acheter-du-vin/selection-LES_INDISPENSABLES?order-by=price-asc",
    ),
  ).toEqual("selection-LES_INDISPENSABLES");
  expect(
    getPlpFiltersSlug(
      "http://localhost:3000/_next/data/development/en/buy-wine/color-Ambr%C3%A9.json",
    ),
  ).toEqual("color-Ambr%C3%A9");
  expect(
    getPlpFiltersSlug(
      "http://localhost:3000/_next/data/development/buy-wine/color-Ambr%C3%A9.json",
    ),
  ).toEqual("color-Ambr%C3%A9");
});

describe("testing query params", () => {
  it("translating query params in french", () => {
    expect(translateCodeTowardsParams("dev_lots_bid_count_desc", "fr")).toEqual({
      "order-by": "bid-count-desc",
    });
    expect(translateCodeTowardsParams("dev_lots_price_desc", "fr")).toEqual({
      "order-by": "price-desc",
    });
  });
  it("translating query params in english", () => {
    expect(translateCodeTowardsParams("dev_lots_bid_count_desc", "en")).toEqual({
      "order-by": "bid-count-desc",
    });
    expect(translateCodeTowardsParams("dev_lots_price_desc", "en")).toEqual({
      "order-by": "price-desc",
    });
  });
  it("untranslating query params", () => {
    expect(
      translateParamsTowardsCode({ fake: "data", still: "fake", "order-by": "price-desc" }),
    ).toEqual("dev_lots_price_desc");
    expect(translateParamsTowardsCode({ "order-by": "price-desc" })).toEqual("dev_lots_price_desc");
  });
  it("going back and forth should give the same result", () => {
    expect(
      translateParamsTowardsCode(translateCodeTowardsParams("dev_lots_bid_count_desc", "fr")),
    ).toEqual("dev_lots_bid_count_desc");
    expect(
      translateParamsTowardsCode(translateCodeTowardsParams("dev_lots_price_desc", "en")),
    ).toEqual("dev_lots_price_desc");
    expect(
      translateCodeTowardsParams(
        translateParamsTowardsCode({ "order-by": "price-desc" }) ?? "",
        "en",
      ),
    ).toEqual({ "order-by": "price-desc" });
    expect(
      translateCodeTowardsParams(
        translateParamsTowardsCode({ "order-by": "price-desc", fake: "data" }) ?? "",
        "fr",
      ),
    ).toEqual({ "order-by": "price-desc" });
  });
});
