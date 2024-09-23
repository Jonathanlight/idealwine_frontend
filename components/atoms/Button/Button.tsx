import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons/faSpinnerThird";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ForwardedRef, forwardRef } from "react";

import styles from "./Button.module.scss";

type Props = {
  variant?:
    | "primaryGolden"
    | "secondaryGolden"
    | "primaryBlack"
    | "primaryWhite"
    | "secondaryBlack"
    | "secondaryWhite"
    | "inline"
    | "icon";
  isLoading?: boolean;
} & JSX.IntrinsicElements["button"];

const Button = (
  { variant = "primaryGolden", className, children, isLoading, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
): JSX.Element => {
  return (
    <button
      {...props}
      ref={ref}
      className={clsx(styles.button, styles[variant], isLoading && styles.loading, className)}
    >
      {children}
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <FontAwesomeIcon icon={faSpinnerThird} spin size="xl" />
        </div>
      )}
    </button>
  );
};

export default forwardRef(Button);
