import { normalizePdpUrlVariantTitle } from "@/utils/stringUtils";

const variantTitles = [
  {
    variantTitle: "Château de la Grille 2018",
    expected: "Chateau-de-la-Grille-2018",
  },
  {
    variantTitle: "1 Bouteille     Stony Hill 2000 importé par bateau à voiles ",
    expected: "1-Bouteille-Stony-Hill-2000-importe-par-bateau-a-voiles",
  },
  {
    variantTitle: "àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ",
    expected: "aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY",
  },
  {
    variantTitle: "Aloxe-Corton Rapet Père & Fils ",
    expected: "Aloxe-Corton-Rapet-Pere-Fils",
  },
];

describe("it normalizes the variant title for the product details page url", () => {
  it.each(variantTitles)(
    "without heading values : $value1 and $value2 should return $expected",
    ({ variantTitle, expected }) => {
      expect(normalizePdpUrlVariantTitle(variantTitle)).toBe(expected);
    },
  );
});
