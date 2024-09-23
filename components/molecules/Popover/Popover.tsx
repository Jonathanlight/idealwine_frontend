import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";
import { Dispatch, ReactNode, SetStateAction } from "react";

import styles from "./Popover.module.scss";

type Props = {
  children?: ReactNode;
  trigger?: ReactNode;
  className?: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
};

const Popover = ({ children, trigger, className, open, onOpenChange }: Props) => {
  return (
    <RadixPopover.Root open={open} onOpenChange={onOpenChange}>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Content
        className={clsx(styles.dropdownMenuContent, className)}
        sideOffset={5}
        forceMount
        style={{
          display: open ? "block" : "none",
        }}
      >
        <RadixPopover.Arrow className={styles.dropdownMenuArrow} />
        {children}
      </RadixPopover.Content>
    </RadixPopover.Root>
  );
};

export default Popover;
