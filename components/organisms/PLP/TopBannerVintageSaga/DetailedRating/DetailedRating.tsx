import clsx from "clsx";

import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import styles from "./index.module.scss";
type Props = {
  color: string;
  rating: string;
  subRegion?: string;
};
const DetailedRating = ({ rating, color, subRegion }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.mainContainer}>
      <div className={clsx(styles.subRegion, styles.smallText)}>
        {isNotNullNorUndefined(subRegion) && t(`enums:region.${subRegion}`)}
      </div>
      <div className={styles.ratingContainer}>
        <p className={styles.rating}>{rating}</p>
        <span className={styles.scale}>{"/20"}</span>
      </div>
      <div className={styles.smallText}>{t(`enums:color.${color}`)}</div>
    </div>
  );
};
export default DetailedRating;
