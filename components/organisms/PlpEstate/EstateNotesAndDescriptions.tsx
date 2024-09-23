import EstateNoteStars from "@/components/organisms/PlpEstate/EstateNoteStars";
import { EstateJsonldShopEstateRead } from "@/networking/sylius-api-client/.ts.schemas";
import { useTranslation } from "@/utils/next-utils";
import { isNonEmptyString, isPositiveNumber } from "@/utils/ts-utils";

import styles from "./EstateNotesAndDescriptions.module.scss";

type Props = {
  estate: EstateJsonldShopEstateRead;
};

const EstateNotesAndDescriptions = ({ estate }: Props) => {
  const { t } = useTranslation("acheter-du-vin");

  const showBd = isPositiveNumber(estate.noteBd) || isNonEmptyString(estate.bdDescription);
  const showRvf = isPositiveNumber(estate.noteRvf) || isNonEmptyString(estate.rvfDescription);

  if (!showBd && !showRvf) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t("estate.title")}</h2>
      <div className={styles.content}>
        {showBd && (
          <>
            <div className={styles.subtitleLine}>
              <h3 className={styles.subtitle}>{t("estate.noteBdTitle")}</h3>{" "}
              {isPositiveNumber(estate.noteBd) && <EstateNoteStars count={estate.noteBd} />}
            </div>
            {isNonEmptyString(estate.bdDescription) && <p>{estate.bdDescription}</p>}
          </>
        )}
        {showRvf && (
          <>
            <div className={styles.subtitleLine}>
              <h3 className={styles.subtitle}>{t("estate.noteRvfTitle")}</h3>{" "}
              {isPositiveNumber(estate.noteRvf) && (
                <EstateNoteStars count={estate.noteRvf} max={3} />
              )}
            </div>
            {isNonEmptyString(estate.rvfDescription) && <p>{estate.rvfDescription}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default EstateNotesAndDescriptions;
