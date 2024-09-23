import { parseCodeFromParams } from "../parsePDPcode";

describe("parse PDP code", () => {
  it.each([
    ["B0002047-1844-1-bouteille-Meursault-Coche-Dury-Domaine", "B0002047-1844"],
    ["1123123suffix-1-bouteille-Meursault-Coche-Dury-Domaine", "1123123suffix"],
    ["1123123-1-bouteille-Meursault-Coche-Dury-Domaine", "1123123"],
    [
      "b0f4d85c-7531-4256-8699-beb5e3e90624-1-bouteille-Meursault-Coche-Dury-Domaine",
      "b0f4d85c-7531-4256-8699-beb5e3e90624",
    ],
    ["B0002047-1844", "B0002047-1844"],
    ["1123123suffix", "1123123suffix"],
    ["b0f4d85c-7531-4256-8699-beb5e3e90624", "b0f4d85c-7531-4256-8699-beb5e3e90624"],
    ["6927184-2-bouteilles-Mercurey-Premier-Cru-Piece-13-Bruno-Lorenzon-2020", "6927184"],
  ])("should return code %s for slug %s", (slug, expectedCode) => {
    const value = parseCodeFromParams(slug);

    expect(value).toEqual(expectedCode);
  });
});
