export const noYear = "selectAllYears";

export const generateYearsArrayWithPossibleNullDefaultOption = (
  startYear: number,
  addDefaultOption?: boolean,
): (number | null)[] => {
  const currentYear = new Date().getFullYear();
  const yearsArray: Array<number | null> = addDefaultOption ? [null] : [];

  for (let year = currentYear; year >= startYear; year--) {
    yearsArray.push(year);
  }

  return yearsArray;
};
