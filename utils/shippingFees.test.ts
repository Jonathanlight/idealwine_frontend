import {
  calculateShippingFees,
  getShippingFeesOptimizations,
  getVolumeCountersByCartItems,
} from "./shippingFees";

describe("shippingFees", () => {
  test("calculates shipping fees for a single bottle", () => {
    const bottles = 1;
    const magnums = 0;
    const others = 0;
    const slice = 990;
    const slice1 = 495;

    const result = calculateShippingFees(bottles, magnums, others, slice, slice1);

    expect(result).toBe(495);
  });

  test("calculates shipping fees for 12 bottles", () => {
    const bottles = 12;
    const magnums = 0;
    const others = 0;
    const slice = 990;
    const slice1 = 495;

    const result = calculateShippingFees(bottles, magnums, others, slice, slice1);

    expect(result).toBe(990);
  });

  test("handles edge case of 13 bottles", () => {
    const bottles = 13;
    const magnums = 0;
    const others = 0;
    const slice = 990;
    const slice1 = 495;

    const result = calculateShippingFees(bottles, magnums, others, slice, slice1);

    expect(result).toBe(1485);
  });

  test("calculates shipping fees for small, medium, and large volumes", () => {
    const bottles = 1;
    const magnums = 1;
    const others = 1;
    const slice = 990;
    const slice1 = 495;

    const result = calculateShippingFees(bottles, magnums, others, slice, slice1);

    expect(result).toBe(1980);
  });

  test("get shipping fees optimizations for 1 bottle", () => {
    const bottles = 1;
    const magnums = 0;
    const others = 0;

    const result = getShippingFeesOptimizations(bottles, magnums, others);

    expect(result).toMatchObject({
      isOptimized: true,
      canProposeMoreBottles: true,
      remainingBottlesToOptim: 0,
      remainingMagnumsToOptim: 0,
    });
  });

  test("get shipping fees optimizations for 12 bottles", () => {
    const bottles = 12;
    const magnums = 0;
    const others = 0;

    const result = getShippingFeesOptimizations(bottles, magnums, others);

    expect(result).toMatchObject({
      isOptimized: true,
      canProposeMoreBottles: false,
      remainingBottlesToOptim: 0,
      remainingMagnumsToOptim: 0,
    });
  });

  test("get shipping fees optimizations for 1 bottle, 2 magnums and 0 others", () => {
    const bottles = 1;
    const magnums = 2;
    const others = 0;

    const result = getShippingFeesOptimizations(bottles, magnums, others);

    expect(result).toMatchObject({
      isOptimized: false,
      canProposeMoreBottles: false,
      remainingBottlesToOptim: 0,
      remainingMagnumsToOptim: 3,
    });
  });

  test("get volumes by cart items", () => {
    const cartItems = [{ variant: { numberOfBottles: 1, volume: 750 }, quantity: 1 }];

    const result = getVolumeCountersByCartItems(cartItems);

    expect(result).toMatchObject({
      bottles: 1,
      magnums: 0,
      others: 0,
    });
  });

  test("get volumes by cart items", () => {
    const cartItems = [
      { variant: { numberOfBottles: 1, volume: 750 }, quantity: 2 },
      { variant: { numberOfBottles: 2, volume: 3000 }, quantity: 2 },
    ];

    const result = getVolumeCountersByCartItems(cartItems);

    expect(result).toMatchObject({
      bottles: 2,
      magnums: 4,
      others: 0,
    });
  });
});
