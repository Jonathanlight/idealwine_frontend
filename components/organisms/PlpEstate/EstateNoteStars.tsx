import { faStar as faStarSolid } from "@fortawesome/pro-solid-svg-icons/faStar";
import { faStar as faStarThin } from "@fortawesome/pro-thin-svg-icons/faStar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./EstateNoteStars.module.scss";

type Props = {
  count: number;
  max?: number;
};

const EstateNoteStars = ({ count, max = 5 }: Props) => {
  return (
    <div className={styles.starsLine}>
      {Array.from({ length: max }, (_, index) => (
        <FontAwesomeIcon key={index} icon={count > index ? faStarSolid : faStarThin} />
      ))}
    </div>
  );
};

export default EstateNoteStars;
