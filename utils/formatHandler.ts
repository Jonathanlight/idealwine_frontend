export const millilitersToLiters = (milliliters: number) => {
  return milliliters / 1000;
};

const UNITS_TO_CENTS_FACTOR = 100;

export const centsToUnits = (cents: number) => cents / UNITS_TO_CENTS_FACTOR;

export const unitsToCents = (units: number) => units * UNITS_TO_CENTS_FACTOR;
