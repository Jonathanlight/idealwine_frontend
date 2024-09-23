import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

export const HelpPageBreadcrumb = ({
  translatedLinkName,
  helpTab,
}: {
  translatedLinkName: string;
  helpTab: string;
}) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.breadcrumb}>
      <BreadcrumbItem link="HOME_URL" name={t("breadcrumbs.homePage")} />
      {" / "}
      <BreadcrumbItem link={translatedLinkName} name={helpTab} isLast={true} />
    </div>
  );
};
