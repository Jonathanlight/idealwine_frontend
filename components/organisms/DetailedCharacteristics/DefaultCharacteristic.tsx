import styles from "./DetailedCharacteristics.module.scss";
import { DefaultCharacteristicType } from "./types";
export const DefaultCharacteristic = ({
  name,
  value,
}: DefaultCharacteristicType): JSX.Element | null => {
  if (value === null) {
    return null;
  }

  return (
    <p className={styles.item}>
      <span className={styles.characteristic}>{name}</span> {value}
    </p>
  );
};
