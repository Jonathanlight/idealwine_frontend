import clsx from "clsx";
import Image from "next/image";

import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./SelectBox.module.scss";

type Props = {
  title: string;
  description?: string | JSX.Element;
  isSelected: boolean;
  onSelect: () => void;
  children?: React.ReactNode;
  className?: string;
  iconUrl?: string;
};

const SelectBox = ({
  title,
  description,
  isSelected,
  onSelect,
  children,
  className,
  iconUrl,
}: Props) => {
  return (
    <div className={clsx(styles.selectBoxContainer, className)}>
      <button onClick={onSelect} className={styles.selectBoxButton}>
        <div className={styles.selectBoxHeader}>
          <span className={clsx(styles.selectBoxCheckmark, isSelected && styles.goldenCheckmark)} />
          <div className={styles.selectBoxContent}>
            <div className={styles.selectBoxTitle}>{title}</div>
            {isNotNullNorUndefined(description) && (
              <div className={styles.selectBoxText}>{description}</div>
            )}
          </div>
          {iconUrl !== undefined && <Image src={iconUrl} alt="icon" width={174} height={43} />}
        </div>
      </button>
      {isSelected && children !== undefined && (
        <div className={styles.childrenContainer}>{children}</div>
      )}
    </div>
  );
};

export default SelectBox;
