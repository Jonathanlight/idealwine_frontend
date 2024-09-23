import { faRegistered } from "@fortawesome/pro-light-svg-icons/faRegistered";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useTranslation } from "@/utils/next-utils";

import AlgoliaRatingInstantSearch from "./AlgoliaRatingInstantSearch";
import styles from "./AlgoliaVintageRatingSearchBox.module.scss";

const AlgoliaVintageRatingSearchBox = (): JSX.Element => {
  const { t } = useTranslation("prix-vin");

  return (
    <div className={styles.searchBox}>
      <h1 className={styles.titleWithIcon}>
        <span className={styles.title}>{t("index.title")}</span>
        <span className={styles.title}>
          {t("index.idealwine")}
          <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={faRegistered} size="xs" color="white" />
          </div>
        </span>
      </h1>
      <div className={styles.subtitle}>{t("index.subtitle")}</div>
      <AlgoliaRatingInstantSearch
        searchBoxStyles={{ input: styles.searchInput }}
        hitsStyle={styles.hits}
        placeholder={t("index.searchPlaceholder")}
      />
    </div>
  );
};

export default AlgoliaVintageRatingSearchBox;
