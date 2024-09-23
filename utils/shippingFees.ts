import {
  SHIPPING_CALCULATOR_MEDIUM_CAPACITY,
  SHIPPING_CALCULATOR_SMALL_CAPACITY,
  VOLUME_MAPPING,
} from "@/utils/constants";

const getSlices = (
  bottles: number,
  magnums: number,
  others: number,
): {
  nbBottlesInSmallSlice: number;
  nbBottlesInMediumSlice: number;
  nbSmallSlices: number;
  nbMediumSlices: number;
  nbLargeSlices: number;
  singleSmallUnits: number;
} => {
  let nbBottlesInMediumSlice = magnums;
  let nbBottlesInSmallSlice = bottles;

  // If there is some remaining space in a box filled with medium bottles, fill it with small bottles (max 6)
  while (
    nbBottlesInMediumSlice % SHIPPING_CALCULATOR_MEDIUM_CAPACITY !== 0 &&
    nbBottlesInSmallSlice > 0
  ) {
    nbBottlesInMediumSlice++;
    nbBottlesInSmallSlice--;
  }

  let singleSmallUnits = 0;

  // If there is a single bottle left, put it in a small box
  if ((nbBottlesInSmallSlice - 1) % SHIPPING_CALCULATOR_SMALL_CAPACITY === 0) {
    singleSmallUnits = 1;
    nbBottlesInSmallSlice--;
  }

  const nbSmallSlices = Math.ceil(nbBottlesInSmallSlice / SHIPPING_CALCULATOR_SMALL_CAPACITY);
  const nbMediumSlices = Math.ceil(nbBottlesInMediumSlice / SHIPPING_CALCULATOR_MEDIUM_CAPACITY);
  const nbLargeSlices = others;

  return {
    nbBottlesInSmallSlice,
    nbBottlesInMediumSlice,
    nbSmallSlices,
    nbMediumSlices,
    nbLargeSlices,
    singleSmallUnits,
  };
};

export const calculateShippingFees = (
  bottles: number,
  magnums: number,
  others: number,
  slice: number,
  slice1: number,
): number => {
  const { nbSmallSlices, nbMediumSlices, nbLargeSlices, singleSmallUnits } = getSlices(
    bottles,
    magnums,
    others,
  );

  return (nbSmallSlices + nbMediumSlices + nbLargeSlices) * slice + singleSmallUnits * slice1;
};

export const getShippingFeesOptimizations = (
  bottles: number,
  magnums: number,
  others: number,
): {
  isOptimized: boolean;
  canProposeMoreBottles: boolean;
  remainingBottlesToOptim: number;
  remainingMagnumsToOptim: number;
} => {
  const { nbBottlesInSmallSlice, nbBottlesInMediumSlice, singleSmallUnits } = getSlices(
    bottles,
    magnums,
    others,
  );

  const remainingBottlesToOptim =
    (SHIPPING_CALCULATOR_SMALL_CAPACITY -
      (nbBottlesInSmallSlice % SHIPPING_CALCULATOR_SMALL_CAPACITY)) %
    SHIPPING_CALCULATOR_SMALL_CAPACITY;

  const remainingMagnumsToOptim =
    (SHIPPING_CALCULATOR_MEDIUM_CAPACITY -
      (nbBottlesInMediumSlice % SHIPPING_CALCULATOR_MEDIUM_CAPACITY)) %
    SHIPPING_CALCULATOR_MEDIUM_CAPACITY;

  const isOptimized =
    nbBottlesInSmallSlice % SHIPPING_CALCULATOR_SMALL_CAPACITY === 0 &&
    nbBottlesInMediumSlice % SHIPPING_CALCULATOR_MEDIUM_CAPACITY === 0;

  const canProposeMoreBottles = singleSmallUnits === 1 ? true : false;

  return {
    isOptimized,
    canProposeMoreBottles,
    remainingBottlesToOptim,
    remainingMagnumsToOptim,
  };
};

type CartItem = {
  quantity?: number;
  variant: {
    volume?: number | null;
    numberOfBottles?: number;
  };
};

export const getVolumeCountersByCartItems = (
  items: CartItem[] | undefined,
): { bottles: number; magnums: number; others: number } => {
  const result = { bottles: 0, magnums: 0, others: 0 };

  if (!items) return result;

  for (const item of items) {
    const variant = item.variant;

    if (item.quantity == null || variant.numberOfBottles == null || variant.volume == null)
      continue;

    const unitVolume = Math.round(variant.volume / variant.numberOfBottles);
    const quantity = item.quantity * variant.numberOfBottles;

    if (unitVolume <= VOLUME_MAPPING.LITRE) {
      result.bottles += quantity;
    } else if (unitVolume <= VOLUME_MAPPING.MAGNUM) {
      result.magnums += quantity;
    } else {
      result.others += quantity;
    }
  }

  return result;
};
