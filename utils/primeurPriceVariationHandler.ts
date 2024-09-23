export const getVariation = (firstNumber: number, secondNumber: number): number => {
  return Math.round(((firstNumber - secondNumber) / secondNumber) * 100 * 100) / 100;
};
