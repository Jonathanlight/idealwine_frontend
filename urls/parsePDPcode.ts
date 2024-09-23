export const parseCodeFromParams = (requestSlug: string): string => {
  const splitRequestSlug = requestSlug.split("-");

  if (requestSlug.length >= 36) {
    const potentialUuid = requestSlug.slice(0, 36);
    const uuidRegex =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    if (uuidRegex.test(potentialUuid)) {
      return potentialUuid;
    }
  }

  const startWithCapitalizedLetterRegex = /^[A-Z]/;

  if (!startWithCapitalizedLetterRegex.test(requestSlug)) {
    return splitRequestSlug[0];
  }

  return [splitRequestSlug[0], splitRequestSlug[1]].join("-");
};
