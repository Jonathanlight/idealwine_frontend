import { faSearch } from "@fortawesome/pro-light-svg-icons/faSearch";
import { useIntervalEffect } from "@react-hookz/web";
import { useRef, useState } from "react";

import Input from "@/components/atoms/Input/Input";
import { useTranslation } from "@/utils/next-utils";

import styles from "./SearchbarUI.module.scss";

type Props = {
  queryValue: string;
  setQueryValue: (value: string) => void;
  searchHandler: () => void;
};

const PLACEHOLDER_TRANSITION_TIME = 3000;

const SearchbarUI = ({ queryValue, searchHandler, setQueryValue }: Props) => {
  const { t } = useTranslation("common");

  const inputRef = useRef<HTMLInputElement>(null);

  const search = () => {
    inputRef.current?.blur(); // hide keyboard on mobile
    searchHandler();
  };

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    t("header.searchbarPlaceholder1"),
    t("header.searchbarPlaceholder2"),
    t("header.searchbarPlaceholder3"),
    t("header.searchbarPlaceholder4"),
  ];

  useIntervalEffect(
    () => setPlaceholderIndex(previousIndex => (previousIndex + 1) % placeholders.length),
    PLACEHOLDER_TRANSITION_TIME,
  );

  return (
    <Input
      ref={inputRef}
      value={queryValue}
      onChange={event => setQueryValue(event.target.value)}
      aria-label={t("header.searchbarLabel")}
      placeholder={placeholders[placeholderIndex]}
      rightIcon={faSearch}
      onRightIconClick={search}
      onKeyDown={event => {
        if (event.key === "Enter") void search();
      }}
      inputClassName={styles.searchbarInput}
    />
  );
};

export default SearchbarUI;
