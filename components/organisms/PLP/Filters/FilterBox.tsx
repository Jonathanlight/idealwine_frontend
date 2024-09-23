import { faCircleArrowDown } from "@fortawesome/pro-light-svg-icons/faCircleArrowDown";
import { faCircleArrowUp } from "@fortawesome/pro-light-svg-icons/faCircleArrowUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import styles from "./FilterBox.module.scss";

export const FilterBox = ({
  title,
  children,
  filtersSelected,
  initiallyOpen,
}: {
  title: string;
  filtersSelected: number;
  children: JSX.Element;
  initiallyOpen?: boolean;
}): JSX.Element => {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <div className={styles.details}>
      <button onClick={() => setOpen(!open)} className={styles.summary}>
        <span className={styles.summaryTitle}>
          {title}
          {filtersSelected > 0 && <span className={styles.filtersNumber}>{filtersSelected}</span>}
        </span>
        {open ? (
          <FontAwesomeIcon icon={faCircleArrowUp} />
        ) : (
          <FontAwesomeIcon icon={faCircleArrowDown} />
        )}
      </button>

      {open && <div className={styles.filterContent}>{children}</div>}
    </div>
  );
};
