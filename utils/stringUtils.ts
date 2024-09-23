export const lowerCaseFirstLetterIfNotAcronym = (str: string) => {
  const secondLetterIsUpperCase = str.length > 1 && str.charAt(1) === str.charAt(1).toUpperCase();

  if (secondLetterIsUpperCase) {
    return str;
  }

  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const normalizePdpUrlVariantTitle = (stringUrl: string) =>
  stringUrl
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/([^\w-]|_)/g, "")
    .replace(/-{2,6}/g, "-"); // some values contain 4 dashes in a row, added to the two delimiting the field, we need to be able to catch up to 6 of them

export const normalizeRatingVintageUrl = (stringUrl: string) =>
  stringUrl
    .trim()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/([^\w-]|_)/g, "");
