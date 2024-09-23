export const parseVintageCodeFromParams = (requestSlug: string): string => {
  const vintageCodeRegex = /^(\d+)-(\d{4}|----).*$/;

  const match = vintageCodeRegex.exec(requestSlug);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }

  return requestSlug;
};
