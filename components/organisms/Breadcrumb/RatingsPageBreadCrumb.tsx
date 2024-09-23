import clsx from "clsx";

import BreadcrumbItem from "@/components/molecules/BreadcrumbItem/BreadcrumbItem";
import { useTranslation } from "@/utils/next-utils";

import styles from "./Breadcrumb.module.scss";

type Props = {
  productName: string;
  year: string;
  color: string;
  className?: string;
};

export const RatingsPageBreadCrumb = ({ className, productName, year, color }: Props) => {
  const { t } = useTranslation("common");

  return (
    <div className={clsx(styles.breadcrumb, className)}>
      <BreadcrumbItem link="HOME_URL" name={t("breadcrumbs.homePage")} />
      {" / "}
      <BreadcrumbItem link="VINTAGE_RATING_URL" name={t("breadcrumbs.ratingsSearch")} />
      {" / "}
      <span className={styles.isLastBreadcrumbItem}>
        {t("breadcrumbs.productNameYearAndColor", {
          productName,
          year,
          color: color.charAt(0).toUpperCase() + color.slice(1),
        })}
      </span>
    </div>
  );
};
