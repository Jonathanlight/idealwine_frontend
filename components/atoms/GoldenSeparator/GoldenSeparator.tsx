import clsx from "clsx";

import styles from "./GoldenSeparator.module.scss";

export enum Size {
  extraSmall = "extraSmall",
  small = "small",
  medium = "medium",
  large = "large",
}
interface Props {
  size: Size;
}

const GoldenSeparator = ({ size }: Props) => {
  return (
    <div
      className={clsx(
        styles.goldenSeparator,
        size === Size.extraSmall && styles.extraSmall,
        size === Size.small && styles.small,
        size === Size.medium && styles.medium,
        size === Size.large && styles.large,
      )}
    ></div>
  );
};

export default GoldenSeparator;
