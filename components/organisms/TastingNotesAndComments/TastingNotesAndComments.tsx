import clsx from "clsx";
import Trans from "next-translate/Trans";

import GoldenUnderlineTitle from "@/components/atoms/GoldenUnderlineTitle";
import { ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead } from "@/networking/sylius-api-client/.ts.schemas";
import { createTastingNotesObject } from "@/utils/getTastingNotesUtils";
import { useTranslation } from "@/utils/next-utils";
import { isNotNullNorUndefined } from "@/utils/ts-utils";

import TastingNotesChart from "../TastingNotesChart";
import styles from "./TastingNotesAndComments.module.scss";

const TastingNotesAndComments = ({
  vintageYear,
  productName,
  results,
}: {
  vintageYear: string | number;
  productName?: string;
  results?: ProductVintageRatingInfoDTOJsonldShopProductVintageRatingInfoDtoRead;
}) => {
  const { t } = useTranslation("prix-vin");
  const sagaRating = results?.sagaRating;
  const notes = createTastingNotesObject(results);

  return (
    <>
      {notes.length > 0 && (
        <div className={styles.fifthGridContainer}>
          <div id="tastingNotesAndComments" className={styles.gridRowTitle}>
            <Trans
              ns="prix-vin"
              i18nKey="furtherInformation"
              components={{ strong: <strong />, br: <br /> }}
              values={{ productName: productName }}
            />
          </div>
          <GoldenUnderlineTitle />
          <div className={clsx(styles.noteAndCommentsContainer, styles.whiteBoxWithShadow)}>
            <h4 className={styles.noteTitleContainer}>{t("tastingNotesAndComments")}</h4>
            <TastingNotesChart notes={notes} />
            {isNotNullNorUndefined(sagaRating) && (
              <div className={styles.vintageQuality}>
                <div>
                  {t("vintageQuality", { vintageYear: vintageYear })}
                  <div className={styles.sagaRating}>
                    {t("sagaRating", { sagaRating: sagaRating })}
                  </div>
                </div>
                <div className={styles.expertAssessment}>
                  <div>{t("expertAssessment")}</div>
                  <div className={styles.expertAssessmentText}>{results?.expertAssessment}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default TastingNotesAndComments;
