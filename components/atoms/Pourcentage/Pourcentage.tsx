import clsx from "clsx";

import styles from "./Pourcentage.module.scss";

type Props = {
  className?: string;
  pourcentage: number;
};

const Pourcentage = ({ className, pourcentage }: Props): JSX.Element => {
  return <div className={clsx(styles.pourcentage, className)}>{`${pourcentage}%`}</div>;
};

export default Pourcentage;
