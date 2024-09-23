import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ForwardedRef, forwardRef, ReactNode } from "react";

import styles from "./Input.module.scss";

type Props = {
  showRequiredStar?: boolean;
  error?: string | boolean;
  message?: ReactNode;
  showMessageOnlyOnFocus?: boolean;
  label?: ReactNode;
  rightIcon?: IconProp;
  onRightIconClick?: () => void;
  labelClassName?: string;
  inputClassName?: string;
} & JSX.IntrinsicElements["input"];

const Input = (
  {
    error,
    className,
    labelClassName,
    message,
    showMessageOnlyOnFocus,
    showRequiredStar,
    label,
    rightIcon,
    onRightIconClick,
    inputClassName,
    ...props
  }: Props,
  ref: ForwardedRef<HTMLInputElement>,
): JSX.Element => {
  return (
    <div className={clsx(styles.container, className)}>
      <label
        className={clsx(
          styles.label,
          props.type === "checkbox" && styles.labelCheckbox,
          labelClassName,
        )}
      >
        {(label !== undefined || showRequiredStar) && (
          <span>
            {label}
            {showRequiredStar && <span className={styles.required}>*</span>}
          </span>
        )}

        <div className={styles.relative}>
          <input
            {...props}
            ref={ref}
            className={clsx(
              styles.input,
              props.readOnly && styles.readOnly,
              {
                [styles.inputPaddingWithRightIcon]: rightIcon !== undefined,
                [styles.fullWidth]: props.type !== "checkbox",
                [styles.invalid]: error,
              },
              inputClassName,
            )}
          />

          {rightIcon !== undefined && (
            <FontAwesomeIcon
              onClick={e => {
                e.preventDefault();
                onRightIconClick?.();
              }}
              icon={rightIcon}
              className={clsx(styles.rightIcon, onRightIconClick && styles.clickable)}
            />
          )}
        </div>
      </label>

      {typeof error === "string" && <div className={styles.error}>{error}</div>}

      {message !== undefined && (
        <div className={clsx(styles.message, showMessageOnlyOnFocus && styles.showOnlyOnFocus)}>
          {message}
        </div>
      )}
    </div>
  );
};

export default forwardRef(Input);
