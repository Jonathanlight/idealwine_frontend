import {
  ProductJsonldBiologicProfile,
  ProductJsonldColor,
  ProductJsonldDominantAroma,
  ProductJsonldIntensity,
  ProductJsonldProfile,
  ProductJsonldTastingOccasion,
  ProductVariantJsonldShopProductVariantReadFormat,
  RegionJsonldName,
  WineCountryJsonldName,
  WineVarietyJsonldName,
} from "@/networking/sylius-api-client/.ts.schemas";

import enums from "../locales/fr/enums.json";

const regions = enums.region;
const countries = enums.country;
const wineVarieties = enums.wineVarieties;
const dominantAromas = enums.dominantAroma;
const tastingOccasions = enums.tastingOccasion;
const profiles = enums.profile;
const colors = enums.color;
const intensities = enums.intensity;
const biologicProfiles = enums.biologicProfile;
const formats = enums.formatWithoutCount;

describe("Frontend translations", () => {
  it("should have every regions defined in backend", () => {
    Object.values(RegionJsonldName).forEach(region => {
      expect(regions[region]).toBeDefined();
    });
  });

  it("should have every countries defined in backend", () => {
    Object.values(WineCountryJsonldName).forEach(country => {
      expect(countries[country]).toBeDefined();
    });
  });

  it("should have every wine variety defined in backend", () => {
    Object.values(WineVarietyJsonldName).forEach(wineVariety => {
      expect(wineVarieties[wineVariety]).toBeDefined();
    });
  });

  it("should have every aroma defined in backend", () => {
    Object.values(ProductJsonldDominantAroma).forEach(aroma => {
      if (aroma !== null) {
        expect(dominantAromas[aroma]).toBeDefined();
      }
    });
  });

  it("should have every tasting occasion defined in backend", () => {
    Object.values(ProductJsonldTastingOccasion).forEach(occasion => {
      if (occasion !== null) {
        expect(tastingOccasions[occasion]).toBeDefined();
      }
    });
  });

  it("should have every profiles defined in backend", () => {
    Object.values(ProductJsonldProfile).forEach(profile => {
      if (profile !== null) {
        expect(profiles[profile]).toBeDefined();
      }
    });
  });

  it("should have every colors defined in backend", () => {
    Object.values(ProductJsonldColor).forEach(color => {
      if (color !== null) {
        expect(colors[color]).toBeDefined();
      }
    });
  });

  it("should have every intensities defined in backend", () => {
    Object.values(ProductJsonldIntensity).forEach(intensity => {
      if (intensity !== null) {
        expect(intensities[intensity]).toBeDefined();
      }
    });
  });

  it("should have every biologicProfiles defined in backend", () => {
    Object.values(ProductJsonldBiologicProfile).forEach(biologicProfile => {
      if (biologicProfile !== null) {
        expect(biologicProfiles[biologicProfile]).toBeDefined();
      }
    });
  });

  it("should have every formats defined in backend", () => {
    Object.values(ProductVariantJsonldShopProductVariantReadFormat).forEach(format => {
      if (format !== null) {
        expect(formats[format]).toBeDefined();
      }
    });
  });
});
