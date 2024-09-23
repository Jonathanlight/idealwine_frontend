import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleCheck } from "@fortawesome/pro-solid-svg-icons/faCircleCheck";
import { faCircle } from "@fortawesome/pro-thin-svg-icons/faCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./GoldenCheckbox.module.scss";

interface Props {
  size: SizeProp;
  checked: boolean;
  onClick: () => void;
}

const GoldenCheckbox = ({ size, checked, onClick }: Props) => {
  const icon = checked ? faCircleCheck : faCircle;

  return (
    <FontAwesomeIcon icon={icon} size={size} className={styles.goldenCheckbox} onClick={onClick} />
  );
};

export default GoldenCheckbox;
