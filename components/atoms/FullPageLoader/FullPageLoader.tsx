import clsx from "clsx";

import { useTranslation } from "@/utils/next-utils";

import styles from "./FullPageLoader.module.scss";

const FullPageLoader = ({ isLoading }: { isLoading: boolean }) => {
  const { t } = useTranslation("common");

  return (
    <div className={clsx(styles.container, isLoading && styles.isLoading)}>
      <div className={styles.iconsContainer}>
        <div className={styles.loader}>
          <div className={styles.loaderOut}></div>
          <div className={styles.loaderIn}></div>
        </div>

        <p className={styles.paragraphe}>{t("common.loadertxt")}</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
