import { parseVintageCodeFromParams } from "../parseVintageCode";

describe("parse Vintage code", () => {
  it.each([
    [
      "500002-1971-bouteille-BORDEAUX-Saint-Emilion-Grand-Cru-Romain-Heninsuffix-blanc-liquoreux",
      "500002-1971",
    ],
    ["500002-1971", "500002-1971"],
    ["34-2004", "34-2004"],
    ["34------bouteille", "34-----"],
    ["5003-----", "5003-----"],
    ["500004-----", "500004-----"],
    ["500003-----bouteille-BERMUDES-Santa-Helena-Chateau-Petrussuffix-ambre", "500003-----"],
  ])("should return code %s for slug %s", (slug, expectedCode) => {
    const value = parseVintageCodeFromParams(slug);

    expect(value).toEqual(expectedCode);
  });
});
