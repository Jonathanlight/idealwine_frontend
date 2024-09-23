import { useEffect, useState } from "react";
import { useRange } from "react-instantsearch-hooks-web";

const resetMinPrice = (startMin?: number, rangeMin?: number) => {
  return Math.max(startMin ?? -Infinity, rangeMin ?? -Infinity);
};

const resetMaxPrice = (startMax?: number, rangeMax?: number) => {
  return Math.min(startMax ?? Infinity, rangeMax ?? Infinity);
};

const useCustomRange = ({
  refine,
  start: [startMin, startMax],
  range: { min, max },
}: ReturnType<typeof useRange>) => {
  const [minValue, setMinValue] = useState(resetMinPrice(startMin, min));
  const [maxValue, setMaxValue] = useState(resetMaxPrice(startMax, max));

  const isMinRefined = startMin !== -Infinity;
  const isMaxRefined = startMax !== Infinity;

  useEffect(() => {
    setMinValue(resetMinPrice(startMin, min));
    setMaxValue(resetMaxPrice(startMax, max));
  }, [startMin, startMax, min, max]);

  const triggerRefinement = () => {
    const minCurrentRefinement = resetMinPrice(Math.min(minValue, maxValue), min);
    const maxCurrentRefinement = resetMaxPrice(Math.max(minValue, maxValue), max);

    refine([minCurrentRefinement, maxCurrentRefinement]);

    setMinValue(minCurrentRefinement);
    setMaxValue(maxCurrentRefinement);
  };

  return {
    minValue: minValue === -Infinity ? "" : minValue.toString(),
    maxValue: maxValue === Infinity ? "" : maxValue.toString(),
    setMinValue: (value: string) => {
      setMinValue(value === "" ? -Infinity : parseFloat(value));
    },
    setMaxValue: (value: string) => {
      setMaxValue(value === "" ? Infinity : parseFloat(value));
    },
    triggerRefinement,
    isMinRefined,
    isMaxRefined,
  };
};

export default useCustomRange;
