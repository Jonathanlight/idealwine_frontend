import { getNextStep, getPreviousStep } from "./bid";

describe("getNextStep", () => {
  it.each([
    [4800, 5100],
    [8000, 8500],
    [5000, 5500],
    [4990000, 4990000],
  ])(
    "should return + bidStep or currentAmount when ceiling is reached",
    (currentAmount, expected) => {
      const result = getNextStep(currentAmount);
      expect(result).toBe(expected);
    },
  );
});

describe("getPreviousStep", () => {
  it.each([
    [5400, 4900],
    [10000, 9500],
    [5500, 5000],
  ])("should return - bidStep", (currentAmount, expected) => {
    const result = getPreviousStep(currentAmount);
    expect(result).toBe(expected);
  });

  it.each([5100, 10000, 30100, 50100, 200100, 10500])(
    "should return same amount when reaching a new ceiling and decrease",
    initialAmount => {
      const nextAmount = getNextStep(initialAmount);
      const result = getPreviousStep(nextAmount);

      expect(result).toBe(initialAmount);
    },
  );
});
