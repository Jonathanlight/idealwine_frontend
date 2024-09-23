import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

export const WineVarietiesDiscoveryPageBreadCrumb = () => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.breadcrumb}>
      <BreadcrumbItem link="HOME_URL" name={t("breadcrumbs.homePage")} />
      {" / "}
      <BreadcrumbItem
        link="DISCOVERY_WINE_VARIETIES"
        name={t("breadcrumbs.wineVarieties")}
        isLast={true}
      />
    </div>
  );
};
