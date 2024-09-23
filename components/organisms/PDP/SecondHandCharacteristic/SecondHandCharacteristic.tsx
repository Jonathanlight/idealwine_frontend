import clsx from "clsx";

import styles from "./SecondHandCharacteristic.module.scss";

type Props = {
  name: string;
  value: string;
  className?: string;
};

export const SecondHandCharacteristic = ({ name, value, className }: Props): JSX.Element => {
  return (
    <span className={clsx(styles.item, className)}>
      <span>{name} </span>
      {value}
    </span>
  );
};
