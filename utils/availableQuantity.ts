export const MAX_AVAILABLE_QUANTITY_TO_SHOW = 60;

export const formatAvailableQuantity = (availableQuantity: number) => {
  if (availableQuantity > MAX_AVAILABLE_QUANTITY_TO_SHOW) {
    return `${MAX_AVAILABLE_QUANTITY_TO_SHOW}+`;
  }

  return availableQuantity.toString();
};
