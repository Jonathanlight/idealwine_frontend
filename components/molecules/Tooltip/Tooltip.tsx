import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

import styles from "./Tooltip.module.scss";

type Props = {
  trigger?: ReactNode;
  contentProps?: Tooltip.TooltipContentProps;
} & Tooltip.TooltipProviderProps;

const TooltipCustom = ({ children, trigger, contentProps, ...props }: Props) => {
  return (
    <Tooltip.Provider delayDuration={0} {...props}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{trigger}</Tooltip.Trigger>
        <Tooltip.Portal>
          {children !== false && (
            <Tooltip.Content
              className={styles.defaultTooltipContent}
              sideOffset={5}
              {...contentProps}
            >
              {children}
            </Tooltip.Content>
          )}
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipCustom;
