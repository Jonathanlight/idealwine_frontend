import clsx from "clsx";
import { useRange } from "react-instantsearch-hooks-web";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input/Input";
import useCustomRange from "@/hooks/useCustomRange";
import { useTranslation } from "@/utils/next-utils";

import styles from "./AlgoliaRangeForm.module.scss";

type Props = {
  rangeState: ReturnType<typeof useRange>;
  minLabel: string;
  maxLabel: string;
  step?: string;
};

const AlgoliaRangeForm = ({ rangeState, minLabel, maxLabel, step = "1" }: Props): JSX.Element => {
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

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    triggerRefinement();
  };

  return (
    <form className={styles.formContainer} onSubmit={handleFormSubmit}>
      <Input
        type="number"
        value={minValue}
        label={minLabel}
        step={step}
        onChange={event => setMinValue(event.target.value)}
        inputClassName={clsx(!isMinRefined && styles.notRefined)}
      />
      <Input
        type="number"
        value={maxValue}
        label={maxLabel}
        step={step}
        onChange={event => setMaxValue(event.target.value)}
        inputClassName={clsx(!isMaxRefined && styles.notRefined)}
      />
      <Button variant="primaryBlack" type="submit" className={styles.button}>
        {t("filters.submit")}
      </Button>
    </form>
  );
};

export default AlgoliaRangeForm;
