import { getVariation } from "./primeurPriceVariationHandler";

describe("getVariation", () => {
  it("should calculate the positive variation correctly", () => {
    const currentYearRating = 1807;
    const primeurPrice = 1700;
    const expectedVariation = 6.29;

    const variation = getVariation(currentYearRating, primeurPrice);

    expect(variation).toEqual(expectedVariation);
  });

  it("should handle zero as secondNumber correctly", () => {
    const currentYearRating = 1807;
    const primeurPrice = 0;
    const expectedVariation = Infinity;

    const variation = getVariation(currentYearRating, primeurPrice);

    expect(variation).toEqual(expectedVariation);
  });
});

describe("getVariation", () => {
  it("should calculate the negative variation correctly", () => {
    const primeurPrice = 1700;
    const pastYearPrimeurPrice = 1746;
    const expectedVariation = -2.63;

    const variation = getVariation(primeurPrice, pastYearPrimeurPrice);

    expect(variation).toEqual(expectedVariation);
  });
});
