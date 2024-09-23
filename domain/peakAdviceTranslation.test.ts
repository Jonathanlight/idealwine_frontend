import { getPeakAdviceTranslationKey } from "@/domain/peakAdviceTranslation";

describe("peakAdviceTranslation", () => {
  const currentYear = new Date().getFullYear();

  it("should return null if peak is undefined", () => {
    const peakAdviceTranslation = getPeakAdviceTranslationKey(undefined);
    expect(peakAdviceTranslation).toBeNull();
  });

  it.each([
    {
      peak: { collection: true },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.collection",
    },
    {
      peak: { yearEnd: currentYear - 1 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.collection",
    },
    {
      peak: { yearEnd: currentYear },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkNow",
    },
    {
      peak: { yearStart: currentYear + 1, yearEnd: currentYear + 2 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkFromTo",
    },
    {
      peak: { yearStart: currentYear + 1, yearEnd: currentYear + 1 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkIn",
    },
    {
      peak: { yearStart: currentYear + 1 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkFromStart",
    },
    {
      peak: { yearStart: currentYear },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkFromNow",
    },
    {
      peak: { yearStart: currentYear - 1 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkFromNow",
    },
    {
      peak: { yearEnd: currentYear + 1 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkUntil",
    },
    {
      peak: { yearStart: currentYear - 1, yearEnd: currentYear + 1 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkUntil",
    },
    {
      peak: { yearStart: currentYear, yearEnd: currentYear + 1 },
      expectedPeakAdviceTranslationKey:
        "acheter-vin:detailedInformation.characteristics.values.peak.drinkUntil",
    },
  ])(
    "should return $expectedPeakAdviceTranslationKey for peak $peak",
    ({ peak, expectedPeakAdviceTranslationKey }) => {
      const peakAdviceTranslationKey = getPeakAdviceTranslationKey(
        peak.collection,
        peak.yearStart,
        peak.yearEnd,
      );

      expect(peakAdviceTranslationKey).toBe(expectedPeakAdviceTranslationKey);
    },
  );
});
