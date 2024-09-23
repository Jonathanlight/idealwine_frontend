import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

export const Top50Breadcrumb = ({ top50tab }: { top50tab: string }) => {
  const { t } = useTranslation("prix-vin");

  return (
    <div className={styles.breadcrumb}>
      <BreadcrumbItem link="HOME_URL" name="Accueil" />
      {" / "}
      <BreadcrumbItem link="VINTAGE_RATING_URL" name={t("searchRating")} />
      {" / "}
      <p className={styles.isLastBreadcrumbItem}>{top50tab}</p>
    </div>
  );
};
