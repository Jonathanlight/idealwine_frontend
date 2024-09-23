import { isNotNullNorUndefined, isNumber } from "@/utils/ts-utils";

type VintagePeak = {
  collection?: boolean | null;
  yearStart?: number | null;
  yearEnd?: number | null;
};

const isValidPeak = (peak?: VintagePeak): peak is NonNullable<VintagePeak> =>
  isNotNullNorUndefined(peak) &&
  (typeof peak.yearEnd === "number" ||
    typeof peak.yearStart === "number" ||
    peak.collection !== undefined) &&
  (typeof peak.yearEnd !== "string" ||
    typeof peak.yearStart !== "string" ||
    peak.yearEnd >= peak.yearStart);

export const getPeakAdviceTranslationKey = (
  collection?: boolean | null,
  yearStart?: number | null,
  yearEnd?: number | null,
): string | null => {
  if (!isValidPeak({ collection, yearStart, yearEnd })) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  // Bottle is marked as collection
  if (collection === true) {
    return "acheter-vin:detailedInformation.characteristics.values.peak.collection";
  }

  // Peak has no end
  if (!isNumber(yearEnd)) {
    if (!isNumber(yearStart)) {
      return null;
    }

    if (yearStart > currentYear) {
      return "acheter-vin:detailedInformation.characteristics.values.peak.drinkFromStart";
    }

    return "acheter-vin:detailedInformation.characteristics.values.peak.drinkFromNow";
  }

  // We are past the peak
  if (yearEnd < currentYear) {
    return "acheter-vin:detailedInformation.characteristics.values.peak.collection";
  }

  // Peak ends this year
  if (yearEnd === currentYear) {
    return "acheter-vin:detailedInformation.characteristics.values.peak.drinkNow";
  }

  // Peak has started
  if (yearEnd > currentYear && (!isNumber(yearStart) || yearStart <= currentYear)) {
    return "acheter-vin:detailedInformation.characteristics.values.peak.drinkUntil";
  }

  // Peak will be a single year
  if (isNumber(yearStart) && yearStart === yearEnd) {
    return "acheter-vin:detailedInformation.characteristics.values.peak.drinkIn";
  }

  // Peak will be a range of years
  if (isNumber(yearStart) && yearStart !== yearEnd) {
    return "acheter-vin:detailedInformation.characteristics.values.peak.drinkFromTo";
  }

  // Suspecting a space-time continuum inconsistency
  return null;
};
