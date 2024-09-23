import React, { ChangeEvent, useEffect, useReducer } from "react";

import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useTranslation } from "@/utils/next-utils";

import styles from "./DatePicker.module.scss";

interface Props {
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  startDate: string | undefined;
  endDate: string | undefined;
}

interface DateState {
  localStartDate: string;
  localEndDate: string;
}

type DateAction =
  | { type: "SET_LOCAL_START_DATE"; payload: string }
  | { type: "SET_LOCAL_END_DATE"; payload: string };

const DatePicker = ({ setStartDate, setEndDate, startDate, endDate }: Props): JSX.Element => {
  const { t } = useTranslation("section-vendeur");
  const dateReducer = (state: DateState, action: DateAction): DateState => {
    switch (action.type) {
      case "SET_LOCAL_START_DATE":
        return { ...state, localStartDate: action.payload };
      case "SET_LOCAL_END_DATE":
        return { ...state, localEndDate: action.payload };
      default:
        return state;
    }
  };

  const [dateState, dispatch] = useReducer(dateReducer, {
    localStartDate: "",
    localEndDate: "",
  });

  const { localStartDate, localEndDate } = dateState;

  const handleLocalStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;
    dispatch({ type: "SET_LOCAL_START_DATE", payload: newValue });
  };

  const handleLocalEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;
    dispatch({ type: "SET_LOCAL_END_DATE", payload: newValue });
  };

  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEndDate(localEndDate);
    setStartDate(localStartDate);
    event.preventDefault();
  };

  useEffect(() => {
    if (startDate !== undefined && endDate !== undefined) {
      dispatch({ type: "SET_LOCAL_START_DATE", payload: startDate });
      dispatch({ type: "SET_LOCAL_END_DATE", payload: endDate });
    }
  }, [startDate, endDate]);

  return (
    <div className={styles.formContainer}>
      <p>{t("dateFilter")}</p>
      <Input
        className={styles.input}
        type="date"
        value={dateState.localStartDate}
        min={"1900-01-01"}
        onChange={handleLocalStartDateChange}
      />
      <p>{t("and")}</p>
      <Input
        className={styles.input}
        type="date"
        min={"1900-01-01"}
        onChange={handleLocalEndDateChange}
        value={dateState.localEndDate}
      />
      <Button variant="primaryBlack" onClick={handleChange}>
        {t("submitForm")}
      </Button>
    </div>
  );
};

export default DatePicker;
