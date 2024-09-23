import { faQuoteLeft } from "@fortawesome/pro-solid-svg-icons/faQuoteLeft";
import { faQuoteRight } from "@fortawesome/pro-solid-svg-icons/faQuoteRight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";

import styles from "./Quoted.module.scss";

export const Quoted = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div className={styles.quoteBlock}>
      <div className={clsx(styles.quotes, styles.left)}>
        <FontAwesomeIcon icon={faQuoteLeft} size="2xl" />
      </div>
      <p className={styles.quotedText}>{children}</p>
      <div className={clsx(styles.quotes, styles.right)}>
        <FontAwesomeIcon icon={faQuoteRight} size="2xl" />
      </div>
    </div>
  );
};

export default Quoted;
