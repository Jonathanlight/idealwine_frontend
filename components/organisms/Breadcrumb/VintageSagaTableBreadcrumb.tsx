import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

export const VintageSagaTableBreadcrumb = ({
  translatedLinkName,
  vintageSagaTab,
}: {
  translatedLinkName: string;
  vintageSagaTab: string;
}) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.breadcrumb}>
      <BreadcrumbItem link="HOME_URL" name={t("breadcrumbs.homePage")} />
      {" / "}
      <BreadcrumbItem link="VINTAGE_SAGA_URL" name="Saga millésimes" />
      {" / "}
      <BreadcrumbItem link={translatedLinkName} name={vintageSagaTab} isLast={true} />
    </div>
  );
};
