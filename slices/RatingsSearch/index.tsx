import AlgoliaRatingInstantSearch from "@/components/organisms/AlgoliaVintageRatingSearchBox/AlgoliaRatingInstantSearch";
import { useTranslation } from "@/utils/next-utils";

import styles from "./index.module.scss";

const RatingsSearch = () => {
  const { t } = useTranslation("home");

  return (
    <section className={styles.ratingsSearchContainer}>
      <h2 className={styles.title}>{t("ratingsSearchTitle")}</h2>
      <AlgoliaRatingInstantSearch
        searchBoxStyles={{
          root: styles.inputContainer,
          form: styles.inputForm,
          input: styles.searchInput,
        }}
        hitsStyle={styles.hits}
        placeholder={t("ratingsSearchPlaceholder")}
      />
    </section>
  );
};

export default RatingsSearch;
