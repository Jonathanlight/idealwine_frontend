export const localeToPrismicLocale = (locale: string | undefined) => {
  switch (locale) {
    case "fr":
      return "fr-fr";
    case "en":
      return "en-gb";
    case "de":
      return "de-de";
    case "it":
      return "it-it";
    default:
      return "fr-fr";
  }
};
