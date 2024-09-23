import clsx from "clsx";
import { useRange } from "react-instantsearch-hooks-web";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import useCustomRange from "@/hooks/useCustomRange";
import { useTranslation } from "@/utils/next-utils";

import styles from "./AlgoliaPriceRangeForm.module.scss";

type Props = {
  rangeState: ReturnType<typeof useRange>;
  minLabel: string;
  maxLabel: string;
  step?: string;
};

const AlgoliaPriceRangeForm = ({ rangeState, minLabel, maxLabel }: Props): JSX.Element => {
  const { t } = useTranslation("acheter-du-vin");

  const {
    minValue,
    maxValue,
    setMinValue,
    setMaxValue,
    triggerRefinement,
    isMinRefined,
    isMaxRefined,
  } = useCustomRange(rangeState);

  const { convertToActiveCurrency, convertFromActiveCurrency } = useCurrencyConverter();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    triggerRefinement();
  };

  const convertToTarget = (value: string) => {
    if (value === "") return value;

    const { priceIsConvertible, convertedPrice } = convertToActiveCurrency(parseFloat(value));

    const convertedValue = priceIsConvertible ? convertedPrice : parseFloat(value);

    return (Math.round(convertedValue) / 100).toString();
  };

  const convertFromTarget = (value: string) => {
    if (value === "") return value;

    const { priceIsConvertible, convertedPrice } = convertFromActiveCurrency(parseFloat(value));

    const convertedValue = priceIsConvertible ? convertedPrice : parseFloat(value);

    return (convertedValue * 100).toString();
  };

  return (
    <form className={styles.formContainer} onSubmit={handleFormSubmit}>
      <Input
        type="number"
        value={convertToTarget(minValue)}
        label={minLabel}
        step="any"
        onChange={event => setMinValue(convertFromTarget(event.target.value))}
        inputClassName={clsx(!isMinRefined && styles.notRefined)}
      />
      <Input
        type="number"
        value={convertToTarget(maxValue)}
        label={maxLabel}
        step="any"
        onChange={event => setMaxValue(convertFromTarget(event.target.value))}
        inputClassName={clsx(!isMaxRefined && styles.notRefined)}
      />
      <Button variant="primaryBlack" type="submit" className={styles.button}>
        {t("filters.submit")}
      </Button>
    </form>
  );
};

export default AlgoliaPriceRangeForm;
