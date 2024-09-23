import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

export const SellYourWinePageBreadcrumb = ({
  translatedLinkName,
  sellerTab,
  translatedSellMyWines,
}: {
  translatedLinkName: string;
  sellerTab: string;
  translatedSellMyWines: string;
}) => {
  const { t } = useTranslation("common");

  return (
    <div className={styles.breadcrumb}>
      <BreadcrumbItem link="HOME_URL" name={t("breadcrumbs.homePage")} />
      {" / "}
      <BreadcrumbItem link="SELL_MY_WINES_URL" name={translatedSellMyWines} />
      {" / "}
      <BreadcrumbItem link={translatedLinkName} name={sellerTab} isLast={true} />
    </div>
  );
};
