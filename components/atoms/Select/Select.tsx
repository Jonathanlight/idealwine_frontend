import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import React, { ForwardedRef, forwardRef } from "react";

import styles from "./Select.module.scss";

export type SelectProps = {
  showRequiredStar?: boolean;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string | boolean;
  triggerClassName?: string;
  options: {
    groups: {
      key: string;
      title?: string;
      options: { value: string; label: string; disabled?: boolean }[];
    }[];
  };
} & React.ComponentProps<typeof Select.Root>;

const SelectCustom = (
  {
    options,
    placeholder,
    className,
    label,
    error,
    triggerClassName,
    showRequiredStar,
    ...props
  }: SelectProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) => (
  <label className={clsx(styles.container, { [styles.error]: error }, className)}>
    {label !== undefined && (
      <p>
        {label}
        {showRequiredStar && <span className={styles.required}>*</span>}
      </p>
    )}

    <Select.Root {...props} value={props.value ?? undefined}>
      <Select.Trigger
        className={clsx(styles.selectTrigger, triggerClassName)}
        aria-label={label ?? placeholder}
        ref={forwardedRef}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={styles.selectIcon}>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.selectContent} position="popper">
          <Select.ScrollUpButton className={styles.selectScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.selectViewport}>
            {options.groups.map(group => (
              <Select.Group key={group.key}>
                {group.title !== undefined && (
                  <Select.Label className={styles.selectLabel}>{group.title}</Select.Label>
                )}
                {group.options.map(option => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select.Group>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.selectScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>

    {typeof error === "string" && <div className={styles.errorMessage}>{error}</div>}
  </label>
);

const SelectItem = ({ children, className, ...props }: Select.SelectItemProps) => {
  return (
    <Select.Item className={clsx(styles.selectItem, className)} {...props}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className={styles.selectItemIndicator}>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
};

export default forwardRef(SelectCustom);
