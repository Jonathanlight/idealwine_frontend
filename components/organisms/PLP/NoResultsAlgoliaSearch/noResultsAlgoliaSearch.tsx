import { faTelescope } from "@fortawesome/pro-light-svg-icons/faTelescope";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation } from "@/utils/next-utils";

import styles from "./noResultsAlgoliaSearch.module.scss";

interface Props {
  query: string;
}

const NoResultsAlgoliaSearch = (props: Props) => {
  const { t } = useTranslation("acheter-du-vin");

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faTelescope} className={styles.titleIcon} />
      <div className={styles.title}>
        <p>{t("noResults.title1")}</p>
        <p>{t("noResults.title2")}</p>
        <p>{t("noResults.title3")}</p>
        <p>{props.query}</p>
      </div>
      <div className={styles.subtitle}>
        <p>
          <span className={styles.redText}>{t("noResults.subtitle1")}</span>{" "}
          {t("noResults.subtitle2")}
        </p>
        <p>{t("noResults.subtitle3")}</p>
      </div>
    </div>
  );
};

export default NoResultsAlgoliaSearch;
