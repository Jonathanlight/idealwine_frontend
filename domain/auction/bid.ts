const MAX_AMOUNT = 4990000;

const ceilingWithSteps = [
  { ceiling: 5000, step: 300 },
  { ceiling: 10000, step: 500 },
  { ceiling: 30000, step: 1000 },
  { ceiling: 50000, step: 2000 },
  { ceiling: 200000, step: 5000 },
  { ceiling: MAX_AMOUNT, step: 10000 },
];

export const getNextStep = (currentAmount: number): number => {
  if (currentAmount >= MAX_AMOUNT) {
    return currentAmount;
  }

  const currentCeiling = ceilingWithSteps.find(({ ceiling }) => ceiling > currentAmount);

  if (!currentCeiling) {
    throw new Error(`Ceiling not found for amount ${currentAmount}`);
  }

  return currentAmount + currentCeiling.step;
};

export const getPreviousStep = (currentAmount: number): number => {
  const currentCeiling = ceilingWithSteps.find(
    ({ ceiling, step }) => ceiling > currentAmount - step,
  );

  if (!currentCeiling) {
    throw new Error(`Ceiling not found for amount ${currentAmount}`);
  }

  return currentAmount - currentCeiling.step;
};
