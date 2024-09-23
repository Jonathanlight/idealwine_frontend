import { useTranslation } from "@/utils/next-utils";

import styles from "./CommandGroupingComponent.module.scss";

const CommandGroupingComponent = () => {
  const { t } = useTranslation("livraison");

  return <div className={styles.textContainer}>{t("GROUPING.explicativeText")}</div>;
};

export default CommandGroupingComponent;
