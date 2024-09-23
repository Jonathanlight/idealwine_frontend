import * as Switch from "@radix-ui/react-switch";
import clsx from "clsx";

import styles from "./Switch.module.scss";

type Props = {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  size?: "small" | "medium";
};

const switchRootClassNames = {
  small: "switchRootSmall",
  medium: "switchRootMedium",
} as const;

const switchTumbClassNames = {
  small: "switchThumbSmall",
  medium: "switchThumbMedium",
} as const;

const CustomSwitch = ({ checked, onChange, size = "medium", disabled = false }: Props) => {
  const switchRootSize = switchRootClassNames[size];
  const switchTumbSize = switchTumbClassNames[size];

  return (
    <Switch.Root
      className={clsx(styles.switchRoot, styles[switchRootSize])}
      onClick={onChange}
      checked={checked}
      disabled={disabled}
    >
      <Switch.Thumb className={clsx(styles.switchThumb, styles[switchTumbSize])} />
    </Switch.Root>
  );
};

export default CustomSwitch;
