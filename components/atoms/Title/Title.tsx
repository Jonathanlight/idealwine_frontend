import React from "react";

import styles from "./Title.module.scss";

type Props = { level: string; children: React.ReactNode };

const Title = ({ children, level }: Props): JSX.Element => {
  switch (level) {
    case "h1":
      return <h1 className={styles.h1}>{children}</h1>;

    case "h2":
      return <h2 className={styles.h2}>{children}</h2>;

    default:
      break;
  }

  return <h1 className={styles.h1}>{children}</h1>;
};

export default Title;
