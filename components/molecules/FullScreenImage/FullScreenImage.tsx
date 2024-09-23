import { faClose } from "@fortawesome/pro-light-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useKeyboardEvent } from "@react-hookz/web/cjs/useKeyboardEvent";

import styles from "./FullScreenImage.module.scss";

type Props = {
  onClose: () => void;
  children: JSX.Element;
};

const FullScreenImage = ({ onClose, children }: Props): JSX.Element => {
  useKeyboardEvent((event: KeyboardEvent) => event.key === "Escape", onClose);

  return (
    <div className={styles.overlay}>
      <button className={styles.closeButton} onClick={onClose}>
        <FontAwesomeIcon icon={faClose} color="white" size="3x" />
      </button>
      {children}
    </div>
  );
};

export default FullScreenImage;
