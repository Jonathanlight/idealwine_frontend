import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

export const SellerPageBreadcrumb = ({
  translatedLinkName,
  sellerTab,
}: {
  translatedLinkName: string;
  sellerTab: string;
}) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.breadcrumb}>
      <BreadcrumbItem link="HOME_URL" name={t("breadcrumbs.homePage")} />
      {" / "}
      <BreadcrumbItem link="MY_IDEALWINE_HOME_URL" name="My Idealwine" />
      {" / "}
      <BreadcrumbItem link={translatedLinkName} name={sellerTab} isLast={true} />
    </div>
  );
};
